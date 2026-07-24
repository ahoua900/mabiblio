"use strict";
(function () {

  /* ==========================================================================
   * 1. Données de démonstration
   * ========================================================================== */
  const languages = ['Français', 'English', 'Español', 'Deutsch', 'العربية', '中文'];
  const genres = ['Roman', 'Bande dessinée', 'Essai', 'Scolaire'];
  const ages = ['Enfants', 'Jeunesse', 'Adultes'];
  const GENRE_COLORS = { 'Roman': '#E4002B', 'Bande dessinée': '#F59E0B', 'Essai': '#16A34A', 'Scolaire': '#7C3AED' };

  const seedBooks = [
    { id: 'b1', title: "L'Enfant et la Rivière", author: 'Nadia Fontaine', genre: 'Roman', age: 'Jeunesse', color: '#B0413E', rating: 4.5, language: 'Français', pageCount: 6, summaryFull: "Un jeune garçon découvre les secrets de son village au fil de l'eau. Entre amitié et courage, ce roman tendre parle de grandir et de laisser aller.", reviews: [{ id: 1, user: 'Camille R.', initial: 'C', rating: 5, comment: "Une écriture délicate, parfaite à lire à voix haute avec mes enfants.", date: 'il y a 3 jours' }] },
    { id: 'b2', title: 'Les Carnets de Mona', author: 'Julien Perrot', genre: 'Bande dessinée', age: 'Enfants', color: '#C97A1B', rating: 4.8, language: 'Français', pageCount: 5, summaryFull: "Mona explore son quartier et invente mille histoires. Une bande dessinée pétillante, pensée pour être lue et relue en famille.", reviews: [] },
    { id: 'b3', title: 'Petite Philosophie du Quotidien', author: 'Claire Dubosc', genre: 'Essai', age: 'Adultes', color: '#1F7A4D', rating: 4.2, language: 'Français', pageCount: 8, summaryFull: "De courts essais pour penser le quotidien autrement. Claire Dubosc questionne nos habitudes avec clarté et une pointe d'humour.", reviews: [{ id: 2, user: 'Antoine M.', initial: 'A', rating: 4, comment: "Des chapitres courts, parfaits pour l'écoute pendant les trajets.", date: 'il y a 1 semaine' }, { id: 3, user: 'Léa P.', initial: 'L', rating: 4, comment: "« Le bonheur se cache dans la répétition des petites choses. » Cette phrase m'a marquée.", date: 'il y a 2 semaines' }] },
    { id: 'b4', title: "Mathématiques Faciles — 6e", author: "Ministère de l'Éducation", genre: 'Scolaire', age: 'Jeunesse', color: '#5B4A9E', rating: 3.9, language: 'Français', pageCount: 10, summaryFull: "Manuel de mathématiques pour la classe de sixième, avec exercices corrigés et rappels de cours illustrés.", reviews: [] },
    { id: 'b5', title: 'Le Dragon Timide', author: 'Sofia Lenoir', genre: 'Bande dessinée', age: 'Enfants', color: '#1E7F8C', rating: 4.9, language: 'Français', pageCount: 4, summaryFull: "Un petit dragon qui a peur de son propre feu apprend à s'accepter grâce à ses amis de la forêt.", reviews: [] },
    { id: 'b6', title: 'Un Été à Marrakech', author: 'Karim Belhadj', genre: 'Roman', age: 'Adultes', color: '#994488', rating: 4.4, language: 'Français', pageCount: 9, summaryFull: "Une famille se retrouve le temps d'un été marocain, entre souvenirs, secrets et retrouvailles inattendues.", reviews: [{ id: 4, user: 'Nadia F.', initial: 'N', rating: 5, comment: "Dépaysant et chaleureux, un roman que j'ai adoré partager en famille.", date: 'il y a 4 jours' }] },
    { id: 'b7', title: 'Sciences Naturelles Illustrées', author: 'Léa Moreau', genre: 'Scolaire', age: 'Enfants', color: '#2F7D63', rating: 4.1, language: 'Français', pageCount: 7, summaryFull: "Découvrir la nature à travers des illustrations simples et un vocabulaire adapté aux plus jeunes.", reviews: [] },
    { id: 'b8', title: 'Réflexions sur le Temps', author: 'Antoine Marchal', genre: 'Essai', age: 'Adultes', color: '#4A5568', rating: 4.6, language: 'Français', pageCount: 11, summaryFull: "Un essai sur notre rapport moderne au temps qui passe, entre urgence permanente et besoin de ralentir.", reviews: [] },
  ];

  const communityFeed = [
    { id: 1, user: 'Sarah K.', initial: 'S', action: 'a noté', book: 'Le Dragon Timide', rating: 5, text: "Mes enfants l'adorent, parfait pour le soir en version audio.", time: 'il y a 2h', type: 'Avis' },
    { id: 2, user: 'Marc T.', initial: 'M', action: 'a partagé une citation de', book: 'Petite Philosophie du Quotidien', rating: 0, text: "« Le bonheur se cache dans la répétition des petites choses. »", time: 'il y a 5h', type: 'Citations' },
    { id: 3, user: 'Inès B.', initial: 'I', action: 'a noté', book: 'Un Été à Marrakech', rating: 5, text: "Une très belle découverte, l'écoute audio est parfaite pour les trajets.", time: 'il y a 1 jour', type: 'Avis' },
    { id: 4, user: 'Hugo D.', initial: 'H', action: 'a commenté', book: "L'Enfant et la Rivière", rating: 4, text: "Idéal pour découvrir la lecture audio avec mes élèves de CM1.", time: 'il y a 2 jours', type: 'Avis' },
    { id: 5, user: 'Yasmine C.', initial: 'Y', action: 'a partagé une citation de', book: 'Réflexions sur le Temps', rating: 0, text: "« Ralentir n'est pas renoncer, c'est choisir ce qui compte. »", time: 'il y a 3 jours', type: 'Citations' },
    { id: 6, user: 'Paul V.', initial: 'P', action: 'a noté', book: 'Les Carnets de Mona', rating: 5, text: "Ma fille de 6 ans redemande cette BD chaque soir.", time: 'il y a 4 jours', type: 'Avis' },
  ];

  /* ==========================================================================
   * 2. Utilitaires
   * ========================================================================== */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function uid() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2); }
  function initialOf(name) { const t = (name || '').trim(); return t ? t[0].toUpperCase() : '?'; }
  function timeAgo(iso) {
    const d = (Date.now() - new Date(iso).getTime()) / 1000;
    if (isNaN(d)) return '';
    if (d < 60) return 'à l’instant';
    if (d < 3600) return 'il y a ' + Math.floor(d / 60) + ' min';
    if (d < 86400) return 'il y a ' + Math.floor(d / 3600) + ' h';
    return 'il y a ' + Math.floor(d / 86400) + ' j';
  }
  function fmtDuration(sec) {
    sec = Math.floor(sec || 0);
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
    if (h > 0) return h + 'h' + String(m).padStart(2, '0');
    return m + ' min';
  }
  function loadScript(src) {
    return new Promise(function (res, rej) {
      const s = document.createElement('script'); s.src = src;
      s.onload = res; s.onerror = function () { rej(new Error('Échec de chargement ' + src)); };
      document.head.appendChild(s);
    });
  }
  const STAR = 'M12 2.5 15 9l7 1-5.2 5 1.3 7-6.1-3.4L5.9 22l1.3-7L2 10l7-1z';
  function stars(size, rating, extra) {
    const r = Math.round(rating); let out = '';
    for (let i = 1; i <= 5; i++) out += '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" style="fill:' + (i <= r ? '#F5A623' : '#DBDBE2') + ';display:block;' + (extra || '') + '"><path d="' + STAR + '"/></svg>';
    return out;
  }
  function ratingPicker(rating) {
    const r = Math.round(rating); let out = '';
    for (let i = 1; i <= 5; i++) out += '<svg data-a="setRating" data-arg="' + i + '" width="26" height="26" viewBox="0 0 24 24" style="fill:' + (i <= r ? '#F5A623' : '#DBDBE2') + ';display:block;cursor:pointer"><path d="' + STAR + '"/></svg>';
    return out;
  }
  function coverBg(color) { return 'background:linear-gradient(150deg,' + color + ',' + color + 'c8)'; }
  function cover(b, w, h, action) {
    action = action || 'openBook';
    return '<div class="cover" data-a="' + action + '" data-arg="' + esc(b.id) + '" style="' + coverBg(b.color) + ';width:' + w + ';height:' + h + ';flex-shrink:0">' +
      '<div class="cover__tag">PDF</div>' +
      '<div class="cover__t">' + esc(b.title) + '</div>' +
      '<div class="cover__a">' + esc(b.author) + '</div></div>';
  }

  const IC = {
    home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>',
    search: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    users: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    library: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    user: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    plus: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    searchSm: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A8A90" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    bookmark: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    bookmarkOn: '<svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    sliders: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
    play: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
    headphones: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
    play2: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>',
    logo: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V6a2 2 0 0 1 2-2h13.5v15.5H6a2 2 0 0 0-2 2Z"/><path d="M20 17.5H6.5A2 2 0 0 0 4.5 19"/></svg>',
    x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  };

  /* ==========================================================================
   * 3. Stockage local (localStorage + IndexedDB pour les PDF)
   * ========================================================================== */
  const LS = {
    get: function (k, def) { try { const v = localStorage.getItem('lectura.' + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem('lectura.' + k, JSON.stringify(v)); } catch (e) {} },
  };
  const idb = {
    _db: null,
    open: function () { const s = this; return new Promise(function (res) { if (s._db) return res(s._db); if (!window.indexedDB) return res(null); const r = indexedDB.open('lectura', 1); r.onupgradeneeded = function () { r.result.createObjectStore('pdfs'); }; r.onsuccess = function () { s._db = r.result; res(s._db); }; r.onerror = function () { res(null); }; }); },
    put: function (k, blob) { return this.open().then(function (db) { if (!db) return; return new Promise(function (res) { const t = db.transaction('pdfs', 'readwrite'); t.objectStore('pdfs').put(blob, k); t.oncomplete = res; t.onerror = res; }); }); },
    get: function (k) { return this.open().then(function (db) { if (!db) return null; return new Promise(function (res) { const r = db.transaction('pdfs', 'readonly').objectStore('pdfs').get(k); r.onsuccess = function () { res(r.result || null); }; r.onerror = function () { res(null); }; }); }); },
  };
  const localStore = {
    users: function () { return LS.get('users', {}); },
    signUp: function (email, password, name) { const u = this.users(); if (u[email]) throw new Error('Un compte existe déjà pour cet email.'); const o = { id: uid(), email: email, name: name || email.split('@')[0], password: password }; u[email] = o; LS.set('users', u); const s = { id: o.id, email: o.email, name: o.name }; LS.set('session', s); return s; },
    signIn: function (email, password) { const o = this.users()[email]; if (!o || o.password !== password) throw new Error('Email ou mot de passe incorrect.'); const s = { id: o.id, email: o.email, name: o.name }; LS.set('session', s); return s; },
    signOut: function () { LS.set('session', null); },
    session: function () { return LS.get('session', null); },
    loadBooks: function () { return LS.get('books', []); },
    saveBook: function (b, pdf) { const a = LS.get('books', []); a.push(b); LS.set('books', a); if (pdf) return idb.put(b.id, pdf); },
    loadReviews: function () { return LS.get('reviews', {}); },
    saveReview: function (id, r) { const m = LS.get('reviews', {}); m[id] = [r].concat(m[id] || []); LS.set('reviews', m); },
    pdfUrl: function (b) { return idb.get(b.id).then(function (bl) { return bl ? URL.createObjectURL(bl) : null; }); },
  };

  /* ==========================================================================
   * 4. Client Supabase (si config.js renseigné)
   * ========================================================================== */
  const supa = {
    client: null,
    async signUp(email, password, name) { const { data, error } = await this.client.auth.signUp({ email, password, options: { data: { display_name: name } } }); if (error) throw new Error(error.message); if (!data.session) throw new Error('Compte créé. Vérifiez votre email pour confirmer, puis connectez-vous.'); return this._s(data.user); },
    async signIn(email, password) { const { data, error } = await this.client.auth.signInWithPassword({ email, password }); if (error) throw new Error(error.message); return this._s(data.user); },
    async signOut() { await this.client.auth.signOut(); },
    async session() { const { data } = await this.client.auth.getSession(); return data.session ? this._s(data.session.user) : null; },
    _s(u) { const name = (u.user_metadata && u.user_metadata.display_name) || (u.email || '').split('@')[0]; return { id: u.id, email: u.email, name: name }; },
    async loadBooks() { const { data, error } = await this.client.from('books').select('*').order('created_at', { ascending: true }); if (error) { console.warn(error.message); return []; } return data.map(function (r) { return { id: r.id, owner: r.owner, title: r.title, author: r.author, genre: r.genre, age: r.age, color: r.color || '#6D6AF5', rating: 0, language: r.language, pageCount: r.page_count || 12, summaryFull: r.summary || '', pdf_path: r.pdf_path, reviews: [] }; }); },
    async saveBook(book, pdf, owner) { let pdf_path = null; if (pdf) { pdf_path = owner + '/' + book.id + '.pdf'; const up = await this.client.storage.from('pdfs').upload(pdf_path, pdf, { contentType: 'application/pdf', upsert: true }); if (up.error) { console.warn(up.error.message); pdf_path = null; } } const { error } = await this.client.from('books').insert({ id: book.id, owner: owner, title: book.title, author: book.author, genre: book.genre, age: book.age, language: book.language, color: book.color, page_count: book.pageCount, summary: book.summaryFull, pdf_path: pdf_path }); if (error) throw new Error(error.message); book.pdf_path = pdf_path; },
    async loadReviews() { const { data, error } = await this.client.from('reviews').select('*').order('created_at', { ascending: false }); if (error) { console.warn(error.message); return {}; } const m = {}; data.forEach(function (r) { (m[r.book_id] = m[r.book_id] || []).push({ id: r.id, user: r.user_name, initial: initialOf(r.user_name), rating: r.rating, comment: r.comment, date: timeAgo(r.created_at) }); }); return m; },
    async saveReview(bookId, r, user) { const { error } = await this.client.from('reviews').insert({ book_id: bookId, user_id: user.id, user_name: user.name, rating: r.rating, comment: r.comment }); if (error) throw new Error(error.message); },
    async pdfUrl(book) { if (!book.pdf_path) return null; const { data } = this.client.storage.from('pdfs').getPublicUrl(book.pdf_path); return data ? data.publicUrl : null; },
  };

  /* ==========================================================================
   * 5. Façade db
   * ========================================================================== */
  const db = {
    mode: 'local',
    async init(config) { if (config && config.supabaseUrl && config.supabaseAnonKey) { try { await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js'); supa.client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey); this.mode = 'supabase'; } catch (e) { console.warn('Supabase indisponible :', e.message); this.mode = 'local'; } } return this.mode; },
    isRemote() { return this.mode === 'supabase'; },
    signUp(e, p, n) { return this.isRemote() ? supa.signUp(e, p, n) : Promise.resolve(localStore.signUp(e, p, n)); },
    signIn(e, p) { return this.isRemote() ? supa.signIn(e, p) : Promise.resolve(localStore.signIn(e, p)); },
    signOut() { return this.isRemote() ? supa.signOut() : Promise.resolve(localStore.signOut()); },
    session() { return this.isRemote() ? supa.session() : Promise.resolve(localStore.session()); },
    loadBooks() { return this.isRemote() ? supa.loadBooks() : Promise.resolve(localStore.loadBooks()); },
    saveBook(b, pdf, u) { return this.isRemote() ? supa.saveBook(b, pdf, u.id) : localStore.saveBook(b, pdf); },
    loadReviews() { return this.isRemote() ? supa.loadReviews() : Promise.resolve(localStore.loadReviews()); },
    saveReview(id, r, u) { return this.isRemote() ? supa.saveReview(id, r, u) : Promise.resolve(localStore.saveReview(id, r)); },
    pdfUrl(b) { return this.isRemote() ? supa.pdfUrl(b) : localStore.pdfUrl(b); },
  };

  /* ==========================================================================
   * 6. Moteur audio (synthèse vocale réelle + repli minuteur)
   * ========================================================================== */
  const audio = {
    timer: null, playing: false, progress: 0, startedAt: 0, onTick: null, onEnd: null, voices: [], _utter: null,
    refreshVoices() { if ('speechSynthesis' in window) this.voices = window.speechSynthesis.getVoices() || []; },
    start(text, opts, onTick, onEnd) {
      this.stop(); this.onTick = onTick; this.onEnd = onEnd; this.playing = true; this.startedAt = Date.now();
      if ('speechSynthesis' in window) { try { const u = new SpeechSynthesisUtterance(text); u.rate = opts.rate || 1; u.lang = opts.langCode || 'fr-FR'; const v = this.voices.find(function (x) { return x.name === opts.voiceName; }); if (v) u.voice = v; this._utter = u; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } catch (e) {} }
      const words = text.split(/\s+/).length, totalMs = Math.max(4000, (words / (2.6 * (opts.rate || 1))) * 1000), step = 100, self = this;
      this.timer = setInterval(function () { self.progress = Math.min(100, self.progress + (step / totalMs) * 100); if (self.onTick) self.onTick(self.progress); if (self.progress >= 100) self.finish(); }, step);
    },
    pause() { if (!this.playing) return; this.playing = false; clearInterval(this.timer); if ('speechSynthesis' in window) try { window.speechSynthesis.pause(); } catch (e) {} this._accrue(); },
    stop() { clearInterval(this.timer); this.timer = null; if (this.playing) this._accrue(); this.playing = false; if ('speechSynthesis' in window) try { window.speechSynthesis.cancel(); } catch (e) {} },
    finish() { clearInterval(this.timer); this.timer = null; this._accrue(); this.playing = false; this.progress = 0; if ('speechSynthesis' in window) try { window.speechSynthesis.cancel(); } catch (e) {} if (this.onEnd) this.onEnd(); },
    _accrue() { const s = (Date.now() - this.startedAt) / 1000; if (s > 0 && s < 3600) LS.set('listenSeconds', (LS.get('listenSeconds', 0) || 0) + s); this.startedAt = Date.now(); },
  };

  /* ==========================================================================
   * 7. Réglages de lecture
   * ========================================================================== */
  const THEMES = {
    light:    { label: 'Clair',   bg: '#FFFFFF', fg: '#1A1A1A', sub: '#8A8A90', chipBg: '#FFFFFF', chipFg: '#1A1A1A' },
    sepia:    { label: 'Sépia',   bg: '#F4ECD8', fg: '#5B4636', sub: '#9A8467', chipBg: '#EFE3C7', chipFg: '#5B4636' },
    dark:     { label: 'Sombre',  bg: '#121316', fg: '#C9C9CE', sub: '#77777E', chipBg: '#1E1F24', chipFg: '#E7E7EA' },
    charcoal: { label: 'Charbon', bg: '#2C2F36', fg: '#C6C9D0', sub: '#8B8F98', chipBg: '#3A3E47', chipFg: '#E7E9EC' },
  };
  const FONTS = {
    serif:   { label: 'Littéraire', css: "Georgia,'Times New Roman',serif" },
    sans:    { label: 'Moderne',    css: "-apple-system,BlinkMacSystemFont,system-ui,sans-serif" },
    elegant: { label: 'Élégant',    css: "'Palatino Linotype','Book Antiqua',Palatino,'Iowan Old Style',serif" },
  };
  const MARGINS = { narrow: { label: 'Étroit', pad: 16 }, normal: { label: 'Normal', pad: 28 }, wide: { label: 'Large', pad: 46 } };

  /* ==========================================================================
   * 8. État
   * ========================================================================== */
  const state = {
    booting: true, currentUser: null,
    authMode: 'signin', authName: '', authEmail: '', authPassword: '', authError: '', authBusy: false,

    screen: 'home', prevScreen: 'home',
    search: '',
    recentSearches: LS.get('recent', []),
    catFilter: null,
    selectedBookId: null,
    newReviewRating: 0, newReviewText: '',
    readingList: LS.get('readingList', []),

    currentPage: 1, readerMode: 'text', pdfUrl: null,
    showSettings: false,
    readerTheme: LS.get('readerTheme', 'light'),
    readerFontKey: LS.get('readerFont', 'serif'),
    readerFontSize: LS.get('readerFontSize', 18),
    readerMargin: LS.get('readerMargin', 'normal'),

    audioPlaying: false, audioProgress: 0, audioSpeed: 1, audioVoice: '', audioLang: 'Français',

    libraryTab: 'Tout', communityTab: 'Tous',
    uploadForm: { title: '', author: '', genre: 'Roman', age: 'Enfants', language: 'Français' },
    uploadFile: null, uploadFileName: '',
    busy: false, toast: null,
  };
  let toastTimer = null;
  const LANG_CODES = { 'Français': 'fr-FR', 'English': 'en-US', 'Español': 'es-ES', 'Deutsch': 'de-DE', 'العربية': 'ar-SA', '中文': 'zh-CN' };
  const MAIN_TABS = ['home', 'search', 'community', 'library', 'profile'];

  function setState(patch) { Object.assign(state, patch); render(); }
  function allBooks() { return seedBooks.concat(state.customBooks || []); }
  function getBook(id) { return allBooks().find(function (b) { return b.id === id; }); }
  function reviewsFor(b) { return (state.reviewsByBook[b.id] || []).concat(b.reviews || []); }
  function bookRating(b) { const r = reviewsFor(b); return b.rating || (r.length ? r.reduce(function (a, x) { return a + x.rating; }, 0) / r.length : 0); }
  function inList(id) { return state.readingList.indexOf(id) !== -1; }
  function progressStore() { return LS.get('progress', {}); }
  function setProgress(id, title, color, value) { const p = progressStore(); p[id] = { title: title, color: color, value: value, updatedAt: Date.now() }; LS.set('progress', p); }
  function historyList() { const p = progressStore(); return Object.keys(p).map(function (id) { return Object.assign({ id: id }, p[id]); }).sort(function (a, b) { return b.updatedAt - a.updatedAt; }); }

  /* ==========================================================================
   * 9. Composants de rendu
   * ========================================================================== */
  function showToast(msg, ms) { clearTimeout(toastTimer); state.toast = msg; render(); toastTimer = setTimeout(function () { setState({ toast: null }); }, ms || 2600); }

  function loaderHtml() { return '<div class="shell"><div style="flex:1;display:flex;align-items:center;justify-content:center;color:var(--muted)">Chargement…</div></div>'; }

  function authHtml() {
    const signup = state.authMode === 'signup';
    const note = db.isRemote() ? 'Connecté à Supabase' : 'Mode local — données conservées dans ce navigateur';
    function f(label, ctrl) { return '<div class="field"><div class="label">' + label + '</div>' + ctrl + '</div>'; }
    return '<div class="shell"><div class="content"><div style="min-height:100%;display:flex;flex-direction:column;justify-content:center;padding:32px 26px">' +
      '<div style="display:flex;align-items:center;gap:11px;margin-bottom:26px">' +
        '<div style="width:40px;height:40px;border-radius:12px;background:var(--red);display:flex;align-items:center;justify-content:center">' + IC.logo + '</div>' +
        '<div style="font-weight:800;font-size:22px;letter-spacing:-.4px">Lectura</div></div>' +
      '<div style="font-size:28px;font-weight:800;letter-spacing:-.6px;margin-bottom:5px;font-family:Georgia,serif">' + (signup ? 'Créer un compte' : 'Bon retour') + '</div>' +
      '<div style="font-size:14px;color:var(--muted);margin-bottom:26px">' + (signup ? 'Rejoignez la bibliothèque en quelques secondes.' : 'Connectez-vous pour retrouver vos livres.') + '</div>' +
      '<form id="authForm">' +
        (signup ? f('Nom', '<input class="input" data-a="authName" value="' + esc(state.authName) + '" placeholder="Votre nom" autocomplete="name" />') : '') +
        f('Email', '<input class="input" data-a="authEmail" type="email" value="' + esc(state.authEmail) + '" placeholder="vous@exemple.com" autocomplete="email" />') +
        f('Mot de passe', '<input class="input" data-a="authPassword" type="password" value="' + esc(state.authPassword) + '" placeholder="••••••••" autocomplete="' + (signup ? 'new-password' : 'current-password') + '" />') +
        (state.authError ? '<div style="background:var(--red-soft);color:var(--red-ink);font-size:13px;padding:11px 13px;border-radius:11px;margin-bottom:14px">' + esc(state.authError) + '</div>' : '') +
        '<button type="submit" class="btn btn--primary" style="margin-top:6px"' + (state.authBusy ? ' disabled' : '') + '>' + (state.authBusy ? 'Veuillez patienter…' : (signup ? 'Créer mon compte' : 'Se connecter')) + '</button>' +
      '</form>' +
      '<div style="text-align:center;font-size:14px;color:var(--muted);margin-top:20px">' + (signup ? 'Déjà un compte ? ' : 'Pas encore de compte ? ') + '<span data-a="authToggle" class="rlink">' + (signup ? 'Se connecter' : 'Créer un compte') + '</span></div>' +
      '<div style="text-align:center;font-size:11.5px;color:var(--muted2);margin-top:18px">' + esc(note) + '</div>' +
    '</div></div></div>';
  }

  function bottomNav() {
    function item(tab, icon, label) { return '<div class="nav__i' + (state.screen === tab ? ' nav__i--on' : '') + '" data-a="go" data-arg="' + tab + '">' + icon + '<span>' + label + '</span></div>'; }
    return '<div class="nav">' + item('home', IC.home, 'Accueil') + item('search', IC.search, 'Explorer') + item('community', IC.users, 'Communauté') + item('library', IC.library, 'Bibliothèque') + item('profile', IC.user, 'Profil') + '</div>';
  }

  function homeScreen() {
    const u = state.currentUser;
    const hist = historyList();
    const cur = hist.length ? getBook(hist[0].id) : null;
    const trending = allBooks().slice().sort(function (a, b) { return bookRating(b) - bookRating(a); }).slice(0, 8);
    const recent = (state.customBooks || []).slice().reverse().concat(seedBooks).slice(0, 8);

    let continueHtml = '';
    if (cur) {
      const v = Math.round(hist[0].value);
      continueHtml = '<div class="sec"><div class="sec__t">Reprendre la lecture</div></div>' +
        '<div class="card" data-a="openBook" data-arg="' + esc(cur.id) + '" style="display:flex;gap:14px;align-items:center;cursor:pointer;padding:14px">' +
          cover(cur, '58px', '82px', 'openBook') +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-weight:800;font-size:15px;letter-spacing:-.2px;font-family:Georgia,serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(cur.title) + '</div>' +
            '<div style="font-size:12.5px;color:var(--muted);margin:2px 0 10px">' + esc(cur.author) + '</div>' +
            '<div style="height:5px;background:var(--soft2);border-radius:5px;overflow:hidden"><div style="width:' + v + '%;height:100%;background:var(--red);border-radius:5px"></div></div>' +
            '<div style="font-size:11px;color:var(--muted);margin-top:5px">' + (v >= 100 ? 'Terminé' : v + '% lu') + '</div>' +
          '</div>' +
          '<div style="width:38px;height:38px;border-radius:12px;background:var(--red);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + IC.play2 + '</div>' +
        '</div>';
    }

    return '<div class="screen"><div class="content pad">' +
      '<div class="top"><div><div style="font-size:13px;color:var(--muted);font-weight:600">Bonjour,</div><div class="h1">' + esc((u.name || '').split(' ')[0]) + '</div></div>' +
        '<div class="avatar" data-a="go" data-arg="profile">' + esc(initialOf(u.name)) + '</div></div>' +
      '<div style="padding:8px 20px 0;margin:0 -20px"><div style="padding:0 20px"><div class="search" data-a="go" data-arg="search">' + IC.searchSm + '<input placeholder="Rechercher un livre, un auteur…" readonly style="cursor:pointer" /></div></div></div>' +
      continueHtml +
      '<div class="sec"><div class="sec__t">Tendances cette semaine</div><span class="sec__a" data-a="go" data-arg="search">Tout voir</span></div>' +
      '<div class="hscroll hidescroll">' + trending.map(function (b) {
        return '<div style="width:120px;flex-shrink:0">' + cover(b, '120px', '172px') +
          '<div style="font-weight:700;font-size:12.5px;margin-top:8px;line-height:1.25;font-family:Georgia,serif;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + esc(b.title) + '</div>' +
          '<div style="font-size:11px;color:var(--muted);margin-top:2px">' + esc(b.author) + '</div></div>';
      }).join('') + '</div>' +
      '<div class="sec"><div class="sec__t">Explorer par catégorie</div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' + genres.map(function (g) {
        return '<div data-a="openCategory" data-arg="' + esc(g) + '" style="cursor:pointer;border-radius:16px;padding:16px;color:#fff;display:flex;align-items:flex-end;height:82px;' + coverBg(GENRE_COLORS[g]) + '"><span style="font-weight:800;font-size:15px;font-family:Georgia,serif">' + esc(g) + '</span></div>';
      }).join('') + '</div>' +
      '<div class="sec"><div class="sec__t">Nouveautés</div></div>' +
      '<div class="hscroll hidescroll">' + recent.map(function (b) { return '<div style="width:110px;flex-shrink:0">' + cover(b, '110px', '158px') + '<div style="font-weight:700;font-size:12px;margin-top:7px;line-height:1.25;font-family:Georgia,serif;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + esc(b.title) + '</div></div>'; }).join('') + '</div>' +
    '</div>' + bottomNav() + fab() + '</div>';
  }

  function searchScreen() {
    const q = state.search.trim().toLowerCase();
    const active = q.length > 0 || state.catFilter;
    let results = allBooks();
    if (state.catFilter) results = results.filter(function (b) { return b.genre === state.catFilter; });
    if (q) results = results.filter(function (b) { return (b.title + ' ' + b.author + ' ' + b.genre).toLowerCase().indexOf(q) !== -1; });

    let body;
    if (active) {
      const grid = results.length ? '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">' + results.map(function (b) { return '<div>' + cover(b, '100%', '150px') + '<div style="font-weight:700;font-size:11.5px;margin-top:6px;line-height:1.2;font-family:Georgia,serif;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + esc(b.title) + '</div></div>'; }).join('') + '</div>'
        : '<div style="padding:50px 0;text-align:center;color:var(--muted);font-size:14px">Aucun résultat pour cette recherche.</div>';
      body = (state.catFilter ? '<div class="chips" style="margin-bottom:16px"><div class="chip chip--red chip--on" data-a="clearCategory">' + esc(state.catFilter) + ' ' + IC.x + '</div></div>' : '') +
        '<div style="font-size:13px;color:var(--muted);font-weight:600;margin-bottom:14px">' + results.length + ' résultat' + (results.length > 1 ? 's' : '') + '</div>' + grid;
    } else {
      const rec = state.recentSearches;
      const recentHtml = rec.length
        ? '<div class="sec" style="margin-top:14px"><div class="sec__t">Recherches récentes</div><span class="sec__a" data-a="clearRecent">Effacer</span></div>' +
          '<div class="chips">' + rec.map(function (t) { return '<div class="chip" data-a="applyRecent" data-arg="' + esc(t) + '">' + esc(t) + '<span data-a="removeRecent" data-arg="' + esc(t) + '" style="display:inline-flex;color:var(--muted)">' + IC.x + '</span></div>'; }).join('') + '</div>'
        : '';
      const trending = allBooks().slice().sort(function (a, b) { return bookRating(b) - bookRating(a); }).slice(0, 6);
      body = recentHtml +
        '<div class="sec"><div class="sec__t">Tendances</div></div>' +
        '<div class="hscroll hidescroll">' + trending.map(function (b) { return '<div style="width:112px;flex-shrink:0">' + cover(b, '112px', '162px') + '<div style="font-weight:700;font-size:12px;margin-top:7px;line-height:1.25;font-family:Georgia,serif;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + esc(b.title) + '</div></div>'; }).join('') + '</div>' +
        '<div class="sec"><div class="sec__t">Catégories</div></div>' +
        '<div class="chips">' + genres.map(function (g) { return '<div class="chip" data-a="openCategory" data-arg="' + esc(g) + '">' + esc(g) + '</div>'; }).join('') + '</div>';
    }

    return '<div class="screen"><div class="content pad">' +
      '<div class="top"><div class="h1">Explorer</div></div>' +
      '<div style="padding:8px 0 4px"><div class="search">' + IC.searchSm + '<input id="searchInput" data-a="setSearch" value="' + esc(state.search) + '" placeholder="Titre, auteur, genre…" />' + (q ? '<span data-a="clearSearch" style="color:var(--muted);cursor:pointer;display:inline-flex">' + IC.x + '</span>' : '') + '</div></div>' +
      body +
    '</div>' + bottomNav() + '</div>';
  }

  function communityScreen() {
    const tabs = ['Tous', 'Avis', 'Citations'];
    const feed = communityFeed.filter(function (p) { return state.communityTab === 'Tous' || p.type === state.communityTab; });
    return '<div class="screen"><div class="content pad">' +
      '<div class="top"><div class="h1">Communauté</div></div>' +
      '<div style="padding:6px 0 4px"><div class="seg">' + tabs.map(function (t) { return '<div class="seg__i' + (t === state.communityTab ? ' seg__i--on' : '') + '" data-a="setCommunityTab" data-arg="' + t + '">' + t + '</div>'; }).join('') + '</div></div>' +
      '<div style="display:flex;flex-direction:column;gap:14px;margin-top:16px">' + feed.map(function (p) {
        const ratingRow = p.rating > 0 ? '<div style="display:flex;gap:1px;margin:8px 0">' + stars(14, p.rating) + '</div>' : '';
        const textStyle = p.type === 'Citations' ? 'font-size:14px;font-style:italic;color:var(--text);line-height:1.55;font-family:Georgia,serif' : 'font-size:13.5px;color:#3A3A44;line-height:1.55';
        return '<div class="card">' +
          '<div style="display:flex;align-items:center;gap:11px">' +
            '<div style="width:38px;height:38px;border-radius:50%;background:var(--soft);color:var(--text);font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + esc(p.initial) + '</div>' +
            '<div style="flex:1;min-width:0"><div style="font-size:13.5px"><span style="font-weight:700">' + esc(p.user) + '</span><span style="color:var(--muted)"> ' + esc(p.action) + ' </span><span style="font-weight:700">' + esc(p.book) + '</span></div><div style="font-size:11.5px;color:var(--muted2)">' + esc(p.time) + '</div></div></div>' +
          ratingRow + '<div style="' + textStyle + ';margin-top:' + (ratingRow ? '0' : '10px') + '">' + esc(p.text) + '</div></div>';
      }).join('') + '</div>' +
    '</div>' + bottomNav() + '</div>';
  }

  function libraryScreen() {
    const tabs = ['Tout', 'Ma liste', 'En cours', 'Mes livres'];
    let items = [];
    if (state.libraryTab === 'Ma liste') items = state.readingList.map(getBook).filter(Boolean);
    else if (state.libraryTab === 'En cours') items = historyList().map(function (h) { return getBook(h.id); }).filter(Boolean);
    else if (state.libraryTab === 'Mes livres') items = (state.customBooks || []).slice().reverse();
    else items = state.readingList.map(getBook).filter(Boolean).concat((state.customBooks || []).slice().reverse()).filter(function (b, i, arr) { return arr.indexOf(b) === i; });

    const progMap = progressStore();
    let list;
    if (items.length) {
      list = '<div style="display:flex;flex-direction:column;gap:12px;margin-top:16px">' + items.map(function (b) {
        const pr = progMap[b.id]; const v = pr ? Math.round(pr.value) : null;
        return '<div class="card" data-a="openBook" data-arg="' + esc(b.id) + '" style="display:flex;gap:14px;align-items:center;cursor:pointer;padding:12px">' +
          cover(b, '52px', '74px', 'openBook') +
          '<div style="flex:1;min-width:0"><div style="font-weight:800;font-size:14.5px;font-family:Georgia,serif;line-height:1.25;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + esc(b.title) + '</div>' +
            '<div style="font-size:12px;color:var(--muted);margin-top:2px">' + esc(b.author) + '</div>' +
            (v != null ? '<div style="height:4px;background:var(--soft2);border-radius:4px;margin-top:8px;overflow:hidden"><div style="width:' + v + '%;height:100%;background:var(--red)"></div></div>' : '<div style="display:flex;gap:1px;margin-top:6px">' + stars(12, bookRating(b)) + '</div>') +
          '</div>' +
          '<div data-a="toggleList" data-arg="' + esc(b.id) + '" style="color:' + (inList(b.id) ? 'var(--red)' : 'var(--muted2)') + ';flex-shrink:0;padding:4px">' + (inList(b.id) ? IC.bookmarkOn : IC.bookmark) + '</div>' +
        '</div>';
      }).join('') + '</div>';
    } else {
      const msg = state.libraryTab === 'Mes livres' ? 'Vous n\'avez pas encore ajouté de livre.' : state.libraryTab === 'En cours' ? 'Aucune lecture en cours.' : 'Aucun livre enregistré pour le moment.';
      list = '<div style="padding:60px 20px;text-align:center;color:var(--muted);font-size:14px">' + msg + '</div>';
    }

    return '<div class="screen"><div class="content pad">' +
      '<div class="top"><div class="h1">Bibliothèque</div></div>' +
      '<div class="hscroll hidescroll" style="padding-top:6px"><div class="chips" style="flex-wrap:nowrap">' + tabs.map(function (t) { return '<div class="chip' + (t === state.libraryTab ? ' chip--on' : '') + '" data-a="setLibraryTab" data-arg="' + esc(t) + '">' + t + '</div>'; }).join('') + '</div></div>' +
      list +
    '</div>' + bottomNav() + fab() + '</div>';
  }

  function profileScreen() {
    const u = state.currentUser;
    const hist = historyList();
    const myReviews = Object.keys(state.reviewsByBook).reduce(function (n, k) { return n + state.reviewsByBook[k].filter(function (r) { return r.user === u.name; }).length; }, 0);
    function stat(v, l) { return '<div class="card" style="text-align:center;padding:16px 8px"><div style="font-size:23px;font-weight:800;color:var(--red);font-family:Georgia,serif">' + v + '</div><div style="font-size:11.5px;color:var(--muted);font-weight:600;margin-top:2px">' + l + '</div></div>'; }
    const histHtml = hist.length ? hist.slice(0, 6).map(function (h) {
      const v = Math.round(h.value);
      return '<div class="card" data-a="openBook" data-arg="' + esc(h.id) + '" style="display:flex;align-items:center;gap:12px;cursor:pointer;padding:12px 14px">' +
        '<div style="width:9px;height:9px;border-radius:50%;background:' + (h.color || 'var(--red)') + ';flex-shrink:0"></div>' +
        '<div style="flex:1;min-width:0"><div style="font-size:13.5px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(h.title) + '</div>' +
          '<div style="height:4px;background:var(--soft2);border-radius:4px;margin-top:6px;overflow:hidden"><div style="width:' + v + '%;height:100%;background:' + (h.color || 'var(--red)') + '"></div></div></div>' +
        '<div style="font-size:12px;font-weight:700;color:var(--muted)">' + (v >= 100 ? 'Terminé' : v + '%') + '</div></div>';
    }).join('') : '<div style="color:var(--muted);font-size:13.5px;padding:8px 0">Ouvrez un livre pour commencer votre historique.</div>';

    return '<div class="screen"><div class="content pad">' +
      '<div class="top"><div class="h1">Profil</div><div class="icon-btn" data-a="signOut" title="Se déconnecter">' + IC.logout + '</div></div>' +
      '<div style="display:flex;align-items:center;gap:16px;padding:14px 0 22px">' +
        '<div style="width:66px;height:66px;border-radius:50%;background:var(--text);color:#fff;font-weight:700;font-size:25px;display:flex;align-items:center;justify-content:center">' + esc(initialOf(u.name)) + '</div>' +
        '<div><div style="font-size:20px;font-weight:800;font-family:Georgia,serif">' + esc(u.name) + '</div><div style="font-size:13px;color:var(--muted)">' + esc(u.email || 'Compte local') + '</div></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">' + stat(hist.length, 'Livres ouverts') + stat(myReviews, 'Avis écrits') + stat(fmtDuration(LS.get('listenSeconds', 0)), 'Écoute') + '</div>' +
      '<div class="sec"><div class="sec__t">Historique de lecture</div></div>' +
      '<div style="display:flex;flex-direction:column;gap:10px">' + histHtml + '</div>' +
    '</div>' + bottomNav() + '</div>';
  }

  function bookScreen() {
    const b = getBook(state.selectedBookId);
    if (!b) return '<div class="shell"></div>';
    const reviews = reviewsFor(b); const rating = bookRating(b);
    const listed = inList(b.id);
    const reviewsHtml = reviews.length ? reviews.map(function (r) {
      return '<div style="display:flex;gap:12px;margin-bottom:18px">' +
        '<div style="width:36px;height:36px;border-radius:50%;background:var(--soft);color:var(--text);font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + esc(r.initial) + '</div>' +
        '<div><div style="display:flex;align-items:baseline;gap:8px"><div style="font-weight:700;font-size:13.5px">' + esc(r.user) + '</div><div style="font-size:11.5px;color:var(--muted2)">' + esc(r.date) + '</div></div>' +
          '<div style="display:flex;gap:1px;margin:3px 0 5px">' + stars(12, r.rating) + '</div>' +
          '<div style="font-size:13.5px;line-height:1.55;color:#3A3A44">' + esc(r.comment) + '</div></div></div>';
    }).join('') : '<div style="color:var(--muted);font-size:13.5px">Aucun avis — soyez le premier à en écrire un.</div>';

    return '<div class="screen"><div class="content pad-plain">' +
      '<div class="top" style="padding-top:14px"><div class="icon-btn" data-a="back">' + IC.back + '</div>' +
        '<div class="icon-btn" data-a="toggleList" data-arg="' + esc(b.id) + '" style="color:' + (listed ? 'var(--red)' : 'var(--text)') + '">' + (listed ? IC.bookmarkOn : IC.bookmark) + '</div></div>' +
      '<div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:14px 24px 4px">' +
        cover(b, '140px', '206px', 'noop') +
        '<div style="font-size:23px;font-weight:800;letter-spacing:-.4px;margin-top:18px;font-family:Georgia,serif">' + esc(b.title) + '</div>' +
        '<div style="font-size:14px;color:var(--muted);margin-top:3px">' + esc(b.author) + '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-top:12px;flex-wrap:wrap;justify-content:center">' +
          '<div style="display:flex;gap:1px">' + stars(15, rating) + '</div>' +
          '<span style="font-size:12.5px;color:var(--muted);font-weight:600">' + (Math.round(rating * 10) / 10) + ' · ' + reviews.length + ' avis</span></div>' +
        '<div class="chips" style="justify-content:center;margin-top:12px">' +
          '<span class="chip"><span style="width:7px;height:7px;border-radius:50%;background:' + (GENRE_COLORS[b.genre] || '#999') + '"></span>' + esc(b.genre) + '</span>' +
          '<span class="chip">' + esc(b.age) + '</span><span class="chip">' + esc(b.language) + '</span></div>' +
      '</div>' +
      '<div style="padding:20px 20px 0;display:flex;gap:10px">' +
        '<button class="btn btn--primary" data-a="readBook">Lire</button>' +
        '<button class="btn btn--soft" data-a="listenBook" style="flex:0 0 auto;width:auto;padding:15px 18px">' + IC.headphones + '</button></div>' +
      '<div style="padding:22px 20px 0"><p style="font-size:14.5px;line-height:1.7;color:#3A3A44">' + esc(b.summaryFull) + '</p></div>' +
      '<div style="padding:26px 20px 0"><div style="font-size:17px;font-weight:800;margin-bottom:14px;font-family:Georgia,serif">Avis (' + reviews.length + ')</div>' +
        '<div class="card" style="background:var(--soft);border:none;margin-bottom:20px">' +
          '<div style="font-size:12.5px;font-weight:700;color:var(--muted);margin-bottom:9px">Votre note</div>' +
          '<div style="display:flex;gap:4px;margin-bottom:11px">' + ratingPicker(state.newReviewRating) + '</div>' +
          '<textarea data-a="setReviewText" placeholder="Partagez votre avis ou une citation…" style="width:100%;min-height:70px;border:1px solid var(--line);border-radius:12px;padding:11px 13px;font-size:14px;outline:none;resize:vertical;background:var(--surface)">' + esc(state.newReviewText) + '</textarea>' +
          '<button class="btn btn--primary" data-a="submitReview" style="margin-top:11px"' + (state.busy ? ' disabled' : '') + '>Publier</button></div>' +
        reviewsHtml +
      '</div>' +
    '</div></div>';
  }

  function readerScreen() {
    const b = getBook(state.selectedBookId);
    if (!b) return '<div class="shell"></div>';
    const th = THEMES[state.readerTheme];
    const isAudio = state.readerMode === 'audio';

    const topSeg = '<div class="seg" style="background:' + (state.readerTheme === 'light' ? 'var(--soft)' : 'rgba(255,255,255,.12)') + '">' +
      '<div class="seg__i' + (!isAudio ? ' seg__i--on' : '') + '" data-a="setModeText" style="color:' + (!isAudio ? th.chipFg : th.sub) + (!isAudio ? ';background:' + th.chipBg : '') + '">Texte</div>' +
      '<div class="seg__i' + (isAudio ? ' seg__i--on' : '') + '" data-a="setModeAudio" style="color:' + (isAudio ? th.chipFg : th.sub) + (isAudio ? ';background:' + th.chipBg : '') + '">Écoute</div></div>';

    const top = '<div class="reader__top" style="color:' + th.fg + '">' +
      '<div data-a="backToBook" style="cursor:pointer;display:flex">' + IC.close + '</div>' + topSeg +
      '<div style="display:flex;gap:6px">' + (isAudio ? '' : '<div class="icon-btn" data-a="toggleSettings" style="background:' + (state.readerTheme === 'light' ? 'var(--soft)' : 'rgba(255,255,255,.12)') + ';color:' + th.fg + '">' + IC.sliders + '</div>') +
        '<div class="icon-btn" data-a="toggleList" data-arg="' + esc(b.id) + '" style="background:' + (state.readerTheme === 'light' ? 'var(--soft)' : 'rgba(255,255,255,.12)') + ';color:' + (inList(b.id) ? 'var(--red)' : th.fg) + '">' + (inList(b.id) ? IC.bookmarkOn : IC.bookmark) + '</div></div></div>';

    let body, bottom = '';
    if (!isAudio && state.pdfUrl) {
      body = '<div class="reader__body" style="padding:0"><iframe src="' + esc(state.pdfUrl) + '" title="PDF" style="border:none;width:100%;height:100%"></iframe></div>';
    } else if (!isAudio) {
      const font = FONTS[state.readerFontKey].css, pad = MARGINS[state.readerMargin].pad, fs = state.readerFontSize;
      const paras = [b.summaryFull, b.summaryFull, b.summaryFull];
      body = '<div class="reader__body" id="readerText" style="padding:14px ' + pad + 'px 30px;color:' + th.fg + ';font-family:' + font + '">' +
        '<div style="text-align:center;margin:18px 0 26px"><div style="font-size:12px;letter-spacing:2px;color:' + th.sub + ';font-weight:700">CHAPITRE ' + state.currentPage + '</div>' +
          '<div style="font-size:20px;font-weight:700;margin-top:8px;font-family:' + font + '">' + esc(b.title) + '</div></div>' +
        paras.map(function (p) { return '<p style="font-size:' + fs + 'px;line-height:1.85;margin:0 0 18px;text-align:justify">' + esc(p) + '</p>'; }).join('') + '</div>';
      bottom = '<div class="reader__bottom" style="color:' + th.sub + '">' +
        '<input type="range" data-a="seekPage" min="1" max="' + b.pageCount + '" value="' + state.currentPage + '" style="width:100%;margin-bottom:6px" />' +
        '<div style="text-align:center;font-size:12px;font-weight:600" id="pageLabel">Page ' + state.currentPage + ' sur ' + b.pageCount + '</div></div>';
    } else {
      const speedOpts = [{ value: '0.75', label: '0.75×' }, { value: '1', label: '1×' }, { value: '1.25', label: '1.25×' }, { value: '1.5', label: '1.5×' }];
      const voiceList = audio.voices.length ? audio.voices.map(function (v) { return { value: v.name, label: v.name }; }) : [{ value: '', label: 'Voix par défaut' }];
      function sel(action, opts, cur) { return '<select class="input" data-a="' + action + '" style="background:' + th.chipBg + ';color:' + th.fg + ';border-color:transparent">' + opts.map(function (o) { const val = typeof o === 'object' ? o.value : o, lab = typeof o === 'object' ? o.label : o; return '<option value="' + esc(val) + '"' + (String(val) === String(cur) ? ' selected' : '') + '>' + esc(lab) + '</option>'; }).join('') + '</select>'; }
      body = '<div class="reader__body" style="display:flex;flex-direction:column;align-items:center;padding:20px 28px;color:' + th.fg + '">' +
        cover(b, '190px', '270px', 'noop') +
        '<div style="font-size:19px;font-weight:800;margin-top:22px;text-align:center;font-family:Georgia,serif">' + esc(b.title) + '</div>' +
        '<div style="font-size:13.5px;color:' + th.sub + ';margin-bottom:26px">' + esc(b.author) + '</div>' +
        '<div style="width:100%;height:6px;background:' + th.chipBg + ';border-radius:6px;overflow:hidden;margin-bottom:8px"><div id="audioBar" style="width:' + state.audioProgress + '%;height:100%;background:var(--red)"></div></div>' +
        '<div style="display:flex;justify-content:space-between;width:100%;font-size:11.5px;color:' + th.sub + ';font-weight:600;margin-bottom:24px"><span id="audioPct">' + Math.round(state.audioProgress) + '%</span><span>' + (('speechSynthesis' in window) ? 'Synthèse vocale' : 'Lecture simulée') + '</span></div>' +
        '<div data-a="togglePlay" style="width:66px;height:66px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;cursor:pointer;margin-bottom:28px;box-shadow:0 10px 24px rgba(228,0,43,.4)">' + (state.audioPlaying ? IC.pause : IC.play) + '</div>' +
        '<div style="width:100%;display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
          '<div><div style="font-size:11px;font-weight:700;color:' + th.sub + ';margin-bottom:6px">VOIX</div>' + sel('setVoice', voiceList, state.audioVoice) + '</div>' +
          '<div><div style="font-size:11px;font-weight:700;color:' + th.sub + ';margin-bottom:6px">VITESSE</div>' + sel('setSpeed', speedOpts, state.audioSpeed) + '</div>' +
          '<div style="grid-column:span 2"><div style="font-size:11px;font-weight:700;color:' + th.sub + ';margin-bottom:6px">LANGUE</div>' + sel('setAudioLang', languages, state.audioLang) + '</div></div></div>';
    }

    const sheet = state.showSettings ? settingsSheet(th) : '';
    return '<div class="screen reader" style="background:' + th.bg + '">' + top + body + bottom + '</div>' + sheet;
  }

  function settingsSheet(th) {
    function chipRow(items, cur, action, red) {
      return '<div class="chips">' + items.map(function (it) { const on = it.key === cur; return '<div class="chip' + (red ? ' chip--red' : '') + (on ? ' chip--on' : '') + '" data-a="' + action + '" data-arg="' + it.key + '">' + it.label + '</div>'; }).join('') + '</div>';
    }
    const themeItems = Object.keys(THEMES).map(function (k) { return { key: k, label: THEMES[k].label }; });
    const fontItems = Object.keys(FONTS).map(function (k) { return { key: k, label: FONTS[k].label }; });
    const marginItems = Object.keys(MARGINS).map(function (k) { return { key: k, label: MARGINS[k].label }; });
    return '<div class="sheet-wrap"><div class="sheet-bd" data-a="toggleSettings"></div>' +
      '<div class="sheet"><div class="sheet__grip"></div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin:6px 0 18px"><div style="font-size:18px;font-weight:800;font-family:Georgia,serif">Réglages de lecture</div><div data-a="toggleSettings" style="cursor:pointer;color:var(--muted)">' + IC.close + '</div></div>' +
      '<div class="label">Tonalité</div>' + chipRow(themeItems, state.readerTheme, 'setTheme') +
      '<div class="label" style="margin-top:20px">Taille du texte</div>' +
      '<div style="display:flex;align-items:center;gap:14px"><span style="font-size:14px;color:var(--muted)">A</span><input type="range" data-a="setSize" min="14" max="24" step="1" value="' + state.readerFontSize + '" style="flex:1" /><span style="font-size:22px;color:var(--muted)">A</span></div>' +
      '<div class="label" style="margin-top:20px">Police</div>' + chipRow(fontItems, state.readerFontKey, 'setFont') +
      '<div class="label" style="margin-top:20px">Marges</div>' + chipRow(marginItems, state.readerMargin, 'setMargin') +
      '</div></div>';
  }

  function uploadScreen() {
    const f = state.uploadForm;
    function fld(label, ctrl) { return '<div class="field"><div class="label">' + label + '</div>' + ctrl + '</div>'; }
    return '<div class="screen"><div class="content pad-plain">' +
      '<div class="top" style="padding-top:14px"><div class="icon-btn" data-a="back">' + IC.back + '</div><div style="font-size:18px;font-weight:800;font-family:Georgia,serif">Ajouter un livre</div><div style="width:40px"></div></div>' +
      '<form id="uploadForm" style="padding:14px 20px 0">' +
        '<label style="display:flex;flex-direction:column;align-items:center;gap:8px;border:2px dashed var(--line);border-radius:16px;padding:34px;cursor:pointer;background:var(--soft);margin-bottom:22px">' +
          '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v14"/><path d="m5 10 7-7 7 7"/><path d="M5 21h14"/></svg>' +
          '<div style="font-size:14px;font-weight:700">' + esc(state.uploadFileName || 'Choisir un fichier PDF') + '</div>' +
          '<div style="font-size:12px;color:var(--muted)">Format PDF</div>' +
          '<input type="file" accept="application/pdf" data-a="handleFile" style="display:none" /></label>' +
        fld('Titre', '<input class="input" data-a="setUploadTitle" value="' + esc(f.title) + '" placeholder="Titre du livre" />') +
        fld('Auteur', '<input class="input" data-a="setUploadAuthor" value="' + esc(f.author) + '" placeholder="Nom de l\'auteur" />') +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
          fld('Genre', '<select class="input" data-a="setUploadGenre">' + genres.map(function (g) { return '<option' + (g === f.genre ? ' selected' : '') + '>' + esc(g) + '</option>'; }).join('') + '</select>') +
          fld('Âge', '<select class="input" data-a="setUploadAge">' + ages.map(function (a) { return '<option' + (a === f.age ? ' selected' : '') + '>' + esc(a) + '</option>'; }).join('') + '</select>') +
        '</div>' +
        fld('Langue', '<select class="input" data-a="setUploadLanguage">' + languages.map(function (l) { return '<option' + (l === f.language ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join('') + '</select>') +
        '<button type="submit" class="btn btn--primary" style="margin-top:8px"' + (state.busy ? ' disabled' : '') + '>' + (state.busy ? 'Ajout en cours…' : 'Ajouter à la bibliothèque') + '</button>' +
      '</form>' +
    '</div></div>';
  }

  function fab() { return '<div class="fab" data-a="go" data-arg="upload">' + IC.plus + '</div>'; }

  function render() {
    const app = document.getElementById('app');
    if (state.booting) { app.innerHTML = loaderHtml(); return; }
    if (!state.currentUser) { app.innerHTML = authHtml(); return; }
    let inner;
    switch (state.screen) {
      case 'home': inner = homeScreen(); break;
      case 'search': inner = searchScreen(); break;
      case 'community': inner = communityScreen(); break;
      case 'library': inner = libraryScreen(); break;
      case 'profile': inner = profileScreen(); break;
      case 'book': inner = bookScreen(); break;
      case 'reader': inner = readerScreen(); break;
      case 'upload': inner = uploadScreen(); break;
      default: inner = homeScreen();
    }
    const toast = state.toast ? '<div class="toast">' + esc(state.toast) + '</div>' : '';
    app.innerHTML = '<div class="shell">' + inner + toast + '</div>';
  }

  /* ==========================================================================
   * 10. Actions
   * ========================================================================== */
  function audioText(b) { return b.summaryFull + ' ' + b.summaryFull; }
  function audioOpts() { return { rate: state.audioSpeed, langCode: LANG_CODES[state.audioLang] || 'fr-FR', voiceName: state.audioVoice }; }
  function startPlayback() {
    const b = getBook(state.selectedBookId);
    audio.progress = state.audioProgress;
    audio.start(audioText(b), audioOpts(),
      function (p) { state.audioProgress = p; const bar = document.getElementById('audioBar'), pct = document.getElementById('audioPct'); if (bar) bar.style.width = p + '%'; if (pct) pct.textContent = Math.round(p) + '%'; setProgress(b.id, b.title, b.color, p); },
      function () { setProgress(b.id, b.title, b.color, 100); setState({ audioPlaying: false, audioProgress: 0 }); });
  }
  function persistReaderPrefs() { LS.set('readerTheme', state.readerTheme); LS.set('readerFont', state.readerFontKey); LS.set('readerFontSize', state.readerFontSize); LS.set('readerMargin', state.readerMargin); }
  function addRecent(q) { q = (q || '').trim(); if (!q) return; const r = state.recentSearches.filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); }); r.unshift(q); state.recentSearches = r.slice(0, 8); LS.set('recent', state.recentSearches); }

  const actions = {
    go: function (tab) { if (state.screen === 'reader') audio.stop(); if (tab === 'upload') state.prevScreen = MAIN_TABS.indexOf(state.screen) !== -1 ? state.screen : 'home'; setState({ screen: tab, showSettings: false, catFilter: (tab === 'search' ? state.catFilter : null) }); },
    noop: function () {},
    back: function () { setState({ screen: MAIN_TABS.indexOf(state.prevScreen) !== -1 ? state.prevScreen : 'home' }); },
    signOut: async function () { audio.stop(); await db.signOut(); state.currentUser = null; state.screen = 'home'; render(); },
    openBook: function (id) {
      const b = getBook(id); if (!b) return;
      const cur = (progressStore()[id] || {}).value || 5;
      setProgress(b.id, b.title, b.color, Math.max(5, Math.round(cur)));
      if (MAIN_TABS.indexOf(state.screen) !== -1) state.prevScreen = state.screen;
      setState({ screen: 'book', selectedBookId: id, newReviewRating: 0, newReviewText: '' });
    },
    openCategory: function (g) { setState({ screen: 'search', catFilter: g, search: '' }); },
    clearCategory: function () { setState({ catFilter: null }); },
    clearSearch: function () { setState({ search: '' }); },
    applyRecent: function (q) { setState({ search: q, catFilter: null }); },
    removeRecent: function (q) { state.recentSearches = state.recentSearches.filter(function (x) { return x !== q; }); LS.set('recent', state.recentSearches); render(); },
    clearRecent: function () { state.recentSearches = []; LS.set('recent', []); render(); },
    toggleList: function (id) {
      const i = state.readingList.indexOf(id);
      if (i === -1) { state.readingList = state.readingList.concat(id); showToast('Ajouté à votre liste'); }
      else { state.readingList = state.readingList.filter(function (x) { return x !== id; }); showToast('Retiré de votre liste'); }
      LS.set('readingList', state.readingList);
    },
    setLibraryTab: function (t) { setState({ libraryTab: t }); },
    setCommunityTab: function (t) { setState({ communityTab: t }); },
    readBook: async function () { audio.stop(); const b = getBook(state.selectedBookId); state.pdfUrl = await db.pdfUrl(b); setState({ screen: 'reader', currentPage: 1, readerMode: 'text', showSettings: false, audioPlaying: false, audioProgress: 0 }); },
    listenBook: function () { audio.stop(); audio.refreshVoices(); if (MAIN_TABS.indexOf(state.screen) !== -1) state.prevScreen = state.screen; setState({ screen: 'reader', selectedBookId: state.selectedBookId, currentPage: 1, readerMode: 'audio', showSettings: false, audioPlaying: false, audioProgress: 0, pdfUrl: null }); },
    backToBook: function () { audio.stop(); setState({ screen: 'book', showSettings: false, audioPlaying: false }); },
    setModeText: async function () { audio.stop(); const b = getBook(state.selectedBookId); state.pdfUrl = await db.pdfUrl(b); setState({ readerMode: 'text', audioPlaying: false }); },
    setModeAudio: function () { audio.refreshVoices(); setState({ readerMode: 'audio', showSettings: false }); },
    toggleSettings: function () { setState({ showSettings: !state.showSettings }); },
    setTheme: function (k) { state.readerTheme = k; persistReaderPrefs(); render(); },
    setFont: function (k) { state.readerFontKey = k; persistReaderPrefs(); render(); },
    setMargin: function (k) { state.readerMargin = k; persistReaderPrefs(); render(); },
    prevPage: function () { const b = getBook(state.selectedBookId); const p = Math.max(1, state.currentPage - 1); setProgress(b.id, b.title, b.color, Math.round(p / b.pageCount * 100)); setState({ currentPage: p }); },
    nextPage: function () { const b = getBook(state.selectedBookId); const p = Math.min(b.pageCount, state.currentPage + 1); setProgress(b.id, b.title, b.color, Math.round(p / b.pageCount * 100)); setState({ currentPage: p }); },
    togglePlay: function () { if (state.audioPlaying) { audio.pause(); setState({ audioPlaying: false }); return; } setState({ audioPlaying: true }); startPlayback(); },
    setRating: function (v) { setState({ newReviewRating: parseInt(v, 10) }); },
    submitReview: async function () {
      if (!state.newReviewText.trim() || !state.newReviewRating || state.busy) return;
      const id = state.selectedBookId, u = state.currentUser;
      const review = { id: uid(), user: u.name, initial: initialOf(u.name), rating: state.newReviewRating, comment: state.newReviewText, date: 'à l’instant' };
      state.busy = true;
      try { await db.saveReview(id, review, u); } catch (e) { state.busy = false; showToast('Erreur : ' + e.message); return; }
      state.reviewsByBook[id] = [review].concat(state.reviewsByBook[id] || []); state.busy = false;
      setState({ newReviewRating: 0, newReviewText: '' });
    },
  };

  /* ==========================================================================
   * 11. Évènements
   * ========================================================================== */
  const root = document.getElementById('app');
  const FIELD_ACTIONS = ['setSearch', 'setReviewText', 'setVoice', 'setSpeed', 'setAudioLang', 'setSize', 'seekPage', 'handleFile', 'setUploadTitle', 'setUploadAuthor', 'setUploadGenre', 'setUploadAge', 'setUploadLanguage', 'authName', 'authEmail', 'authPassword'];

  root.addEventListener('click', function (e) {
    const el = e.target.closest('[data-a]'); if (!el) return;
    const a = el.getAttribute('data-a');
    if (FIELD_ACTIONS.indexOf(a) !== -1) return;
    if (a === 'authToggle') { setState({ authMode: state.authMode === 'signin' ? 'signup' : 'signin', authError: '' }); return; }
    const fn = actions[a]; if (fn) fn(el.getAttribute('data-arg'));
  });

  root.addEventListener('input', function (e) {
    const el = e.target.closest('[data-a]'); if (!el) return;
    const a = el.getAttribute('data-a');
    if (a === 'setSearch') { state.search = el.value; state.catFilter = null; render(); const inp = document.getElementById('searchInput'); if (inp) { inp.focus(); const v = inp.value; inp.setSelectionRange(v.length, v.length); } }
    else if (a === 'setReviewText') state.newReviewText = el.value;
    else if (a === 'setUploadTitle') state.uploadForm.title = el.value;
    else if (a === 'setUploadAuthor') state.uploadForm.author = el.value;
    else if (a === 'authName') state.authName = el.value;
    else if (a === 'authEmail') state.authEmail = el.value;
    else if (a === 'authPassword') state.authPassword = el.value;
    else if (a === 'setSize') { state.readerFontSize = parseInt(el.value, 10); persistReaderPrefs(); const t = document.getElementById('readerText'); if (t) t.querySelectorAll('p').forEach(function (p) { p.style.fontSize = state.readerFontSize + 'px'; }); }
    else if (a === 'seekPage') { const b = getBook(state.selectedBookId); state.currentPage = parseInt(el.value, 10); setProgress(b.id, b.title, b.color, Math.round(state.currentPage / b.pageCount * 100)); const lbl = document.getElementById('pageLabel'); if (lbl) lbl.textContent = 'Page ' + state.currentPage + ' sur ' + b.pageCount; }
  });

  root.addEventListener('change', function (e) {
    const el = e.target.closest('[data-a]'); if (!el) return;
    const a = el.getAttribute('data-a');
    switch (a) {
      case 'setVoice': state.audioVoice = el.value; if (state.audioPlaying) startPlayback(); break;
      case 'setSpeed': state.audioSpeed = parseFloat(el.value); if (state.audioPlaying) startPlayback(); break;
      case 'setAudioLang': state.audioLang = el.value; if (state.audioPlaying) startPlayback(); break;
      case 'setUploadGenre': state.uploadForm.genre = el.value; break;
      case 'setUploadAge': state.uploadForm.age = el.value; break;
      case 'setUploadLanguage': state.uploadForm.language = el.value; break;
      case 'handleFile': { const file = el.files[0]; if (!file) return; state.uploadFile = file; state.uploadFileName = file.name; if (!state.uploadForm.title) state.uploadForm.title = file.name.replace(/\.pdf$/i, ''); render(); break; }
    }
  });

  root.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    const el = e.target.closest('#searchInput'); if (!el) return;
    addRecent(el.value);
  });

  root.addEventListener('submit', async function (e) {
    if (e.target.closest('#authForm')) {
      e.preventDefault(); if (state.authBusy) return;
      const signup = state.authMode === 'signup', email = state.authEmail.trim(), pw = state.authPassword, name = state.authName.trim();
      if (!email || !pw || (signup && !name)) { setState({ authError: 'Merci de remplir tous les champs.' }); return; }
      state.authBusy = true; state.authError = ''; render();
      try { const s = signup ? await db.signUp(email, pw, name) : await db.signIn(email, pw); state.authBusy = false; state.currentUser = s; await afterLogin(); }
      catch (err) { state.authBusy = false; setState({ authError: err.message }); }
      return;
    }
    if (e.target.closest('#uploadForm')) {
      e.preventDefault(); if (state.busy) return;
      const f = state.uploadForm; if (!f.title.trim()) return;
      const book = { id: uid(), title: f.title, author: f.author || 'Auteur inconnu', genre: f.genre, age: f.age, color: '#8A3D8F', rating: 0, language: f.language, pageCount: 12, summaryFull: 'Livre ajouté par vous récemment.', reviews: [] };
      state.busy = true; render();
      try { await db.saveBook(book, state.uploadFile, state.currentUser); }
      catch (err) { state.busy = false; showToast('Erreur : ' + err.message); return; }
      state.customBooks = state.customBooks.concat(book); state.busy = false;
      state.uploadForm = { title: '', author: '', genre: 'Roman', age: 'Enfants', language: 'Français' }; state.uploadFile = null; state.uploadFileName = '';
      setState({ screen: 'library', libraryTab: 'Mes livres' });
      showToast('« ' + book.title + ' » a été ajouté', 3200);
    }
  });

  /* ==========================================================================
   * 12. Démarrage
   * ========================================================================== */
  async function afterLogin() { try { state.customBooks = await db.loadBooks(); state.reviewsByBook = await db.loadReviews(); } catch (e) { console.warn(e); } render(); }

  async function boot() {
    state.customBooks = []; state.reviewsByBook = {};
    if ('speechSynthesis' in window) { audio.refreshVoices(); window.speechSynthesis.onvoiceschanged = function () { audio.refreshVoices(); }; }
    await db.init(window.LECTURA_CONFIG || {});
    try { const s = await db.session(); state.currentUser = s; state.booting = false; if (s) await afterLogin(); else render(); }
    catch (e) { state.booting = false; render(); }
  }

  boot();
})();
