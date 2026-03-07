import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Mail, Lock, Eye, LogIn, PlusSquare } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  const handleLogin = () => {
    router.push("/(tabs)");
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.miniLogoIcon}>
              <PlusSquare color="#1d6cf0" size={20} />
            </View>
            <Text style={styles.headerTitle}>Medical Management</Text>
          </View>

          {/* Logo Central */}
          <View style={styles.logoContainer}>
            <View style={styles.mainLogoCircle}>
              <PlusSquare color="#1d6cf0" size={40} fill="#f0f6ff" />
            </View>
            <Text style={styles.welcomeText}>Bon Retour !</Text>
            <Text style={styles.subText}>
              Gérer vos prestations et frais efficacement.
            </Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            <Text style={styles.label}>Adresse email</Text>
            <View style={styles.inputContainer}>
              <Mail color="#94a3b8" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="docteur@hospital.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputContainer}>
              <Lock color="#94a3b8" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Votre mot de passe"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Eye color="#94a3b8" size={20} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Mot de passe oublié?</Text>
            </TouchableOpacity>

            {/* Bouton Sign In */}
            <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
              <Text style={styles.signInText}>Se connecter</Text>
              <LogIn color="#fff" size={20} style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <Text style={styles.footerText}>Pas encore de compte ?</Text>

            {/* Bouton Create Account */}
            <TouchableOpacity
              style={styles.createAccountButton}
              onPress={handleRegister}
            >
              <Text style={styles.createAccountText}>Créer compte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginTop: 10,
  },
  miniLogoIcon: {
    backgroundColor: "#f0f6ff",
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  mainLogoCircle: {
    backgroundColor: "#f0f6ff",
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  welcomeText: { fontSize: 26, fontWeight: "800", color: "#1e293b" },
  subText: { color: "#64748b", textAlign: "center", marginTop: 8 },
  form: { width: "100%", paddingHorizontal: 25, marginTop: 15 },
  label: {
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: "#1e293b" },
  forgotPassword: {
    color: "#1d6cf0",
    textAlign: "right",
    marginTop: 12,
    fontWeight: "600",
  },
  signInButton: {
    backgroundColor: "#1d6cf0",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 30,
    marginTop: 30,
    elevation: 4,
    shadowColor: "#1d6cf0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  signInText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  footerText: { textAlign: "center", color: "#64748b", marginTop: 40 },
  createAccountButton: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#f8fafc",
  },
  createAccountText: { color: "#1d6cf0", fontWeight: "700" },
});
