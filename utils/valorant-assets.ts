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
  contentTiers: ValorantContentTier[];
  currencies: ValorantCurrencies[];
  competitiveTiers: ValorantCompetitiveTier[];
};

let assets: StoredAssets = {
  skins: [],
  buddies: [],
  sprays: [],
  cards: [],
  titles: [],
  contentTiers: [],
  currencies: [],
  competitiveTiers: [],
};
export const FILE_LOCATION =
  FileSystem.cacheDirectory + "/valchecker_assets.json";

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

  let [
    skins,
    contentTiers,
    buddies,
    sprays,
    cards,
    titles,
    currencies,
    competitiveTiers,
  ] = await Promise.all([
    fetchSkins(language),
    fetchContentTier(language),
    fetchBuddies(language),
    fetchSprays(language),
    fetchPlayerCards(language),
    fetchPlayerTitles(language),
    fetchCurrencies(language),
    fetchCompetitiveTier(language),
  ]);

  let skinsWithContentTier: ValorantSkin[] = [];
  if (skins && contentTiers) {
    for (let i = 0; i < skins.length; i++) {
      const contierTierSkin = contentTiers.find(
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
  assets.buddies = buddies;
  assets.sprays = sprays;
  assets.cards = cards;
  assets.titles = titles;
  assets.contentTiers = contentTiers;
  assets.currencies = currencies;
  assets.competitiveTiers = competitiveTiers[competitiveTiers.length - 1].tiers;

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

export async function fetchSeasons(language?: string) {
  const res = await axios.request<{ data: ValorantSeason[] }>({
    url: `https://valorant-api.com/v1/seasons?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchSeasonByID(seasonId: string, language?: string) {
  const res = await axios.request<{ data: ValorantSeason }>({
    url: `https://valorant-api.com/v1/seasons/${seasonId}?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchCompetitiveTier(language?: string) {
  const res = await axios.request<{ data: ValorantCompetitiveTiers[] }>({
    url: `https://valorant-api.com/v1/competitivetiers?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}

export async function getMissions(language?: string) {
  const res = await axios.request<{ data: ValorantMission[] }>({
    url: `https://valorant-api.com/v1/missions?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}

export async function getLevelBorders(language?: string) {
  const res = await axios.request<{ data: ValorantLevelBorder[] }>({
    url: `https://valorant-api.com/v1/levelborders?language=${
      language ?? getVAPILang()
    }`,
    method: "GET",
  });

  return res.data.data;
}
