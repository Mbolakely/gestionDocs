import { Pencil, Stethoscope, Trash2 } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export type Medecin = {
  numed: number;
  nom: string;
  nb_jours: number;
  taux_journalier: number;
};

export type DoctorCardProps = {
  item: Medecin;
  onEdit?: (item: Medecin) => void;
  onDelete?: (item: Medecin) => void;
};

const DoctorCard: React.FC<DoctorCardProps> = ({ item, onEdit, onDelete }) => {
  const prestation = item.nb_jours * item.taux_journalier;

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Stethoscope size={24} color="#5e72e4" />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.doctorName}>{item.nom}</Text>
        <Text style={styles.specialtyText}>
          {item.nb_jours} Jours • {item.taux_journalier}Ar/jour
        </Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.amountText}>${prestation}</Text>
        <Text style={styles.prestationLabel}>PRESTATION</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => onEdit?.(item)}>
          <Pencil size={18} color="#adb5bd" style={styles.actionIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete?.(item)}>
          <Trash2 size={18} color="#f5365c" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DoctorCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: "#f0f4ff",
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  infoContainer: { flex: 1 },
  doctorName: { fontSize: 15, fontWeight: "bold", color: "#001d3d" },
  specialtyText: { fontSize: 12, color: "#adb5bd", marginTop: 2 },
  priceContainer: { alignItems: "flex-end", marginRight: 15 },
  amountText: { fontSize: 15, fontWeight: "bold", color: "#5e72e4" },
  prestationLabel: { fontSize: 9, color: "#adb5bd", fontWeight: "700" },
  actionsContainer: { justifyContent: "space-between", height: 45 },
  actionIcon: { marginBottom: 10 },
});