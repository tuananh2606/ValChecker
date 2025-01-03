import { Dimensions, Platform } from "react-native";

export const TypeBattlePass = "Season";

export const VCurrencies = {
  VP: "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741", // VP
  RAD: "e59aa87c-4cbf-517a-5983-6e81511be9b7", // Radianite Points
  FAG: "f08d4ae3-939c-4576-ab26-09ce1f23bb37", // Free Agents
  KC: "85ca954a-41f2-ce94-9b45-8ca3dd39a00d", // Kingdom Credits
};

export const VItemTypes = {
  SkinLevel: "e7c63390-eda7-46e0-bb7a-a6abdacd2433",
  SkinChroma: "3ad1b2b2-acdb-4524-852f-954a76ddae0a",
  Agent: "01bb38e1-da47-4e6a-9b3d-945fe4655707",
  ContractDefinition: "f85cb6f7-33e5-4dc8-b609-ec7212301948",
  Buddy: "dd3bf334-87f3-40bd-b043-682a57a8dc3a",
  Spray: "d5f120f8-ff8c-4aac-92ea-f2b5acbe9475",
  PlayerCard: "3f296c07-64c3-494c-923b-fe692a4fa1bd",
  PlayerTitle: "de7caa6b-adf7-4588-bbd1-143831e786c6",
};

export const VMissions = {
  "2374d513-4508-aab4-cf0c-d7b166fb46d7": {
    title: "Kill enemies",
    target: 100,
  },
  "f2294642-4c5c-b89e-fdc3-a68bb46ec1a1": {
    title: "Deal damage",
    target: 18000,
  },
  "d6c42ee5-4a94-61ce-8a72-43bac02f51c9": {
    title: "Purchase items from the armory",
    target: 200,
  },
};

export const VSprayEquipSlot = {
  "04af080a-4071-487b-61c0-5b9c0cfaac74": 0,
  "5863985e-43ac-b05d-cb2d-139e72970014": 1,
  "7cdc908e-4f69-9140-a604-899bd879eed1": 2,
  "0814b2fe-4512-60a4-5288-1fbdcec6ca48": 3,
};

export const regions = ["eu", "na", "ap", "kr"];
export const getAccessTokenFromUri = (uri: string) => {
  return (
    uri.match(
      /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/
    ) as any
  )[1];
};
export const convertSecstoHhMmSs = (remainingTime: number) => {
  const days = Math.floor(remainingTime / 3600 / 24);
  const hours = Math.floor((remainingTime - days * 24 * 3600) / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  return `${days >= 1 ? `${days.toString().padStart(2, "0")}:` : ""}${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const convertDatetoSeconds = (date: string) => {
  const newDate = new Date(date);
  const now = Date.now();

  return Math.floor((newDate.getTime() - now) / 1000);
};
export const getDeviceWidth = () => {
  return Dimensions.get("window").width;
};
export const getDeviceHeight = () => {
  return Dimensions.get("window").height;
};
