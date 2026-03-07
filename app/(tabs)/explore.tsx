import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from "react-native";
import { ChevronLeft, User, Calendar, DollarSign, Save } from "lucide-react-native";

type FormType = {
  nom: string;
  nb_jours: string;
  taux_journalier: string;
};

export default function AddDoctorScreen() {

  const [form, setForm] = useState<FormType>({
    nom: "",
    nb_jours: "",
    taux_journalier: ""
  });


  const totalPrestation =
    Number(form.nb_jours) * Number(form.taux_journalier) || 0;

  const handleSave = async () => {

    if (!form.nom || !form.nb_jours || !form.taux_journalier) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const newDoctor = {
      nom: form.nom,
      nb_jours: parseInt(form.nb_jours),
      taux_journalier: parseFloat(form.taux_journalier)
    };

    try {

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/medecins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newDoctor)
      });

      const data = await response.json();

      Alert.alert("Success", "Doctor added successfully");

      setForm({
        nom: "",
        nb_jours: "",
        taux_journalier: ""
      });

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Ajout Médecin</Text>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <User size={40} color="#1d6cf0" />
            </View>

            <Text style={styles.avatarText}>Informations du Médecin</Text>
          </View>

          {/* FORM */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOM COMPLET</Text>

            <View style={styles.inputWrapper}>
              <User size={20} color="#adb5bd" style={styles.inputIcon} />

              <TextInput
                style={styles.input}
                placeholder="Dr. Gregory House"
                value={form.nom}
                onChangeText={(val) =>
                  setForm({ ...form, nom: val })
                }
              />
            </View>
          </View>

          <View style={styles.row}>

            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>JOURS</Text>

              <View style={styles.inputWrapper}>
                <Calendar size={20} color="#adb5bd" style={styles.inputIcon} />

                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={form.nb_jours}
                  onChangeText={(val) =>
                    setForm({ ...form, nb_jours: val })
                  }
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>TAUX JOURNALIER</Text>

              <View style={styles.inputWrapper}>
                <DollarSign size={20} color="#adb5bd" style={styles.inputIcon} />

                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={form.taux_journalier}
                  onChangeText={(val) =>
                    setForm({ ...form, taux_journalier: val })
                  }
                />
              </View>
            </View>

          </View>

          {/* PRESTATION */}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>
              PRESTATION ESTIMEE
            </Text>

            <Text style={styles.summaryAmount}>
              {totalPrestation.toLocaleString()}Ar
            </Text>
          </View>

          {/* BUTTON */}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSave}
          >
            <Save size={20} color="#fff" />

            <Text style={styles.submitButtonText}>
              Sauvegarder
            </Text>
          </TouchableOpacity>

        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    marginTop: 10,
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a2b4b' },
  scrollContent: { padding: 25 },
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatarCircle: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#eef3ff', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 10
  },
  avatarText: { fontSize: 14, color: '#adb5bd', fontWeight: '600' },
  form: { marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '700', color: '#7c8db5', marginBottom: 8, marginLeft: 5 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#f0f2f5',
    height: 55,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#1a2b4b', fontSize: 15, fontWeight: '500' },
  row: { flexDirection: 'row' },
  summaryCard: {
    backgroundColor: '#5e72e4',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  summaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '700' },
  summaryAmount: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 5 },
  submitButton: {
    backgroundColor: '#1d6cf0',
    flexDirection: 'row',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1d6cf0',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 }
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 10 }
});

