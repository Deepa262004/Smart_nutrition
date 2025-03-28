import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get("window");

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
    const [dietary_preferences, setDietaryPreference] = useState('');
    const [familyHistory, setFamilyHistory] = useState('');
    const [health_condition_preferences, setHealthCondition] = useState('');

    // Handle form submission
    const handleOptionPress = async () => {
        if (!goal || !age || !height || !weight || !gender || !activityLevel) {
            alert('Please fill in all required details!');
            return;
        }

        // Set hasDiabetes to true if health condition is "diabetes"
    const diabetesSelected = health_condition_preferences === 'diabetes';
    
    try {
        await AsyncStorage.setItem('userProfile', JSON.stringify({
            name,
            goal,
            age,
            height,
            weight,
            gender,
            hasDiabetes: diabetesSelected, // Updated logic
            insulin: diabetesSelected ? insulin : null, // Store insulin only if diabetes is selected
            activityLevel,
            dietary_preferences,
            familyHistory,
            health_condition_preferences
        }));
            alert('Profile updated successfully!');
            router.push('/auth/loginscreen');
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    };
    
return(
        <LinearGradient colors={['#DFFFD6', '#FFF8D6']} style={styles.container}>
            <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Help us know you better</Text>
                    <TextInput style={styles.input} placeholder="Your Goal" value={goal} onChangeText={setGoal} />
                    <TextInput style={styles.input} placeholder="Your Name" value={name} onChangeText={setName} />
                    <TextInput style={styles.input} placeholder="Your Age" value={age} keyboardType="numeric" onChangeText={setAge} />
                    <TextInput style={styles.input} placeholder="Height (cm)" value={height} keyboardType="numeric" onChangeText={setHeight} />
                    <TextInput style={styles.input} placeholder="Weight (kg)" value={weight} keyboardType="numeric" onChangeText={setWeight} />

                   <Text style={styles.label}>Select Gender</Text>
                               <Picker selectedValue={gender} style={styles.input} onValueChange={setGender}>
                                   <Picker.Item label="Select Gender" value="" />
                                   <Picker.Item label="Male" value="male" />
                                   <Picker.Item label="Female" value="female" />
                                   <Picker.Item label="Other" value="other" />
                               </Picker>
                   
                               {/* Health Conditions Dropdown */}
                               <Text style={styles.label}>Health Conditions</Text>
                               <Picker selectedValue={health_condition_preferences} style={styles.input} onValueChange={setHealthCondition}>
                                   <Picker.Item label="None" value="none" />
                                   <Picker.Item label="Diabetes" value="diabetes" />
                                   <Picker.Item label="Cardiovascular" value="cardiovascular" />
                               </Picker>
                   
                  
                    {health_condition_preferences === 'diabetes' || health_condition_preferences === 'both' ? (
                        <TextInput style={styles.input} placeholder="Insulin (units)" value={insulin} keyboardType="numeric" onChangeText={setInsulin} />
                    ) : null}

                    {/* Physical Activity Level */}
                                <Text style={styles.label}>Physical Activity Level</Text>
                                <Picker selectedValue={activityLevel} style={styles.input} onValueChange={setActivityLevel}>
                                    <Picker.Item label="Select Activity Level" value="" />
                                    <Picker.Item label="Low" value="low" />
                                    <Picker.Item label="Moderate" value="moderate" />
                                    <Picker.Item label="Active" value="active" />
                                </Picker>
                    
                               {/* Dietary Preference Dropdown */}
                                <Text style={styles.label}>Dietary Preference</Text>
                                <Picker selectedValue={dietary_preferences} style={styles.input} onValueChange={setDietaryPreference}>
                                    <Picker.Item label="Vegetarian" value="vegetarian" />
                                    <Picker.Item label="Non Vegetarian" value="non vegetarian" />
                                    <Picker.Item label="Vegan" value="vegan" />
                                </Picker>
                    
                    
                                {/* Family History Dropdown */}
                                <Text style={styles.label}>Family Medical History</Text>
                                <Picker selectedValue={familyHistory} style={styles.input} onValueChange={setFamilyHistory}>
                                    <Picker.Item label="No history" value="none" />
                                    <Picker.Item label="Diabetes" value="diabetes" />
                                    <Picker.Item label="Cardiovascular" value="cardiovascular" />
                                </Picker>
                    
                    

                    {/* <Text style={styles.label}>Dietary Preference</Text>
                    <Picker selectedValue={dietaryPreference} style={styles.input} onValueChange={setDietaryPreference}>
                        {choices.dietary_choices.map((item) => (
                            <Picker.Item key={item[0]} label={item[1]} value={item[0]} />
                        ))}
                    </Picker> */}

                    <TouchableOpacity style={styles.button} onPress={handleOptionPress}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
    scrollContainer: { flexGrow: 1, alignItems: 'center', paddingVertical: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginVertical: 8, width: width * 0.9, backgroundColor: '#FFF' },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    button: { backgroundColor: '#5CB85C', paddingVertical: 15, borderRadius: 30, width: width * 0.9, alignItems: 'center', marginTop: 20 },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

