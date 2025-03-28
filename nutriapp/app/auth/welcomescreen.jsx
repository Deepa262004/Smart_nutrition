import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, BounceIn } from "react-native-reanimated";

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <LinearGradient colors={["#DFFFD6", "#FFF8D6"]} style={styles.container}>
            <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
                {/* Icon Section */}
                <Animated.Image 
                    entering={BounceIn.duration(800)}
                    source={require("../../assets/icons/healthy-food.png")} 
                    style={styles.icon} 
                />

                {/* Welcome Text */}
                <Text style={styles.title}>Hi there!</Text>
                <Text style={styles.subtitle}>Welcome to Smart Nutrition</Text>

                {/* Get Started Button */}
                <TouchableOpacity style={styles.button} onPress={() => router.push("auth/goalscreen")}>
                    <Text style={styles.buttonText}>Let's Go</Text>
                </TouchableOpacity>

                {/* Login Text */}
                <TouchableOpacity onPress={() => router.push("/auth/loginscreen")}>
                    <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Log in</Text></Text>
                </TouchableOpacity>

                {/* Terms and Privacy Policy */}
                <Text style={styles.footerText}>
                    By continuing, you agree to our <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    content: {
        alignItems: "center",
        width: "100%",
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 40,
    },
    title: {
        fontSize: 38,
        fontWeight: "bold",
        color: "#333",
        textTransform: "uppercase",
        letterSpacing: 1.5,
    },
    subtitle: {
        fontSize: 20,
        color: "#555",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#93C572",
        paddingVertical: 15,
        paddingHorizontal: 70,
        borderRadius: 30,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        marginBottom: 20,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    loginText: {
        color: "gray",
        fontSize: 15,
    },
    loginLink: {
        color: "#E1AD01",
        fontWeight: "bold",
    },
    footerText: {
        fontSize: 13,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
        paddingHorizontal: 30,
    },
    linkText: {
        color: "#000",
        fontWeight: "bold",
    },
});

