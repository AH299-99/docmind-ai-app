import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { API_URL } from '../config';

type Mode = 'text' | 'document' | 'assignment';
type AiTask = 'summarize' | 'explain' | 'analyze';
type Level = 'school' | 'college' | 'university';
type Length = 'short' | 'medium' | 'long';
type ExportFormat = 'pdf' | 'docx' | 'txt';

const TASK_META: { key: AiTask; label: string; color: string }[] = [
  { key: 'summarize', label: 'Summarize', color: '#8b5cf6' },
  { key: 'explain', label: 'Explain', color: '#3b82f6' },
  { key: 'analyze', label: 'Analyze', color: '#14b8a6' },
];

const ASSIGNMENT_COLOR = '#f97316';
const PICK_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const MODES: { key: Mode; label: string }[] = [
  { key: 'text', label: 'Text' },
  { key: 'document', label: 'Document' },
  { key: 'assignment', label: 'Assignment' },
];

function formatSize(bytes?: number): string {
  if (!bytes && bytes !== 0) return 'unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function safeFileName(title: string): string {
  const cleaned = title
    .replace(/[^\w\- ]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
  return cleaned || 'docmind-result';
}

function mimeFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.docx'))
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (lower.endsWith('.txt')) return 'text/plain';
  return 'application/octet-stream';
}

export default function Home() {
  const [mode, setMode] = useState<Mode>('text');
  const [text, setText] = useState('');
  const [task, setTask] = useState<AiTask>('summarize');
  const [doc, setDoc] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<Level>('college');
  const [length, setLength] = useState<Length>('medium');
  const [instructions, setInstructions] = useState('');
  const [result, setResult] = useState('');
  const [resultTitle, setResultTitle] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const router = useRouter();

  const apiError = (error: any) => {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong';
    Alert.alert('Error', String(msg));
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/');
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setResult('');
    setResultTitle('');
  };

  // ---------- Text mode ----------
  const handleAnalyze = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }
    setBusy('text');
    setResult('');
    setResultTitle('');
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/ai/analyze`,
        { text, task },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.result);
      setResultTitle('AI result');
    } catch (error: any) {
      apiError(error);
    } finally {
      setBusy(null);
    }
  };

  // ---------- Document mode ----------
  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: PICK_TYPES,
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      const asset = res.assets[0];
      if (asset.size && asset.size > MAX_FILE_BYTES) {
        Alert.alert('File too large', 'Please pick a file under 10 MB.');
        return;
      }
      setDoc(asset);
    } catch (error: any) {
      apiError(error);
    }
  };

  const handleUpload = async () => {
    if (!doc) {
      Alert.alert('Error', 'Please pick a document first');
      return;
    }
    setBusy('doc');
    setResult('');
    setResultTitle('');
    try {
      const token = await AsyncStorage.getItem('token');
      const form = new FormData();
      if (Platform.OS === 'web') {
        // On web the picker gives us a real File object.
        const webFile: unknown = doc.file;
        if (webFile instanceof Blob) {
          form.append('document', webFile, doc.name);
        } else {
          Alert.alert('Error', 'Could not read the picked file on web.');
          return;
        }
      } else {
        form.append('document', {
          uri: doc.uri,
          name: doc.name,
          type: doc.mimeType || mimeFromName(doc.name),
        } as any);
      }
      form.append('task', task);
      const response = await axios.post(`${API_URL}/api/ai/upload`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(response.data.result);
      setResultTitle(response.data.filename ? `Analysis of ${response.data.filename}` : 'Document analysis');
    } catch (error: any) {
      apiError(error);
    } finally {
      setBusy(null);
    }
  };

  // ---------- Assignment mode ----------
  const handleAssignment = async () => {
    if (!topic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }
    setBusy('assign');
    setResult('');
    setResultTitle('');
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/ai/assignment`,
        { topic, instructions: instructions.trim() || undefined, level, length },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.result);
      setResultTitle(response.data.title || topic);
    } catch (error: any) {
      apiError(error);
    } finally {
      setBusy(null);
    }
  };

  // ---------- Export / download ----------
  const handleDownload = async (format: ExportFormat) => {
    if (!result) {
      Alert.alert('Nothing to download', 'Generate a result first.');
      return;
    }
    setBusy(`export-${format}`);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/ai/export`,
        { title: resultTitle || 'DocMind AI result', content: result, format },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer',
        }
      );
      const ext = format === 'pdf' ? 'pdf' : format === 'docx' ? 'docx' : 'txt';
      const mime =
        format === 'pdf'
          ? 'application/pdf'
          : format === 'docx'
            ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : 'text/plain';
      const filename = `${safeFileName(resultTitle || 'docmind-result')}.${ext}`;
      const data = response.data as ArrayBuffer;

      if (Platform.OS === 'web') {
        // expo-sharing can't share local files on web — trigger a browser download instead.
        const blob = new Blob([data], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } else {
        const file = new File(Paths.cache, filename);
        if (file.exists) file.delete();
        file.write(new Uint8Array(data));
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(file.uri);
        } else {
          Alert.alert('Saved', `File saved as ${filename}`);
        }
      }
    } catch (error: any) {
      apiError(error);
    } finally {
      setBusy(null);
    }
  };

  const renderTaskChips = (active: AiTask, onPick: (t: AiTask) => void) => {
    return (
      <View style={styles.chipRow}>
        {TASK_META.map((c) => {
          const isActive = active === c.key;
          return (
            <TouchableOpacity
              key={c.key}
              style={[
                styles.chip,
                { borderColor: c.color },
                isActive && { backgroundColor: c.color },
              ]}
              onPress={() => onPick(c.key)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const actionButton = (
    busyKey: string,
    label: string,
    onPress: () => void
  ) => (
    <TouchableOpacity onPress={onPress} disabled={busy !== null} activeOpacity={0.85}>
      <LinearGradient
        colors={['#8b5cf6', '#ec4899', '#f97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, busy !== null && styles.buttonDisabled]}
      >
        {busy === busyKey ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderOptionChips = <T extends string>(
    options: { key: T; label: string }[],
    value: T,
    onPick: (v: T) => void,
    color: string
  ) => (
    <View style={styles.chipRow}>
      {options.map((o) => {
        const isActive = value === o.key;
        return (
          <TouchableOpacity
            key={o.key}
            style={[
              styles.chip,
              { borderColor: color },
              isActive && { backgroundColor: color },
            ]}
            onPress={() => onPick(o.key)}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Gradient header */}
      <LinearGradient
        colors={['#8b5cf6', '#ec4899', '#f97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>DocMind AI</Text>
            <Text style={styles.tagline}>Your documents, understood.</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Mode toggle */}
      <View style={styles.card}>
        <View style={styles.segment}>
          {MODES.map((m) =>
            mode === m.key ? (
              <TouchableOpacity key={m.key} style={styles.segmentItem} activeOpacity={0.9}>
                <LinearGradient
                  colors={['#8b5cf6', '#ec4899', '#f97316']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.segmentActive}
                >
                  <Text style={styles.segmentTextActive}>{m.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={m.key}
                style={styles.segmentItem}
                onPress={() => switchMode(m.key)}
              >
                <Text style={styles.segmentText}>{m.label}</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Text mode */}
        {mode === 'text' && (
          <View>
            {renderTaskChips(task, setTask)}
            <TextInput
              style={styles.textArea}
              placeholder="Paste your text here..."
              placeholderTextColor="#888"
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={8}
            />
            {actionButton('text', 'Analyze', handleAnalyze)}
          </View>
        )}

        {/* Document mode */}
        {mode === 'document' && (
          <View>
            <TouchableOpacity style={styles.pickButton} onPress={pickDocument}>
              <Text style={styles.pickButtonText}>
                {doc ? 'Change document' : 'Pick document'}
              </Text>
              <Text style={styles.pickButtonSub}>PDF, DOCX or TXT · up to 10 MB</Text>
            </TouchableOpacity>
            {doc && (
              <View style={styles.fileCard}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {doc.name}
                </Text>
                <Text style={styles.fileSize}>{formatSize(doc.size)}</Text>
              </View>
            )}
            {renderTaskChips(task, setTask)}
            {actionButton('doc', 'Upload & Analyze', handleUpload)}
          </View>
        )}

        {/* Assignment mode */}
        {mode === 'assignment' && (
          <View>
            <Text style={styles.label}>Topic</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. The water cycle"
              placeholderTextColor="#888"
              value={topic}
              onChangeText={setTopic}
              multiline
            />
            <Text style={styles.label}>Level</Text>
            {renderOptionChips<Level>(
              [
                { key: 'school', label: 'School' },
                { key: 'college', label: 'College' },
                { key: 'university', label: 'University' },
              ],
              level,
              setLevel,
              ASSIGNMENT_COLOR
            )}
            <Text style={styles.label}>Length</Text>
            {renderOptionChips<Length>(
              [
                { key: 'short', label: 'Short' },
                { key: 'medium', label: 'Medium' },
                { key: 'long', label: 'Long' },
              ],
              length,
              setLength,
              ASSIGNMENT_COLOR
            )}
            <Text style={styles.label}>Instructions (optional)</Text>
            <TextInput
              style={styles.textAreaSmall}
              placeholder="Anything specific to include..."
              placeholderTextColor="#888"
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={3}
            />
            {actionButton('assign', 'Generate Assignment', handleAssignment)}
          </View>
        )}
      </View>

      {/* Result */}
      {result ? (
        <View style={styles.card}>
          <Text style={styles.resultTitle}>{resultTitle || 'Result'}</Text>
          <ScrollView style={styles.resultScroll} nestedScrollEnabled>
            <Text style={styles.resultText}>{result}</Text>
          </ScrollView>
          <View style={styles.downloadRow}>
            {(
              [
                { key: 'pdf', label: 'PDF', color: '#ef4444' },
                { key: 'docx', label: 'Word', color: '#2563eb' },
                { key: 'txt', label: 'TXT', color: '#14b8a6' },
              ] as { key: ExportFormat; label: string; color: string }[]
            ).map((d) => (
              <TouchableOpacity
                key={d.key}
                style={[styles.downloadBtn, { backgroundColor: d.color }]}
                onPress={() => handleDownload(d.key)}
                disabled={busy !== null}
              >
                {busy === `export-${d.key}` ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.downloadText}>{d.label}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 16, paddingBottom: 32 },
  header: { borderRadius: 16, padding: 20, marginBottom: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  logoutBtn: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  card: {
    backgroundColor: '#1e1e2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#0f0f1a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  segmentItem: { flex: 1, borderRadius: 8 },
  segmentActive: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 10,
  },
  segmentTextActive: { color: '#fff', fontSize: 14, fontWeight: '700' },
  chipRow: { flexDirection: 'row', marginBottom: 14, gap: 8 },
  chip: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 24,
    paddingVertical: 9,
    alignItems: 'center',
  },
  chipText: { color: '#aaa', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  label: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: '#0f0f1a',
    color: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    marginBottom: 14,
    textAlignVertical: 'top',
    minHeight: 54,
  },
  textArea: {
    backgroundColor: '#0f0f1a',
    color: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  textAreaSmall: {
    backgroundColor: '#0f0f1a',
    color: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  pickButton: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#8b5cf6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  pickButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  pickButtonSub: { color: '#aaa', fontSize: 12, marginTop: 6 },
  fileCard: {
    backgroundColor: '#0f0f1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  fileName: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 },
  fileSize: { color: '#aaa', fontSize: 12 },
  resultTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  resultScroll: { maxHeight: 340, marginBottom: 14 },
  resultText: { color: '#e8e8f0', fontSize: 15, lineHeight: 23 },
  downloadRow: { flexDirection: 'row', gap: 10 },
  downloadBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  downloadText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
