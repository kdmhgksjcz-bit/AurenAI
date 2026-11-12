import { Link } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const C = { bg: "#F5F2EC", paper: "#FCFBF8", ink: "#24231F", muted: "#77736C", line: "#E5E0D7", accent: "#927B62", pale: "#EDE7DE" };
const items = [
  { group: "HAIR / CLEANSING", title: "Gentle shampoo", role: "Cleans the scalp and removes everyday build-up.", look: "Choose a formula that leaves your scalp comfortable rather than tight. Wash frequency depends on your scalp, activity and preference." },
  { group: "HAIR / CONDITIONING", title: "Rinse-out conditioner", role: "Improves slip and helps reduce friction through the lengths.", look: "Apply mainly where hair needs conditioning. Fine hair may prefer lighter textures; thicker or curlier hair may prefer richer formulas." },
  { group: "HAIR / STYLING", title: "Leave-in or light mousse", role: "Can support manageability, definition or hold depending on the formula.", look: "Start with a small amount. Choose based on the finish you want, not marketing claims." },
  { group: "SKIN / MOISTURISING", title: "Glycerin", role: "A humectant used to help attract and retain water in the outer skin layer.", look: "Common in moisturisers. It works as part of a finished formula, not as a guarantee of a particular result." },
  { group: "SKIN / BARRIER SUPPORT", title: "Ceramides", role: "Lipids naturally found in the skin barrier and commonly used in moisturisers.", look: "Useful to know when comparing moisturisers, especially if your skin feels dry or uncomfortable." },
  { group: "SKIN / DAILY PROTECTION", title: "Broad-spectrum SPF 30+", role: "Helps protect skin from ultraviolet radiation when used as directed.", look: "Choose a product you can apply comfortably and consistently. Follow its label for amount and reapplication." }
];

export default function ProductsScreen() {
  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Link href="/" style={styles.back}>←  BACK TO STUDIO</Link>
      <Text style={styles.eyebrow}>AUREN / INGREDIENT LIBRARY</Text>
      <Text style={styles.title}>Understand the formula.</Text>
      <Text style={styles.intro}>A starting guide to common product types and ingredients. The finished formula, concentration and how you use it all matter.</Text>
      {items.map((item) => <View key={item.title} style={styles.card}>
        <Text style={styles.group}>{item.group}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.role}>{item.role}</Text>
        <View style={styles.rule} />
        <Text style={styles.look}>{item.look}</Text>
      </View>)}
      <View style={styles.note}>
        <Text style={styles.noteTitle}>Why no brand rankings yet?</Text>
        <Text style={styles.noteCopy}>AUREN should only rank specific products after checking current ingredient lists, product availability, price and retailer data. This prototype does not invent those details.</Text>
      </View>
      <Text style={styles.footer}>INFORMATIONAL COSMETIC GUIDANCE · NO MEDICAL CLAIMS</Text>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  page: { paddingHorizontal: 23, paddingTop: 17, paddingBottom: 48, maxWidth: 720, width: "100%", alignSelf: "center" },
  back: { color: C.muted, fontSize: 9, letterSpacing: 1.4, marginBottom: 31 },
  eyebrow: { color: C.accent, fontSize: 9, letterSpacing: 2, fontWeight: "600" },
  title: { color: C.ink, fontSize: 37, lineHeight: 43, letterSpacing: -1.2, marginTop: 13 },
  intro: { color: C.muted, fontSize: 13, lineHeight: 21, marginTop: 12, marginBottom: 21 },
  card: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, padding: 18, marginBottom: 10 },
  group: { color: C.accent, fontSize: 8, letterSpacing: 1.5, fontWeight: "600" },
  cardTitle: { color: C.ink, fontSize: 20, marginTop: 12 },
  role: { color: C.muted, fontSize: 11, lineHeight: 18, marginTop: 6 },
  rule: { height: 1, backgroundColor: C.line, marginVertical: 12 },
  look: { color: C.muted, fontSize: 10, lineHeight: 17 },
  note: { backgroundColor: C.pale, padding: 17, marginTop: 9 },
  noteTitle: { color: C.ink, fontSize: 13, fontWeight: "600" },
  noteCopy: { color: C.muted, fontSize: 11, lineHeight: 18, marginTop: 6 },
  footer: { color: C.muted, fontSize: 8, letterSpacing: 1.2, textAlign: "center", marginTop: 28 }
});