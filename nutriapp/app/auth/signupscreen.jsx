import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const router = useRouter();

    const showModal = (message) => {
        setModalMessage(message);
        setModalVisible(true);
    };

    const handleSignUp = async () => {
        if (!email.includes("@")) {
            showModal("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            showModal("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            showModal("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8001/auth/signup/", {
                username: email.split("@")[0],
                email,
                password,
            });

            showModal(response.data.message || "Signup successful!");
            setTimeout(() => {
                router.replace("/auth/goalscreen");
            }, 1500);
        } catch (error) {
            showModal(error.response?.data?.error || "Something went wrong!");
        }
    };

    return (
        <Animated.View style={styles.animatedContainer} entering={FadeIn.duration(500)}>
            <LinearGradient colors={["#DFFFD6", "#FFF8D6"]} style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#AAA"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#AAA"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={passwordVisible}
                    />
                    <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={styles.icon}
                    >
                        <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={22} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#AAA"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={confirmPasswordVisible}
                    />
                    <TouchableOpacity
                        onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        style={styles.icon}
                    >
                        <Ionicons name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={22} color="#666" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/auth/loginscreen")}> 
                    <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Log in</Text></Text>
                </TouchableOpacity>

                <Modal animationType="slide" transparent visible={modalVisible}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>{modalMessage}</Text>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    animatedContainer: { flex: 1 },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    inputContainer: {
        width: "90%",
        maxWidth: 400,
        minWidth: 270,
        backgroundColor: '#FFF',
        borderRadius: 18,
        paddingHorizontal: 15,
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    input: { flex: 1, height: 50, fontSize: 16, color: "#333" },
    icon: { padding: 10 },
    button: {
        backgroundColor: '#93C572',
        paddingVertical: 15,
        paddingHorizontal: 80,
        borderRadius: 30,
        marginBottom: 15,
    },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    loginText: { color: 'gray', fontSize: 14 },
    loginLink: { color: '#E1AD01', fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%", alignItems: "center" },
    modalText: { fontSize: 16, marginBottom: 10 },
    modalButton: { backgroundColor: "#000", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginTop: 10 },
    modalButtonText: { color: "#FFF", fontSize: 16 },
});