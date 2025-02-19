import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const profile = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.profileImage} />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userDetails}>Age: 45 | Type 2 Diabetes</Text>
      </View>

      {/* Health Goals */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Health Goals</Text>
        <Text style={styles.goalItem}>✅ Maintain Blood Sugar Levels</Text>
        <Text style={styles.goalItem}>✅ Weight Management</Text>
        <Text style={styles.goalItem}>✅ Avoid High Glycemic Foods</Text>
      </View>

      {/* Nutrition Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Nutrition Summary</Text>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionItem}>Calories: 1800 kcal</Text>
          <Text style={styles.nutritionItem}>Carbs: 120g</Text>
          <Text style={styles.nutritionItem}>Protein: 90g</Text>
          <Text style={styles.nutritionItem}>Fat: 50g</Text>
        </View>
      </View>

      {/* Meal History */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Meal History</Text>
        <Text style={styles.mealItem}>🍲 Breakfast: Oats & Nuts</Text>
        <Text style={styles.mealItem}>🥗 Lunch: Grilled Chicken Salad</Text>
        <Text style={styles.mealItem}>🍎 Snack: Apple & Almonds</Text>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProfile")}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },
  profileHeader: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  userName: { fontSize: 20, fontWeight: "bold" },
  userDetails: { fontSize: 14, color: "gray" },

  card: { backgroundColor: "white", padding: 16, borderRadius: 10, marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  goalItem: { fontSize: 14, color: "#007bff", marginBottom: 5 },

  nutritionRow: { flexDirection: "column", marginTop: 5 },
  nutritionItem: { fontSize: 14, marginBottom: 5, fontWeight: "bold" },

  mealItem: { fontSize: 14, marginBottom: 5 },

  editButton: { backgroundColor: "#50C878", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  editButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default profile;
