"use strict";
(function () {

  /* ==========================================================================
   * 1. Données de base (catalogue de démonstration + fil communautaire)
   * ========================================================================== */
  const languages = ['Français', 'English', 'Español', 'Deutsch', 'العربية', '中文'];
  const genres = ['Tous', 'Roman', 'Bande dessinée', 'Essai', 'Scolaire'];
  const ages = ['Tous', 'Enfants', 'Jeunesse', 'Adultes'];
  const GENRE_COLORS = { 'Roman': '#4F46E5', 'Bande dessinée': '#F59E0B', 'Essai': '#16A34A', 'Scolaire': '#DB2777' };

  const seedBooks = [
    { id: 'b1', title: "L'Enfant et la Rivière", author: 'Nadia Fontaine', genre: 'Roman', age: 'Jeunesse', color: '#4F46E5', rating: 4.5, language: 'Français', pageCount: 6, summaryFull: "Un jeune garçon découvre les secrets de son village au fil de l'eau. Entre amitié et courage, ce roman tendre parle de grandir et de laisser aller.", reviews: [{ id: 1, user: 'Camille R.', initial: 'C', rating: 5, comment: "Une écriture délicate, parfaite à lire à voix haute avec mes enfants.", date: 'il y a 3 jours' }] },
    { id: 'b2', title: 'Les Carnets de Mona', author: 'Julien Perrot', genre: 'Bande dessinée', age: 'Enfants', color: '#F59E0B', rating: 4.8, language: 'Français', pageCount: 5, summaryFull: "Mona explore son quartier et invente mille histoires. Une bande dessinée pétillante, pensée pour être lue et relue en famille.", reviews: [] },
    { id: 'b3', title: 'Petite Philosophie du Quotidien', author: 'Claire Dubosc', genre: 'Essai', age: 'Adultes', color: '#16A34A', rating: 4.2, language: 'Français', pageCount: 8, summaryFull: "De courts essais pour penser le quotidien autrement. Claire Dubosc questionne nos habitudes avec clarté et une pointe d'humour.", reviews: [{ id: 2, user: 'Antoine M.', initial: 'A', rating: 4, comment: "Des chapitres courts, parfaits pour l'écoute pendant les trajets.", date: 'il y a 1 semaine' }, { id: 3, user: 'Léa P.', initial: 'L', rating: 4, comment: "« Le bonheur se cache dans la répétition des petites choses. » Cette phrase m'a marquée.", date: 'il y a 2 semaines' }] },
    { id: 'b4', title: "Mathématiques Faciles — 6e", author: "Ministère de l'Éducation", genre: 'Scolaire', age: 'Jeunesse', color: '#DB2777', rating: 3.9, language: 'Français', pageCount: 10, summaryFull: "Manuel de mathématiques pour la classe de sixième, avec exercices corrigés et rappels de cours illustrés.", reviews: [] },
    { id: 'b5', title: 'Le Dragon Timide', author: 'Sofia Lenoir', genre: 'Bande dessinée', age: 'Enfants', color: '#06B6D4', rating: 4.9, language: 'Français', pageCount: 4, summaryFull: "Un petit dragon qui a peur de son propre feu apprend à s'accepter grâce à ses amis de la forêt.", reviews: [] },
    { id: 'b6', title: 'Un Été à Marrakech', author: 'Karim Belhadj', genre: 'Roman', age: 'Adultes', color: '#7C3AED', rating: 4.4, language: 'Français', pageCount: 9, summaryFull: "Une famille se retrouve le temps d'un été marocain, entre souvenirs, secrets et retrouvailles inattendues.", reviews: [{ id: 4, user: 'Nadia F.', initial: 'N', rating: 5, comment: "Dépaysant et chaleureux, un roman que j'ai adoré partager en famille.", date: 'il y a 4 jours' }] },
    { id: 'b7', title: 'Sciences Naturelles Illustrées', author: 'Léa Moreau', genre: 'Scolaire', age: 'Enfants', color: '#059669', rating: 4.1, language: 'Français', pageCount: 7, summaryFull: "Découvrir la nature à travers des illustrations simples et un vocabulaire adapté aux plus jeunes.", reviews: [] },
    { id: 'b8', title: 'Réflexions sur le Temps', author: 'Antoine Marchal', genre: 'Essai', age: 'Adultes', color: '#64748B', rating: 4.6, language: 'Français', pageCount: 11, summaryFull: "Un essai sur notre rapport moderne au temps qui passe, entre urgence permanente et besoin de ralentir.", reviews: [] },
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
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Échec de chargement ' + src)); };
      document.head.appendChild(s);
    });
  }

  function coverCss(color, extra) {
    return 'background:linear-gradient(155deg, ' + color + ', ' + color + 'cc);border-radius:14px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 6px 16px rgba(20,20,30,0.10);' + (extra || '');
  }
  function ageBadgeCss(age, fontSize, pad) {
    let bg = '#E5E7EB', fg = '#374151';
    if (age === 'Enfants') { bg = '#FEF3C7'; fg = '#92400E'; }
    else if (age === 'Jeunesse') { bg = '#DBEAFE'; fg = '#1E40AF'; }
    return 'background:' + bg + ';color:' + fg + ';font-size:' + fontSize + ';font-weight:700;padding:' + pad + ';border-radius:20px';
  }
  const STAR_PATH = 'M12 2.5 15 9l7 1-5.2 5 1.3 7-6.1-3.4L5.9 22l1.3-7L2 10l7-1z';
  function stars(size, rating, extra) {
    const r = Math.round(rating); let out = '';
    for (let i = 1; i <= 5; i++) out += '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" style="fill:' + (i <= r ? '#F5A623' : '#DBDBE2') + ';display:block;' + (extra || '') + '"><path d="' + STAR_PATH + '"/></svg>';
    return out;
  }
  function ratingPicker(rating) {
    const r = Math.round(rating); let out = '';
    for (let i = 1; i <= 5; i++) out += '<svg data-a="setRating" data-arg="' + i + '" width="20" height="20" viewBox="0 0 24 24" style="fill:' + (i <= r ? '#F5A623' : '#DBDBE2') + ';display:block;cursor:pointer"><path d="' + STAR_PATH + '"/></svg>';
    return out;
  }
  function options(list, current) {
    return list.map(function (o) {
      const val = typeof o === 'object' ? o.value : o, label = typeof o === 'object' ? o.label : o;
      return '<option value="' + esc(val) + '"' + (String(val) === String(current) ? ' selected' : '') + '>' + esc(label) + '</option>';
    }).join('');
  }

  const IC = {
    logo: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V6a2 2 0 0 1 2-2h13.5v15.5H6a2 2 0 0 0-2 2Z"/><path d="M20 17.5H6.5A2 2 0 0 0 4.5 19"/></svg>',
    home: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>',
    community: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    profile: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    uploadArrow: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v14"/><path d="m5 10 7-7 7 7"/><path d="M5 21h14"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8B96" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    bookOpen: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    headphones: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    chevLeft: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6B76" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    navLeft: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3A3A44" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    navRight: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3A3A44" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    play: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
    uploadBig: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v14"/><path d="m5 10 7-7 7 7"/><path d="M5 21h14"/></svg>',
    logout: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>',
  };

  /* ==========================================================================
   * 3. Stockage local (IndexedDB pour les PDF, localStorage pour le reste)
   *    Sert de base hors-ligne ET de repli quand Supabase n'est pas configuré.
   * ========================================================================== */
  const LS = {
    get: function (k, def) { try { const v = localStorage.getItem('lectura.' + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem('lectura.' + k, JSON.stringify(v)); } catch (e) {} },
  };

  const idb = {
    _db: null,
    open: function () {
      const self = this;
      return new Promise(function (res) {
        if (self._db) return res(self._db);
        if (!window.indexedDB) return res(null);
        const req = indexedDB.open('lectura', 1);
        req.onupgradeneeded = function () { req.result.createObjectStore('pdfs'); };
        req.onsuccess = function () { self._db = req.result; res(self._db); };
        req.onerror = function () { res(null); };
      });
    },
    put: function (key, blob) {
      return this.open().then(function (db) {
        if (!db) return; return new Promise(function (res) { const t = db.transaction('pdfs', 'readwrite'); t.objectStore('pdfs').put(blob, key); t.oncomplete = res; t.onerror = res; });
      });
    },
    get: function (key) {
      return this.open().then(function (db) {
        if (!db) return null; return new Promise(function (res) { const r = db.transaction('pdfs', 'readonly').objectStore('pdfs').get(key); r.onsuccess = function () { res(r.result || null); }; r.onerror = function () { res(null); }; });
      });
    },
  };

  const localStore = {
    users: function () { return LS.get('users', {}); },
    signUp: function (email, password, name) {
      const users = this.users();
      if (users[email]) throw new Error('Un compte existe déjà pour cet email.');
      const u = { id: uid(), email: email, name: name || email.split('@')[0], password: password };
      users[email] = u; LS.set('users', users);
      const session = { id: u.id, email: u.email, name: u.name };
      LS.set('session', session); return session;
    },
    signIn: function (email, password) {
      const u = this.users()[email];
      if (!u || u.password !== password) throw new Error('Email ou mot de passe incorrect.');
      const session = { id: u.id, email: u.email, name: u.name };
      LS.set('session', session); return session;
    },
    signOut: function () { LS.set('session', null); },
    session: function () { return LS.get('session', null); },
    loadBooks: function () { return LS.get('books', []); },
    saveBook: function (book, pdfBlob) {
      const books = LS.get('books', []); books.push(book); LS.set('books', books);
      if (pdfBlob) return idb.put(book.id, pdfBlob);
    },
    loadReviews: function () { return LS.get('reviews', {}); },
    saveReview: function (bookId, review) {
      const map = LS.get('reviews', {}); map[bookId] = [review].concat(map[bookId] || []); LS.set('reviews', map);
    },
    pdfUrl: function (book) {
      return idb.get(book.id).then(function (blob) { return blob ? URL.createObjectURL(blob) : null; });
    },
  };

  /* ==========================================================================
   * 4. Client Supabase (activé uniquement si config.js est renseigné)
   * ========================================================================== */
  const supa = {
    client: null,
    async signUp(email, password, name) {
      const { data, error } = await this.client.auth.signUp({ email, password, options: { data: { display_name: name } } });
      if (error) throw new Error(error.message);
      if (!data.session) throw new Error('Compte créé. Vérifiez votre email pour confirmer, puis connectez-vous.');
      return this._session(data.user);
    },
    async signIn(email, password) {
      const { data, error } = await this.client.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      return this._session(data.user);
    },
    async signOut() { await this.client.auth.signOut(); },
    async session() {
      const { data } = await this.client.auth.getSession();
      return data.session ? this._session(data.session.user) : null;
    },
    _session(user) {
      const name = (user.user_metadata && user.user_metadata.display_name) || (user.email || '').split('@')[0];
      return { id: user.id, email: user.email, name: name };
    },
    async loadBooks() {
      const { data, error } = await this.client.from('books').select('*').order('created_at', { ascending: true });
      if (error) { console.warn('loadBooks', error.message); return []; }
      return data.map(function (r) {
        return { id: r.id, owner: r.owner, title: r.title, author: r.author, genre: r.genre, age: r.age, color: r.color || '#6D6AF5', rating: 0, language: r.language, pageCount: r.page_count || 12, summaryFull: r.summary || '', pdf_path: r.pdf_path, reviews: [] };
      });
    },
    async saveBook(book, pdfBlob, owner) {
      let pdf_path = null;
      if (pdfBlob) {
        pdf_path = owner + '/' + book.id + '.pdf';
        const up = await this.client.storage.from('pdfs').upload(pdf_path, pdfBlob, { contentType: 'application/pdf', upsert: true });
        if (up.error) { console.warn('upload pdf', up.error.message); pdf_path = null; }
      }
      const { error } = await this.client.from('books').insert({
        id: book.id, owner: owner, title: book.title, author: book.author, genre: book.genre, age: book.age,
        language: book.language, color: book.color, page_count: book.pageCount, summary: book.summaryFull,
        pdf_path: pdf_path,
      });
      if (error) throw new Error(error.message);
      book.pdf_path = pdf_path;
    },
    async loadReviews() {
      const { data, error } = await this.client.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) { console.warn('loadReviews', error.message); return {}; }
      const map = {};
      data.forEach(function (r) {
        (map[r.book_id] = map[r.book_id] || []).push({ id: r.id, user: r.user_name, initial: initialOf(r.user_name), rating: r.rating, comment: r.comment, date: timeAgo(r.created_at) });
      });
      return map;
    },
    async saveReview(bookId, review, user) {
      const { error } = await this.client.from('reviews').insert({ book_id: bookId, user_id: user.id, user_name: user.name, rating: review.rating, comment: review.comment });
      if (error) throw new Error(error.message);
    },
    async pdfUrl(book) {
      if (!book.pdf_path) return null;
      const { data } = this.client.storage.from('pdfs').getPublicUrl(book.pdf_path);
      return data ? data.publicUrl : null;
    },
  };

  /* ==========================================================================
   * 5. Façade « db » : choisit Supabase ou le stockage local
   * ========================================================================== */
  const db = {
    mode: 'local',
    async init(config) {
      if (config && config.supabaseUrl && config.supabaseAnonKey) {
        try {
          await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js');
          supa.client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
          this.mode = 'supabase';
        } catch (e) { console.warn('Supabase indisponible, bascule en local :', e.message); this.mode = 'local'; }
      }
      return this.mode;
    },
    isRemote() { return this.mode === 'supabase'; },
    signUp(email, password, name) { return this.isRemote() ? supa.signUp(email, password, name) : Promise.resolve(localStore.signUp(email, password, name)); },
    signIn(email, password) { return this.isRemote() ? supa.signIn(email, password) : Promise.resolve(localStore.signIn(email, password)); },
    signOut() { return this.isRemote() ? supa.signOut() : Promise.resolve(localStore.signOut()); },
    session() { return this.isRemote() ? supa.session() : Promise.resolve(localStore.session()); },
    loadBooks() { return this.isRemote() ? supa.loadBooks() : Promise.resolve(localStore.loadBooks()); },
    saveBook(book, pdfBlob, user) { return this.isRemote() ? supa.saveBook(book, pdfBlob, user.id) : localStore.saveBook(book, pdfBlob); },
    loadReviews() { return this.isRemote() ? supa.loadReviews() : Promise.resolve(localStore.loadReviews()); },
    saveReview(bookId, review, user) { return this.isRemote() ? supa.saveReview(bookId, review, user) : Promise.resolve(localStore.saveReview(bookId, review)); },
    pdfUrl(book) { return this.isRemote() ? supa.pdfUrl(book) : localStore.pdfUrl(book); },
  };

  /* ==========================================================================
   * 6. Moteur audio (synthèse vocale réelle + repli si indisponible)
   * ========================================================================== */
  const audio = {
    timer: null, playing: false, progress: 0, startedAt: 0, onTick: null, onEnd: null,
    voices: [],
    refreshVoices() {
      if (!('speechSynthesis' in window)) return;
      this.voices = window.speechSynthesis.getVoices() || [];
    },
    start(text, opts, onTick, onEnd) {
      this.stop();
      this.onTick = onTick; this.onEnd = onEnd; this.playing = true; this.startedAt = Date.now();
      // Lecture vocale réelle (si disponible)
      if ('speechSynthesis' in window) {
        try {
          const u = new SpeechSynthesisUtterance(text);
          u.rate = opts.rate || 1; u.lang = opts.langCode || 'fr-FR';
          const v = this.voices.find(function (vc) { return vc.name === opts.voiceName; });
          if (v) u.voice = v;
          this._utter = u;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
        } catch (e) { /* repli timer ci-dessous */ }
      }
      // Progression pilotée par un minuteur (fiable dans tous les environnements)
      const words = text.split(/\s+/).length;
      const totalMs = Math.max(4000, (words / (2.6 * (opts.rate || 1))) * 1000);
      const step = 100; // ms
      const self = this;
      this.timer = setInterval(function () {
        self.progress = Math.min(100, self.progress + (step / totalMs) * 100);
        if (self.onTick) self.onTick(self.progress);
        if (self.progress >= 100) { self.finish(); }
      }, step);
    },
    pause() {
      if (!this.playing) return;
      this.playing = false;
      clearInterval(this.timer);
      if ('speechSynthesis' in window) try { window.speechSynthesis.pause(); } catch (e) {}
      this._accrue();
    },
    resumeFrom(text, opts, onTick, onEnd) {
      // reprise simple : relance la synthèse depuis le début du passage, progression conservée
      const saved = this.progress;
      this.start(text, opts, onTick, onEnd);
      this.progress = saved;
    },
    stop() {
      clearInterval(this.timer); this.timer = null;
      if (this.playing) this._accrue();
      this.playing = false;
      if ('speechSynthesis' in window) try { window.speechSynthesis.cancel(); } catch (e) {}
    },
    finish() {
      clearInterval(this.timer); this.timer = null;
      this._accrue(); this.playing = false; this.progress = 0;
      if ('speechSynthesis' in window) try { window.speechSynthesis.cancel(); } catch (e) {}
      if (this.onEnd) this.onEnd();
    },
    _accrue() {
      const secs = (Date.now() - this.startedAt) / 1000;
      if (secs > 0 && secs < 3600) LS.set('listenSeconds', (LS.get('listenSeconds', 0) || 0) + secs);
      this.startedAt = Date.now();
    },
  };

  /* ==========================================================================
   * 7. État applicatif
   * ========================================================================== */
  const state = {
    booting: true,
    currentUser: null,
    authMode: 'signin', authName: '', authEmail: '', authPassword: '', authError: '', authBusy: false,

    screen: 'home',
    search: '',
    selectedBookId: null,
    filterGenre: 'Tous',
    filterAge: 'Tous',
    customBooks: [],
    reviewsByBook: {},
    newReviewRating: 0,
    newReviewText: '',
    currentPage: 1,
    readerMode: 'text',
    pdfUrl: null,
    audioPlaying: false,
    audioProgress: 0,
    audioSpeed: 1,
    audioVoice: '',
    audioLang: 'Français',
    uploadForm: { title: '', author: '', genre: 'Roman', age: 'Enfants', language: 'Français' },
    uploadFile: null,
    uploadFileName: '',
    busy: false,
    toast: null,
  };
  let communityTab = 'Tous';
  let toastTimer = null;

  const LANG_CODES = { 'Français': 'fr-FR', 'English': 'en-US', 'Español': 'es-ES', 'Deutsch': 'de-DE', 'العربية': 'ar-SA', '中文': 'zh-CN' };

  function setState(patch) { Object.assign(state, patch); render(); }
  function allBooks() { return seedBooks.concat(state.customBooks); }
  function getBook(id) { return allBooks().find(function (b) { return b.id === id; }); }
  function reviewsFor(book) { return (state.reviewsByBook[book.id] || []).concat(book.reviews || []); }

  function progressStore() { return LS.get('progress', {}); }
  function setProgress(bookId, title, color, value) {
    const p = progressStore(); p[bookId] = { title: title, color: color, value: value, updatedAt: Date.now() }; LS.set('progress', p);
  }

  /* ==========================================================================
   * 8. Rendu
   * ========================================================================== */
  function showToast(msg, ms) { clearTimeout(toastTimer); state.toast = msg; render(); toastTimer = setTimeout(function () { setState({ toast: null }); }, ms || 3000); }

  function loaderHtml() {
    return '<div style="height:100vh;display:flex;align-items:center;justify-content:center;color:#9A9AA5;font-size:14px">Chargement…</div>';
  }

  function authHtml() {
    const signup = state.authMode === 'signup';
    const modeNote = db.isRemote()
      ? 'Connecté à Supabase'
      : 'Mode local (aucun Supabase configuré) — vos données restent dans ce navigateur';
    return '' +
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#F6F5F2">' +
        '<div style="width:100%;max-width:380px;background:#fff;border:1px solid #EBEBEE;border-radius:18px;padding:34px 30px;box-shadow:0 10px 40px rgba(20,20,30,0.06)">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:22px">' +
            '<div style="width:34px;height:34px;border-radius:9px;background:#4F46E5;display:flex;align-items:center;justify-content:center">' + IC.logo + '</div>' +
            '<div style="font-weight:800;font-size:20px;letter-spacing:-0.3px">Lectura</div>' +
          '</div>' +
          '<div style="font-size:20px;font-weight:800;margin-bottom:4px">' + (signup ? 'Créer un compte' : 'Connexion') + '</div>' +
          '<div style="font-size:13px;color:#9A9AA5;margin-bottom:22px">' + (signup ? 'Rejoignez la bibliothèque en quelques secondes.' : 'Ravi de vous revoir.') + '</div>' +
          '<form id="authForm">' +
            (signup ? field('NOM', '<input data-a="authName" value="' + esc(state.authName) + '" placeholder="Votre nom" autocomplete="name" style="' + inputCss() + '" />') : '') +
            field('EMAIL', '<input data-a="authEmail" type="email" value="' + esc(state.authEmail) + '" placeholder="vous@exemple.com" autocomplete="email" style="' + inputCss() + '" />') +
            field('MOT DE PASSE', '<input data-a="authPassword" type="password" value="' + esc(state.authPassword) + '" placeholder="••••••••" autocomplete="' + (signup ? 'new-password' : 'current-password') + '" style="' + inputCss() + '" />') +
            (state.authError ? '<div style="background:#FEF2F2;color:#B91C1C;font-size:12.5px;padding:9px 12px;border-radius:8px;margin-bottom:14px">' + esc(state.authError) + '</div>' : '') +
            '<button type="submit"' + (state.authBusy ? ' disabled' : '') + ' style="width:100%;background:#4F46E5;color:#fff;font-weight:700;font-size:14.5px;padding:12px;border:none;border-radius:10px;cursor:pointer;opacity:' + (state.authBusy ? '0.6' : '1') + '">' + (state.authBusy ? 'Veuillez patienter…' : (signup ? 'Créer mon compte' : 'Se connecter')) + '</button>' +
          '</form>' +
          '<div style="text-align:center;font-size:13px;color:#6B6B76;margin-top:18px">' +
            (signup ? 'Déjà un compte ? ' : 'Pas encore de compte ? ') +
            '<span data-a="authToggle" style="color:#4F46E5;font-weight:700;cursor:pointer">' + (signup ? 'Se connecter' : 'Créer un compte') + '</span>' +
          '</div>' +
          '<div style="text-align:center;font-size:11px;color:#B4B4BE;margin-top:16px">' + esc(modeNote) + '</div>' +
        '</div>' +
      '</div>';
  }
  function field(label, control) { return '<div style="margin-bottom:14px"><div style="font-size:11.5px;font-weight:700;color:#6B6B76;margin-bottom:6px">' + label + '</div>' + control + '</div>'; }
  function inputCss() { return 'width:100%;padding:11px 12px;border:1px solid #E3E3E9;border-radius:9px;font-size:14px;box-sizing:border-box;outline:none'; }

  function navItem(action, active, icon, label) {
    const base = 'display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;';
    return '<div data-a="' + action + '" style="' + (active ? base + 'background:#EEF2FF;color:#4F46E5' : base + 'color:#6B6B76') + '">' + icon + '<span>' + label + '</span></div>';
  }

  function sidebar() {
    const u = state.currentUser;
    return '' +
      '<div style="width:232px;flex-shrink:0;background:#FFFFFF;border-right:1px solid #EBEBEE;display:flex;flex-direction:column;justify-content:space-between;padding:24px 16px">' +
        '<div>' +
          '<div style="display:flex;align-items:center;gap:10px;padding:4px 8px 28px">' +
            '<div style="width:32px;height:32px;border-radius:9px;background:#4F46E5;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + IC.logo + '</div>' +
            '<div style="font-weight:800;font-size:19px;letter-spacing:-0.3px">Lectura</div></div>' +
          '<div style="display:flex;flex-direction:column;gap:2px">' +
            navItem('goHome', state.screen === 'home', IC.home, 'Accueil') +
            navItem('goCommunity', state.screen === 'community', IC.community, 'Communauté') +
            navItem('goProfile', state.screen === 'profile', IC.profile, 'Profil') +
          '</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:14px">' +
          '<div data-a="goUpload" style="display:flex;align-items:center;gap:8px;justify-content:center;background:#4F46E5;color:#fff;font-weight:700;font-size:14px;padding:12px;border-radius:11px;cursor:pointer">' + IC.uploadArrow + 'Ajouter un livre</div>' +
          '<div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px">' +
            '<div data-a="goProfile" style="display:flex;align-items:center;gap:10px;cursor:pointer;flex:1;min-width:0">' +
              '<div style="width:32px;height:32px;border-radius:50%;background:#EDE9FE;color:#5B21B6;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + esc(initialOf(u.name)) + '</div>' +
              '<div style="font-size:13px;font-weight:600;color:#3A3A44;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(u.name) + '</div></div>' +
            '<div data-a="signOut" title="Se déconnecter" style="color:#9A9AA5;cursor:pointer;display:flex;padding:4px">' + IC.logout + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function catalogGridHtml() {
    const q = state.search.trim().toLowerCase();
    const filtered = allBooks().filter(function (b) {
      const okGenre = state.filterGenre === 'Tous' || b.genre === state.filterGenre;
      const okAge = state.filterAge === 'Tous' || b.age === state.filterAge;
      const okSearch = !q || (b.title + ' ' + b.author).toLowerCase().indexOf(q) !== -1;
      return okGenre && okAge && okSearch;
    });
    if (filtered.length === 0) return '<div style="padding:60px 0;text-align:center;color:#9A9AA5;font-size:14px">Aucun livre ne correspond à ces filtres.</div>';
    return '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:26px">' +
      filtered.map(function (b) {
        const rev = reviewsFor(b);
        const rating = b.rating || (rev.length ? rev.reduce(function (a, r) { return a + r.rating; }, 0) / rev.length : 0);
        return '<div data-a="openBook" data-arg="' + esc(b.id) + '" style="cursor:pointer;display:flex;flex-direction:column;gap:10px">' +
          '<div style="' + coverCss(b.color, 'height:190px;padding:16px') + '">' +
            '<div style="align-self:flex-start;background:rgba(255,255,255,0.22);color:#fff;font-size:10.5px;font-weight:700;letter-spacing:0.4px;padding:4px 8px;border-radius:6px">PDF</div>' +
            '<div><div style="color:#fff;font-weight:800;font-size:16px;line-height:1.25;margin-bottom:5px">' + esc(b.title) + '</div>' +
              '<div style="color:rgba(255,255,255,0.78);font-size:12.5px;font-weight:500">' + esc(b.author) + '</div></div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;justify-content:space-between">' +
            '<div style="display:flex;gap:1px">' + stars(13, rating) + '</div>' +
            '<div style="' + ageBadgeCss(b.age, '11px', '3px 8px') + '">' + esc(b.age) + '</div></div>' +
        '</div>';
      }).join('') + '</div>';
  }

  function homeScreen() {
    const chipBase = 'padding:7px 14px;border-radius:20px;font-size:12.5px;font-weight:600;cursor:pointer;';
    const genreChips = genres.map(function (g) {
      return '<div data-a="setFilterGenre" data-arg="' + esc(g) + '" style="' + (g === state.filterGenre ? chipBase + 'background:#14151A;color:#fff' : chipBase + 'background:#F1F1F4;color:#4B4B55') + '">' + esc(g) + '</div>';
    }).join('');
    const ageChips = ages.map(function (a) {
      return '<div data-a="setFilterAge" data-arg="' + esc(a) + '" style="' + (a === state.filterAge ? chipBase + 'background:#4F46E5;color:#fff' : chipBase + 'background:#F1F1F4;color:#4B4B55') + '">' + esc(a) + '</div>';
    }).join('');
    return '' +
      '<div style="height:76px;flex-shrink:0;border-bottom:1px solid #EBEBEE;display:flex;align-items:center;justify-content:space-between;padding:0 36px">' +
        '<div style="font-size:22px;font-weight:800;letter-spacing:-0.4px">Catalogue</div>' +
        '<div style="display:flex;align-items:center;gap:10px;background:#F1F1F4;border-radius:10px;padding:10px 14px;width:280px">' + IC.search +
          '<input id="searchInput" data-a="setSearch" value="' + esc(state.search) + '" placeholder="Rechercher un titre, un auteur…" style="border:none;background:none;outline:none;font-size:13.5px;width:100%;color:#14151A" /></div>' +
      '</div>' +
      '<div style="flex:1;overflow-y:auto;padding:28px 36px 48px">' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">' + genreChips + '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px">' + ageChips + '</div>' +
        '<div id="catalogGrid">' + catalogGridHtml() + '</div>' +
      '</div>';
  }

  function bookScreen() {
    const b = getBook(state.selectedBookId);
    if (!b) return '';
    const reviews = reviewsFor(b);
    const rating = b.rating || (reviews.length ? reviews.reduce(function (a, r) { return a + r.rating; }, 0) / reviews.length : 0);
    const reviewsHtml = reviews.length > 0
      ? '<div style="display:flex;flex-direction:column;gap:18px;max-width:560px">' + reviews.map(function (r) {
          return '<div style="display:flex;gap:12px">' +
            '<div style="width:34px;height:34px;border-radius:50%;background:#EDE9FE;color:#5B21B6;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + esc(r.initial) + '</div>' +
            '<div><div style="display:flex;align-items:baseline;gap:8px"><div style="font-weight:700;font-size:13.5px">' + esc(r.user) + '</div><div style="font-size:11.5px;color:#9A9AA5">' + esc(r.date) + '</div></div>' +
              '<div style="display:flex;gap:1px;margin:3px 0 5px">' + stars(12, r.rating) + '</div>' +
              '<div style="font-size:13.5px;line-height:1.55;color:#3A3A44">' + esc(r.comment) + '</div></div></div>';
        }).join('') + '</div>'
      : '<div style="color:#9A9AA5;font-size:13.5px">Aucun avis pour le moment — soyez le premier à en écrire un.</div>';
    return '' +
      '<div style="height:76px;flex-shrink:0;border-bottom:1px solid #EBEBEE;display:flex;align-items:center;padding:0 36px">' +
        '<div data-a="goHome" style="display:flex;align-items:center;gap:6px;cursor:pointer;color:#6B6B76;font-size:13.5px;font-weight:600"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>Retour au catalogue</div></div>' +
      '<div style="flex:1;overflow-y:auto;padding:36px 36px 56px">' +
        '<div style="display:flex;gap:40px;max-width:900px">' +
          '<div style="width:220px;flex-shrink:0;display:flex;flex-direction:column;gap:12px">' +
            '<div style="' + coverCss(b.color, 'height:280px;padding:20px') + '">' +
              '<div style="align-self:flex-start;background:rgba(255,255,255,0.22);color:#fff;font-size:11px;font-weight:700;letter-spacing:0.4px;padding:5px 9px;border-radius:6px">PDF</div>' +
              '<div style="color:#fff;font-weight:800;font-size:19px;line-height:1.3">' + esc(b.title) + '</div></div>' +
            '<div data-a="readBook" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#4F46E5;color:#fff;font-weight:700;font-size:13.5px;padding:12px;border-radius:10px;cursor:pointer">' + IC.bookOpen + 'Lire le PDF</div>' +
            '<div data-a="listenBook" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#F1F1F4;color:#14151A;font-weight:700;font-size:13.5px;padding:12px;border-radius:10px;cursor:pointer">' + IC.headphones + 'Écouter le livre</div>' +
            '<div data-a="addToList" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#fff;border:1px solid #E3E3E9;color:#3A3A44;font-weight:700;font-size:13.5px;padding:12px;border-radius:10px;cursor:pointer">' + IC.plus + 'Ajouter à ma liste</div>' +
          '</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-size:26px;font-weight:800;letter-spacing:-0.4px;margin-bottom:4px">' + esc(b.title) + '</div>' +
            '<div style="font-size:14.5px;color:#6B6B76;margin-bottom:16px">' + esc(b.author) + '</div>' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap">' +
              '<div style="display:flex;gap:1px">' + stars(16, rating) + '</div>' +
              '<div style="font-size:13px;color:#6B6B76;font-weight:600">' + (Math.round(rating * 10) / 10) + ' · ' + reviews.length + ' avis</div>' +
              '<div style="width:8px;height:8px;border-radius:50%;background:' + (GENRE_COLORS[b.genre] || '#9A9AA5') + '"></div>' +
              '<div style="font-size:12.5px;color:#6B6B76;font-weight:600">' + esc(b.genre) + '</div>' +
              '<div style="' + ageBadgeCss(b.age, '11.5px', '4px 9px') + '">' + esc(b.age) + '</div>' +
              '<div style="background:#F1F1F4;color:#5A5A66;font-size:11.5px;font-weight:700;padding:4px 9px;border-radius:20px">' + esc(b.language) + '</div></div>' +
            '<p style="font-size:14.5px;line-height:1.65;color:#3A3A44;max-width:560px">' + esc(b.summaryFull) + '</p>' +
            '<div style="margin-top:40px;border-top:1px solid #EBEBEE;padding-top:28px">' +
              '<div style="font-size:16px;font-weight:800;margin-bottom:16px">Avis (' + reviews.length + ')</div>' +
              '<div style="background:#FAFAF9;border:1px solid #EBEBEE;border-radius:12px;padding:18px;margin-bottom:22px;max-width:560px">' +
                '<div style="font-size:12.5px;font-weight:700;color:#6B6B76;margin-bottom:8px">Votre avis</div>' +
                '<div style="display:flex;gap:3px;margin-bottom:10px">' + ratingPicker(state.newReviewRating) + '</div>' +
                '<textarea data-a="setReviewText" placeholder="Partagez votre expérience ou une citation…" style="width:100%;min-height:64px;border:1px solid #E3E3E9;border-radius:8px;padding:10px 12px;font-size:13.5px;outline:none;resize:vertical;box-sizing:border-box">' + esc(state.newReviewText) + '</textarea>' +
                '<div data-a="submitReview" style="margin-top:10px;display:inline-flex;background:#4F46E5;color:#fff;font-weight:700;font-size:13px;padding:9px 16px;border-radius:8px;cursor:pointer">Publier</div></div>' +
              reviewsHtml +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function readerScreen() {
    const b = getBook(state.selectedBookId);
    if (!b) return '';
    const modeBase = 'padding:7px 16px;border-radius:7px;font-size:12.5px;font-weight:700;cursor:pointer;';
    const modeText = state.readerMode === 'text' ? modeBase + 'background:#fff;color:#14151A;box-shadow:0 1px 2px rgba(0,0,0,0.06)' : modeBase + 'color:#6B6B76';
    const modeAudio = state.readerMode === 'audio' ? modeBase + 'background:#fff;color:#14151A;box-shadow:0 1px 2px rgba(0,0,0,0.06)' : modeBase + 'color:#6B6B76';
    const header = '<div style="height:76px;flex-shrink:0;border-bottom:1px solid #EBEBEE;display:flex;align-items:center;justify-content:space-between;padding:0 36px">' +
      '<div data-a="backToBook" style="display:flex;align-items:center;gap:14px;cursor:pointer">' + IC.chevLeft + '<div style="font-size:15px;font-weight:700">' + esc(b.title) + '</div></div>' +
      '<div style="display:flex;background:#F1F1F4;border-radius:9px;padding:3px"><div data-a="setModeText" style="' + modeText + '">Texte</div><div data-a="setModeAudio" style="' + modeAudio + '">Écoute</div></div></div>';

    let body;
    if (state.readerMode === 'text') {
      if (state.pdfUrl) {
        body = '<div style="flex:1;overflow:hidden;padding:0;display:flex"><iframe src="' + esc(state.pdfUrl) + '" title="PDF" style="flex:1;border:none;width:100%;height:100%"></iframe></div>';
      } else {
        body = '<div style="flex:1;overflow-y:auto;padding:36px;display:flex;justify-content:center">' +
            '<div style="background:#fff;border:1px solid #EBEBEE;border-radius:14px;max-width:620px;width:100%;padding:52px 56px;box-shadow:0 1px 2px rgba(20,20,30,0.03)">' +
              '<div style="font-size:11.5px;font-weight:700;color:#9A9AA5;letter-spacing:0.5px;margin-bottom:18px">PAGE ' + state.currentPage + ' / ' + b.pageCount + '</div>' +
              '<p style="font-size:15.5px;line-height:1.85;color:#26262E;font-family:Georgia,\'Times New Roman\',serif">' + esc(b.summaryFull) + '</p></div></div>' +
          '<div style="flex-shrink:0;border-top:1px solid #EBEBEE;padding:16px 36px;display:flex;align-items:center;justify-content:center;gap:20px">' +
            '<span data-a="prevPage" style="cursor:pointer">' + IC.navLeft + '</span>' +
            '<div style="font-size:13px;font-weight:600;color:#3A3A44">Page ' + state.currentPage + ' / ' + b.pageCount + '</div>' +
            '<span data-a="nextPage" style="cursor:pointer">' + IC.navRight + '</span></div>';
      }
    } else {
      const speedOpts = [{ value: '0.75', label: '0.75x' }, { value: '1', label: '1x' }, { value: '1.25', label: '1.25x' }, { value: '1.5', label: '1.5x' }];
      const voiceList = audio.voices.length ? audio.voices.map(function (v) { return { value: v.name, label: v.name + ' — ' + v.lang }; }) : [{ value: '', label: 'Voix par défaut du système' }];
      body = '<div style="flex:1;overflow-y:auto;padding:36px;display:flex;justify-content:center;align-items:flex-start">' +
          '<div style="max-width:440px;width:100%;display:flex;flex-direction:column;align-items:center;padding-top:20px">' +
            '<div style="' + coverCss(b.color, 'width:220px;height:220px;padding:24px;align-items:center;justify-content:center;margin-bottom:18px') + '"><div style="color:#fff;font-weight:800;font-size:20px;text-align:center;line-height:1.3">' + esc(b.title) + '</div></div>' +
            '<div style="font-size:14px;font-weight:600;color:#6B6B76;margin-bottom:28px">' + esc(b.author) + '</div>' +
            '<div style="width:100%;height:6px;background:#EBEBEE;border-radius:6px;margin-bottom:10px;overflow:hidden"><div id="audioBar" style="width:' + state.audioProgress + '%;height:100%;background:#4F46E5;border-radius:6px"></div></div>' +
            '<div style="display:flex;justify-content:space-between;width:100%;font-size:11.5px;color:#9A9AA5;font-weight:600;margin-bottom:26px"><span id="audioPct">' + Math.round(state.audioProgress) + '%</span><span>' + (('speechSynthesis' in window) ? 'Synthèse vocale' : 'Lecture simulée') + '</span></div>' +
            '<div data-a="togglePlay" style="width:60px;height:60px;border-radius:50%;background:#4F46E5;display:flex;align-items:center;justify-content:center;cursor:pointer;margin-bottom:30px">' + (state.audioPlaying ? IC.pause : IC.play) + '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%">' +
              '<div><div style="font-size:11.5px;font-weight:700;color:#9A9AA5;margin-bottom:6px">VOIX</div><select data-a="setVoice" style="width:100%;padding:9px 10px;border:1px solid #E3E3E9;border-radius:8px;font-size:13px;background:#fff;box-sizing:border-box">' + options(voiceList, state.audioVoice) + '</select></div>' +
              '<div><div style="font-size:11.5px;font-weight:700;color:#9A9AA5;margin-bottom:6px">VITESSE</div><select data-a="setSpeed" style="width:100%;padding:9px 10px;border:1px solid #E3E3E9;border-radius:8px;font-size:13px;background:#fff;box-sizing:border-box">' + options(speedOpts, state.audioSpeed) + '</select></div>' +
              '<div style="grid-column:span 2"><div style="font-size:11.5px;font-weight:700;color:#9A9AA5;margin-bottom:6px">LANGUE DE LECTURE</div><select data-a="setAudioLang" style="width:100%;padding:9px 10px;border:1px solid #E3E3E9;border-radius:8px;font-size:13px;background:#fff;box-sizing:border-box">' + options(languages, state.audioLang) + '</select></div>' +
            '</div></div></div>';
    }
    return header + body;
  }

  function uploadScreen() {
    const f = state.uploadForm;
    return '' +
      '<div style="height:76px;flex-shrink:0;border-bottom:1px solid #EBEBEE;display:flex;align-items:center;padding:0 36px"><div style="font-size:22px;font-weight:800;letter-spacing:-0.4px">Ajouter un livre</div></div>' +
      '<div style="flex:1;overflow-y:auto;padding:36px;display:flex;justify-content:center">' +
        '<form id="uploadForm" style="max-width:560px;width:100%">' +
          '<label style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:2px dashed #D8D8E2;border-radius:14px;padding:38px;cursor:pointer;background:#FAFAF9;margin-bottom:26px">' + IC.uploadBig +
            '<div style="font-size:14px;font-weight:700;color:#3A3A44">' + esc(state.uploadFileName || 'Choisir un fichier PDF') + '</div>' +
            '<div style="font-size:12px;color:#9A9AA5">Glissez un fichier PDF ou cliquez pour parcourir</div>' +
            '<input type="file" accept="application/pdf" data-a="handleFile" style="display:none" /></label>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">' +
            '<div style="grid-column:span 2"><div style="font-size:12px;font-weight:700;color:#6B6B76;margin-bottom:6px">TITRE</div><input data-a="setUploadTitle" value="' + esc(f.title) + '" placeholder="Titre du livre" style="width:100%;padding:10px 12px;border:1px solid #E3E3E9;border-radius:8px;font-size:13.5px;box-sizing:border-box;outline:none" /></div>' +
            '<div style="grid-column:span 2"><div style="font-size:12px;font-weight:700;color:#6B6B76;margin-bottom:6px">AUTEUR</div><input data-a="setUploadAuthor" value="' + esc(f.author) + '" placeholder="Nom de l\'auteur" style="width:100%;padding:10px 12px;border:1px solid #E3E3E9;border-radius:8px;font-size:13.5px;box-sizing:border-box;outline:none" /></div>' +
            '<div><div style="font-size:12px;font-weight:700;color:#6B6B76;margin-bottom:6px">GENRE</div><select data-a="setUploadGenre" style="width:100%;padding:10px 12px;border:1px solid #E3E3E9;border-radius:8px;font-size:13.5px;background:#fff;box-sizing:border-box">' + options(['Roman', 'Bande dessinée', 'Essai', 'Scolaire'], f.genre) + '</select></div>' +
            '<div><div style="font-size:12px;font-weight:700;color:#6B6B76;margin-bottom:6px">TRANCHE D\'ÂGE</div><select data-a="setUploadAge" style="width:100%;padding:10px 12px;border:1px solid #E3E3E9;border-radius:8px;font-size:13.5px;background:#fff;box-sizing:border-box">' + options(['Enfants', 'Jeunesse', 'Adultes'], f.age) + '</select></div>' +
            '<div style="grid-column:span 2"><div style="font-size:12px;font-weight:700;color:#6B6B76;margin-bottom:6px">LANGUE ORIGINALE</div><select data-a="setUploadLanguage" style="width:100%;padding:10px 12px;border:1px solid #E3E3E9;border-radius:8px;font-size:13.5px;background:#fff;box-sizing:border-box">' + options(languages, f.language) + '</select></div>' +
          '</div>' +
          '<button type="submit"' + (state.busy ? ' disabled' : '') + ' style="width:100%;background:#4F46E5;color:#fff;font-weight:700;font-size:14.5px;padding:13px;border:none;border-radius:10px;cursor:pointer;opacity:' + (state.busy ? '0.6' : '1') + '">' + (state.busy ? 'Ajout en cours…' : 'Ajouter à la bibliothèque') + '</button>' +
        '</form></div>';
  }

  function profileScreen() {
    const u = state.currentUser;
    const prog = progressStore();
    const history = Object.keys(prog).map(function (id) { return Object.assign({ id: id }, prog[id]); }).sort(function (a, b) { return b.updatedAt - a.updatedAt; }).slice(0, 5);
    const myReviews = Object.keys(state.reviewsByBook).reduce(function (n, k) { return n + state.reviewsByBook[k].filter(function (r) { return r.user === u.name; }).length; }, 0);
    const booksRead = history.length;
    const listen = fmtDuration(LS.get('listenSeconds', 0));

    const historyHtml = history.length ? history.map(function (h) {
      const v = Math.round(h.value);
      return '<div data-a="openBook" data-arg="' + esc(h.id) + '" style="cursor:pointer;display:flex;align-items:center;gap:14px;background:#fff;border:1px solid #EBEBEE;border-radius:12px;padding:12px 16px">' +
        '<div style="width:10px;height:10px;border-radius:50%;background:' + (h.color || '#4F46E5') + ';flex-shrink:0"></div>' +
        '<div style="flex:1"><div style="font-size:13.5px;font-weight:700">' + esc(h.title) + '</div>' +
          '<div style="height:5px;background:#EBEBEE;border-radius:5px;margin-top:6px;overflow:hidden"><div style="width:' + v + '%;height:100%;background:' + (h.color || '#4F46E5') + ';border-radius:5px"></div></div></div>' +
        '<div style="font-size:12px;font-weight:700;color:#9A9AA5">' + (v >= 100 ? 'Terminé' : v + '%') + '</div></div>';
    }).join('') : '<div style="color:#9A9AA5;font-size:13.5px">Ouvrez un livre pour commencer votre historique.</div>';

    function stat(v, l) { return '<div style="background:#fff;border:1px solid #EBEBEE;border-radius:12px;padding:16px;text-align:center"><div style="font-size:22px;font-weight:800;color:#4F46E5">' + v + '</div><div style="font-size:12px;color:#6B6B76;font-weight:600">' + l + '</div></div>'; }
    return '' +
      '<div style="height:76px;flex-shrink:0;border-bottom:1px solid #EBEBEE;display:flex;align-items:center;justify-content:space-between;padding:0 36px"><div style="font-size:22px;font-weight:800;letter-spacing:-0.4px">Mon profil</div>' +
        '<div data-a="signOut" style="display:flex;align-items:center;gap:6px;cursor:pointer;color:#6B6B76;font-size:13px;font-weight:600">' + IC.logout + 'Se déconnecter</div></div>' +
      '<div style="flex:1;overflow-y:auto;padding:36px;max-width:640px">' +
        '<div style="display:flex;align-items:center;gap:18px;margin-bottom:28px">' +
          '<div style="width:64px;height:64px;border-radius:50%;background:#EDE9FE;color:#5B21B6;font-weight:700;font-size:24px;display:flex;align-items:center;justify-content:center">' + esc(initialOf(u.name)) + '</div>' +
          '<div><div style="font-size:19px;font-weight:800">' + esc(u.name) + '</div><div style="font-size:13px;color:#9A9AA5">' + esc(u.email || 'Compte local') + '</div></div></div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:32px">' + stat(booksRead, 'Livres ouverts') + stat(myReviews, 'Avis écrits') + stat(listen, 'Écoute audio') + '</div>' +
        '<div style="font-size:15px;font-weight:800;margin-bottom:14px">Historique de lecture</div>' +
        '<div style="display:flex;flex-direction:column;gap:12px">' + historyHtml + '</div></div>';
  }

  function communityScreen() {
    const tabBase = 'padding:7px 14px;border-radius:7px;font-size:12.5px;font-weight:700;cursor:pointer;';
    const tabs = ['Tous', 'Avis', 'Citations'].map(function (t) {
      return '<div data-a="setCommunityTab" data-arg="' + esc(t) + '" style="' + (t === communityTab ? tabBase + 'background:#fff;color:#14151A;box-shadow:0 1px 2px rgba(0,0,0,0.06)' : tabBase + 'color:#6B6B76') + '">' + esc(t) + '</div>';
    }).join('');
    const feed = communityFeed.filter(function (p) { return communityTab === 'Tous' || p.type === communityTab; }).map(function (p) {
      const ratingRow = p.rating > 0 ? '<div style="display:flex;gap:1px;margin-bottom:8px">' + stars(13, p.rating) + '</div>' : '';
      const textStyle = p.type === 'Citations' ? 'font-size:13.5px;font-style:italic;color:#3A3A44;line-height:1.55' : 'font-size:13.5px;color:#3A3A44;line-height:1.55';
      return '<div style="background:#fff;border:1px solid #EBEBEE;border-radius:14px;padding:18px 20px">' +
        '<div style="display:flex;align-items:center;gap:11px;margin-bottom:10px">' +
          '<div style="width:36px;height:36px;border-radius:50%;background:#FEF3C7;color:#92400E;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + esc(p.initial) + '</div>' +
          '<div style="flex:1"><div style="font-size:13.5px"><span style="font-weight:700">' + esc(p.user) + '</span><span style="color:#6B6B76"> ' + esc(p.action) + ' </span><span style="font-weight:700">' + esc(p.book) + '</span></div><div style="font-size:11.5px;color:#9A9AA5">' + esc(p.time) + '</div></div></div>' +
        ratingRow + '<div style="' + textStyle + '">' + esc(p.text) + '</div></div>';
    }).join('');
    return '' +
      '<div style="height:76px;flex-shrink:0;border-bottom:1px solid #EBEBEE;display:flex;align-items:center;justify-content:space-between;padding:0 36px"><div style="font-size:22px;font-weight:800;letter-spacing:-0.4px">Communauté</div><div style="display:flex;background:#F1F1F4;border-radius:9px;padding:3px">' + tabs + '</div></div>' +
      '<div style="flex:1;overflow-y:auto;padding:32px 36px 56px;display:flex;justify-content:center"><div style="max-width:600px;width:100%;display:flex;flex-direction:column;gap:16px">' + feed + '</div></div>';
  }

  function render() {
    const app = document.getElementById('app');
    if (state.booting) { app.innerHTML = loaderHtml(); return; }
    if (!state.currentUser) { app.innerHTML = authHtml(); return; }
    let main;
    switch (state.screen) {
      case 'home': main = homeScreen(); break;
      case 'book': main = bookScreen(); break;
      case 'reader': main = readerScreen(); break;
      case 'upload': main = uploadScreen(); break;
      case 'profile': main = profileScreen(); break;
      case 'community': main = communityScreen(); break;
      default: main = homeScreen();
    }
    const toast = state.toast ? '<div style="position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#14151A;color:#fff;font-size:13.5px;font-weight:600;padding:12px 20px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.18);animation:toastIn 0.25s ease-out">' + esc(state.toast) + '</div>' : '';
    app.innerHTML = '<div style="display:flex;height:100vh;width:100vw;overflow:hidden;background:#F6F5F2">' + sidebar() + '<div style="flex:1;display:flex;flex-direction:column;overflow:hidden">' + main + '</div>' + toast + '</div>';
  }

  /* ==========================================================================
   * 9. Actions
   * ========================================================================== */
  const audioText = function (b) { return b.summaryFull + ' ' + b.summaryFull; };

  function audioOpts() { return { rate: state.audioSpeed, langCode: LANG_CODES[state.audioLang] || 'fr-FR', voiceName: state.audioVoice }; }

  function startPlayback() {
    const b = getBook(state.selectedBookId);
    audio.progress = state.audioProgress;
    audio.start(audioText(b), audioOpts(),
      function (p) {
        state.audioProgress = p;
        const bar = document.getElementById('audioBar'); const pct = document.getElementById('audioPct');
        if (bar) bar.style.width = p + '%'; if (pct) pct.textContent = Math.round(p) + '%';
        setProgress(b.id, b.title, b.color, p);
      },
      function () { setProgress(b.id, b.title, b.color, 100); setState({ audioPlaying: false, audioProgress: 0 }); }
    );
  }

  const actions = {
    goHome: function () { audio.stop(); setState({ screen: 'home', audioPlaying: false }); },
    goCommunity: function () { audio.stop(); setState({ screen: 'community', audioPlaying: false }); },
    goProfile: function () { audio.stop(); setState({ screen: 'profile', audioPlaying: false }); },
    goUpload: function () { audio.stop(); setState({ screen: 'upload', audioPlaying: false }); },
    signOut: async function () { audio.stop(); await db.signOut(); state.currentUser = null; state.screen = 'home'; render(); },
    openBook: function (id) {
      const b = getBook(id);
      if (b) setProgress(b.id, b.title, b.color, Math.max(1, Math.round((progressStore()[b.id] || {}).value || 5)));
      setState({ screen: 'book', selectedBookId: id, newReviewRating: 0, newReviewText: '' });
    },
    setFilterGenre: function (g) { setState({ filterGenre: g }); },
    setFilterAge: function (a) { setState({ filterAge: a }); },
    readBook: async function () {
      audio.stop();
      const b = getBook(state.selectedBookId);
      state.pdfUrl = await db.pdfUrl(b);
      setState({ screen: 'reader', currentPage: 1, readerMode: 'text', audioPlaying: false, audioProgress: 0 });
    },
    listenBook: function () {
      audio.stop();
      audio.refreshVoices();
      setState({ screen: 'reader', currentPage: 1, readerMode: 'audio', audioPlaying: false, audioProgress: 0, pdfUrl: null });
    },
    backToBook: function () { audio.stop(); setState({ screen: 'book', audioPlaying: false }); },
    setModeText: async function () { audio.stop(); const b = getBook(state.selectedBookId); state.pdfUrl = await db.pdfUrl(b); setState({ readerMode: 'text', audioPlaying: false }); },
    setModeAudio: function () { audio.refreshVoices(); setState({ readerMode: 'audio' }); },
    prevPage: function () { const b = getBook(state.selectedBookId); const p = Math.max(1, state.currentPage - 1); setProgress(b.id, b.title, b.color, Math.round(p / b.pageCount * 100)); setState({ currentPage: p }); },
    nextPage: function () { const b = getBook(state.selectedBookId); const p = Math.min(b.pageCount, state.currentPage + 1); setProgress(b.id, b.title, b.color, Math.round(p / b.pageCount * 100)); setState({ currentPage: p }); },
    togglePlay: function () {
      if (state.audioPlaying) { audio.pause(); setState({ audioPlaying: false }); return; }
      setState({ audioPlaying: true });
      startPlayback();
    },
    setRating: function (v) { setState({ newReviewRating: parseInt(v, 10) }); },
    submitReview: async function () {
      if (!state.newReviewText.trim() || !state.newReviewRating || state.busy) return;
      const id = state.selectedBookId; const u = state.currentUser;
      const review = { id: uid(), user: u.name, initial: initialOf(u.name), rating: state.newReviewRating, comment: state.newReviewText, date: 'à l’instant' };
      state.busy = true;
      try { await db.saveReview(id, review, u); } catch (e) { state.busy = false; showToast('Erreur : ' + e.message); return; }
      state.reviewsByBook[id] = [review].concat(state.reviewsByBook[id] || []);
      state.busy = false;
      setState({ newReviewRating: 0, newReviewText: '' });
    },
    addToList: function () { showToast('Ajouté à votre liste de lecture'); },
  };

  /* ==========================================================================
   * 10. Câblage des évènements (délégation)
   * ========================================================================== */
  const root = document.getElementById('app');
  const FIELD_ACTIONS = ['setSearch', 'setReviewText', 'setVoice', 'setSpeed', 'setAudioLang', 'handleFile', 'setUploadTitle', 'setUploadAuthor', 'setUploadGenre', 'setUploadAge', 'setUploadLanguage', 'authName', 'authEmail', 'authPassword'];

  root.addEventListener('click', function (e) {
    const el = e.target.closest('[data-a]');
    if (!el) return;
    const a = el.getAttribute('data-a');
    if (FIELD_ACTIONS.indexOf(a) !== -1) return;
    if (a === 'authToggle') { setState({ authMode: state.authMode === 'signin' ? 'signup' : 'signin', authError: '' }); return; }
    const fn = actions[a];
    if (fn) fn(el.getAttribute('data-arg'));
  });

  root.addEventListener('input', function (e) {
    const el = e.target.closest('[data-a]');
    if (!el) return;
    const a = el.getAttribute('data-a');
    if (a === 'setSearch') {
      state.search = el.value;
      const grid = document.getElementById('catalogGrid');
      if (grid) grid.innerHTML = catalogGridHtml();
    }
    else if (a === 'setReviewText') state.newReviewText = el.value;
    else if (a === 'setUploadTitle') state.uploadForm.title = el.value;
    else if (a === 'setUploadAuthor') state.uploadForm.author = el.value;
    else if (a === 'authName') state.authName = el.value;
    else if (a === 'authEmail') state.authEmail = el.value;
    else if (a === 'authPassword') state.authPassword = el.value;
  });

  root.addEventListener('change', function (e) {
    const el = e.target.closest('[data-a]');
    if (!el) return;
    const a = el.getAttribute('data-a');
    switch (a) {
      case 'setVoice': state.audioVoice = el.value; if (state.audioPlaying) startPlayback(); break;
      case 'setSpeed': state.audioSpeed = parseFloat(el.value); if (state.audioPlaying) startPlayback(); break;
      case 'setAudioLang': state.audioLang = el.value; if (state.audioPlaying) startPlayback(); break;
      case 'setUploadGenre': state.uploadForm.genre = el.value; break;
      case 'setUploadAge': state.uploadForm.age = el.value; break;
      case 'setUploadLanguage': state.uploadForm.language = el.value; break;
      case 'handleFile': {
        const file = el.files[0]; if (!file) return;
        state.uploadFile = file; state.uploadFileName = file.name;
        if (!state.uploadForm.title) state.uploadForm.title = file.name.replace(/\.pdf$/i, '');
        render(); break;
      }
    }
  });

  root.addEventListener('submit', async function (e) {
    if (e.target.closest('#authForm')) {
      e.preventDefault();
      if (state.authBusy) return;
      const signup = state.authMode === 'signup';
      const email = state.authEmail.trim(), pw = state.authPassword, name = state.authName.trim();
      if (!email || !pw || (signup && !name)) { setState({ authError: 'Merci de remplir tous les champs.' }); return; }
      state.authBusy = true; state.authError = ''; render();
      try {
        const session = signup ? await db.signUp(email, pw, name) : await db.signIn(email, pw);
        state.authBusy = false; state.currentUser = session;
        await afterLogin();
      } catch (err) { state.authBusy = false; setState({ authError: err.message }); }
      return;
    }
    if (e.target.closest('#uploadForm')) {
      e.preventDefault();
      if (state.busy) return;
      const f = state.uploadForm;
      if (!f.title.trim()) return;
      const book = { id: uid(), title: f.title, author: f.author || 'Auteur inconnu', genre: f.genre, age: f.age, color: '#6D6AF5', rating: 0, language: f.language, pageCount: 12, summaryFull: 'Livre ajouté par vous récemment.', reviews: [] };
      state.busy = true; render();
      try { await db.saveBook(book, state.uploadFile, state.currentUser); }
      catch (err) { state.busy = false; showToast('Erreur : ' + err.message); return; }
      state.customBooks = state.customBooks.concat(book);
      state.busy = false;
      state.uploadForm = { title: '', author: '', genre: 'Roman', age: 'Enfants', language: 'Français' };
      state.uploadFile = null; state.uploadFileName = '';
      setState({ screen: 'home' });
      showToast('« ' + book.title + ' » a été ajouté à la bibliothèque', 3500);
    }
  });

  root.addEventListener('click', function (e) {
    const el = e.target.closest('[data-a="setCommunityTab"]');
    if (!el) return;
    communityTab = el.getAttribute('data-arg'); render();
  });

  /* ==========================================================================
   * 11. Démarrage
   * ========================================================================== */
  async function afterLogin() {
    try {
      state.customBooks = await db.loadBooks();
      state.reviewsByBook = await db.loadReviews();
    } catch (e) { console.warn(e); }
    render();
  }

  async function boot() {
    if ('speechSynthesis' in window) {
      audio.refreshVoices();
      window.speechSynthesis.onvoiceschanged = function () { audio.refreshVoices(); };
    }
    await db.init(window.LECTURA_CONFIG || {});
    try {
      const session = await db.session();
      state.currentUser = session;
      state.booting = false;
      if (session) await afterLogin(); else render();
    } catch (e) { state.booting = false; render(); }
  }

  boot();
})();
