import { useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const C = { bg: "#F5F2EC", paper: "#FCFBF8", ink: "#24231F", muted: "#77736C", line: "#E5E0D7", accent: "#927B62", pale: "#EDE7DE", white: "#FFFFFF" };
const questions = [
  { key: "feel", title: "How does your skin usually feel?", options: ["Balanced", "Oily", "Dry or tight", "Combination", "Not sure"] },
  { key: "sensitivity", title: "How does your skin react to new products?", options: ["Rarely reacts", "Sometimes feels sensitive", "Often reacts", "Not sure"] },
  { key: "concern", title: "What would you like your routine to focus on?", options: ["Keeping skin comfortable", "Managing shine", "Visible blemishes", "Uneven-looking texture", "A simple daily routine"] },
  { key: "routine", title: "What does your current routine look like?", options: ["No regular routine", "Cleanser only", "Cleanser and moisturiser", "Several products", "Not sure"] },
  { key: "preference", title: "What matters most when choosing products?", options: ["Few steps", "Fragrance-free options", "Lightweight textures", "Affordable products", "Clear ingredient information"] }
] as const;
type Answers = Record<string, string>;

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.choice, selected && styles.choiceSelected]}>
    <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
    {selected ? <Text style={styles.check}>✓</Text> : null}
  </Pressable>;
}

function routineFor(a: Answers) {
  const cleanser = a.feel === "Oily" ? "A gentle gel or lotion cleanser that removes daily oil without leaving skin tight." : "A mild, non-stripping cleanser. If your skin feels dry or sensitive, keep cleansing gentle and avoid scrubbing.";
  const moisturiser = a.feel === "Oily" ? "A light moisturiser can still support the skin barrier; choose a texture you find comfortable." : "A simple moisturiser with ingredients such as glycerin or ceramides can help support skin comfort.";
  const sun = "Use broad-spectrum SPF 30 or higher during the day. Choose a texture you will comfortably apply and reapply when outdoors.";
  const extra = a.concern === "Visible blemishes" ? "Keep the routine simple first. Avoid picking or stacking multiple strong products. If blemishes are persistent, painful or worrying, ask a healthcare professional for advice." : a.concern === "Managing shine" ? "Blotting papers or a lightweight moisturiser may be enough; a very harsh cleanser can leave skin feeling uncomfortable." : "Add optional products only when there is a clear reason. More steps do not automatically mean better results.";
  return [cleanser, moisturiser, sun, extra];
}

export default function SkinScreen() {
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const completed = useMemo(() => questions.filter((q) => answers[q.key]).length, [answers]);
  const routine = useMemo(() => routineFor(answers), [answers]);

  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Link href="/" style={styles.back}>←  BACK TO STUDIO</Link>
      <Text style={styles.eyebrow}>AUREN / SKIN STUDIO</Text>
      <Text style={styles.title}>Build a routine that makes sense.</Text>
      <Text style={styles.intro}>Tell us how your skin behaves and what you want from a routine. The goal is comfort, consistency and clear information—not perfection.</Text>
      <Link href={{ pathname: "/scan", params: { type: "skin" } }} asChild><Pressable style={styles.primary}><Text style={styles.primaryText}>SCAN MY SKIN WITH AI  →</Text></Pressable></Link>
      {!showResults ? <>
        <View style={styles.progressLine}><Text style={styles.progressLabel}>YOUR PROFILE</Text><Text style={styles.progressLabel}>{completed} / {questions.length}</Text></View>
        <View style={styles.track}><View style={[styles.fill, { width: `${completed / questions.length * 100}%` }]} /></View>
        {questions.map((q, index) => <View key={q.key} style={styles.questionCard}>
          <Text style={styles.number}>0{index + 1}</Text>
          <Text style={styles.question}>{q.title}</Text>
          <View style={styles.choices}>{q.options.map((option) => <Choice key={option} label={option} selected={answers[q.key] === option} onPress={() => setAnswers((old) => ({ ...old, [q.key]: option }))} />)}</View>
        </View>)}
        <View style={styles.note}><Text style={styles.noteTitle}>A note on accuracy</Text><Text style={styles.noteCopy}>This is a cosmetic self-assessment, not a diagnosis. Skin can change with weather, age, stress and products. If a concern is persistent, painful or worrying, a healthcare professional can assess it.</Text></View>
        <Pressable disabled={completed !== questions.length} onPress={() => setShowResults(true)} style={[styles.primary, completed !== questions.length && styles.disabled]}>
          <Text style={styles.primaryText}>CREATE MY SKIN ROUTINE  →</Text>
        </Pressable>
      </> : <>
        <View style={styles.resultIntro}>
          <Text style={styles.resultEyebrow}>YOUR SKIN FOUNDATIONS</Text>
          <Text style={styles.resultTitle}>Keep the routine clear and comfortable.</Text>
          <Text style={styles.resultCopy}>{answers.feel} feel · {answers.sensitivity.toLowerCase()} sensitivity · focus: {answers.concern.toLowerCase()}</Text>
        </View>
        <Text style={styles.sectionTitle}>Your simple routine</Text>
        {routine.map((item, i) => <View key={i} style={styles.stepCard}>
          <Text style={styles.stepLabel}>{["01 / CLEANSE", "02 / MOISTURISE", "03 / PROTECT", "04 / KEEP IT SIMPLE"][i]}</Text>
          <Text style={styles.stepCopy}>{item}</Text>
        </View>)}
        <View style={styles.note}>
          <Text style={styles.noteTitle}>Ingredient direction</Text>
          <Text style={styles.noteCopy}>Look for straightforward formulas. Glycerin and ceramides are common moisturising/barrier-support ingredients. Fragrance-free options may be worth considering if you often react to products. No single ingredient suits everyone.</Text>
        </View>
        <View style={styles.note}>
          <Text style={styles.noteTitle}>What AUREN does not claim</Text>
          <Text style={styles.noteCopy}>This guide is based on your answers, not a skin scan or medical assessment. Specific brand recommendations require a verified product catalogue and current ingredient data.</Text>
        </View>
        <Pressable onPress={() => setShowResults(false)} style={styles.secondary}><Text style={styles.secondaryText}>← EDIT MY ANSWERS</Text></Pressable>
      </>}
      <Text style={styles.footer}>COSMETIC GUIDANCE · NOT A MEDICAL ASSESSMENT</Text>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  page: { paddingHorizontal: 23, paddingTop: 17, paddingBottom: 48, maxWidth: 720, width: "100%", alignSelf: "center" },
  back: { color: C.muted, fontSize: 9, letterSpacing: 1.4, marginBottom: 31 },
  eyebrow: { color: C.accent, fontSize: 9, letterSpacing: 2, fontWeight: "600" },
  title: { color: C.ink, fontSize: 35, lineHeight: 42, letterSpacing: -1.1, marginTop: 13 },
  intro: { color: C.muted, fontSize: 13, lineHeight: 21, marginTop: 12, marginBottom: 22 },
  progressLine: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { color: C.muted, fontSize: 8, letterSpacing: 1.3 },
  track: { height: 3, backgroundColor: C.line, marginTop: 9, marginBottom: 19 },
  fill: { height: 3, backgroundColor: C.accent },
  questionCard: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, padding: 17, marginBottom: 11 },
  number: { color: C.accent, fontSize: 9, letterSpacing: 1.4 },
  question: { color: C.ink, fontSize: 17, lineHeight: 23, marginTop: 9, marginBottom: 14 },
  choices: { gap: 7 },
  choice: { minHeight: 42, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: C.line, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  choiceSelected: { borderColor: C.accent, backgroundColor: C.pale },
  choiceText: { color: C.muted, fontSize: 12 },
  choiceTextSelected: { color: C.ink, fontWeight: "600" },
  check: { color: C.accent, fontSize: 13 },
  note: { padding: 17, backgroundColor: C.pale, marginTop: 12 },
  noteTitle: { color: C.ink, fontSize: 13, fontWeight: "600" },
  noteCopy: { color: C.muted, fontSize: 11, lineHeight: 18, marginTop: 6 },
  primary: { backgroundColor: C.ink, padding: 17, alignItems: "center", marginTop: 17 },
  disabled: { backgroundColor: "#B9B3AA" },
  primaryText: { color: C.white, fontSize: 9, letterSpacing: 1.5, fontWeight: "600" },
  resultIntro: { backgroundColor: C.pale, padding: 19, marginTop: 10, marginBottom: 24 },
  resultEyebrow: { color: C.accent, fontSize: 8, letterSpacing: 1.6, fontWeight: "600" },
  resultTitle: { color: C.ink, fontSize: 25, lineHeight: 30, marginTop: 9 },
  resultCopy: { color: C.muted, fontSize: 10, marginTop: 9 },
  sectionTitle: { color: C.ink, fontSize: 20, marginBottom: 12 },
  stepCard: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, padding: 16, marginBottom: 9 },
  stepLabel: { color: C.accent, fontSize: 8, letterSpacing: 1.3, fontWeight: "600" },
  stepCopy: { color: C.muted, fontSize: 11, lineHeight: 18, marginTop: 8 },
  secondary: { borderWidth: 1, borderColor: C.line, padding: 15, alignItems: "center", marginTop: 19 },
  secondaryText: { color: C.ink, fontSize: 9, letterSpacing: 1.3, fontWeight: "600" },
  footer: { color: C.muted, fontSize: 8, letterSpacing: 1.2, textAlign: "center", marginTop: 28 }
});