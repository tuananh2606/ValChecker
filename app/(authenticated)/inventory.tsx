import TabButtons, { TabButtonType } from "@/components/TabButtons";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InventoryScreen() {
  return (
    <View>
      <View>
        <Text>Card</Text>
      </View>
      <View>
        <Text>Spray</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width: 350,
    height: 275,
  },
});
