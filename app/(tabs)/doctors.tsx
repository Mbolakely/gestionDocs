import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { User, Plus } from "lucide-react-native";
import ConfirmationModal from "@/components/modals/confirmation";
import EditDoctorModal from "@/components/modals/editDocModal";
import DoctorCard, { Medecin } from "@/components/cards/doctorCards";

export default function DoctorsScreen() {
  const [doctors, setDoctors] = useState<Medecin[]>([]);

  const [selectedDoctor, setSelectedDoctor] = useState<Medecin | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/medecins`
      );
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.log(error);
    }
  };

  // --- Suppression ---
  const openDeleteModal = (doctor: Medecin) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedDoctor) {
      setShowDeleteModal(false);
      return;
    }
    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/medecins/${selectedDoctor.numed}`,
        { method: "DELETE" }
      );
      setShowDeleteModal(false);
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (error) {
      console.log(error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedDoctor(null);
  };

  // --- Edition ---
  const openEditModal = (doctor: Medecin) => {
    setSelectedDoctor(doctor);
    setShowEditModal(true);
  };

  const confirmEdit = async (updated: Medecin) => {
    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/medecins/${updated.numed}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );
      setShowEditModal(false);
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setSelectedDoctor(null);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.logoContainer}>
            <Plus size={20} color="#5e72e4" />
          </View>
          <Text style={styles.headerTitle}>Medical Management</Text>
        </View>
        <User size={28} color="#000" />
      </View>

      {/* Title */}
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>Prestations</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{doctors.length} Médecins</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.numed.toString()}
        renderItem={({ item }) => (
          <DoctorCard
            item={item}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal suppression */}
      <ConfirmationModal
        visible={showDeleteModal}
        title="Supprimer le médecin"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedDoctor?.nom} ?`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Modal édition */}
      <EditDoctorModal
        visible={showEditModal}
        doctor={selectedDoctor}
        onConfirm={confirmEdit}
        onCancel={cancelEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8faff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerTitleRow: { flexDirection: "row", alignItems: "center" },
  logoContainer: {
    backgroundColor: "#e2e8ff",
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#001d3d" },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#001d3d" },
  badge: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: "#6c757d", fontSize: 12, fontWeight: "600" },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
});