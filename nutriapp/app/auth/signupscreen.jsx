import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const router = useRouter();

    const showModal = (message) => {
        setModalMessage(message);
        setModalVisible(true);
    };

    const handleSignUp = async () => {
        console.log("Signup button clicked");

        if (password !== confirmPassword) {
            showModal("Passwords do not match!");
            return;
        }

        try {
            console.log("Sending request to API...");
            const response = await axios.post("http://192.168.159.25:8081/auth/signup/", {
                username: email.split("@")[0],
                email,
                password,
            });

            console.log("Signup successful:", response.data);

            setTimeout(() => {
                showModal(response.data.message || "Signup successful!");
            }, 500);
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
            showModal(error.response?.data?.error || "Something went wrong!");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create an Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/auth/loginscreen")}>
                <Text style={styles.loginText}>
                    Already have an account? <Text style={styles.loginLink}>Log in</Text>
                </Text>
            </TouchableOpacity>

            {/* Custom Modal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                if (modalMessage.includes("successful")) {
                                    router.replace("/auth/goalscreen");
                                }
                            }}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#FFF",
    },
    button: {
        backgroundColor: "#000",
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
        marginBottom: 15,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    loginText: {
        color: "gray",
        fontSize: 14,
    },
    loginLink: {
        color: "green",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: "#000",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    modalButtonText: {
        color: "#FFF",
        fontSize: 16,
    },
});

