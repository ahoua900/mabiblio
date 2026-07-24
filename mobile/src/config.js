/*
 * Configuration Lectura (mobile).
 *
 * Renseignez ces deux valeurs avec celles de VOTRE projet Supabase
 * (Dashboard → Project Settings → API) :
 *   - supabaseUrl     : https://xxxx.supabase.co
 *   - supabaseAnonKey : la clé « anon public » (publiable, protégée par les règles RLS)
 *
 * NE mettez JAMAIS ici la clé « service_role » (secrète).
 *
 * Tant que ces champs sont vides, l'application fonctionne entièrement en local
 * (comptes, livres, avis et fichiers stockés sur l'appareil via AsyncStorage / FileSystem).
 */
export default {
  supabaseUrl: '',
  supabaseAnonKey: '',

  // Optionnel : clé API Google Books. La recherche fonctionne sans clé
  // (quota public plus limité). https://console.cloud.google.com → Books API
  googleBooksApiKey: '',

  // ---- Traduction (agent Mistral) ----
  // Deux façons de l'activer :
  //  1) RECOMMANDÉ : mettez l'URL d'un proxy serveur (ex. Edge Function Supabase)
  //     qui reçoit { text, targetLang } et renvoie { translation }. La clé secrète
  //     reste alors côté serveur.
  //  2) RAPIDE (prototype) : mettez directement votre clé Mistral ci-dessous.
  //     ⚠️ Une clé dans l'app est extractible : ne publiez pas l'app ainsi.
  mistralProxyUrl: '',
  mistralApiKey: '',
  mistralAgentId: 'ag_019f94d427db73c3adfdbbb6126ee1d9',
};
