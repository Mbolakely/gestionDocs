import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { PlusSquare } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.4)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  const router = useRouter();

  const navigate = () => {
    router.navigate("/(auth)/login");
  };
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(ringScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Logo pop in
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Text slide up
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslate, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Subtitle fade
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.ring,
            { opacity: ringOpacity, transform: [{ scale: ringScale }] },
          ]}
        />

        <Animated.View
          style={[
            styles.logoWrapper,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <View style={styles.logoCircle}>
            <PlusSquare color="#1d6cf0" size={48} fill="#dbeafe" />
          </View>
        </Animated.View>

        <Animated.Text
          style={[
            styles.appName,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslate }],
            },
          ]}
        >
          Medical{"\n"}Management{"\n"}App
        </Animated.Text>

        <Animated.View style={[styles.divider, { opacity: subtitleOpacity }]}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
        </Animated.View>

        <TouchableOpacity onPress={navigate} activeOpacity={0.7}>
          <Animated.Text style={[styles.welcome, { opacity: subtitleOpacity }]}>
            Continuer
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8faff",
  },
  bgCircleTop: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#dbeafe",
    opacity: 0.4,
    top: -80,
    right: -80,
  },
  bgCircleBottom: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#bfdbfe",
    opacity: 0.3,
    bottom: -60,
    left: -60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  ring: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: "#93c5fd",
    opacity: 0.6,
  },
  logoWrapper: {
    marginBottom: 36,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1d6cf0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  welcome: {
    fontSize: 15,
    color: "#1d6cf0",
    fontWeight: "600",
    marginTop: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  dividerLine: {
    width: 40,
    height: 1,
    backgroundColor: "#cbd5e1",
  },
  dividerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#1d6cf0",
    opacity: 0.5,
  },
});
