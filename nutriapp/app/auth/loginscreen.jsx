import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons'; 
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function loginscreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true); 

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8001/auth/login/", {
                email,
                password,
            });

            if (response.status === 200) {
                const { token, username } = response.data;
                await AsyncStorage.setItem("token", token);
                await AsyncStorage.setItem("username", username);
                console.log("Login successful");
                console.log(email, password);

                router.push("/tabs/home"); 
            }
        } catch (error) {
            console.error("Login failed:", error.message);
        }
    };

    return (
        <LinearGradient colors={["#DFFFD6", "#FFF8D6"]} style={styles.container}>
            <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
                <Text style={styles.title}>Welcome Back!</Text>
        

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#AAA"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#AAA"
                        secureTextEntry={secureText}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                        <Ionicons
                            name={secureText ? "eye-off-outline" : "eye-outline"}
                            size={24}
                            color="gray"
                            style={styles.eyeIcon}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/auth/signupscreen')}>
                    <Text style={styles.signupText}>
                        Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    inputContainer: {
        width: "90%", 
        maxWidth: 400,  
        minWidth: 270,
        backgroundColor: '#FFF',
        borderRadius: 18,
        paddingHorizontal: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: "#333",
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        backgroundColor: '#93C572',
        paddingVertical: 15,
        paddingHorizontal: 80,
        borderRadius: 30,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 5,
        marginBottom: 15,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    signupText: {
        color: 'gray',
        fontSize: 14,
    },
    signupLink: {
        color: '#E1AD01',
        fontWeight: 'bold',
    },
    content: {
        alignItems: "center",
        width: "90%",
        maxWidth: 400,
    }    
});

    