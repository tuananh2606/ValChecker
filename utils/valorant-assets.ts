import axios from "axios";
import { getVAPILang } from "./localization";
import * as FileSystem from "expo-file-system";

type StoredAssets = {
  riotClientVersion?: string;
  language?: string;
  skins: ValorantSkin[];
  buddies: ValorantBuddyAccessory[];
  sprays: ValorantSprayAccessory[];
  cards: ValorantCardAccessory[];
  titles: ValorantTitleAccessory[];
  contentTier: ValorantContentTier[];
  currencies: ValorantCurrencies[];
};

let assets: StoredAssets = {
  skins: [],
  buddies: [],
  sprays: [],
  cards: [],
  titles: [],
  contentTier: [],
  currencies: [],
};
export const FILE_LOCATION =
  FileSystem.cacheDirectory + "/valorant_assets.json";

export function getAssets() {
  return assets;
}

export async function loadAssets() {
  const { exists } = await FileSystem.getInfoAsync(FILE_LOCATION);
  const version = await fetchVersion();
  const language = getVAPILang();

  if (exists) {
    const storedAssets = await FileSystem.readAsStringAsync(FILE_LOCATION);
    const storedAssetsJson: StoredAssets = JSON.parse(storedAssets);

    if (
      storedAssetsJson.riotClientVersion === version &&
      storedAssetsJson.language === language
    ) {
      assets = storedAssetsJson;

      return;
    }
  }
  const skins = await fetchSkins(language);
  const contentTier = await fetchContentTier(language);

  let skinsWithContentTier: ValorantSkin[] = [];
  if (skins && contentTier) {
    for (let i = 0; i < skins.length; i++) {
      const contierTierSkin = contentTier.find(
        (_contentTier) => _contentTier.uuid === skins[i]?.contentTierUuid
      );
      if (contierTierSkin)
        skinsWithContentTier.push({
          ...skins[i],
          contentTier: contierTierSkin,
        });
    }
  }

  assets.skins = skinsWithContentTier;
  assets.riotClientVersion = version;
  assets.language = language;
  assets.buddies = await fetchBuddies(language);
  assets.sprays = await fetchSprays(language);
  assets.cards = await fetchPlayerCards(language);
  assets.titles = await fetchPlayerTitles(language);
  assets.contentTier = contentTier;
  assets.currencies = await fetchCurrencies(language);

  await FileSystem.writeAsStringAsync(FILE_LOCATION, JSON.stringify(assets));
}

export async function fetchVersion() {
  const res = await axios.request({
    url: "https://valorant-api.com/v1/version",
    method: "GET",
  });

  return res.data.data.riotClientVersion;
}

export async function fetchSkins(language?: string) {
  const res = await axios.request<{ data: ValorantSkinResponse[] }>({
    url: `https://valorant-api.com/v1/weapons/skins?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchBuddies(language?: string) {
  const res = await axios.request<{ data: ValorantBuddyAccessory[] }>({
    url: `https://valorant-api.com/v1/buddies?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchSprays(language?: string) {
  const res = await axios.request<{ data: ValorantSprayAccessory[] }>({
    url: `https://valorant-api.com/v1/sprays?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchPlayerCards(language?: string) {
  const res = await axios.request<{ data: ValorantCardAccessory[] }>({
    url: `https://valorant-api.com/v1/playercards?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchPlayerTitles(language?: string) {
  const res = await axios.request<{ data: ValorantTitleAccessory[] }>({
    url: `https://valorant-api.com/v1/playertitles?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchBundle(bundleId: string, language?: string) {
  const res = await axios.request<{ data: ValorantBundle }>({
    url: `https://valorant-api.com/v1/bundles/${bundleId}?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchContentTier(language?: string) {
  const res = await axios.request<{ data: ValorantContentTier[] }>({
    url: `https://valorant-api.com/v1/contenttiers?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });
  return res.data.data;
}

export async function fetchContentTierById(
  contentTierId: string,
  language?: string
) {
  const res = await axios.request<{ data: ValorantContentTier }>({
    url: `https://valorant-api.com/v1/contenttiers/${contentTierId}?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}
export async function fetchContracts(language?: string) {
  const res = await axios.request<{ data: ValorantContract[] }>({
    url: `https://valorant-api.com/v1/contracts?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchCurrencies(language?: string) {
  const res = await axios.request<{ data: ValorantCurrencies[] }>({
    url: `https://valorant-api.com/v1/currencies?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });
  return res.data.data;
}
