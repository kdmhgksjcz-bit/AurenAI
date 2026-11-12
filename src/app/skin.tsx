import { useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const palette = { bg: "#F6F3EE", card: "#FFFEFC", ink: "#252522", muted: "#77736D", line: "#E6E0D7", accent: "#8A7660" };

const questions = [
  { key: "feel", title: "How does your skin usually feel?", options: ["Balanced", "Oily", "Dry or tight", "Combination", "Not sure"] },
  { key: "sensitivity", title: "How does your skin react to new products?", options: ["Rarely reacts", "Sometimes feels sensitive", "Often reacts", "Not sure"] },
  { key: "concern", title: "What would you like your routine to focus on?", options: ["Keeping skin comfortable", "Shine management", "Visible blemishes", "Uneven-looking texture", "A simple daily routine"] },
  { key: "routine", title: "How would you describe your current routine?", options: ["No regular routine", "Cleanser only", "Cleanser and moisturiser", "Several products", "Not sure"] },
  { key: "preference", title: "What matters most when choosing products?", options: ["Few steps", "Fragrance-free options", "Lightweight textures", "Affordable products", "Clear ingredient information"] },
] as const;

export default function SkinScreen() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const completed = useMemo(() => questions.filter((q) => answers[q.key]).length, [answers]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Link href="/" style={styles.back}>←  STUDIO</Link>
        <Text style={styles.eyebrow}>AUREN / SKIN PROFILE</Text>
        <Text style={styles.title}>Build a routine that makes sense.</Text>
        <Text style={styles.subtitle}>Tell us how your skin behaves and what you want from a routine. The aim is comfort, consistency and clear product information—not perfection.</Text>
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
          <Text style={styles.noteTitle}>Cosmetic guidance only</Text>
          <Text style={styles.noteText}>This questionnaire does not diagnose skin conditions. If a skin concern is painful, persistent or worrying, a qualified healthcare professional is the right person to assess it.</Text>
        </View>
        <Pressable disabled={completed !== questions.length} onPress={() => setSubmitted(true)} style={[styles.button, completed !== questions.length && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>{submitted ? "PROFILE REVIEWED" : "REVIEW MY PROFILE"}</Text>
        </Pressable>
        {submitted ? <Text style={styles.confirmation}>Your answers are ready for the next analysis step. This prototype does not yet generate AI recommendations or save a profile between sessions.</Text> : null}
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
  title: { marginTop: 13, color: palette.ink, fontSize: 34, lineHeight: 41, letterSpacing: -1 },
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