import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("Guest");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [weight, setWeight] = useState(70); // Default weight in kg
  const [height, setHeight] = useState(170); // Default height in cm
  const [bmi, setBmi] = useState(0);
  const [calorieRequirement, setCalorieRequirement] = useState(2000);
  const [bodyFat, setBodyFat] = useState(20); // Body fat percentage
  const [heartRate, setHeartRate] = useState(72); // Resting heart rate
  const [bloodPressure, setBloodPressure] = useState("120/80"); // Blood pressure
  const [steps, setSteps] = useState(5000); // Daily steps
  const [waterIntake, setWaterIntake] = useState(2); // Liters of water consumed

  // Animation for water intake
  const waterProgress = useSharedValue(0);

  useEffect(() => {
    waterProgress.value = withTiming((waterIntake / 3) * 100, {
      duration: 1000,
      easing: Easing.ease,
    });
  }, [waterIntake]);

  const animatedWaterStyle = useAnimatedStyle(() => {
    return {
      width: `${waterProgress.value}%`,
    };
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        const userWeight = await AsyncStorage.getItem("weight");
        const userHeight = await AsyncStorage.getItem("height");

        if (username) setUserName(username);
        if (userWeight) setWeight(parseFloat(userWeight));
        if (userHeight) setHeight(parseFloat(userHeight));

        // Calculate BMI
        const heightInMeters = height / 100;
        const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        setBmi(bmiValue);

        // Calculate calorie requirement
        const calorieReq = (10 * weight + 6.25 * height - 5 * 25 + 5).toFixed(0);
        setCalorieRequirement(calorieReq);
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [weight, height]);

  const meals = [
    {
      title: "Grilled Salmon",
      image: require("../../assets/salmon.jpg"),
      nutrition: "Protein: 25g, Fat: 12g, Carbs: 0g",
      recipe: "Grill the salmon with olive oil, salt, and pepper for 10 minutes.",
      calories: 300,
    },
    {
      title: "Avocado Salad",
      image: require("../../assets/salad.jpg"),
      nutrition: "Protein: 5g, Fat: 15g, Carbs: 20g",
      recipe: "Mix chopped avocado, tomatoes, onions, and lemon juice.",
      calories: 250,
    },
    {
      title: "Oatmeal Bowl",
      image: require("../../assets/oatsmeal.jpg"),
      nutrition: "Protein: 10g, Fat: 5g, Carbs: 50g",
      recipe: "Cook oats with milk, add honey and fruits for sweetness.",
      calories: 400,
    },
  ];

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Normal";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    return "Obese";
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey, {userName}</Text>
        <Text style={styles.subText}>Have a refreshing evening!</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Combined BMI and Calorie Requirement */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>BMI</Text>
            <Text style={styles.metricValue}>{bmi}</Text>
            <Text style={styles.metricSubText}>({getBmiCategory(bmi)})</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Daily Calories</Text>
            <Text style={styles.metricValue}>{calorieRequirement}</Text>
            <Text style={styles.metricSubText}>kcal</Text>
          </View>
        </View>
      </View>

      {/* Body Composition */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Body Composition</Text>
        <View style={styles.row}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{bodyFat}%</Text>
            <Text style={styles.metricLabel}>Body Fat</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{waterIntake}L</Text>
            <Text style={styles.metricLabel}>Water Intake</Text>
          </View>
        </View>
        {/* Water Intake Animation */}
        <View style={styles.waterContainer}>
          <View style={styles.waterBackground}>
            <Animated.View style={[styles.waterFill, animatedWaterStyle]} />
          </View>
          <Text style={styles.waterText}>{waterIntake} / 3L</Text>
        </View>
      </View>

      {/* Vital Signs */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vital Signs</Text>
        <View style={styles.row}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{heartRate}</Text>
            <Text style={styles.metricLabel}>Heart Rate</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{bloodPressure}</Text>
            <Text style={styles.metricLabel}>Blood Pressure</Text>
          </View>
        </View>
      </View>

      {/* Activity Tracking */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activity</Text>
        <View style={styles.row}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{steps}</Text>
            <Text style={styles.metricLabel}>Steps</Text>
          </View>
        </View>
      </View>

      {/* Meal Recommendations */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommended Meals</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {meals.map((meal, index) => (
            <TouchableOpacity
              key={index}
              style={styles.mealCard}
              onPress={() => {
                setSelectedMeal(meal);
                setModalVisible(true);
              }}
            >
              <Image source={meal.image} style={styles.mealImage} />
              <Text style={styles.mealTitle}>{meal.title}</Text>
              <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Meal Details Modal */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {selectedMeal && (
              <>
                <Text style={styles.modalTitle}>{selectedMeal.title}</Text>
                <Text style={styles.modalText}>{selectedMeal.nutrition}</Text>
                <Text style={styles.modalText}>{selectedMeal.recipe}</Text>
                <Text style={styles.modalText}>{selectedMeal.calories} kcal</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Plan Your Meal Button */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.planMealButton} onPress={() => router.push("auth/mealrecomdation")}>
          <Text style={styles.planMealButtonText}>Plan Your Meal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },
  header: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 10,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  greeting: { fontSize: 22, fontWeight: "bold", color: "white" },
  subText: { fontSize: 14, color: "white" },
  settingsButton: { position: "absolute", right: 15, top: 20 },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  metricCard: {
    flex: 0.48,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: { fontSize: 20, fontWeight: "bold" },
  metricLabel: { fontSize: 14, color: "gray" },
  metricSubText: { fontSize: 12, color: "gray" },

  waterContainer: { marginTop: 10, alignItems: "end" },
  waterBackground: {
    width: width * 0.45,
    height: 20,
    backgroundColor: "#E0E0E0",

    borderRadius: 10,
    overflow: "hidden",
  },
  waterFill: {
    height: "100%",
    backgroundColor: "#33C1FF",
    borderRadius: 10,
  },
  waterText: { marginTop: 5, fontSize: 14, color: "#333" },

  mealCard: { marginRight: 10, alignItems: "center" },
  mealImage: { width: 100, height: 100, borderRadius: 10 },
  mealTitle: { marginTop: 5, fontSize: 14, fontWeight: "bold" },
  mealCalories: { fontSize: 12, color: "gray" },

  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: 300, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 10, textAlign: "center" },
  closeButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 5, marginTop: 10 },
  closeButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },

  planMealButton: {
    backgroundColor: "#50C878",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  planMealButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  
});

export default Home;