import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getAccessTokenFromUri, VCurrencies, VItemTypes } from "./misc";
//import https from "https-browserify";
import { fetchBundle, fetchVersion, getAssets } from "./valorant-assets";
import * as SecureStore from "expo-secure-store";
import CookieManager from "@react-native-cookies/cookies";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

axios.interceptors.request.use(
  function (config) {
    if (__DEV__) console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const refreshAndRetryQueue: any[] = [];

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 400) {
      try {
        // Refresh the access token
        const version = await fetchVersion();
        const res = await reAuth(version);
        const accessToken = getAccessTokenFromUri(
          res.data.response.parameters.uri
        );
        const entitlementsToken = await getEntitlementsToken(accessToken);
        if (accessToken && entitlementsToken) {
          originalRequest._retry = true;
          await SecureStore.setItemAsync("access_token", accessToken);
          await SecureStore.setItemAsync(
            "entitlements_token",
            entitlementsToken
          );
          // Update the request headers with the new access token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers["X-Riot-Entitlements-JWT"] =
            entitlementsToken;

          // Retry all requests in the queue with the new token
          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            axios
              .request(config)
              .then((response) => resolve(response))
              .catch((err) => reject(err));
          });

          // Clear the queue
          refreshAndRetryQueue.length = 0;

          // Retry the original request
          return axios(originalRequest);
        }
      } catch (err) {
        await CookieManager.clearAll(true);
        await AsyncStorage.removeItem("region");
        router.replace("/(login)");
      }

      // Add the original request to the queue
      return new Promise((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    }

    return Promise.reject(error);
  }
);

export let defaultUser = {
  id: "",
  name: "",
  tagLine: "",
  region: "",
  shops: {
    main: [] as SkinShopItem[],
    bundles: [] as BundleShopItem[],
    nightMarket: [] as NightMarketItem[],
    accessory: [] as AccessoryShopItem[],
    remainingSecs: {
      main: 0,
      bundles: [0],
      nightMarket: 0,
      accessory: 0,
    },
  },
  balances: {
    vp: 0,
    rad: 0,
    fag: 0,
    kc: 0,
  },
  progress: {
    level: 0,
    xp: 0,
  },
};

const extraHeaders = () => ({
  "X-Riot-ClientVersion":
    getAssets().riotClientVersion || "43.0.1.4195386.4190634",
  "X-Riot-ClientPlatform":
    "eyJwbGF0Zm9ybVR5cGUiOiJQQyIsInBsYXRmb3JtT1MiOiJXaW5kb3dzIiwicGxhdGZvcm1PU1ZlcnNpb24iOiIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwicGxhdGZvcm1DaGlwc2V0IjoiVW5rbm93biJ9",
});

export async function getEntitlementsToken(accessToken: string) {
  const res = await axios.request<EntitlementResponse>({
    url: getUrl("entitlements"),
    method: "POST",
    headers: {
      ...extraHeaders(),
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {},
  });

  return res.data.entitlements_token;
}

export function getUserId(accessToken: string) {
  const data = jwtDecode(accessToken) as any;

  return data.sub;
}

export async function getUsername(
  accessToken: string,
  entitlementsToken: string,
  userId: string,
  region: string
) {
  const res = await axios.request<NameServiceResponse>({
    url: getUrl("name", region),
    method: "PUT",
    headers: {
      ...extraHeaders(),
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
    data: [userId],
  });

  return res.data[0].GameName !== ""
    ? { name: res.data[0].GameName, tagLine: res.data[0].TagLine }
    : { name: "?", tagLine: "?" };
}

export async function getShop(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string
) {
  const res = await axios.request<StorefrontResponse>({
    url: getUrl("storefront", region, userId),
    method: "POST",
    headers: {
      ...extraHeaders(),
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
    data: {},
  });

  return res.data;
}

export async function parseShop(shop: StorefrontResponse) {
  /* NORMAL SHOP */
  let singleItemStoreOffers = shop.SkinsPanelLayout.SingleItemStoreOffers;
  let main: SkinShopItem[] = [];
  const { skins, buddies, cards, sprays, titles } = getAssets();

  for (var i = 0; i < singleItemStoreOffers.length; i++) {
    const offer = singleItemStoreOffers[i];

    const skin = skins.find((_skin) => _skin.levels[0].uuid === offer.OfferID);

    if (skin) {
      main[i] = {
        ...skin,
        price: offer.Cost[VCurrencies.VP],
      };
    }
  }

  /* BUNDLES */
  const bundles: BundleShopItem[] = [];
  for (var b = 0; b < shop.FeaturedBundle.Bundles.length; b++) {
    const bundle = shop.FeaturedBundle.Bundles[b];
    const bundleAsset = await fetchBundle(bundle.DataAssetID);

    bundles.push({
      ...bundleAsset,
      price: bundle.Items.map((item) => item.DiscountedPrice).reduce(
        (a, b) => a + b
      ),
      items: bundle.Items.filter(
        (item) => item.Item.ItemTypeID === VItemTypes.SkinLevel
      ).map((item) => {
        const skin = skins.find(
          (_skin) => _skin.levels[0].uuid === item.Item.ItemID
        ) as ValorantSkin;

        return {
          ...skin,
          price: item.BasePrice,
        };
      }),
    });
  }

  /* NIGHT MARKET */
  let nightMarket: NightMarketItem[] = [];
  if (shop.BonusStore) {
    var bonusStore = shop.BonusStore.BonusStoreOffers;
    for (var k = 0; k < bonusStore.length; k++) {
      let itemid = bonusStore[k].Offer.Rewards[0].ItemID;
      const skin = skins.find(
        (_skin) => _skin.levels[0].uuid === itemid
      ) as ValorantSkin;
      nightMarket.push({
        ...skin,
        price: bonusStore[k].Offer.Cost[VCurrencies.VP],
        discountedPrice: bonusStore[k].DiscountCosts[VCurrencies.VP],
        discountPercent: bonusStore[k].DiscountPercent,
      });
    }
  }

  /* ACCESSORY SHOP */
  let accessoryStore = shop.AccessoryStore.AccessoryStoreOffers;
  let accessory: AccessoryShopItem[] = [];
  for (var i = 0; i < accessoryStore.length; i++) {
    const accessoryItem = accessoryStore[i].Offer;

    // This is a pain because of different return types
    const buddy = buddies.find(
      (_skin) => _skin.levels[0].uuid === accessoryItem.Rewards[0].ItemID
    );
    const card = cards.find(
      (_skin) => _skin.uuid === accessoryItem.Rewards[0].ItemID
    );
    const title = titles.find(
      (_skin) => _skin.uuid === accessoryItem.Rewards[0].ItemID
    );
    const spray = sprays.find(
      (_skin) => _skin.uuid === accessoryItem.Rewards[0].ItemID
    );

    if (buddy) {
      accessory[i] = {
        uuid: buddy.levels[0].uuid,
        displayName: buddy.displayName,
        displayIcon: buddy.levels[0].displayIcon,
        price: accessoryItem.Cost[VCurrencies.KC],
        type: "buddy",
      };
    } else if (card) {
      accessory[i] = {
        uuid: card.uuid,
        displayName: card.displayName,
        displayIcon: card.displayIcon,
        wideArt: card.wideArt,
        largeArt: card.largeArt,
        price: accessoryItem.Cost[VCurrencies.KC],
        type: "card",
      };
    } else if (title) {
      accessory[i] = {
        uuid: title.uuid,
        displayName: title.displayName,
        titleText: title.titleText,
        price: accessoryItem.Cost[VCurrencies.KC],
        type: "title",
      };
    } else if (spray) {
      accessory[i] = {
        uuid: spray.uuid,
        displayName: spray.displayName,
        displayIcon: spray.displayIcon,
        fullIcon: spray.fullIcon,
        fullTransparentIcon: spray.fullTransparentIcon,
        price: accessoryItem.Cost[VCurrencies.KC],
        type: "spray",
      };
    }
  }

  return {
    main,
    bundles,
    nightMarket,
    accessory,
    remainingSecs: {
      main:
        shop.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds ?? 0,
      bundles: shop.FeaturedBundle.Bundles.map(
        (bundle) => bundle.DurationRemainingInSeconds
      ) ?? [0],
      nightMarket: shop.BonusStore?.BonusStoreRemainingDurationInSeconds ?? 0,
      accessory:
        shop.AccessoryStore.AccessoryStoreRemainingDurationInSeconds ?? 0,
    },
  };
}

export function parseSeason(seasons: ValorantSeason[]) {
  let seasonsAvailableData = [];
  const parentSeasons = seasons.slice(1).filter((season) => !season.parentUuid);
  const childSeasons = seasons.filter(
    (season) =>
      season.parentUuid &&
      new Date(season.startTime).getTime() < new Date().getTime()
  );
  const processSeasons = parentSeasons.filter(
    (pS) => new Date(pS.startTime).getTime() < new Date().getTime()
  );
  for (let i = 0; i < processSeasons.length; i++) {
    for (let j = 0; j < childSeasons.length; j++) {
      if (childSeasons[j].parentUuid === processSeasons[i].uuid) {
        seasonsAvailableData.push({
          label: `${processSeasons[i].displayName} - ${childSeasons[j].displayName}`,
          value: childSeasons[j].uuid,
        });
      }
    }
  }
  return seasonsAvailableData;
}

export async function getBalances(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string
) {
  const res = await axios.request<WalletResponse>({
    url: getUrl("wallet", region, userId),
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return {
    vp: res.data.Balances[VCurrencies.VP],
    rad: res.data.Balances[VCurrencies.RAD],
    fag: res.data.Balances[VCurrencies.FAG],
    kc: res.data.Balances[VCurrencies.KC],
  };
}

export async function getProgress(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string
) {
  const res = await axios.request<AccountXPResponse>({
    url: getUrl("playerxp", region, userId),
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return {
    level: res.data.Progress.Level,
    xp: res.data.Progress.XP,
  };
}

export async function getMissionsMetadata(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string
) {
  const res = await axios.request<ContractsResponse>({
    url: getUrl("contracts", region, userId),
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return {
    MissionMetadata: res.data.MissionMetadata,
    Missions: res.data.Missions,
  };
}

const detectType = (type: string, uuid: string): BattlePassItem | undefined => {
  const { skins, buddies, cards, sprays, titles, currencies } = getAssets();

  switch (type) {
    case "PlayerCard":
      const card = cards.find((_card) => _card.uuid === uuid);
      return { ...card, type: type } as BattlePassItem;
    case "Title":
      const title = titles.find((_title) => _title.uuid === uuid);
      return { ...title, type: type } as BattlePassItem;
    case "EquippableSkinLevel":
      const skin = skins.find((_skin) => _skin.levels[0].uuid === uuid);
      return skin as BattlePassItem;
    case "EquippableCharmLevel":
      const weaponCharm = buddies.find(
        (_weaponCharm) => _weaponCharm.levels[0].uuid === uuid
      );
      return weaponCharm as BattlePassItem;
    case "Currency":
      const currency = currencies.find(
        (_currencies) => _currencies.uuid === uuid
      );
      return { ...currency, type: type } as BattlePassItem;
    case "Spray":
      const spray = sprays.find((_spray) => _spray.uuid === uuid);
      return { ...spray, type: type } as BattlePassItem;
  }
};

export async function parseBattlePass(contract: ValorantContract) {
  /* Battle Pass */
  let chapters = contract.content.chapters;
  let battlePass: BattlePass[] = [];
  for (let i = 0; i < chapters.length; i++) {
    let freeRewards = chapters[i].freeRewards;
    let levels = chapters[i].levels;
    let newFreeRewards: BattlePassItem[] = [];
    let newLevels: BattlePassLevelsItem[] = [];

    if (freeRewards) {
      for (let j = 0; j < freeRewards.length; j++) {
        let freeRewardsItem = freeRewards[j];
        const newItem = detectType(freeRewardsItem.type, freeRewardsItem.uuid);
        if (newItem) {
          newFreeRewards.push(newItem);
        }
      }
    }
    for (let l = 0; l < levels.length; l++) {
      let levelsItem = levels[l].reward;
      const newItem = detectType(levelsItem.type, levelsItem.uuid);
      if (newItem) {
        newLevels.push({ ...newItem, xp: levels[l].xp });
      }
    }
    if (newLevels) {
      battlePass[i] = {
        freeRewards: newFreeRewards,
        levels: newLevels,
      };
    }
  }
  return battlePass;
}
export async function fetchContractsByPID(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string
) {
  const res = await axios.request<ContractsResponse>({
    url: getUrl("contracts", region, userId),
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return res.data.Contracts as Contract[];
}

export async function fetchPlayerLoadout(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string
) {
  const res = await axios.request<PlayerLoadoutResponse>({
    url: getUrl("player", region, userId),
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return res.data;
}

export async function fetchPlayerOwnedItems(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string,
  ownedItemType: string
) {
  const res = await axios.request<OwnedItemsResponse>({
    url: getUrl("ownedItem", region, userId, ownedItemType),
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return res.data;
}

export async function fetchLeaderBoard(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  seasonId: string,
  startIndex: number = 0,
  size: number = 50
) {
  const res = await axios.request<LeaderboardResponse>({
    url: `https://pd.${region}.a.pvp.net/mmr/v1/leaderboards/affinity/${region}/queue/competitive/season/${seasonId}?startIndex=${startIndex}&size=${size}`,
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return res.data;
}

export async function fetchPlayerMMR(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string
) {
  const res = await axios.request<PlayerMMRResponse>({
    url: getUrl("playerMMR", region, userId),
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return res.data;
}

export async function fetchPlayerXP(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string
) {
  const res = await axios.request<AccountXPResponse>({
    url: getUrl("playerXP", region, userId),
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return res.data;
}

export async function fetchMatchHistory(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string,
  startIndex: number = 0,
  endIndex: number = 20,
  queue: string = "all"
) {
  const res = await axios.request<MatchHistoryResponse>({
    url: `https://pd.${region}.a.pvp.net/match-history/v1/history/${userId}?startIndex=${startIndex}&endIndex=${endIndex}`,
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return res.data;
}

export async function fetchCompetitiveUpdates(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string,
  startIndex: number = 0,
  endIndex: number = 10
) {
  const res = await axios.request<CompetitiveUpdatesResponse>({
    url: `https://pd.${region}.a.pvp.net/mmr/v1/players/${userId}/competitiveupdates?startIndex=${startIndex}&endIndex=${endIndex}&queue=competitive`,
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return res.data;
}

export async function fetchMatchDetails(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  matchID: string
) {
  const res = await axios.request<MatchDetailsResponse>({
    url: `https://pd.${region}.a.pvp.net/match-details/v1/matches/${matchID}`,
    method: "GET",
    headers: {
      ...extraHeaders(),
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return res.data;
}

export async function parseMatchHistory(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string,
  matchHistory: MatchHistory[]
) {
  /* Match History */
  const { maps, characters, competitiveTiers } = getAssets();
  const promises = matchHistory.map((match) =>
    fetchMatchDetails(accessToken, entitlementsToken, region, match.MatchID)
  );
  const competitiveUpdates = await fetchCompetitiveUpdates(
    accessToken,
    entitlementsToken,
    region,
    userId,
    0,
    15
  );
  const matchDetailsData = await Promise.all(promises);
  let matchHistoryArr: MatchDetails[] = [];
  for (let m = 0; m < matchDetailsData.length; m++) {
    const matchMap = maps.find(
      (map) => map.mapUrl === matchDetailsData[m].matchInfo.mapId
    );
    for (let c = 0; c < matchDetailsData[m].players.length; c++) {
      const character = characters.find(
        (item) => item.uuid === matchDetailsData[m].players[c].characterId
      );
      if (matchDetailsData[m].matchInfo.isRanked) {
        const competitiveTier = competitiveTiers.find(
          (item) => item.tier === matchDetailsData[m].players[c].competitiveTier
        );
        if (competitiveTier) {
          matchDetailsData[m].players[c].competitiveRank = competitiveTier;
        }
      }
      if (character) {
        matchDetailsData[m].players[c].character = {
          uuid: character.uuid,
          displayName: character.displayName,
          displayIcon: character.displayIcon,
        };
      }
    }
    const competitiveUpdate = competitiveUpdates.Matches.find(
      (item) => item.MatchID === matchDetailsData[m].matchInfo.matchId
    );

    if (matchMap) {
      matchHistoryArr.push({
        ...matchDetailsData[m],
        map: {
          uuid: matchMap.uuid,
          displayName: matchMap.displayName,
          listViewIcon: matchMap.listViewIcon,
          splash: matchMap.splash,
          mapUrl: matchMap.mapUrl,
        },
        competitiveUpdates: competitiveUpdate,
      });
    }
  }

  return matchHistoryArr;
}

export const reAuth = (version: string) =>
  axios.request({
    url: "https://auth.riotgames.com/api/v1/authorization",
    method: "POST",
    headers: {
      "User-Agent": `RiotClient/${version} rso-auth (Windows; 10;;Professional, x64)`,
      "Content-Type": "application/json",
    },
    data: {
      client_id: "play-valorant-web-prod",
      nonce: "1",
      redirect_uri: "https://playvalorant.com/opt_in",
      response_type: "token id_token",
      response_mode: "query",
      scope: "account openid",
    },
    // httpsAgent: new https.Agent({
    //   ciphers: [
    //     "TLS_CHACHA20_POLY1305_SHA256",
    //     "TLS_AES_128_GCM_SHA256",
    //     "TLS_AES_256_GCM_SHA384",
    //     "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
    //   ].join(":"),
    //   honorCipherOrder: true,
    //   minVersion: "TLSv1.2",
    // }),
    // withCredentials: true,
  });

function getUrl(
  name: string,
  region?: string,
  userId?: string,
  itemTypeID?: string,
  seasonId?: string,
  startIndex?: number,
  size?: number,
  query?: string
) {
  const URLS: any = {
    auth: "https://auth.riotgames.com/api/v1/authorization/",
    entitlements: "https://entitlements.auth.riotgames.com/api/token/v1/",
    storefront: `https://pd.${region}.a.pvp.net/store/v3/storefront/${userId}`,
    wallet: `https://pd.${region}.a.pvp.net/store/v1/wallet/${userId}`,
    playerxp: `https://pd.${region}.a.pvp.net/account-xp/v1/players/${userId}`,
    contracts: `https://pd.${region}.a.pvp.net/contracts/v1/contracts/${userId}`,
    weapons: "https://valorant-api.com/v1/weapons/",
    offers: `https://pd.${region}.a.pvp.net/store/v1/offers/`,
    name: `https://pd.${region}.a.pvp.net/name-service/v2/players`,
    player: `https://pd.${region}.a.pvp.net/personalization/v2/players/${userId}/playerloadout`,
    ownedItem: `https://pd.${region}.a.pvp.net/store/v1/entitlements/${userId}/${itemTypeID}`,
    playerMMR: `https://pd.${region}.a.pvp.net/mmr/v1/players/${userId}`,
    playerXP: `https://pd.${region}.a.pvp.net/account-xp/v1/players/${userId}`,
    leaderboard: `https://pd.${region}.a.pvp.net/mmr/v1/leaderboards/affinity/${region}/queue/competitive/season/${seasonId}?startIndex=${startIndex}&size=${size}
`,
  };

  return URLS[name];
}
