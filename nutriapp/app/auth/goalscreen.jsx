import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Goalscreen() {
    const router = useRouter();
    
    // State for user details and selected goal
    const [goal, setGoal] = useState('');  
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [insulin, setInsulin] = useState('');
    const [weight, setWeight] = useState('');

    const handleOptionPress = () => {
        if (!goal || !name || !age || !height || !insulin || !weight) {
            alert('Please fill in all details!');
            return;
        }

        // Navigate to the login page after form submission
        router.push('/auth/loginscreen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>What's your main goal?</Text>
            
            <TextInput 
                style={styles.input}
                placeholder="Enter your goal"
                value={goal}
                onChangeText={setGoal}
            />

            <TextInput 
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
            />

            <TextInput 
                style={styles.input}
                placeholder="Enter your age"
                value={age}
                keyboardType="numeric"
                onChangeText={setAge}
            />

            <TextInput 
                style={styles.input}
                placeholder="Enter your height (cm)"
                value={height}
                keyboardType="numeric"
                onChangeText={setHeight}
            />

            <TextInput 
                style={styles.input}
                placeholder="Enter your insulin (units)"
                value={insulin}
                keyboardType="numeric"
                onChangeText={setInsulin}
            />

            <TextInput 
                style={styles.input}
                placeholder="Enter your weight (kg)"
                value={weight}
                keyboardType="numeric"
                onChangeText={setWeight}
            />

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
    loginLink: {
        color: 'blue',
        fontSize: 16,
        marginTop: 10,
    },
});

