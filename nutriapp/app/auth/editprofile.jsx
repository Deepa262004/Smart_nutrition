import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";

const choices = {
  gender_choices: [
    ['male', 'Male'],
    ['female', 'Female'],
    ['other', 'Other']
  ],
  health_choices: [
    ['diabetes','Diabetes'],
        ['cardiovascular','Cardiovascular'],
        ['none','none']
  ],
  physical_activity_choices: [
    ['low', 'Low'],
    ['medium', 'Medium'],
    ['high', 'High']
  ],
  family_history_choices: [
    ['diabetic','Diabetic'],
    ['non_diabetic','Non Diabetic']
  ]
};

export default function EditProfile() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    insulin: "",
    physical_activity: "",
    health_condition_preferences: "",
    dietary_preferences: "",
    family_history: "",
    gender: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("userProfile");
        if (storedProfile) {
          const userProfile = JSON.parse(storedProfile);
          setUsername(userProfile.name || "");
          setFormData(userProfile);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch profile details.");
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify({ ...formData, name: username }));
      Alert.alert("Success", "Profile updated successfully!");
      router.push("/tabs/home");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile details.");
      console.error(error);
    }
  };

  return (
    <LinearGradient colors={["#DFFFD6", "#FFF8D6"]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flexContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
            <Text style={styles.title}>Edit Profile</Text>

            <TextInput 
              style={styles.input} 
              placeholder="Age" 
              keyboardType="numeric" 
              value={formData.age} 
              onChangeText={(value) => handleChange("age", value)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Weight (kg)" 
              keyboardType="numeric" 
              value={formData.weight} 
              onChangeText={(value) => handleChange("weight", value)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Height (cm)" 
              keyboardType="numeric" 
              value={formData.height} 
              onChangeText={(value) => handleChange("height", value)} 
            />
           
            <Text style={styles.label}>Gender</Text>
            <Picker 
              selectedValue={formData.gender} 
              style={styles.input} 
              onValueChange={(value) => handleChange("gender", value)}
            >
              <Picker.Item label="Select Gender" value="" />
              {choices.gender_choices.map((item) => (
                <Picker.Item key={item[0]} label={item[1]} value={item[0]} />
              ))}
            </Picker>
           
            <Text style={styles.label}>Health Condition</Text>
            <Picker 
              selectedValue={formData.health_condition_preferences} 
              style={styles.input} 
              onValueChange={(value) => handleChange("health_condition_preferences", value)}
            >
              <Picker.Item label="Select Condition" value="" />
              {choices.health_choices.map((item) => (
                <Picker.Item key={item[0]} label={item[1]} value={item[0]} />
              ))}
            </Picker>
           
            {formData.health_condition_preferences === 'diabetes' || formData.health_condition_preferences === 'both' ? (
              <TextInput 
                style={styles.input} 
                placeholder="Insulin (units)" 
                value={formData.insulin} 
                keyboardType="numeric" 
                onChangeText={(value) => handleChange("insulin", value)} 
              />
            ) : null}
           
            <Text style={styles.label}>Physical Activity Level</Text>
            <Picker 
              selectedValue={formData.physical_activity} 
              style={styles.input} 
              onValueChange={(value) => handleChange("physical_activity", value)}
            >
              <Picker.Item label="Select Level" value="" />
              {choices.physical_activity_choices.map((item) => (
                <Picker.Item key={item[0]} label={item[1]} value={item[0]} />
              ))}
            </Picker>

            {/* Dietary Preference Dropdown */}
            <Text style={styles.label}>Dietary Preference</Text>
            <Picker selectedValue={formData.dietary_preferences} style={styles.input}  onValueChange={(value) => handleChange("dietary_preferences", value)}>
                <Picker.Item label="Vegetarian" value="vegetarian" />
                <Picker.Item label="Non Vegetarian" value="non vegetarian" />
                <Picker.Item label="Vegan" value="vegan" />
    </Picker>
           
            <Text style={styles.label}>Family Medical History</Text>
            <Picker 
              selectedValue={formData.family_history} 
              style={styles.input} 
              onValueChange={(value) => handleChange("family_history", value)}
            >
              <Picker.Item label="Select" value="" />
              {choices.family_history_choices.map((item) => (
                <Picker.Item key={item[0]} label={item[1]} value={item[0]} />
              ))}
            </Picker>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flexContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingBottom: 30 },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  label: { fontSize: 16, marginTop: 10, marginBottom: 5 },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5, 
    backgroundColor: "white" 
  },
  button: { 
    backgroundColor: "#4CAF50", 
    padding: 15, 
    borderRadius: 5, 
    alignItems: "center", 
    marginTop: 15 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});