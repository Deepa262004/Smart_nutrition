import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import ingredientSubstitutes from "./ingredientSubstitutes.json";

const getSubstituteFromDataset = (ingredient) => {
  return ingredientSubstitutes[ingredient.toLowerCase()] || null;
};

const MealDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [ingredientInput, setIngredientInput] = useState("");
  const [substitutionResult, setSubstitutionResult] = useState(null);
  const [error, setError] = useState("");

  let mealData = {};
  try {
    mealData = params.meal ? JSON.parse(params.meal) : {};
  } catch (err) {
    console.error("Error parsing meal data:", err);
    mealData = {};
  }

  const ingredientsList = Array.isArray(mealData.Ingredients)
    ? mealData.Ingredients
    : mealData.Ingredients
    ? mealData.Ingredients
        .replace(/,/, ", ")
        .replace(/[\[\]']+/g, "")
        .split(",")
        .map((ingredient) => ingredient.trim())
    : [];

  const updateInstructionsWithSubstitutes = (updatedIngredients) => {
    if (!mealData.TranslatedInstructions) {
      console.error("Instructions not available.");
      return;
    }

    if (!substitutionResult || !Array.isArray(substitutionResult.substitutes)) {
      console.error("Substitution result is not available or malformed.");
      return;
    }

    let updatedInstructions = mealData.TranslatedInstructions;
    updatedIngredients.forEach((ingredient, index) => {
      const substitute = substitutionResult.substitutes[index];
      if (substitute) {
        updatedInstructions = updatedInstructions.replace(
          new RegExp(ingredient, "gi"),
          substitute
        );
      }
    });

    router.push({
      pathname: "/auth/instructions",
      params: { instructions: encodeURIComponent(updatedInstructions) },
    });
  };

  const getSubstitute = async () => {
    setError("");
    setSubstitutionResult(null);
    const ingredient = ingredientInput.trim().toLowerCase();

    const localSubs = getSubstituteFromDataset(ingredient);
    if (localSubs) {
      setSubstitutionResult({ substitutes: localSubs });
      updateInstructionsWithSubstitutes([ingredientInput.trim()]);
      return;
    }

    try {
      const response = await axios.get(
        `http://192.168.10.3:8001/auth/ingredient-substitutes?ingredient=${encodeURIComponent(
          ingredient
        )}`
      );

      if (response.status === 200 && response.data) {
        setSubstitutionResult(response.data);
        updateInstructionsWithSubstitutes([ingredientInput.trim()]);
      } else {
        setError("No substitutes found from the API.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not fetch substitution. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mealName}>
        {mealData.RecipeName || "No name available"}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients:</Text>
        {ingredientsList.length > 0 ? (
          ingredientsList.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              • {ingredient}
            </Text>
          ))
        ) : (
          <Text>No ingredients listed</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Need a Substitute?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter ingredient to replace"
          value={ingredientInput}
          onChangeText={setIngredientInput}
        />
        <Button title="Find Substitute" onPress={getSubstitute} />
        {substitutionResult?.substitutes && (
          <View style={styles.substituteBox}>
            <Text style={styles.subTitle}>
              Substitutes for {ingredientInput}:
            </Text>
            {substitutionResult.substitutes.map((sub, idx) => (
              <Text key={idx} style={styles.ingredient}>
                • {sub}
              </Text>
            ))}
          </View>
        )}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.section}>
  <Button
    title="Go to Instructions"
    onPress={() => {
      let finalInstructions = mealData.TranslatedInstructions || "No instructions available";

      if (
        substitutionResult &&
        Array.isArray(substitutionResult.substitutes) &&
        ingredientInput.trim()
      ) {
        const updatedIngredient = ingredientInput.trim();
        substitutionResult.substitutes.forEach((substitute) => {
          const regex = new RegExp(updatedIngredient, "gi");
          finalInstructions = finalInstructions.replace(regex, substitute);
        });
      }

      router.push({
        pathname: "/auth/instructions",
        params: { instructions: encodeURIComponent(finalInstructions) },
      });
    }}
    color="#1976D2"
  />
</View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  mealName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  substituteBox: {
    marginTop: 10,
  },
  subTitle: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default MealDetails;
