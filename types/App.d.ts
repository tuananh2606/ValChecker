interface SkinShopItem extends ValorantSkin {
  price: number;
}

interface BattlePassItem {
  uuid: string;
  displayIcon?: string;
  displayName: string;
  largeArt?: string;
  fullIcon?: String;
  fullTransparentIcon?: string;
  type?: string;
}

interface BattlePassLevelsItem extends BattlePassItem {
  xp: string;
}

interface BattlePass {
  freeRewards: {
    uuid: string;
    displayIcon?: string;
    displayName: string;
    largeArt?: string;
    fullIcon?: String;
    type?: string;
  }[];
  levels: {
    uuid: string;
    displayIcon?: string;
    displayName: string;
    largeArt?: string;
    fullIcon?: String;
    xp: int;
    type?: string;
  }[];
}

interface AccessoryShopItem {
  uuid: string;
  displayName: string;
  displayIcon?: string;
  fullIcon?: string;
  fullTransparentIcon?: string;
  wideArt?: string;
  largeArt?: string;
  titleText?: string;
  price: number;
  type: string;
}

interface GalleryItem extends ValorantSkin {
  onWishlist: boolean;
}

interface NightMarketItem extends SkinShopItem {
  discountedPrice: number;
  discountPercent: number;
}

interface BundleShopItem extends ValorantBundle {
  price: number;
  items: SkinShopItem[];
}

interface IPlayerItem {
  IsAnonymized: boolean;
  IsBanned: boolean;
  PlayerCardID: string;
  TitleID: string;
  competitiveTier: number;
  gameName: string;
  leaderboardRank: number;
  numberOfWins: number;
  puuid: string;
  rankedRating: number;
  tagLine: string;
  rankTier?: ValorantCompetitiveTier;
}

interface Balance {
  vp: number;
  rad: number;
  fag: number;
}

interface Progress {
  level: number;
  xp: number;
}
