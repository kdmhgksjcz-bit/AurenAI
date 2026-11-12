import { useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const C = { bg: "#F5F2EC", paper: "#FCFBF8", ink: "#24231F", muted: "#77736C", line: "#E5E0D7", accent: "#927B62", pale: "#EDE7DE", white: "#FFFFFF" };
const questions = [
  { key: "pattern", title: "How does your hair naturally sit?", options: ["Straight", "Slightly wavy", "Wavy", "Curly", "Coily"] },
  { key: "density", title: "How much hair do you have?", options: ["Low", "Medium", "High", "Not sure"] },
  { key: "strand", title: "How would you describe each strand?", options: ["Fine", "Medium", "Thick", "Not sure"] },
  { key: "scalp", title: "How does your scalp usually feel?", options: ["Balanced", "Oily", "Dry", "Sensitive", "Varies"] },
  { key: "condition", title: "How does your hair usually behave?", options: ["Smooth", "Dry or frizzy", "Lacks definition", "Gets weighed down", "Varies"] },
  { key: "goal", title: "What would you most like to explore?", options: ["Natural movement", "More defined texture", "More volume", "A haircut direction", "A simpler routine"] }
] as const;

type Answers = Record<string, string>;

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.choice, selected && styles.choiceSelected]}>
      <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
      {selected ? <Text style={styles.check}>✓</Text> : null}
    </Pressable>
  );
}

function getStyles(a: Answers) {
  const textured = ["Slightly wavy", "Wavy", "Curly", "Coily"].includes(a.pattern);
  const fine = a.strand === "Fine" || a.density === "Low";
  const options = [
    { title: "Soft natural flow", tag: "LOW EFFORT", copy: "Keep the natural pattern visible with light layering and a flexible, lightweight styling product.", why: "A movement-first direction works with your selected natural texture rather than forcing it into a different shape." },
    { title: "Defined texture", tag: "TEXTURE FOCUS", copy: "Use a small amount of leave-in conditioner and a light mousse or styling cream, then allow the hair to dry without repeatedly touching it.", why: "This prioritises definition. It is most relevant when your profile includes waves or curls, but can be adapted to straight hair." },
    { title: "Layered shape", tag: "CUT DIRECTION", copy: "Ask for soft, connected layers that preserve length and remove excess bulk only where needed. Bring reference photos to your stylist.", why: "Layers can create movement; the exact placement depends on your length, density and face-framing preference." }
  ];
  if (!textured) options[1] = { ...options[1], title: "Polished natural texture", copy: "Keep the finish light with a small amount of smoothing cream or leave-in conditioner. Avoid heavy products that flatten the hair.", why: "This option respects a straighter pattern while focusing on manageability and a natural finish." };
  if (fine) options[2] = { ...options[2], title: "Lightweight layered shape", copy: "Choose subtle layers and avoid removing too much density. Use lightweight products so the shape keeps its lift.", why: "Fine strands or lower density can be weighed down by heavy creams and aggressive texturising." };
  if (a.goal === "More volume") options.unshift({ title: "Root-lift direction", tag: "VOLUME FOCUS", copy: "Try a light mousse at the roots and a cut with subtle shape. Keep conditioners mainly through the lengths if your roots get oily.", why: "Your stated goal is volume; lightweight formulas are less likely to flatten the result." });
  return options.slice(0, 3);
}

function getCare(a: Answers) {
  const scalp = a.scalp === "Oily" ? "Choose a gentle shampoo that cleans the scalp comfortably; wash as often as your scalp needs." : a.scalp === "Dry" || a.scalp === "Sensitive" ? "Use a mild shampoo and avoid aggressive scrubbing or strongly fragranced products if they bother your scalp." : "Use a gentle shampoo and adjust wash frequency to comfort and activity.";
  const condition = a.condition === "Dry or frizzy" ? "Add a rinse-out conditioner and, if needed, a small amount of leave-in conditioner through the lengths." : a.condition === "Gets weighed down" ? "Use a lighter conditioner and keep richer products away from the roots." : "Use conditioner through the lengths and add a styling product only if it solves a specific problem.";
  return [scalp, condition, "Change one product at a time and give your routine a little time before judging the result."];
}

export default function HairScreen() {
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const completed = useMemo(() => questions.filter((q) => answers[q.key]).length, [answers]);
  const stylesForProfile = useMemo(() => getStyles(answers), [answers]);
  const care = useMemo(() => getCare(answers), [answers]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <Link href="/" style={styles.back}>←  BACK TO STUDIO</Link>
        <Text style={styles.eyebrow}>AUREN / HAIR STUDIO</Text>
        <Text style={styles.title}>Understand your hair.</Text>
        <Text style={styles.intro}>Build a useful starting profile. Choose the answers that feel closest; uncertainty is completely fine.</Text>
        <Link href={{ pathname: "/scan", params: { type: "hair" } }} asChild><Pressable style={styles.primary}><Text style={styles.primaryText}>SCAN MY HAIR WITH AI  →</Text></Pressable></Link>
        {!showResults ? <>
          <View style={styles.progressLine}>
            <Text style={styles.progressLabel}>YOUR PROFILE</Text>
            <Text style={styles.progressLabel}>{completed} / {questions.length}</Text>
          </View>
          <View style={styles.track}><View style={[styles.fill, { width: `${completed / questions.length * 100}%` }]} /></View>
          {questions.map((q, index) => <View key={q.key} style={styles.questionCard}>
            <Text style={styles.number}>0{index + 1}</Text>
            <Text style={styles.question}>{q.title}</Text>
            <View style={styles.choices}>{q.options.map((option) => <Choice key={option} label={option} selected={answers[q.key] === option} onPress={() => setAnswers((old) => ({ ...old, [q.key]: option }))} />)}</View>
          </View>)}
          <View style={styles.note}>
            <Text style={styles.noteTitle}>What this profile can tell us</Text>
            <Text style={styles.noteCopy}>These are self-reported observations, not laboratory measurements. Hair behaviour also depends on length, humidity, styling and recent treatments.</Text>
          </View>
          <Pressable disabled={completed !== questions.length} onPress={() => setShowResults(true)} style={[styles.primary, completed !== questions.length && styles.disabled]}>
            <Text style={styles.primaryText}>CREATE MY HAIR GUIDE  →</Text>
          </Pressable>
        </> : <>
          <View style={styles.resultIntro}>
            <Text style={styles.resultEyebrow}>YOUR HAIR GUIDE</Text>
            <Text style={styles.resultTitle}>A starting point, shaped around your answers.</Text>
            <Text style={styles.resultCopy}>{answers.pattern} pattern · {answers.strand.toLowerCase()} strands · {answers.density.toLowerCase()} density</Text>
          </View>
          <Text style={styles.sectionTitle}>Styling directions</Text>
          {stylesForProfile.map((item, i) => <View key={item.title} style={styles.resultCard}>
            <View style={styles.resultMeta}><Text style={styles.resultTag}>0{i + 1} / {item.tag}</Text><Text style={styles.resultArrow}>↗</Text></View>
            <Text style={styles.resultCardTitle}>{item.title}</Text>
            <Text style={styles.resultCardCopy}>{item.copy}</Text>
            <View style={styles.why}><Text style={styles.whyLabel}>WHY THIS MAY FIT</Text><Text style={styles.whyCopy}>{item.why}</Text></View>
          </View>)}
          <Text style={styles.sectionTitle}>Your care foundations</Text>
          {care.map((item, i) => <View key={i} style={styles.step}><Text style={styles.stepNumber}>0{i + 1}</Text><Text style={styles.stepCopy}>{item}</Text></View>)}
          <View style={styles.note}><Text style={styles.noteTitle}>Product matching comes next</Text><Text style={styles.noteCopy}>These are product-type suggestions, not a verified live product catalogue. AUREN will need ingredient and retailer data before it can make specific brand or price recommendations.</Text></View>
          <Pressable onPress={() => setShowResults(false)} style={styles.secondary}><Text style={styles.secondaryText}>← EDIT MY ANSWERS</Text></Pressable>
        </>}
        <Text style={styles.footer}>COSMETIC GUIDANCE · NOT A MEDICAL ASSESSMENT</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  page: { paddingHorizontal: 23, paddingTop: 17, paddingBottom: 48, maxWidth: 720, width: "100%", alignSelf: "center" },
  back: { color: C.muted, fontSize: 9, letterSpacing: 1.4, marginBottom: 31 },
  eyebrow: { color: C.accent, fontSize: 9, letterSpacing: 2, fontWeight: "600" },
  title: { color: C.ink, fontSize: 37, lineHeight: 43, letterSpacing: -1.2, marginTop: 13 },
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
  note: { padding: 17, backgroundColor: C.pale, marginTop: 8 },
  noteTitle: { color: C.ink, fontSize: 13, fontWeight: "600" },
  noteCopy: { color: C.muted, fontSize: 11, lineHeight: 18, marginTop: 6 },
  primary: { backgroundColor: C.ink, padding: 17, alignItems: "center", marginTop: 17 },
  disabled: { backgroundColor: "#B9B3AA" },
  primaryText: { color: C.white, fontSize: 9, letterSpacing: 1.5, fontWeight: "600" },
  resultIntro: { backgroundColor: C.pale, padding: 19, marginTop: 10, marginBottom: 24 },
  resultEyebrow: { color: C.accent, fontSize: 8, letterSpacing: 1.6, fontWeight: "600" },
  resultTitle: { color: C.ink, fontSize: 25, lineHeight: 30, marginTop: 9 },
  resultCopy: { color: C.muted, fontSize: 10, marginTop: 9 },
  sectionTitle: { color: C.ink, fontSize: 20, marginBottom: 12, marginTop: 3 },
  resultCard: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, padding: 17, marginBottom: 10 },
  resultMeta: { flexDirection: "row", justifyContent: "space-between" },
  resultTag: { color: C.accent, fontSize: 8, letterSpacing: 1.3, fontWeight: "600" },
  resultArrow: { color: C.accent },
  resultCardTitle: { color: C.ink, fontSize: 19, marginTop: 15 },
  resultCardCopy: { color: C.muted, fontSize: 11, lineHeight: 18, marginTop: 7 },
  why: { borderTopWidth: 1, borderTopColor: C.line, marginTop: 13, paddingTop: 11 },
  whyLabel: { color: C.accent, fontSize: 8, letterSpacing: 1.2, fontWeight: "600" },
  whyCopy: { color: C.muted, fontSize: 10, lineHeight: 16, marginTop: 5 },
  step: { flexDirection: "row", gap: 13, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.line },
  stepNumber: { color: C.accent, fontSize: 9, paddingTop: 2 },
  stepCopy: { color: C.muted, fontSize: 11, lineHeight: 18, flex: 1 },
  secondary: { borderWidth: 1, borderColor: C.line, padding: 15, alignItems: "center", marginTop: 19 },
  secondaryText: { color: C.ink, fontSize: 9, letterSpacing: 1.3, fontWeight: "600" },
  footer: { color: C.muted, fontSize: 8, letterSpacing: 1.2, textAlign: "center", marginTop: 28 }
});