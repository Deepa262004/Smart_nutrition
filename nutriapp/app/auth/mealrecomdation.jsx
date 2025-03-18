import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const mealrecomdation = () => {
    const [formData, setFormData] = useState({
        dietPreference: '',
        dislikedFoods: '',
        allergies: '',
        healthGoals: ''
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
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
                    onChangeText={(text) => handleChange('dietPreference', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Foods you dislike (E.g., Broccoli, Mushrooms)"
                    placeholderTextColor="#777"
                    value={formData.dislikedFoods}
                    onChangeText={(text) => handleChange('dislikedFoods', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Any allergies? (E.g., Peanuts, Dairy)"
                    placeholderTextColor="#777"
                    value={formData.allergies}
                    onChangeText={(text) => handleChange('allergies', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Your health goals (E.g., Weight Loss, Muscle Gain)"
                    placeholderTextColor="#777"
                    value={formData.healthGoals}
                    onChangeText={(text) => handleChange('healthGoals', text)}
                />
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Generate Meal Plan</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1565C0',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#444',
        textAlign: 'center',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default mealrecomdation;