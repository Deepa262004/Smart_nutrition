import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const MealRecommendation = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [formData, setFormData] = useState({
    dietPreference: "",
    dislikedFoods: "",
    allergies: "",
    healthGoals: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeMealIndex, setActiveMealIndex] = useState(null);

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

  const handleMealSelection = async (meal, mealType) => {
    try {
      const updatedProfile = { ...userData, [mealType]: meal };
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setUserData(updatedProfile);
      Alert.alert("Success", `${meal.RecipeName} set as ${mealType}`);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setDropdownVisible(false);
  };

  const toggleDropdown = (index) => {
    setDropdownVisible(!dropdownVisible);
    setActiveMealIndex(index);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Get Your Customized Meal Plan</Text>
      <Text style={styles.subtitle}>Fill in the details to receive a personalized meal plan:</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="What type of diet do you follow? (E.g., Vegan, Low Carb)"
          placeholderTextColor="#777"
          value={formData.dietPreference}
          onChangeText={(text) => handleChange("dietPreference", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Foods you dislike (E.g., Broccoli, Mushrooms)"
          placeholderTextColor="#777"
          value={formData.dislikedFoods}
          onChangeText={(text) => handleChange("dislikedFoods", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Any allergies? (E.g., Peanuts, Dairy)"
          placeholderTextColor="#777"
          value={formData.allergies}
          onChangeText={(text) => handleChange("allergies", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Your health goals (E.g., Weight Loss, Muscle Gain)"
          placeholderTextColor="#777"
          value={formData.healthGoals}
          onChangeText={(text) => handleChange("healthGoals", text)}
        />

        <TouchableOpacity style={styles.button} onPress={submitMealPlanRequest}>
          <Text style={styles.buttonText}>Generate Meal Plan</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1565C0" />
      ) : meals.length > 0 ? (
        <FlatList
          data={meals}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.mealItem}>
              <Text style={styles.mealName}>{item.RecipeName}</Text>
              <Text style={styles.mealDetails}>Total Time: {item.TotalTimeInMins} mins</Text>
              <Text style={styles.mealDetails}>Diet: {item.Diet}</Text>
              <Text style={styles.mealDetails}>Instructions: {item.TranslatedInstructions}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setSelectedMeal(item);
                  toggleDropdown(index);
                }}
              >
                <Ionicons name="add" size={24} color="#1565C0" />
              </TouchableOpacity>

              {/* Dropdown for Meal Selection */}
              {dropdownVisible && activeMealIndex === index && (
                <View style={styles.dropdown}>
                  {["Breakfast", "Lunch", "Dinner"].map((mealType) => (
                    <TouchableOpacity
                      key={mealType}
                      style={styles.dropdownItem}
                      onPress={() => handleMealSelection(item, mealType.toLowerCase())}
                    >
                      <Text style={styles.dropdownItemText}>{mealType}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noMealsText}>No meals recommended yet.</Text>
      )}

      {/* Modal for Meal Details */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Meal Details</Text>
            {selectedMeal && (
              <>
                <Text style={styles.modalText}>{selectedMeal.RecipeName}</Text>
                <Text style={styles.modalText}>Total Time: {selectedMeal.TotalTimeInMins} mins</Text>
                <Text style={styles.modalText}>Diet: {selectedMeal.Diet}</Text>
                <Text style={styles.modalText}>Instructions: {selectedMeal.TranslatedInstructions}</Text>
              </>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1565C0",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  mealItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  mealDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  addButton: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  dropdown: {
    position: "absolute",
    right: 16,
    top: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#1565C0",
  },
  noMealsText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 12,
  },
  closeButton: {
    color: "#1565C0",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
});

export default MealRecommendation;