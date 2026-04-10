import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { User, Plus, ChevronLeft, ChevronRight } from "lucide-react-native";
import ConfirmationModal from "@/components/modals/confirmation";
import EditDoctorModal from "@/components/modals/editDocModal";
import DoctorCard, { Medecin } from "@/components/cards/doctorCards";
import { useFocusEffect } from "@react-navigation/native";

const PER_PAGE = 10;

export default function DoctorsScreen() {
  const [doctors, setDoctors] = useState<Medecin[]>([]);
  const [page, setPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Medecin | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const totalPages = Math.ceil(doctors.length / PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginated = doctors.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/medecins`,
      );
      const data = await response.json();
      setDoctors(data);
      setPage(1); 
    } catch (error) {
      console.log(error);
    }
  };

  const goPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
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
        { method: "DELETE" },
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

  // --- Édition ---
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
        },
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

  // useEffect(() => {
  //   fetchDoctors();
  // }, []);
useFocusEffect(
  useCallback(() => {
    fetchDoctors();
  }, [])
);
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

      {/* Title + badge */}
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>Prestations</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{doctors.length} Médecins</Text>
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={paginated}
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
        ListFooterComponent={
          totalPages > 1 ? (
            <View style={styles.paginationWrapper}>
              {/* Info texte */}
              <Text style={styles.pgInfo}>
                {(page - 1) * PER_PAGE + 1}–
                {Math.min(page * PER_PAGE, doctors.length)} sur {doctors.length}{" "}
                médecins
              </Text>

              {/* Contrôles */}
              <View style={styles.pagination}>
                {/* Précédent */}
                <TouchableOpacity
                  style={[styles.pgBtn, page === 1 && styles.pgBtnDisabled]}
                  onPress={() => goPage(page - 1)}
                  disabled={page === 1}
                  activeOpacity={0.7}
                >
                  <ChevronLeft
                    size={16}
                    color={page === 1 ? "#ced4da" : "#5e72e4"}
                  />
                  <Text
                    style={[
                      styles.pgBtnText,
                      page === 1 && styles.pgBtnTextDisabled,
                    ]}
                  >
                    Précédent
                  </Text>
                </TouchableOpacity>

                {/* Numéros */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.pgNumbers}
                >
                  {pageNumbers.map((n) => (
                    <TouchableOpacity
                      key={n}
                      style={[styles.pgNum, n === page && styles.pgNumActive]}
                      onPress={() => goPage(n)}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.pgNumText,
                          n === page && styles.pgNumTextActive,
                        ]}
                      >
                        {n}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Suivant */}
                <TouchableOpacity
                  style={[
                    styles.pgBtn,
                    page === totalPages && styles.pgBtnDisabled,
                  ]}
                  onPress={() => goPage(page + 1)}
                  disabled={page === totalPages}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.pgBtnText,
                      page === totalPages && styles.pgBtnTextDisabled,
                    ]}
                  >
                    Suivant
                  </Text>
                  <ChevronRight
                    size={16}
                    color={page === totalPages ? "#ced4da" : "#5e72e4"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        }
      />

      {/* Modals */}
      <ConfirmationModal
        visible={showDeleteModal}
        title="Supprimer le médecin"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedDoctor?.nom} ?`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
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
    marginTop: 15,
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
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },

  // Pagination
  paginationWrapper: { marginTop: 8, marginBottom: 24 },
  pgInfo: {
    textAlign: "center",
    fontSize: 12,
    color: "#adb5bd",
    marginBottom: 10,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  pgNumbers: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
  },

  pgBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#5e72e4",
    backgroundColor: "#fff",
  },
  pgBtnDisabled: { borderColor: "#dee2e6", backgroundColor: "#f8f9fa" },
  pgBtnText: { fontSize: 13, color: "#5e72e4", fontWeight: "500" },
  pgBtnTextDisabled: { color: "#ced4da" },

  pgNum: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#dee2e6",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  pgNumActive: { backgroundColor: "#5e72e4", borderColor: "#5e72e4" },
  pgNumText: { fontSize: 13, color: "#6c757d" },
  pgNumTextActive: { color: "#fff", fontWeight: "600" },
});
