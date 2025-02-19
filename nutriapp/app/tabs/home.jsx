
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Home = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  
    useEffect(() => {
      const fetchUserName = async () => {
        const token = await AsyncStorage.getItem("token");
  
        if (token) {
          try {
            const response = await axios.get("http://127.0.0.1:8001/auth/user/details/", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUserName(response.data.username);
          } catch (error) {
            console.log("Error fetching user details:", error);
          }
        }
      };
  
      fetchUserName();
    }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey {userName} </Text>
        <Text style={styles.subText}>Have a refreshing evening!</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      
      {/* Nutrition Section */}
  <View style={styles.card}>
  <Text style={styles.cardTitle}>Nutrition Levels</Text>
  <View style={styles.nutritionContainer}>
    {[
      { title: "Protein", value: "50g", color: "#FF5733" },
      { title: "Carbs", value: "200g", color: "#33C1FF" },
      { title: "Fibre", value: "30g", color: "#2E8B57" },
      { title: "Fat", value: "70g", color: "#FFC133" }
    ].map((item, index) => (
      <View key={index} style={[styles.nutritionCard, { borderColor: item.color }]}>
        <View style={[styles.nutritionCircle, { backgroundColor: item.color }]}>
          <Text style={styles.nutritionValue}>{item.value}</Text>
        </View>
        <Text style={styles.nutritionText}>{item.title}</Text>
      </View>
    ))}
  </View>
</View>


      {/* Calorie Tracker */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Calories</Text>
        <View style={styles.calorieTracker}>
          <Svg width={100} height={100} viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="40" stroke="lightgray" strokeWidth="8" fill="none" />
            <Circle cx="50" cy="50" r="40" stroke="#007bff" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="125.6" />
          </Svg>
          <View style={styles.calorieText}>
            <Text style={styles.caloriesLeft}>1284</Text>
            <Text style={styles.calorieSubText}>Left</Text>
          </View>
        </View>
      </View>

      {/* Glucose & Weight Charts */}
      <View style={styles.row}>
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Glucose</Text>
          <Text style={styles.noData}>No data</Text>
        </View>
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Weight</Text>
          <Text style={styles.weightText}>90 kg</Text>
        </View>
      </View>

      {/* Plan Your Meal Button */}
      <View style={styles.card}>
      <TouchableOpacity 
  style={styles.planMealButton} 
  onPress={() => navigation.navigate("mealrecomdation")}
>
  <Text style={styles.planMealButtonText}>Plan Your Meal</Text>
</TouchableOpacity>

      </View>

      
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },
  header: { backgroundColor: "#007bff", padding: 20, borderRadius: 10, position: "relative" },
  greeting: { fontSize: 22, fontWeight: "bold", color: "white" },
  subText: { fontSize: 14, color: "white" },
  settingsButton: { position: "absolute", right: 15, top: 20 },
  streakContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  streakText: { fontSize: 16, color: "#007bff" },
  chatButton: { flexDirection: "row", backgroundColor: "#007bff", padding: 10, borderRadius: 5, alignItems: "center" },
  chatText: { color: "white", marginLeft: 5 },
  card: { backgroundColor: "white", padding: 16, borderRadius: 10, marginTop: 15 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  nutritionContainer: { 
  flexDirection: "row", 
  justifyContent: "space-between", 
  alignItems: "center", 
  marginTop: 10 
},
nutritionContainer: { 
  flexDirection: "row", 
  justifyContent: "space-between", 
  alignItems: "center", 
  marginTop: 10 
},
nutritionCard: { 
  flex: 0.23, 
  paddingVertical: 15, 
  paddingHorizontal: 10, 
  borderWidth: 2, 
  borderRadius: 12, 
  alignItems: "center", 
  backgroundColor: "white", 
  elevation: 4, 
  shadowColor: "#000", 
  shadowOpacity: 0.1, 
  shadowRadius: 5 
},
nutritionCircle: { 
  width: 50, 
  height: 50, 
  borderRadius: 25, 
  alignItems: "center", 
  justifyContent: "center", 
  marginBottom: 8, 
  shadowColor: "#000", 
  shadowOpacity: 0.2, 
  shadowRadius: 5 
},
nutritionText: { 
  fontSize: 14, 
  fontWeight: "bold", 
  color: "#333" 
},
nutritionValue: { 
  fontSize: 16, 
  fontWeight: "bold", 
  color: "white" 
},

  calorieTracker: { flexDirection: "row", alignItems: "center", justifyContent: "center", position: "relative" },
  calorieText: { position: "absolute", alignItems: "center" },
  caloriesLeft: { fontSize: 24, fontWeight: "bold" },
  calorieSubText: { fontSize: 12, color: "gray" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  chartCard: { backgroundColor: "white", flex: 0.48, padding: 16, borderRadius: 10, alignItems: "center" },
  noData: { textAlign: "center", color: "gray" },
  weightText: { textAlign: "center", fontSize: 18, fontWeight: "bold" },
  planMealButton: { backgroundColor: "#50C878", paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, alignItems: "center" },
  planMealButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  resource: { fontSize: 14, color: "#007bff", marginVertical: 4 }
});

export default Home;
