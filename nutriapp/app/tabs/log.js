import React from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const mealHistory = [
  { id: "1", name: "Chapati Roasted Veg Rolls", calories: "258 cal", details: "Homemade, 2.0 roll" },
  { id: "2", name: "Besan Chilla With Tomato, Onion, Carrot", calories: "212 cal", details: "Homemade, 2.0 Besan Chilla" },
  { id: "3", name: "Egg & Onion Fry Curry", calories: "200 cal", details: "Home Made, 1.0 cup" },
  { id: "4", name: "Tofu", calories: "148 cal", details: "Briyas, 100.0 gm" },
  { id: "5", name: "White Rice", calories: "130 cal", details: "Cooked, 100.0 gram" },
  { id: "6", name: "Pesarttu", calories: "198 cal", details: "None, 2.0 dosa" },
  { id: "7", name: "Watermelon", calories: "50 cal", details: "Fresh, 150 gm" },
];

const LogFood = () => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.searchBar} placeholder="Search for a food" placeholderTextColor="#888" />
      
      <Text style={styles.historyTitle}>History</Text>
      
      <FlatList
        data={mealHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealCard}>
            <View>
              <Text style={styles.mealName}>{item.name}</Text>
              <Text style={styles.mealDetails}>{item.calories} • {item.details}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c3b2e", // Updated color
    padding: 20,
  },
  searchBar: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  mealCard: {
    backgroundColor: "#1a4d3e",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  mealDetails: {
    fontSize: 14,
    color: "#ccc",
  },
  addButton: {
    backgroundColor: "#ffcc00",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
});

export default LogFood;