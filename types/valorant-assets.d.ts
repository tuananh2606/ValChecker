interface ValorantSkin {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid?: string;
  contentTier: ValorantContentTier;
  displayIcon?: string;
  wallpaper?: string;
  assetPath: string;
  chromas: ISkinChroma[];
  levels: ISkinLevel[];
}

interface ValorantSkinResponse {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid?: string;
  displayIcon?: string;
  wallpaper?: string;
  assetPath: string;
  chromas: ISkinChroma[];
  levels: ISkinLevel[];
}

interface ISkinLevel {
  uuid: string;
  displayName: string;
  displayIcon: string;
  streamedVideo: string | null;
  assetPath: string;
}

interface ISkinChroma {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
  fullRender: string;
  streamedVideo: string | null;
  assetPath: string;
}

interface ValorantBuddyAccessory {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  themeUuid: string;
  displayIcon?: string;
  assetPath: string;
  levels: ValorantBuddyLevel[];
}

interface ValorantTitleAccessory {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  titleText: string;
  assetPath: string;
}

interface ValorantCardAccessory {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  themeUuid: string;
  displayIcon: string;
  smallArt: string;
  wideArt: string;
  largeArt: string;
  assetPath: string;
}

interface ValorantSprayAccessory {
  uuid: string;
  displayName: string;
  category: string;
  themeUuid: string;
  isNullSpray: boolean;
  hideIfNotOwned: boolean;
  displayIcon: string;
  fullIcon: string;
  fullTransparentIcon: string;
  animationPng: string;
  animationGif: string;
  assetPath: string;
  levels: ValorantSprayLevel[];
}

interface ValorantBuddyLevel {
  uuid: string;
  charmLevel: number;
  hideIfNotOwned: boolean;
  displayName: string;
  displayIcon: string;
  assetPath: string;
}

interface ValorantSprayLevel {
  uuid: string;
  sprayLevel: number;
  displayName: string;
  displayIcon: string;
  assetPath: string;
}

interface ValorantBundle {
  uuid: string;
  displayName: string;
  displayNameSubText?: string;
  description: string;
  extraDescription?: string;
  promoDescription?: string;
  useAdditionalContext: boolean;
  displayIcon: string;
  displayIcon2: string;
  verticalPromoImage?: string;
  assetPath: string;
}

interface ValorantSkinChroma {
  uuid: string;
  displayName: string;
  displayIcon?: string;
  fullRender: string;
  swatch?: string;
  streamedVideo?: string;
  assetPath: string;
}

interface ValorantSkinLevel {
  uuid: string;
  displayName: string;
  levelItem?: string;
  displayIcon?: string;
  streamedVideo?: string;
  assetPath: string;
}

interface ValorantBundle {
  uuid: string;
  displayName: string;
  displayNameSubText: any;
  description: string;
  extraDescription: any;
  promoDescription: any;
  useAdditionalContext: boolean;
  displayIcon: string;
  displayIcon2: string;
  logoIcon: any;
  verticalPromoImage: string;
  assetPath: string;
}
interface ValorantContentTier {
  uuid: string;
  displayName: string;
  devName: string;
  rank: int;
  juiceValue: int;
  juiceCost: int;
  highlightColor: string;
  displayIcon: string;
  assetPath: string;
}
interface ValorantContract {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
  shipIt: boolean;
  useLevelVPCostOverride: boolean;
  levelVPCostOverride: int;
  freeRewardScheduleUuid: string;
  content: {
    relationType: string;
    relationUuid: string;
    chapters: {
      isEpilogue: boolean;
      levels: {
        reward: {
          type: string;
          uuid: string;
          amount: int;
          isHighlighted: boolean;
        };
        xp: int;
        vpCost: int;
        isPurchasableWithVP: boolean;
        doughCost: int;
        isPurchasableWithDough: boolean;
      }[];
      freeRewards:
        | {
            amount: int;
            isHighlighted: boolean;
            type: string;
            uuid: string;
          }[]
        | null;
    }[];
    premiumRewardScheduleUuid: string | null;
    premiumVPCost: int;
  };
  assetPath: string;
}
interface ValorantCurrencies {
  uuid: string;
  displayName: string;
  displayNameSingular: string;
  displayIcon: string;
  largeIcon: string;
  rewardPreviewIcon: string;
  assetPath: string;
}
