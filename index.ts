import "expo-router/entry";
import BackgroundFetch from "react-native-background-fetch";
import { wishlistBgTask } from "./utils/wishlist";
import mobileAds from "react-native-google-mobile-ads";
import { onlineManager } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

// Initialize on app start
mobileAds()
  .initialize()
  .then((adapterStatuses) => console.log(adapterStatuses));

BackgroundFetch.registerHeadlessTask(async (event) => {
  let taskId = event.taskId;
  let isTimeout = event.timeout;
  if (isTimeout) {
    console.log("[BackgroundFetch] Headless TIMEOUT:", taskId);
    BackgroundFetch.finish(taskId);
    return;
  }

  await wishlistBgTask();
  BackgroundFetch.finish(taskId);
});
