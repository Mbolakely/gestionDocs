import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stethoscope, X } from "lucide-react-native";
import { Medecin } from "@/components/cards/doctorCards";

export type EditDoctorModalProps = {
  visible: boolean;
  doctor: Medecin | null;
  onConfirm: (updated: Medecin) => void;
  onCancel: () => void;
};

const EditDoctorModal: React.FC<EditDoctorModalProps> = ({
  visible,
  doctor,
  onConfirm,
  onCancel,
}) => {
  const [nom, setNom] = useState("");
  const [nbJours, setNbJours] = useState("");
  const [tauxJournalier, setTauxJournalier] = useState("");

  // Sync fields quand le médecin change
  useEffect(() => {
    if (doctor) {
      setNom(doctor.nom);
      setNbJours(doctor.nb_jours.toString());
      setTauxJournalier(doctor.taux_journalier.toString());
    }
  }, [doctor]);

  const handleConfirm = () => {
    if (!doctor) return;
    onConfirm({
      ...doctor,
      nom: nom.trim(),
      nb_jours: parseInt(nbJours) || 0,
      taux_journalier: parseFloat(tauxJournalier) || 0,
    });
  };

  const isValid =
    nom.trim().length > 0 &&
    parseInt(nbJours) > 0 &&
    parseFloat(tauxJournalier) > 0;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modal}>

          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.iconContainer}>
              <Stethoscope size={20} color="#5e72e4" />
            </View>
            <Text style={styles.title}>Modifier le médecin</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <X size={20} color="#adb5bd" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {doctor?.nom}
          </Text>

          {/* Champs */}
          <View style={styles.fields}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                value={nom}
                onChangeText={setNom}
                placeholder="Nom du médecin"
                placeholderTextColor="#c5cfe0"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.fieldHalf]}>
                <Text style={styles.label}>Nb. jours</Text>
                <TextInput
                  style={styles.input}
                  value={nbJours}
                  onChangeText={setNbJours}
                  placeholder="0"
                  placeholderTextColor="#c5cfe0"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.fieldGroup, styles.fieldHalf]}>
                <Text style={styles.label}>Taux / jour (Ar)</Text>
                <TextInput
                  style={styles.input}
                  value={tauxJournalier}
                  onChangeText={setTauxJournalier}
                  placeholder="0.00"
                  placeholderTextColor="#c5cfe0"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Aperçu prestation */}
            {isValid && (
              <View style={styles.preview}>
                <Text style={styles.previewLabel}>Prestation estimée</Text>
                <Text style={styles.previewAmount}>
                  {(parseInt(nbJours) * parseFloat(tauxJournalier)).toLocaleString()}Ar
                </Text>
              </View>
            )}
          </View>

          {/* Boutons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm, !isValid && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, styles.buttonTextCancel]}>
                Annuler
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditDoctorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(26, 43, 75, 0.45)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  iconContainer: {
    backgroundColor: "#eef3ff",
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#1a2b4b",
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#adb5bd",
    marginBottom: 24,
    marginLeft: 2,
  },
  fields: {
    gap: 16,
    marginBottom: 28,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldHalf: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7c8db5",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#f5f7ff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1a2b4b",
    borderWidth: 1,
    borderColor: "#e2e8ff",
  },
  preview: {
    backgroundColor: "#eef3ff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d0daff",
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7c8db5",
    textTransform: "uppercase",
  },
  previewAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#5e72e4",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonConfirm: {
    backgroundColor: "#5e72e4",
  },
  buttonDisabled: {
    backgroundColor: "#c5cfe0",
  },
  buttonCancel: {
    backgroundColor: "#eef3ff",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  buttonTextCancel: {
    color: "#5e72e4",
  },
});