// import React from 'react';
// import { View, StyleSheet } from 'react-native';

// const AuthLayout = ({ children }) => {
//     return (
//         <View style={styles.container}>
//             {children}
//         </View>
//     );
// };
// console.log("LogoPage is rendering");

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff', 
//         paddingHorizontal: 20,
//     },
// });

// export default 	AuthLayout;

import { Slot } from "expo-router";

export default function AuthLayout() {
  return <Slot />;
}
