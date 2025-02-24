import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function loginscreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    const handleLogin = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8001/auth/login/", {
          email,
          password,
        });
    
        if (response.status === 200) {
          const { token, username } = response.data;
          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("username", username); // Store username
          console.log("Login successful");
          console.log(email,password)
        
          navigation.navigate("/tabs/home");
        }
      } catch (error) {
        console.error("Login failed:", error.message);
      }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/signupscreen')}>
                <Text style={styles.signupText}>Don’t have an account? <Text style={styles.signupLink}>Sign up</Text></Text>
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
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
        marginBottom: 15,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupText: {
        color: 'gray',
        fontSize: 14,
    },
    signupLink: {
        color: 'green',
        fontWeight: 'bold',
    },
});
