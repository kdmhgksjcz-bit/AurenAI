import { Link } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const colors = {
  background: "#F6F3EE",
  surface: "#FFFEFC",
  ink: "#252522",
  muted: "#77736D",
  line: "#E6E0D7",
  accent: "#8A7660",
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.wordmark}>AUREN</Text>
          <Text style={styles.headerLabel}>PRIVATE BEAUTY STUDIO</Text>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>YOUR PERSONAL BEAUTY SPACE</Text>
          <Text style={styles.title}>A considered approach to your hair and skin.</Text>
          <Text style={styles.description}>
            Understand your needs, build a routine, and explore recommendations grounded in reliable evidence.
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Your studio</Text>
          <Text style={styles.sectionNote}>CHOOSE AN ANALYSIS</Text>
        </View>

        <Link href="/hair" asChild>
          <Pressable style={styles.analysisCard}>
            <View style={styles.cardTopline}>
              <Text style={styles.cardIndex}>01 / HAIR</Text>
              <Text style={styles.cardArrow}>↗</Text>
            </View>
            <Text style={styles.cardTitle}>Hair analysis</Text>
            <Text style={styles.cardDescription}>
              Explore your hair profile, styling options, care routine, and suitable products.
            </Text>
            <Text style={styles.cardAction}>EXPLORE HAIR <Text style={styles.inlineArrow}>→</Text></Text>
          </Pressable>
        </Link>

        <Link href="/skin" asChild>
          <Pressable style={styles.analysisCard}>
            <View style={styles.cardTopline}>
              <Text style={styles.cardIndex}>02 / SKIN</Text>
              <Text style={styles.cardArrow}>↗</Text>
            </View>
            <Text style={styles.cardTitle}>Skin analysis</Text>
            <Text style={styles.cardDescription}>
              Understand your skin preferences and create a practical, cosmetic skincare routine.
            </Text>
            <Text style={styles.cardAction}>EXPLORE SKIN <Text style={styles.inlineArrow}>→</Text></Text>
          </Pressable>
        </Link>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Knowledge before claims.</Text>
          <Text style={styles.footerText}>
            AUREN provides cosmetic guidance, not medical diagnosis. Recommendations should explain their evidence and limitations.
          </Text>
          <Text style={styles.footerBrand}>AUREN AI  ·  VERSION 0.1</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 24, paddingTop: 22, paddingBottom: 48 },
  header: { paddingBottom: 42, borderBottomWidth: 1, borderBottomColor: colors.line },
  wordmark: { color: colors.ink, fontSize: 25, letterSpacing: 7, fontWeight: "500" },
  headerLabel: { marginTop: 7, color: colors.muted, fontSize: 9, letterSpacing: 2.2 },
  intro: { paddingTop: 42, paddingBottom: 38 },
  eyebrow: { color: colors.accent, fontSize: 9, letterSpacing: 2, fontWeight: "600" },
  title: { marginTop: 16, color: colors.ink, fontSize: 37, lineHeight: 43, letterSpacing: -1.1, fontWeight: "400" },
  description: { marginTop: 16, color: colors.muted, fontSize: 14, lineHeight: 22, maxWidth: 330 },
  sectionHeading: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { color: colors.ink, fontSize: 20, fontWeight: "500" },
  sectionNote: { color: colors.muted, fontSize: 8, letterSpacing: 1.5 },
  analysisCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: 22, marginBottom: 13, minHeight: 190 },
  cardTopline: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardIndex: { color: colors.accent, fontSize: 9, letterSpacing: 1.6, fontWeight: "600" },
  cardArrow: { color: colors.accent, fontSize: 19 },
  cardTitle: { marginTop: 23, color: colors.ink, fontSize: 25, fontWeight: "400", letterSpacing: -0.4 },
  cardDescription: { marginTop: 8, color: colors.muted, fontSize: 12, lineHeight: 19, maxWidth: 290 },
  cardAction: { marginTop: 18, color: colors.ink, fontSize: 9, letterSpacing: 1.5, fontWeight: "600" },
  inlineArrow: { color: colors.accent, fontSize: 13 },
  footer: { marginTop: 34, paddingTop: 23, borderTopWidth: 1, borderTopColor: colors.line },
  footerTitle: { color: colors.ink, fontSize: 16, fontWeight: "500" },
  footerText: { marginTop: 8, color: colors.muted, fontSize: 11, lineHeight: 18 },
  footerBrand: { marginTop: 24, color: colors.muted, fontSize: 8, letterSpacing: 1.6 },
});
