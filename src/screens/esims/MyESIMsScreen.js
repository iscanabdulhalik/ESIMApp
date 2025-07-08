// src/screens/esims/MyESIMsScreen.js
import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { COLORS, FONTS } from "../../constants/theme";
// import { useESIMStore } from '../../stores/esimStore';

const MyESIMsScreen = () => {
  // const { myESIMs, fetchMyESIMs } = useESIMStore();
  // useEffect(() => { fetchMyESIMs() }, []);
  const myESIMs = []; // Başlangıç için boş

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>eSIM'lerim</Text>
      {myESIMs.length === 0 ? (
        <Text style={styles.emptyText}>Henüz bir eSIM satın almadınız.</Text>
      ) : (
        <FlatList
          data={myESIMs}
          renderItem={({ item }) => <Text>{item.id}</Text>}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { ...FONTS.h1, color: COLORS.text, padding: 24 },
  emptyText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
export default MyESIMsScreen;
