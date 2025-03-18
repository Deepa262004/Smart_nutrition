import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user details from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userProfile");
        if (storedData) {
          setUserData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

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
          onPress={() => navigation.navigate("/auth/profilesteup")}
        >
          <Text style={styles.editButtonText}>Set Up Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        {/* <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.profileImage} /> */}
        <Text style={styles.userName}>{userData.name || "User"}</Text>
        <Text style={styles.userDetails}>Age: {userData.age || "N/A"}</Text>
      </View>

      {/* Health Goals */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Health Goals</Text>
        <Text style={styles.goalItem}>✅ {userData.goal || "No goal set"}</Text>
      </View>

      {/* Nutrition Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Nutrition Summary</Text>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionItem}>Calories: {userData.calories || "1800"} kcal</Text>
          <Text style={styles.nutritionItem}>Carbs: {userData.carbs || "120g"}</Text>
          <Text style={styles.nutritionItem}>Protein: {userData.protein || "90g"}</Text>
          <Text style={styles.nutritionItem}>Fat: {userData.fat || "50g"}</Text>
        </View>
      </View>

      {/* Meal History */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Meal History</Text>
        <Text style={styles.mealItem}>🍲 Breakfast: {userData.breakfast || "Not recorded"}</Text>
        <Text style={styles.mealItem}>🥗 Lunch: {userData.lunch || "Not recorded"}</Text>
        <Text style={styles.mealItem}>🍎 Snack: {userData.snack || "Not recorded"}</Text>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("/auth/profilesteup")}
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

export default Profile;
