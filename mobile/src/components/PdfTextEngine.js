import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

// Moteur d'extraction de texte PDF : charge pdf.js (CDN) dans une WebView
// invisible et lui envoie le contenu base64 du fichier à analyser. La
// WebView répond avec le texte de toutes les pages concaténé.
// Nécessite une connexion internet au moment de l'extraction (chargement de
// la librairie pdf.js) ; sans réseau, extract() se résout avec `null` et
// l'appelant retombe sur le comportement précédent (ouverture du fichier).
const EXTRACT_TIMEOUT = 60000;

const HTML = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
  function post(msg) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(msg));
  }

  function base64ToBytes(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  async function extract(id, base64) {
    try {
      if (!window.pdfjsLib) throw new Error('pdfjs indisponible');
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const bytes = base64ToBytes(base64);
      const doc = await window.pdfjsLib.getDocument({ data: bytes }).promise;
      let text = '';
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(function (it) { return it.str; }).join(' ');
        text += pageText.trim() + '\\n\\n';
        post({ id: id, progress: i / doc.numPages });
      }
      post({ id: id, done: true, text: text.trim() });
    } catch (e) {
      post({ id: id, done: true, error: (e && e.message) || 'extraction impossible' });
    }
  }

  function handleMessage(e) {
    try {
      const msg = JSON.parse(e.data);
      extract(msg.id, msg.base64);
    } catch (err) {}
  }
  document.addEventListener('message', handleMessage);
  window.addEventListener('message', handleMessage);
</script>
</body></html>`;

const PdfTextEngine = forwardRef(function PdfTextEngine(_props, ref) {
  const webviewRef = useRef(null);
  const pending = useRef(new Map());
  const counter = useRef(0);

  useImperativeHandle(ref, () => ({
    extract(base64) {
      return new Promise((resolve) => {
        if (!webviewRef.current) { resolve(null); return; }
        const id = 'x' + (counter.current++);
        const timer = setTimeout(() => {
          pending.current.delete(id);
          resolve(null);
        }, EXTRACT_TIMEOUT);
        pending.current.set(id, { resolve, timer });
        webviewRef.current.postMessage(JSON.stringify({ id, base64 }));
      });
    },
  }));

  function onMessage(e) {
    let msg;
    try { msg = JSON.parse(e.nativeEvent.data); } catch (err) { return; }
    if (!msg || !msg.done) return; // on ignore les évènements de progression
    const entry = pending.current.get(msg.id);
    if (!entry) return;
    pending.current.delete(msg.id);
    clearTimeout(entry.timer);
    entry.resolve(msg.error ? null : msg.text || null);
  }

  return (
    <View style={{ width: 0, height: 0, opacity: 0 }} pointerEvents="none">
      <WebView
        ref={webviewRef}
        source={{ html: HTML }}
        onMessage={onMessage}
        javaScriptEnabled
        originWhitelist={['*']}
        style={{ width: 1, height: 1 }}
      />
    </View>
  );
});

export default PdfTextEngine;
