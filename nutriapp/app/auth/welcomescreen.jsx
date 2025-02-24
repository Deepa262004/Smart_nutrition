import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function welcomescreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Icon Section */}
            <Image 
                source={require("../../assets/icons/healthy-food.png")} // lowercase
                style={styles.icon} // Apply updated style
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
                You will be accepting our <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
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
    icon: {
        width: 80, // Adjusted size
        height: 80, // Adjusted size
        marginBottom: 50,
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#000",
    },
    subtitle: {
        fontSize: 20,
        color: "#000",
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    ratingText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFA500",
        marginRight: 5,
    },
    appStoreText: {
        fontSize: 16,
        color: "#FFA500",
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
    footerText: {
        fontSize: 12,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
    },
    linkText: {
        color: "#000",
        fontWeight: "bold",
    },
});
