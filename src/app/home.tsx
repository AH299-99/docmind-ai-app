import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config';

export default function Home() {
  const [text, setText] = useState('');
  const [task, setTask] = useState('summarize');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }
    setLoading(true);
    setResult('');
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/ai/analyze`,
        { text, task },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.result);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <View style={styles.header}>
        <Text style={styles.title}>DocMind AI</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.taskRow}>
        {['summarize', 'explain', 'analyze'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.taskButton, task === t && styles.taskButtonActive]}
            onPress={() => setTask(t)}
          >
            <Text style={[styles.taskButtonText, task === t && styles.taskButtonTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.textArea}
        placeholder="Paste your text here..."
        placeholderTextColor="#888"
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={8}
      />

      <TouchableOpacity style={styles.button} onPress={handleAnalyze} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Analyze</Text>}
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Result:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  logout: { color: '#ff6b6b', fontSize: 14 },
  taskRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  taskButton: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  taskButtonActive: { backgroundColor: '#6c5ce7' },
  taskButtonText: { color: '#aaa', fontSize: 13 },
  taskButtonTextActive: { color: '#fff', fontWeight: '600' },
  textArea: {
    backgroundColor: '#1e1e2e',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6c5ce7',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultBox: {
    backgroundColor: '#1e1e2e',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  resultLabel: { color: '#6c5ce7', fontWeight: '600', marginBottom: 8 },
  resultText: { color: '#fff', fontSize: 15, lineHeight: 22 },
});
