// MealRecommendation.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

const MealRecommendation = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState([]);
  const [formData, setFormData] = useState({
    dietary_preferences: "",
    dislikedFoods: "",
    allergies: "",
    health_condition_preferences: "",
  });

  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userProfile");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
          setFormData((prev) => ({
            ...prev,
            dietary_preferences: parsedData.dietary_preferences || "",
            health_condition_preferences: parsedData.health_condition_preferences || "",
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const submitMealPlanRequest = async () => {
    if (!userData) {
      Alert.alert("Error", "User data not available");
      return;
    }

    const requestData = { ...userData, ...formData };
    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8001/auth/predict/", requestData);
      setMeals(response.data.recipes);
    } catch (error) {
      console.error("Error fetching meal recommendations:", error);
      Alert.alert("Error", "Failed to fetch meal recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Get Your Customized Meal Plan</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="What type of diet do you follow?"
          placeholderTextColor="#777"
          value={formData.dietary_preferences}
          onChangeText={(text) => handleChange("dietary_preferences", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Foods you dislike"
          placeholderTextColor="#777"
          value={formData.dislikedFoods}
          onChangeText={(text) => handleChange("dislikedFoods", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Any allergies?"
          placeholderTextColor="#777"
          value={formData.allergies}
          onChangeText={(text) => handleChange("allergies", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Any health conditions?"
          placeholderTextColor="#777"
          value={formData.health_condition_preferences}
          onChangeText={(text) => handleChange("health_condition_preferences", text)}
        />

        <TouchableOpacity style={styles.button} onPress={submitMealPlanRequest}>
          <Text style={styles.buttonText}>Generate Meal Plan</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1565C0" />
      ) : (
        meals.map((meal, index) => (
          <TouchableOpacity
            key={index}
            style={styles.mealItem}
            onPress={() =>
              router.push({
                pathname: "/auth/mealdetails",
                params: { meal: JSON.stringify(meal)  },
              })
            }
          >
            <Text style={styles.mealName}>{meal.RecipeName}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: "#F5F5F5" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1565C0", marginBottom: 16 },
  formContainer: { marginBottom: 20 },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#50C878",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  mealItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
    elevation: 2,
  },
  mealName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});

export default MealRecommendation;
