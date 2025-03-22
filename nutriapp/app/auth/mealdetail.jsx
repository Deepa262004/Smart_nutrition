import React from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";

const MealDetailsScreen = ({ route }) => {
  const { meals } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meal Recommendations</Text>
      <FlatList
        data={meals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealName}>{item.RecipeName}</Text>
            <Text style={styles.mealDetails}>Total Time: {item.TotalTimeInMins} mins</Text>
            <Text style={styles.mealDetails}>Diet: {item.Diet}</Text>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            <Text style={styles.instructions}>{item.Instructions}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#E3F2FD", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1565C0", marginBottom: 15, textAlign: "center" },
  mealItem: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 15 },
  mealName: { fontSize: 18, fontWeight: "bold" },
  mealDetails: { fontSize: 14, color: "#555", marginBottom: 5 },
  instructionsTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  instructions: { fontSize: 14, color: "#444" },
});

export default MealDetailsScreen;
