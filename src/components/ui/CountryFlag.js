import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";

const CountryFlag = ({
  countryCode,
  size = 32,
  style,
  fallbackText = "🌍",
}) => {
  // ISO country code'dan flag emoji'ye çevirme
  const getFlagEmoji = (code) => {
    if (!code || code.length !== 2) return fallbackText;

    const codePoints = code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());

    return String.fromCodePoint(...codePoints);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.flag, { fontSize: size }]}>
        {getFlagEmoji(countryCode)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },

  flag: {
    fontFamily: fonts.family.regular,
  },
});

export default CountryFlag;
