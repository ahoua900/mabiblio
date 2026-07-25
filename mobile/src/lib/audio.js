import * as Speech from 'expo-speech';
import { storage } from './storage';

// Moteur audio : synthèse vocale réelle (expo-speech).
// `Speech.pause()` n'est pas supporté sur Android (la voix continuait de
// parler malgré le bouton pause) : la pause est donc implémentée par un
// arrêt complet (`Speech.stop()`) suivi, à la reprise, d'un redémarrage de
// la lecture à partir du dernier mot prononcé (suivi via `onBoundary`).
const audio = {
  text: '',
  opts: {},
  offset: 0,
  lastSpokenOffset: 0,
  playing: false,
  startedAt: 0,
  onTick: null,
  onEnd: null,

  start(text, opts, onTick, onEnd) {
    this.stop();
    this.text = text || '';
    this.opts = opts || {};
    this.onTick = onTick;
    this.onEnd = onEnd;
    this._speakFrom(0);
  },

  resume() {
    if (this.playing || !this.text) return;
    this._speakFrom(this.offset);
  },

  _speakFrom(charOffset) {
    const remaining = this.text.slice(charOffset);
    if (!remaining.trim()) { this._finish(); return; }
    this.offset = charOffset;
    this.lastSpokenOffset = charOffset;
    this.playing = true;
    this.startedAt = Date.now();
    try {
      Speech.speak(remaining, {
        language: this.opts.langCode || 'fr-FR',
        rate: this.opts.rate || 1,
        voice: this.opts.voice || undefined,
        onBoundary: (e) => {
          if (!this.playing) return;
          this.lastSpokenOffset = charOffset + (e && e.charIndex ? e.charIndex : 0);
          const pct = this.text.length ? Math.min(100, (this.lastSpokenOffset / this.text.length) * 100) : 0;
          if (this.onTick) this.onTick(pct);
        },
        onDone: () => { if (this.playing) this._finish(); },
        onError: () => { if (this.playing) this._finish(); },
      });
    } catch (e) {
      this._finish();
    }
  },

  pause() {
    if (!this.playing) return;
    this.playing = false;
    this._accrue();
    try { Speech.stop(); } catch (e) {}
    // Reprend exactement où la dernière limite de mot a été rapportée.
    this.offset = this.lastSpokenOffset;
  },

  // Change la vitesse et/ou la langue à la volée : redémarre la synthèse à
  // partir du dernier mot prononcé plutôt que de reprendre au début.
  setOptions(patch) {
    this.opts = { ...this.opts, ...patch };
    if (this.playing) {
      this._accrue();
      try { Speech.stop(); } catch (e) {}
      this._speakFrom(this.lastSpokenOffset);
    }
  },

  stop() {
    const wasPlaying = this.playing;
    this.playing = false;
    if (wasPlaying) this._accrue();
    try { Speech.stop(); } catch (e) {}
    this.text = '';
    this.offset = 0;
    this.lastSpokenOffset = 0;
  },

  _finish() {
    this._accrue();
    this.playing = false;
    const cb = this.onEnd;
    this.text = '';
    this.offset = 0;
    this.lastSpokenOffset = 0;
    if (cb) cb();
  },

  async _accrue() {
    const s = (Date.now() - this.startedAt) / 1000;
    if (s > 0 && s < 3600) {
      const cur = (await storage.get('listenSeconds', 0)) || 0;
      await storage.set('listenSeconds', cur + s);
    }
    this.startedAt = Date.now();
  },
};

export default audio;
