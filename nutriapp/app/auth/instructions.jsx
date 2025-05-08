import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

const UpdatedInstructions = () => {
  const params = useLocalSearchParams();
  const rawInstructions = decodeURIComponent(params.instructions || "");

  // Split by period or comma followed by optional space
  const instructionItems = rawInstructions
    .split(/[.]\s*/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0); // Filter out empty lines

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Instructions</Text>
      {instructionItems.map((item, index) => (
        <Text key={index} style={styles.bulletItem}>
          • {item}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#FAFAFA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1565C0",
    textAlign: "center",
  },
  bulletItem: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 10,
  },
});

export default UpdatedInstructions;
