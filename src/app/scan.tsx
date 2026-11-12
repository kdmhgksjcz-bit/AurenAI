import { useRef, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions, type CameraView as CameraViewType } from "expo-camera";
import { ActivityIndicator, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const API_BASE_URL = Platform.OS === "web" ? (process.env.EXPO_PUBLIC_API_BASE_URL || "") : (process.env.EXPO_PUBLIC_API_BASE_URL || "https://aurenai-v7vsmszwby-4291.vercel.app").replace(/\/$/, "");
const C = { bg: "#F5F2EC", paper: "#FCFBF8", ink: "#24231F", muted: "#77736C", line: "#E5E0D7", accent: "#927B62", pale: "#EDE7DE", white: "#FFFFFF" };
type ScanKind = "hair" | "skin";
type Analysis = { title?: string; overview?: string; observations?: string[]; recommendations?: string[]; limitations?: string[]; confidence?: string };

export default function ScanScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  const camera = useRef<CameraViewType>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [kind, setKind] = useState<ScanKind>(() => params.type === "skin" ? "skin" : "hair");
  const [facing, setFacing] = useState<"front" | "back">("front");
  const [ready, setReady] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState("");

  const reset = () => { setImage(null); setAnalysis(null); setError(""); setReady(false); setConsented(false); };

  const capture = async () => {
    if (!camera.current || !ready || loading) return;
    try {
      setError("");
      const photo = await camera.current.takePictureAsync({ quality: 0.5, base64: true, exif: false });
      if (!photo?.base64) throw new Error("The camera did not return an image. Please try again.");
      setConsented(false);
      setImage(`data:image/jpeg;base64,${photo.base64}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not capture the image.");
    }
  };

  const runAnalysis = async () => {
    if (!image || loading || !consented) return;
    setLoading(true); setError(""); setAnalysis(null);
    try {
      if (image.length > 3_800_000) throw new Error("This photo is too large to send. Please retake it and try again.");
      const response = await fetch(API_BASE_URL + "/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kind, image }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "The analysis could not be completed (HTTP " + response.status + ").");
      if (!payload.analysis || typeof payload.analysis !== "object") throw new Error("The AI service returned an unexpected response. Please try again.");
      setAnalysis(payload.analysis as Analysis);
      setImage(null);
      setConsented(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!permission) return <SafeAreaView style={styles.safe}><View style={styles.center}><ActivityIndicator color={C.accent} /><Text style={styles.body}>Checking camera access…</Text></View></SafeAreaView>;

  if (!permission.granted) return <SafeAreaView style={styles.safe}><View style={styles.page}>
    <Link href="/" style={styles.back}>←  BACK TO STUDIO</Link>
    <Text style={styles.eyebrow}>AUREN / AI SCAN</Text>
    <Text style={styles.title}>A clearer starting point.</Text>
    <Text style={styles.body}>Allow camera access to take a single photo for your hair or skin guide. AUREN does not save the photo to a profile.</Text>
    <Pressable onPress={requestPermission} style={styles.primary}><Text style={styles.primaryText}>ALLOW CAMERA ACCESS →</Text></Pressable>
  </View></SafeAreaView>;

  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Link href="/" style={styles.back}>←  BACK TO STUDIO</Link>
      <Text style={styles.eyebrow}>AUREN / VISUAL ANALYSIS</Text>
      <Text style={styles.title}>See the details.</Text>
      <Text style={styles.intro}>A guided photo assessment, followed by an AI-generated cosmetic care guide.</Text>

      <View style={styles.tabs}>
        <Pressable onPress={() => { setKind("hair"); reset(); }} style={[styles.tab, kind === "hair" && styles.tabActive]}><Text style={[styles.tabText, kind === "hair" && styles.tabTextActive]}>HAIR</Text></Pressable>
        <Pressable onPress={() => { setKind("skin"); reset(); }} style={[styles.tab, kind === "skin" && styles.tabActive]}><Text style={[styles.tabText, kind === "skin" && styles.tabTextActive]}>SKIN</Text></Pressable>
      </View>

      {!analysis ? <>
        <View style={styles.guide}>
          <Text style={styles.guideTitle}>{kind === "hair" ? "Frame your hair" : "Frame one skin area"}</Text>
          <Text style={styles.guideCopy}>{kind === "hair" ? "Use soft daylight. Keep your hair visible from the front and avoid strong filters or styling effects." : "Use soft daylight and frame a small area such as your cheek or forehead. Avoid filters, makeup and harsh flash."}</Text>
        </View>

        <View style={styles.cameraFrame}>
          {image ? <Image source={{ uri: image }} style={styles.preview} resizeMode="cover" /> :
            <CameraView ref={camera} style={styles.camera} facing={facing} onCameraReady={() => setReady(true)} onMountError={(e) => setError(e.message)} />}
          {!image && <View pointerEvents="none" style={styles.frameOverlay}><View style={styles.cornerTL}/><View style={styles.cornerTR}/><View style={styles.cornerBL}/><View style={styles.cornerBR}/></View>}
        </View>
        {image ? <Pressable onPress={() => setConsented(value => !value)} accessibilityRole="checkbox" accessibilityState={{ checked: consented }} style={styles.consentRow}>
          <View style={[styles.consentBox, consented && styles.consentBoxChecked]}>{consented ? <Text style={styles.consentCheck}>✓</Text> : null}</View>
          <Text style={styles.consentText}>I agree to send this photo to the AI service for visual analysis. I understand the provider processes it under its own privacy terms.</Text>
        </Pressable> : null}
        <View style={styles.cameraActions}>
          {!image ? <>
            <Pressable onPress={() => { setFacing(v => v === "front" ? "back" : "front"); setReady(false); }} style={styles.flip}><Text style={styles.flipText}>FLIP CAMERA</Text></Pressable>
            <Pressable onPress={capture} disabled={!ready} style={[styles.shutter, !ready && { opacity: 0.4 }]}><View style={styles.shutterInner}/></Pressable>
            <View style={{ width: 92 }} />
          </> : <>
            <Pressable onPress={reset} style={styles.flip}><Text style={styles.flipText}>RETAKE</Text></Pressable>
            <Pressable onPress={runAnalysis} disabled={loading || !consented} style={[styles.primary, styles.analyseButton, (!consented || loading) && { opacity: 0.45 }]}>{loading ? <ActivityIndicator color={C.white}/> : <Text style={styles.primaryText}>ANALYSE PHOTO →</Text>}</Pressable>
          </>}
        </View>
        {loading && <View style={styles.loading}><ActivityIndicator color={C.accent}/><Text style={styles.loadingText}>Reviewing visible details…</Text><Text style={styles.small}>This can take a few moments.</Text></View>}
      </> : <>
        <View style={styles.resultHero}>
          <Text style={styles.resultLabel}>YOUR AI GUIDE</Text>
          <Text style={styles.resultTitle}>{analysis.title || (kind === "hair" ? "Your hair overview" : "Your skin overview")}</Text>
          <Text style={styles.resultOverview}>{analysis.overview || "A visual starting point based on the photo you provided."}</Text>
          {analysis.confidence ? <Text style={styles.confidence}>VISUAL CONFIDENCE · {analysis.confidence.toUpperCase()}</Text> : null}
        </View>
        <Text style={styles.sectionTitle}>What the image suggests</Text>
        {(analysis.observations || []).map((item, i) => <View key={i} style={styles.resultRow}><Text style={styles.resultIndex}>0{i + 1}</Text><Text style={styles.resultText}>{item}</Text></View>)}
        <Text style={styles.sectionTitle}>Practical next steps</Text>
        {(analysis.recommendations || []).map((item, i) => <View key={i} style={styles.resultRow}><Text style={styles.resultIndex}>0{i + 1}</Text><Text style={styles.resultText}>{item}</Text></View>)}
        {(analysis.limitations || []).length > 0 && <View style={styles.note}><Text style={styles.noteTitle}>What this scan cannot tell you</Text>{analysis.limitations?.map((item, i) => <Text key={i} style={styles.noteText}>•  {item}</Text>)}</View>}
        <Pressable onPress={reset} style={styles.secondary}><Text style={styles.secondaryText}>START A NEW SCAN</Text></Pressable>
      </>}

      {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}
      <View style={styles.privacy}>
        <Text style={styles.privacyTitle}>Your image, your choice</Text>
        <Text style={styles.privacyText}>The photo is sent through Vercel AI Gateway to the model provider for this request. AUREN does not add it to an account profile or your photo library. Your device may temporarily cache the camera capture; provider handling follows its privacy terms. Only scan your own image. You can cancel before sending.</Text>
      </View>
      <Text style={styles.footer}>COSMETIC GUIDANCE ONLY · NOT A MEDICAL ASSESSMENT</Text>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  page: { paddingHorizontal: 22, paddingTop: 15, paddingBottom: 46, maxWidth: 720, width: "100%", alignSelf: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12, backgroundColor: C.bg },
  back: { color: C.muted, fontSize: 9, letterSpacing: 1.4, marginBottom: 29 },
  eyebrow: { color: C.accent, fontSize: 9, letterSpacing: 2, fontWeight: "600" },
  title: { color: C.ink, fontSize: 37, lineHeight: 43, letterSpacing: -1.2, marginTop: 13 },
  intro: { color: C.muted, fontSize: 13, lineHeight: 21, marginTop: 10, marginBottom: 20 },
  body: { color: C.muted, fontSize: 13, lineHeight: 21, marginTop: 13 },
  tabs: { flexDirection: "row", backgroundColor: C.pale, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line },
  tabText: { color: C.muted, fontSize: 9, letterSpacing: 1.5, fontWeight: "600" },
  tabTextActive: { color: C.ink },
  guide: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, padding: 15, marginBottom: 12 },
  guideTitle: { color: C.ink, fontSize: 15 },
  guideCopy: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 5 },
  cameraFrame: { height: 390, backgroundColor: "#24231F", overflow: "hidden", position: "relative", justifyContent: "center" },
  camera: { flex: 1 },
  preview: { width: "100%", height: "100%" },
  frameOverlay: { ...StyleSheet.absoluteFillObject, margin: 22 },
  cornerTL: { position: "absolute", top: 0, left: 0, width: 32, height: 32, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#F5F2EC" },
  cornerTR: { position: "absolute", top: 0, right: 0, width: 32, height: 32, borderTopWidth: 2, borderRightWidth: 2, borderColor: "#F5F2EC" },
  cornerBL: { position: "absolute", bottom: 0, left: 0, width: 32, height: 32, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: "#F5F2EC" },
  cornerBR: { position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#F5F2EC" },
  consentRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, marginTop: 12 },
  consentBox: { width: 19, height: 19, borderWidth: 1, borderColor: C.accent, alignItems: "center", justifyContent: "center", marginTop: 1 },
  consentBoxChecked: { backgroundColor: C.ink, borderColor: C.ink },
  consentCheck: { color: C.white, fontSize: 12 },
  consentText: { flex: 1, color: C.muted, fontSize: 10, lineHeight: 16 },
  cameraActions: { minHeight: 84, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  flip: { width: 92, paddingVertical: 12, alignItems: "center" },
  flipText: { color: C.muted, fontSize: 8, letterSpacing: 1.2, fontWeight: "600" },
  shutter: { width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: C.ink, alignItems: "center", justifyContent: "center" },
  shutterInner: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.ink },
  primary: { backgroundColor: C.ink, paddingVertical: 16, paddingHorizontal: 20, alignItems: "center", marginTop: 18 },
  primaryText: { color: C.white, fontSize: 9, letterSpacing: 1.4, fontWeight: "600" },
  analyseButton: { flex: 1, marginTop: 0 },
  loading: { backgroundColor: C.pale, padding: 18, alignItems: "center", gap: 8 },
  loadingText: { color: C.ink, fontSize: 13 },
  small: { color: C.muted, fontSize: 10 },
  resultHero: { backgroundColor: C.pale, padding: 20, marginTop: 5, marginBottom: 24 },
  resultLabel: { color: C.accent, fontSize: 8, letterSpacing: 1.7, fontWeight: "600" },
  resultTitle: { color: C.ink, fontSize: 25, lineHeight: 31, marginTop: 10 },
  resultOverview: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 9 },
  confidence: { color: C.accent, fontSize: 8, letterSpacing: 1.2, marginTop: 14 },
  sectionTitle: { color: C.ink, fontSize: 19, marginBottom: 8, marginTop: 7 },
  resultRow: { flexDirection: "row", gap: 13, borderBottomWidth: 1, borderBottomColor: C.line, paddingVertical: 13 },
  resultIndex: { color: C.accent, fontSize: 9, paddingTop: 2 },
  resultText: { color: C.muted, fontSize: 11, lineHeight: 18, flex: 1 },
  note: { backgroundColor: C.pale, padding: 16, marginTop: 17 },
  noteTitle: { color: C.ink, fontSize: 13, fontWeight: "600", marginBottom: 7 },
  noteText: { color: C.muted, fontSize: 10, lineHeight: 17, marginTop: 4 },
  secondary: { borderWidth: 1, borderColor: C.line, padding: 15, alignItems: "center", marginTop: 20 },
  secondaryText: { color: C.ink, fontSize: 9, letterSpacing: 1.3, fontWeight: "600" },
  privacy: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, padding: 15, marginTop: 20 },
  privacyTitle: { color: C.ink, fontSize: 12, fontWeight: "600" },
  privacyText: { color: C.muted, fontSize: 10, lineHeight: 16, marginTop: 6 },
  error: { backgroundColor: "#F1E4E0", padding: 13, marginTop: 13 },
  errorText: { color: "#7D3C31", fontSize: 11, lineHeight: 17 },
  footer: { color: C.muted, fontSize: 8, letterSpacing: 1.1, textAlign: "center", marginTop: 25 }
});