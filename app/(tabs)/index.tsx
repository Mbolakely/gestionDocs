import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from "react-native";
import { ChevronLeft, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

type Medecin = {
  numed: number;
  nom: string;
  nb_jours: number;
  taux_journalier: number;
};

type Stats = {
  total: number;
  min: number;
  max: number;
};

const CHART_MAX_HEIGHT = 140;

export default function DashboardScreen() {

  const [doctors, setDoctors] = useState<Medecin[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, min: 0, max: 0 });

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/medecins`);
      const data = await res.json();
      setDoctors(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchStats();
  }, []);

  // Normalisation sur la plus grande des 3 valeurs
  const chartMax = Math.max(stats.total, stats.min, stats.max, 1);

  const getBarHeight = (value: number) =>
    Math.max((value / chartMax) * CHART_MAX_HEIGHT, value > 0 ? 6 : 0);

  const formatAmount = (v: number) =>
    v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`;

  const bars = [
    { label: "TOTAL", value: stats.total, color: "#d6e4ff", accent: "#5e72e4" },
    { label: "MIN",   value: stats.min,   color: "#fde8ec", accent: "#f5365c" },
    { label: "MAX",   value: stats.max,   color: "#d1f7e8", accent: "#2dce89" },
  ];

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <ChevronLeft size={24} color="#000" />
        <Text style={styles.headerTitle}>Statistiques</Text>
        <Calendar size={24} color="#000" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* TOTAL */}
        <View style={styles.mainKpiCard}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>PRESTATION TOTALE</Text>
            <View style={styles.trendBadgePositive}>
              <ArrowUpRight size={14} color="#2dce89" />
              <Text style={styles.trendTextPositive}>Live</Text>
            </View>
          </View>
          <Text style={styles.mainAmount}>{stats.total.toLocaleString()}Ar</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: "70%" }]} />
          </View>
        </View>

        {/* MIN / MAX */}
        <View style={styles.row}>
          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>MIN </Text>
            <Text style={styles.smallAmount}>{stats.min.toLocaleString()}Ar</Text>
            <View style={styles.trendRow}>
              <ArrowDownRight size={14} color="#f5365c" />
              <Text style={styles.trendTextNegative}>minimum</Text>
            </View>
          </View>

          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>MAX</Text>
            <Text style={styles.smallAmount}>{stats.max.toLocaleString()}Ar</Text>
            <View style={styles.trendRow}>
              <ArrowUpRight size={14} color="#2dce89" />
              <Text style={styles.trendTextPositive}>Maximum</Text>
            </View>
          </View>
        </View>

        {/* CHART */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Diagrammes des statistiques</Text>
            <Text style={styles.sectionSubtitle}>Répartition de prestations</Text>
          </View>
          <Text style={styles.detailsLink}>{doctors.length} Docs</Text>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {bars.map((bar) => (
              <View key={bar.label} style={styles.barGroup}>
                <Text style={[styles.barValue, { color: bar.accent }]}>
                  {formatAmount(bar.value)}
                </Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: getBarHeight(bar.value),
                      backgroundColor: bar.color,
                      borderTopColor: bar.accent,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{bar.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.legend}>
            {bars.map((bar) => (
              <View key={bar.label} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: bar.accent }]} />
                <Text style={styles.legendText}>{bar.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
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
  scrollContent: { padding: 20 },

  mainKpiCard: {
    backgroundColor: '#eef3ff',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: '#d0daff',
    marginBottom: 20
  },
  kpiHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  kpiLabel: { color: '#7c8db5', fontWeight: '600', fontSize: 13 },
  mainAmount: { fontSize: 32, fontWeight: '800', color: '#1a2b4b', marginBottom: 15 },
  trendBadgePositive: {
    flexDirection: 'row',
    backgroundColor: '#d1f7e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: 'center'
  },
  trendTextPositive: { color: '#2dce89', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  progressBarBg: { height: 6, backgroundColor: '#d0daff', borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: '#2b63f1', borderRadius: 3 },

  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  smallCard: {
    backgroundColor: '#fff',
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0f2f5',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  smallLabel: { color: '#adb5bd', fontSize: 11, fontWeight: '700', marginBottom: 8 },
  smallAmount: { fontSize: 22, fontWeight: '700', color: '#1a2b4b' },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  trendTextNegative: { color: '#f5365c', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 15
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1a2b4b' },
  sectionSubtitle: { color: '#adb5bd', fontSize: 13 },
  detailsLink: { color: '#5e72e4', fontWeight: 'bold' },

  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: CHART_MAX_HEIGHT + 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
    paddingBottom: 10,
  },
  barGroup: { alignItems: 'center', justifyContent: 'flex-end' },
  barValue: { fontSize: 12, fontWeight: '800', marginBottom: 6 },
  bar: { width: 65, borderRadius: 8, borderTopWidth: 4 },
  barLabel: { fontSize: 10, color: '#adb5bd', fontWeight: '700', marginTop: 10 },

  legend: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  legendText: { color: '#7c8db5', fontSize: 12, fontWeight: '600' },
});