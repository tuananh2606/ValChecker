import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { VCurrencies, VItemTypes } from "./misc";
//import https from "https-browserify";
import { fetchBundle, getAssets } from "./valorant-assets";

axios.interceptors.request.use(
  function (config) {
    if (__DEV__) console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  function (error) {
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

export async function getMissions(
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
  itemTypeID?: string
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
  };

  return URLS[name];
}
