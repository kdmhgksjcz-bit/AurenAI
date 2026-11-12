import { useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const palette = { bg: "#F6F3EE", card: "#FFFEFC", ink: "#252522", muted: "#77736D", line: "#E6E0D7", accent: "#8A7660" };

const questions = [
  { key: "pattern", title: "How does your hair naturally sit?", options: ["Straight", "Slightly wavy", "Wavy", "Curly", "Coily"] },
  { key: "density", title: "How much hair do you have?", options: ["Fine / low density", "Medium density", "High density", "Not sure"] },
  { key: "strand", title: "How would you describe each strand?", options: ["Fine", "Medium", "Thick", "Not sure"] },
  { key: "scalp", title: "How does your scalp usually feel?", options: ["Balanced", "Oily", "Dry", "Sensitive", "Varies"] },
  { key: "goal", title: "What would you like to work on?", options: ["More defined waves or curls", "Less frizz", "More volume", "A suitable haircut", "A simpler care routine"] },
] as const;

export default function HairScreen() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const completed = useMemo(() => questions.filter((q) => answers[q.key]).length, [answers]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Link href="/" style={styles.back}>←  STUDIO</Link>
        <Text style={styles.eyebrow}>AUREN / HAIR PROFILE</Text>
        <Text style={styles.title}>Understand your hair.</Text>
        <Text style={styles.subtitle}>A short profile helps us make more relevant styling and care suggestions. Choose what feels closest; “not sure” is a valid answer.</Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>YOUR PROFILE</Text>
          <Text style={styles.progressText}>{completed} OF {questions.length}</Text>
        </View>
        <View style={styles.track}><View style={[styles.fill, { width: `${(completed / questions.length) * 100}%` }]} /></View>
        {questions.map((question, index) => (
          <View key={question.key} style={styles.questionCard}>
            <Text style={styles.number}>0{index + 1}</Text>
            <Text style={styles.question}>{question.title}</Text>
            <View style={styles.options}>
              {question.options.map((option) => {
                const selected = answers[question.key] === option;
                return (
                  <Pressable key={option} onPress={() => setAnswers((current) => ({ ...current, [question.key]: option }))} style={[styles.option, selected && styles.optionSelected]}>
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
                    {selected ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
        <View style={styles.note}>
          <Text style={styles.noteTitle}>A note on accuracy</Text>
          <Text style={styles.noteText}>This profile is a starting point, not a scientific measurement. Hair behaviour can change with length, weather, styling and product use.</Text>
        </View>
        <Pressable disabled={completed !== questions.length} onPress={() => {}} style={[styles.button, completed !== questions.length && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>PROFILE COMPLETE</Text>
        </Pressable>
        <Text style={styles.bottom}>Your answers stay on this screen in this prototype. No photo scan or upload is used.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  container: { padding: 24, paddingTop: 18, paddingBottom: 50 },
  back: { color: palette.muted, fontSize: 10, letterSpacing: 1.5, marginBottom: 34 },
  eyebrow: { color: palette.accent, fontSize: 9, letterSpacing: 2, fontWeight: "600" },
  title: { marginTop: 13, color: palette.ink, fontSize: 36, lineHeight: 42, letterSpacing: -1 },
  subtitle: { marginTop: 12, color: palette.muted, fontSize: 13, lineHeight: 21 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  progressText: { color: palette.muted, fontSize: 9, letterSpacing: 1.2 },
  track: { height: 3, backgroundColor: palette.line, marginTop: 10, marginBottom: 20 },
  fill: { height: 3, backgroundColor: palette.accent },
  questionCard: { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, padding: 18, marginBottom: 12 },
  number: { color: palette.accent, fontSize: 9, letterSpacing: 1.5 },
  question: { marginTop: 10, marginBottom: 15, color: palette.ink, fontSize: 18, lineHeight: 24 },
  options: { gap: 8 },
  option: { minHeight: 43, paddingHorizontal: 13, paddingVertical: 11, borderWidth: 1, borderColor: palette.line, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  optionSelected: { borderColor: palette.accent, backgroundColor: "#F2EEE8" },
  optionText: { color: palette.muted, fontSize: 12 },
  optionTextSelected: { color: palette.ink, fontWeight: "600" },
  check: { color: palette.accent, fontSize: 13 },
  note: { padding: 17, backgroundColor: "#EEE9E1", marginTop: 8 },
  noteTitle: { color: palette.ink, fontSize: 13, fontWeight: "600" },
  noteText: { color: palette.muted, fontSize: 11, lineHeight: 18, marginTop: 6 },
  button: { marginTop: 20, padding: 17, backgroundColor: palette.ink, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#B8B2A9" },
  buttonText: { color: "#FFFFFF", fontSize: 10, letterSpacing: 1.5, fontWeight: "600" },
  bottom: { color: palette.muted, fontSize: 10, lineHeight: 16, textAlign: "center", marginTop: 13 },
});