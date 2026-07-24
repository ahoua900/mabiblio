import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useApp } from '../lib/store';
import { genres, ages, languages } from '../data';
import { colors, serif } from '../theme';
import { uid } from '../lib/util';
import { Button } from '../components/ui';

export default function UploadScreen({ navigation }) {
  const app = useApp();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Roman');
  const [age, setAge] = useState('Enfants');
  const [language, setLanguage] = useState('Français');
  const [fileUri, setFileUri] = useState(null);
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);

  async function pick() {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
      if (res.canceled || !res.assets || !res.assets[0]) return;
      const a = res.assets[0];
      setFileUri(a.uri);
      setFileName(a.name || 'document.pdf');
      if (!title) setTitle((a.name || '').replace(/\.pdf$/i, ''));
    } catch (e) {
      Alert.alert('Erreur', "Impossible de sélectionner le fichier.");
    }
  }

  async function submit() {
    if (!title.trim() || busy) return;
    setBusy(true);
    const id = uid();
    let localUri = null;
    if (fileUri) {
      try {
        const dest = FileSystem.documentDirectory + id + '.pdf';
        await FileSystem.copyAsync({ from: fileUri, to: dest });
        localUri = dest;
      } catch (e) { localUri = fileUri; }
    }
    const book = {
      id, title: title.trim(), author: author.trim() || 'Auteur inconnu', genre, age,
      color: '#8A3D8F', rating: 0, language, pageCount: 12,
      summaryFull: 'Livre ajouté par vous récemment.', reviews: [], localUri,
    };
    try {
      await app.addBook(book, fileUri);
      navigation.navigate('Tabs', { screen: 'Bibliothèque' });
    } catch (e) {
      Alert.alert('Erreur', e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={['top']}>
      <View style={styles.top}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Ajouter un livre</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <TouchableOpacity activeOpacity={0.8} style={styles.drop} onPress={pick}>
            <Feather name="upload" size={30} color={colors.red} />
            <Text style={styles.dropTitle}>{fileName || 'Choisir un fichier PDF'}</Text>
            <Text style={styles.dropSub}>Format PDF</Text>
          </TouchableOpacity>

          <Field label="Titre">
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Titre du livre" placeholderTextColor={colors.muted2} />
          </Field>
          <Field label="Auteur">
            <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Nom de l'auteur" placeholderTextColor={colors.muted2} />
          </Field>

          <Field label="Genre"><Chips options={genres} value={genre} onChange={setGenre} /></Field>
          <Field label="Tranche d'âge"><Chips options={ages} value={age} onChange={setAge} /></Field>
          <Field label="Langue"><Chips options={languages} value={language} onChange={setLanguage} /></Field>

          <Button title={busy ? 'Ajout en cours…' : 'Ajouter à la bibliothèque'} onPress={submit} disabled={busy} style={{ marginTop: 8 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, children }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function Chips({ options, value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => (
        <TouchableOpacity key={o} onPress={() => onChange(o)} style={[styles.chip, { backgroundColor: o === value ? colors.text : colors.soft }]}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: o === value ? '#fff' : '#48484E' }}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800', fontFamily: serif, color: colors.text },
  drop: { alignItems: 'center', gap: 8, borderWidth: 2, borderColor: colors.line, borderStyle: 'dashed', borderRadius: 16, paddingVertical: 34, backgroundColor: colors.soft, marginBottom: 22 },
  dropTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  dropSub: { fontSize: 12, color: colors.muted },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color: colors.muted, marginBottom: 8, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, color: colors.text, backgroundColor: colors.surface },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
});
