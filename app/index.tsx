import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

export default function Index() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const checkFirstLaunch = async () => {
    try {
      const onboarded = await AsyncStorage.getItem("onboarded");
      if (onboarded == "1") setShowOnboarding(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  // const href = (showOnboarding ? "onboarding" : "(login)/login") as Href;

  return (
    <Redirect
      href={(showOnboarding ? "onboarding" : "(login)/login") as Href}
    />
  );
}
