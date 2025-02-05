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
  swatch: string;
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

interface ValorantSeason {
  uuid: string;
  displayName: string;
  title: string;
  type: string;
  startTime: Date;
  endTime: Date;
  parentUuid: string;
  assetPath: string;
}
interface ValorantCompetitiveTiers {
  uuid: string;
  assetObjectName: string;
  tiers: ValorantCompetitiveTier[];
}

interface ValorantCompetitiveTier {
  tier: number;
  tierName: string;
  division: string;
  divisionName: string;
  color: string;
  backgroundColor: string;
  smallIcon: string;
  largeIcon: string;
  rankTriangleDownIcon?: string;
  rankTriangleUpIcon?: string;
}

interface ValorantMission {
  uuid: string;
  displayName?: string;
  title: string;
  type: string;
  xpGrant: number;
  progressToComplete: number;
  activationDate: string;
  expirationDate: string;
  tags?: string;
  objectives: {
    objectiveUuid: string;
    value: number;
  }[];
  assetPath: string;
}

interface ValorantLevelBorder {
  uuid: string;
  displayName: string;
  startingLevel: number;
  levelNumberAppearance: string;
  smallPlayerCardAppearance: string;
  assetPath: string;
}

interface ValorantMap {
  uuid: string;
  displayName: string;
  narrativeDescription?: string;
  tacticalDescription: string;
  coordinates: string;
  displayIcon: string;
  listViewIcon: string;
  listViewIconTall: string;
  splash: string;
  stylizedBackgroundImage: string;
  premierBackgroundImage: string;
  assetPath: string;
  mapUrl: string;
}

interface ValorantCharacter {
  uuid: string;
  displayName: string;
  description: string;
  developerName: string;
  releaseDate: string;
  characterTags?: string[];
  displayIcon: string;
  displayIconSmall: string;
  bustPortrait: string;
  fullPortrait: string;
  fullPortraitV2: string;
  killfeedPortrait: string;
  background: string;
  backgroundGradientColors: string[];
  assetPath: string;
  isFullPortraitRightFacing: boolean;
  isPlayableCharacter: boolean;
  isAvailableForTest: boolean;
  isBaseContent: boolean;
  role: {
    uuid: string;
    displayName: string;
    description: string;
    displayIcon: string;
    assetPath: string;
  };
  recruitmentData?: {
    counterId: string;
    milestoneId: string;
    milestoneThreshold: number;
    useLevelVpCostOverride: boolean;
    levelVpCostOverride: number;
    startDate: string;
    endDate: string;
  };
  abilities: {
    slot: string;
    displayName: string;
    description: string;
    displayIcon: string;
  }[];
  voiceLine?: {
    minDuration: number;
    maxDuration: number;
    mediaList: {
      id: number;
      wwise: string;
      wave: string;
    }[];
  };
}
