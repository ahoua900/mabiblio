import * as Speech from 'expo-speech';
import { storage } from './storage';

// Moteur audio : synthèse vocale réelle (expo-speech) + progression pilotée par minuteur.
const audio = {
  timer: null,
  playing: false,
  progress: 0,
  startedAt: 0,

  start(text, opts, onTick, onEnd) {
    this.stop();
    this.playing = true;
    this.startedAt = Date.now();

    // Lecture vocale réelle
    try {
      Speech.speak(text, {
        language: opts.langCode || 'fr-FR',
        rate: opts.rate || 1,
        voice: opts.voice || undefined,
      });
    } catch (e) {}

    // Progression estimée (fiable indépendamment du moteur TTS)
    const words = text.split(/\s+/).length;
    const totalMs = Math.max(4000, (words / (2.6 * (opts.rate || 1))) * 1000);
    const step = 120;
    this.timer = setInterval(() => {
      this.progress = Math.min(100, this.progress + (step / totalMs) * 100);
      if (onTick) onTick(this.progress);
      if (this.progress >= 100) this.finish(onEnd);
    }, step);
  },

  pause() {
    if (!this.playing) return;
    this.playing = false;
    clearInterval(this.timer);
    this.timer = null;
    try { Speech.pause(); } catch (e) { try { Speech.stop(); } catch (e2) {} }
    this._accrue();
  },

  stop() {
    clearInterval(this.timer);
    this.timer = null;
    if (this.playing) this._accrue();
    this.playing = false;
    try { Speech.stop(); } catch (e) {}
  },

  finish(onEnd) {
    clearInterval(this.timer);
    this.timer = null;
    this._accrue();
    this.playing = false;
    this.progress = 0;
    try { Speech.stop(); } catch (e) {}
    if (onEnd) onEnd();
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
