import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Goalscreen() {
    const router = useRouter();

    // State for user details
    const [goal, setGoal] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('');
    const [hasDiabetes, setHasDiabetes] = useState(false);
    const [insulin, setInsulin] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [dietaryPreference, setDietaryPreference] = useState('');
    const [familyHistory, setFamilyHistory] = useState('');

    // Handle form submission
    const handleOptionPress = async () => {
        if (!goal || !age || !height || !weight || !gender || !activityLevel) {
            alert('Please fill in all required details!');
            return;
        }

        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify({
                name,
                goal,
                age,
                height,
                weight,
                gender,
                hasDiabetes,
                insulin: hasDiabetes ? insulin : null,
                activityLevel,
                dietaryPreference,
                familyHistory,
            }));
            alert('Profile updated successfully!');
            router.push('/auth/loginscreen');
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>What's your main goal?</Text>
            <TextInput style={styles.input} placeholder="Enter your goal" value={goal} onChangeText={setGoal} />
            <TextInput style={styles.input} placeholder="Enter your name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Enter your age" value={age} keyboardType="numeric" onChangeText={setAge} />
            <TextInput style={styles.input} placeholder="Enter your height (cm)" value={height} keyboardType="numeric" onChangeText={setHeight} />
            <TextInput style={styles.input} placeholder="Enter your weight (kg)" value={weight} keyboardType="numeric" onChangeText={setWeight} />

            {/* Gender Selection */}
            <Text style={styles.label}>Select Gender</Text>
            <Picker selectedValue={gender} style={styles.input} onValueChange={setGender}>
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
            </Picker>

            {/* Diabetes Question */}
            <Text style={styles.label}>Do you have diabetes?</Text>
            <View style={styles.toggleContainer}>
                <TouchableOpacity style={[styles.toggleButton, hasDiabetes && styles.selected]} onPress={() => setHasDiabetes(true)}>
                    <Text style={styles.toggleText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleButton, !hasDiabetes && styles.selected]} onPress={() => setHasDiabetes(false)}>
                    <Text style={styles.toggleText}>No</Text>
                </TouchableOpacity>
            </View>

            {hasDiabetes && (
                <TextInput style={styles.input} placeholder="Enter your insulin (units)" value={insulin} keyboardType="numeric" onChangeText={setInsulin} />
            )}

            {/* Physical Activity Level */}
            <Text style={styles.label}>Physical Activity Level</Text>
            <Picker selectedValue={activityLevel} style={styles.input} onValueChange={setActivityLevel}>
                <Picker.Item label="Select Activity Level" value="" />
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Moderate" value="moderate" />
                <Picker.Item label="Active" value="active" />
            </Picker>

            {/* Dietary Preference */}
            <TextInput style={styles.input} placeholder="Any dietary preference?" value={dietaryPreference} onChangeText={setDietaryPreference} />

            {/* Family History */}
            <TextInput style={styles.input} placeholder="Family medical history (if any)" value={familyHistory} onChangeText={setFamilyHistory} />

            {/* Submit Button */}
            <TouchableOpacity style={styles.option} onPress={handleOptionPress}>
                <Text style={styles.optionText}>Submit Details</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        width: '80%',
        backgroundColor: '#FFF',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    toggleButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    selected: {
        backgroundColor: '#000',
    },
    toggleText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    option: {
        backgroundColor: '#000',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    optionText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
