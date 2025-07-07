import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DataGo eSIM</Text>
      <Text style={styles.subtitle}>Uygulama Başarıyla Çalışıyor! 🎉</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setCount(count + 1)}
      >
        <Text style={styles.buttonText}>Tıkla: {count}</Text>
      </TouchableOpacity>

      <Text style={styles.info}>React Native + Expo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#10B981",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "600",
  },
  info: {
    color: "#64748B",
    fontSize: 14,
  },
});
