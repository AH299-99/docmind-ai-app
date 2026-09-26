import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HelpScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Help & guide</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            Everything you need to get useful{'\n'}results from DocMind AI.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title="How it works">
            <ThemedText type="small">DocMind AI reads the text you give it and returns a focused answer. Three steps:</ThemedText>
            <ThemedText type="small">
              <ThemedText type="smallBold">1. </ThemedText>Paste or type your text on the Home tab.
            </ThemedText>
            <ThemedText type="small">
              <ThemedText type="smallBold">2. </ThemedText>Pick a task: Summarize, Explain, or Analyze.
            </ThemedText>
            <ThemedText type="small">
              <ThemedText type="smallBold">3. </ThemedText>Tap Analyze and read the result.
            </ThemedText>
          </Collapsible>

          <Collapsible title="Summarize vs Explain vs Analyze">
            <ThemedText type="small">
              <ThemedText type="smallBold">Summarize </ThemedText>turns long text into a short version with the key points. Best for articles, reports, and notes.
            </ThemedText>
            <ThemedText type="small">
              <ThemedText type="smallBold">Explain </ThemedText>breaks difficult text down in simpler terms. Best for technical or dense writing.
            </ThemedText>
            <ThemedText type="small">
              <ThemedText type="smallBold">Analyze </ThemedText>pulls out the main ideas and insights. Best when you want to understand what matters in a document.
            </ThemedText>
          </Collapsible>

          <Collapsible title="Tips for better results">
            <ThemedText type="small">
              <ThemedText type="smallBold">· </ThemedText>Paste complete text, not fragments — the AI needs context.
            </ThemedText>
            <ThemedText type="small">
              <ThemedText type="smallBold">· </ThemedText>One topic at a time gives cleaner answers than a mix.
            </ThemedText>
            <ThemedText type="small">
              <ThemedText type="smallBold">· </ThemedText>Very long documents may get cut off — split them into parts.
            </ThemedText>
            <ThemedText type="small">
              <ThemedText type="smallBold">· </ThemedText>Match the task to your goal: a summary for catching up, an explanation for learning, an analysis for decisions.
            </ThemedText>
          </Collapsible>

          <Collapsible title="Upload documents">
            <ThemedText type="small">Tap the Document tab on the Home screen, then “Pick document” and choose a PDF, DOCX, or TXT file (up to 10 MB).</ThemedText>
            <ThemedText type="small">Pick a task — Summarize, Explain, or Analyze — then tap “Upload & Analyze”. The file is sent to the DocMind API, which reads the text inside and returns the result.</ThemedText>
          </Collapsible>

          <Collapsible title="Generate assignments">
            <ThemedText type="small">Tap the Assignment tab on the Home screen. Type your topic, pick a level (School, College, or University) and a length (Short, Medium, or Long), and add any extra instructions if you want.</ThemedText>
            <ThemedText type="small">Tap “Generate Assignment” and DocMind AI writes the full assignment for you. You can download it right from the result card.</ThemedText>
          </Collapsible>

          <Collapsible title="Download results">
            <ThemedText type="small">Every result card has three download buttons: PDF, Word, and TXT.</ThemedText>
            <ThemedText type="small">Tapping one sends the result to the DocMind API, which builds the file for you. On phones it opens the share sheet so you can save it to your files or send it to another app; on the web it downloads straight to your computer.</ThemedText>
          </Collapsible>

          <Collapsible title="Your privacy">
            <ThemedText type="small">
              You need an account to use DocMind AI. Your login stays saved on this device, and the text you submit is sent to the DocMind API so the AI can process it.
            </ThemedText>
            <ThemedText type="small">
              Don&apos;t paste passwords, private keys, or anything you wouldn&apos;t share — treat it like sending an email.
            </ThemedText>
          </Collapsible>

          <Collapsible title="Troubleshooting">
            <ThemedText type="small">
              <ThemedText type="smallBold">“Login failed” — </ThemedText>double-check your email and password, or create an account on the Sign up screen.
            </ThemedText>
            <ThemedText type="small">
              <ThemedText type="smallBold">“Something went wrong” — </ThemedText>check your internet connection. The server may also be down; wait a bit and try again.
            </ThemedText>
            <ThemedText type="small">
              <ThemedText type="smallBold">Empty or strange result — </ThemedText>try shorter, cleaner text and make sure you picked the right task.
            </ThemedText>
          </Collapsible>

          <Collapsible title="About DocMind AI">
            <ThemedText type="small">
              DocMind AI is built by Azmat Hayat with React Native (Expo) and a Node.js API powered by Google Gemini.
            </ThemedText>
            <ExternalLink href="https://github.com/AH299-99/docmind-ai-app">
              <ThemedText type="linkPrimary">View source on GitHub</ThemedText>
            </ExternalLink>
          </Collapsible>
        </ThemedView>
        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
});
