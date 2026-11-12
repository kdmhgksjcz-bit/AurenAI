import { Link } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

const C = {
  bg: "#F5F2EC", paper: "#FCFBF8", ink: "#24231F", muted: "#77736C",
  line: "#E5E0D7", accent: "#927B62", pale: "#EDE7DE", white: "#FFFFFF"
};

function StudioCard({ number, label, title, copy, href }: {
  number: string; label: string; title: string; copy: string; href: "/hair" | "/skin" | "/products";
}) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.studioCard, pressed && { opacity: 0.82 }]}>
        <View style={styles.cardMeta}>
          <Text style={styles.cardNumber}>{number} / {label}</Text>
          <Text style={styles.cardArrow}>↗</Text>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardCopy}>{copy}</Text>
        <Text style={styles.cardLink}>OPEN STUDIO  <Text style={{ color: C.accent }}>→</Text></Text>
      </Pressable>
    </Link>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.wordmark}>AUREN</Text>
            <Text style={styles.headerSub}>PRIVATE BEAUTY STUDIO</Text>
          </View>
          <View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>YOUR STUDIO</Text></View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>BEAUTY, WITH CLARITY</Text>
          <Text style={styles.heroTitle}>A more considered way to care for yourself.</Text>
          <Text style={styles.heroCopy}>
            Scan a photo you choose. Explore visible details, practical routines and informed product decisions.
          </Text>
          <View style={styles.heroRule} />
          <Text style={styles.heroFoot}>PERSONAL GUIDANCE  ·  AI-ASSISTED  ·  PRIVACY MINDED</Text>
        </View>

        <Link href="/scan" asChild><Pressable style={styles.scanCallout}><Text style={styles.scanEyebrow}>NEW / AI VISUAL SCAN</Text><Text style={styles.scanTitle}>Start with a photo.  ↗</Text><Text style={styles.scanCopy}>A guided hair or skin scan, with an AI-generated cosmetic care guide.</Text></Pressable></Link>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore your studio</Text>
          <Text style={styles.sectionKicker}>01 — 03</Text>
        </View>
        <StudioCard number="01" label="HAIR" title="Hair, understood." copy="Map your hair profile, compare styling directions and build a simple care routine." href="/hair" />
        <StudioCard number="02" label="SKIN" title="A routine that fits." copy="Describe how your skin behaves and create a calm, practical skincare foundation." href="/skin" />
        <StudioCard number="03" label="INGREDIENTS" title="Know what you choose." copy="A clear guide to common cosmetic ingredients, what they do and what they cannot promise." href="/products" />

        <View style={styles.principle}>
          <Text style={styles.principleEyebrow}>THE AUREN STANDARD</Text>
          <Text style={styles.principleTitle}>Knowledge before claims.</Text>
          <Text style={styles.principleCopy}>AUREN provides AI-assisted visual observations for cosmetic education. A single photo cannot establish medical conditions or reliably measure every hair or skin characteristic.</Text>
        </View>
        <Text style={styles.footer}>AUREN AI  ·  VERSION 0.3  ·  ENGLISH</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  page: { paddingHorizontal: 23, paddingTop: 16, paddingBottom: 46, maxWidth: 720, width: "100%", alignSelf: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 19, borderBottomWidth: 1, borderBottomColor: C.line },
  wordmark: { color: C.ink, fontSize: 24, letterSpacing: 7, fontWeight: "500" },
  headerSub: { marginTop: 5, color: C.muted, fontSize: 8, letterSpacing: 2 },
  status: { flexDirection: "row", alignItems: "center", gap: 7, borderWidth: 1, borderColor: C.line, paddingHorizontal: 10, paddingVertical: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#8C9A7B" },
  statusText: { color: C.muted, fontSize: 8, letterSpacing: 1 },
  hero: { paddingTop: 49, paddingBottom: 36 },
  eyebrow: { color: C.accent, fontSize: 9, letterSpacing: 2.2, fontWeight: "600" },
  heroTitle: { marginTop: 17, color: C.ink, fontSize: 42, lineHeight: 48, letterSpacing: -1.5, fontWeight: "400", maxWidth: 570 },
  heroCopy: { marginTop: 17, color: C.muted, fontSize: 14, lineHeight: 23, maxWidth: 440 },
  heroRule: { height: 1, backgroundColor: C.line, marginTop: 29, marginBottom: 13 },
  heroFoot: { color: C.muted, fontSize: 8, letterSpacing: 1.1 },
  scanCallout: { backgroundColor: "#EDE7DE", borderWidth: 1, borderColor: "#E5E0D7", padding: 20, marginBottom: 29 },
  scanEyebrow: { color: "#927B62", fontSize: 8, letterSpacing: 1.7, fontWeight: "600" },
  scanTitle: { color: "#24231F", fontSize: 24, marginTop: 11 },
  scanCopy: { color: "#77736C", fontSize: 11, lineHeight: 18, marginTop: 7 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 },
  sectionTitle: { color: C.ink, fontSize: 20, fontWeight: "500" },
  sectionKicker: { color: C.muted, fontSize: 9, letterSpacing: 1.4 },
  studioCard: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, padding: 21, marginBottom: 11, minHeight: 174 },
  cardMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardNumber: { color: C.accent, fontSize: 9, letterSpacing: 1.5, fontWeight: "600" },
  cardArrow: { color: C.accent, fontSize: 18 },
  cardTitle: { color: C.ink, fontSize: 25, letterSpacing: -0.5, marginTop: 21 },
  cardCopy: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 7, maxWidth: 420 },
  cardLink: { color: C.ink, fontSize: 9, letterSpacing: 1.4, fontWeight: "600", marginTop: 18 },
  principle: { backgroundColor: C.pale, padding: 20, marginTop: 24 },
  principleEyebrow: { color: C.accent, fontSize: 8, letterSpacing: 1.7, fontWeight: "600" },
  principleTitle: { color: C.ink, fontSize: 20, marginTop: 10 },
  principleCopy: { color: C.muted, fontSize: 11, lineHeight: 18, marginTop: 7 },
  footer: { color: C.muted, fontSize: 8, letterSpacing: 1.5, textAlign: "center", marginTop: 28 }
});