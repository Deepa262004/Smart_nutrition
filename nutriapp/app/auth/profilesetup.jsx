import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ProfileSetup = ({ navigation }) => {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    daily_insulin_level: "",
    physical_activity: "",
    health_condition_preferences: "",
    dietary_preferences: "",
    family_history: "",
    gender: "",
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Get stored token

      if (!token) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8001/auth/profile/setup/",
        formData,
        { headers: { Authorization: `Bearer ${token}`} }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Profile setup completed!");
        navigation.navigate("Home");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save profile details.");
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Profile Setup</Text>

      <TextInput placeholder="Age" keyboardType="numeric" onChangeText={(value) => handleChange("age", value)} style={styles.input} />
      <TextInput placeholder="Weight (kg)" keyboardType="numeric" onChangeText={(value) => handleChange("weight", value)} style={styles.input} />
      <TextInput placeholder="Height (cm)" keyboardType="numeric" onChangeText={(value) => handleChange("height", value)} style={styles.input} />
      <TextInput placeholder="Daily Insulin Level" keyboardType="numeric" onChangeText={(value) => handleChange("daily_insulin_level", value)} style={styles.input} />
      <TextInput placeholder="Physical Activity" onChangeText={(value) => handleChange("physical_activity", value)} style={styles.input} />
      <TextInput placeholder="Health Condition Preferences" onChangeText={(value) => handleChange("health_condition_preferences", value)} style={styles.input} />
      <TextInput placeholder="Dietary Preferences" onChangeText={(value) => handleChange("dietary_preferences", value)} style={styles.input} />
      <TextInput placeholder="Family History" onChangeText={(value) => handleChange("family_history", value)} style={styles.input} />
      <TextInput placeholder="Gender" onChangeText={(value) => handleChange("gender", value)} style={styles.input} />

      <Button title="Save Profile" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default ProfileSetup;
