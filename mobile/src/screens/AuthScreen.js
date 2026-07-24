import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../lib/store';
import { Button } from '../components/ui';
import { colors, serif } from '../theme';

export default function AuthScreen() {
  const app = useApp();
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const signup = mode === 'signup';

  async function submit() {
    if (busy) return;
    if (!email.trim() || !password || (signup && !name.trim())) {
      setError('Merci de remplir tous les champs.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (signup) await app.signUp(email.trim(), password, name.trim());
      else await app.signIn(email.trim(), password);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.logo}><Feather name="book" size={20} color="#fff" /></View>
            <Text style={styles.brandName}>Lectura</Text>
          </View>

          <Text style={styles.h1}>{signup ? 'Créer un compte' : 'Bon retour'}</Text>
          <Text style={styles.sub}>
            {signup ? 'Rejoignez la bibliothèque en quelques secondes.' : 'Connectez-vous pour retrouver vos livres.'}
          </Text>

          {signup && (
            <Field label="Nom">
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Votre nom" placeholderTextColor={colors.muted2} autoCapitalize="words" />
            </Field>
          )}
          <Field label="Email">
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="vous@exemple.com" placeholderTextColor={colors.muted2} autoCapitalize="none" keyboardType="email-address" />
          </Field>
          <Field label="Mot de passe">
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={colors.muted2} secureTextEntry />
          </Field>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button title={busy ? 'Veuillez patienter…' : signup ? 'Créer mon compte' : 'Se connecter'} onPress={submit} disabled={busy} style={{ marginTop: 6 }} />

          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: colors.muted, fontSize: 14 }}>
              {signup ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
              <Text style={{ color: colors.red, fontWeight: '700' }} onPress={() => { setMode(signup ? 'signin' : 'signup'); setError(''); }}>
                {signup ? 'Se connecter' : 'Créer un compte'}
              </Text>
            </Text>
          </View>

          <Text style={styles.note}>
            {app.isRemote ? 'Connecté à Supabase' : 'Mode local — données conservées sur l’appareil'}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, children }) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 26 },
  logo: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontWeight: '800', fontSize: 22, letterSpacing: -0.4, color: colors.text },
  h1: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6, marginBottom: 5, fontFamily: serif, color: colors.text },
  sub: { fontSize: 14, color: colors.muted, marginBottom: 26 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color: colors.muted, marginBottom: 7, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, color: colors.text, backgroundColor: colors.surface },
  error: { backgroundColor: colors.redSoft, color: colors.redInk, fontSize: 13, padding: 11, borderRadius: 11, marginBottom: 14, overflow: 'hidden' },
  note: { textAlign: 'center', fontSize: 11.5, color: colors.muted2, marginTop: 18 },
});
