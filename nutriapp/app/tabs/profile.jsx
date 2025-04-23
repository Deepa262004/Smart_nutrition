import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculatedData, setCalculatedData] = useState({});

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userProfile");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
          calculateNutrition(parsedData);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const calculateNutrition = (data) => {
    if (!data || !data.height || !data.weight || !data.age || !data.gender) return;

    const { height, weight, age, gender, activityLevel } = data;

    let BMR = gender === "male"
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725
    };

    const TDEE = BMR * (activityMultiplier[activityLevel] || 1.2);
    const carbs = (TDEE * 0.5) / 4;
    const protein = (TDEE * 0.3) / 4;
    const fat = (TDEE * 0.2) / 9;

    setCalculatedData({
      calories: Math.round(TDEE),
      carbs: Math.round(carbs),
      protein: Math.round(protein),
      fat: Math.round(fat),
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#50C878" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No profile data found. Please update your profile.</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/auth/profilesteup")}
        >
          <Text style={styles.editButtonText}>Set Up Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.userName}>{userData.name || "User"}</Text>
        <Text style={styles.userDetails}>Age: {userData.age || "N/A"}</Text>
        <Text style={styles.userDetails}>Height: {userData.height} cm | Weight: {userData.weight} kg</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Health Goals</Text>
        <Text style={styles.goalItem}>✅ {userData.goal || "No goal set"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Nutrition Summary</Text>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionItem}>Calories: {calculatedData.calories || "N/A"} kcal</Text>
          <Text style={styles.nutritionItem}>Carbs: {calculatedData.carbs || "N/A"}g</Text>
          <Text style={styles.nutritionItem}>Protein: {calculatedData.protein || "N/A"}g</Text>
          <Text style={styles.nutritionItem}>Fat: {calculatedData.fat || "N/A"}g</Text>
        </View>
      </View>
<View>
      {/* Meal History */}
      <Text style={styles.mealItem}>
  🍲 Breakfast: {userData.breakfast?.RecipeName || "Not recorded"}
</Text>
<Text style={styles.mealItem}>
  🥗 Lunch: {userData.lunch?.RecipeName || "Not recorded"}
</Text>
<Text style={styles.mealItem}>
  🍎 Dinner: {userData.dinner?.RecipeName || "Not recorded"}
</Text>
</View>
      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/auth/editprofile")}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileHeader: { alignItems: "center", marginBottom: 20 },
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

export default Profile;
