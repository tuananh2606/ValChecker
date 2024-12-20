type StorefrontResponse = {
  FeaturedBundle: {
    Bundle: {
      /** UUID */
      ID: string;
      /** UUID */
      DataAssetID: string;
      /** Currency ID */
      CurrencyID: string;
      Items: {
        Item: {
          /** Item Type ID */
          ItemTypeID: string;
          /** Item ID */
          ItemID: string;
          Amount: number;
        };
        BasePrice: number;
        /** Currency ID */
        CurrencyID: string;
        DiscountPercent: number;
        DiscountedPrice: number;
        IsPromoItem: boolean;
      }[];
      ItemOffers:
        | {
            /** UUID */
            BundleItemOfferID: string;
            Offer: {
              OfferID: string;
              IsDirectPurchase: boolean;
              /** Date in ISO 8601 format */
              StartDate: string;
              Cost: {
                [x: string]: number;
              };
              Rewards: {
                /** Item Type ID */
                ItemTypeID: string;
                /** Item ID */
                ItemID: string;
                Quantity: number;
              }[];
            };
            DiscountPercent: number;
            DiscountedCost: {
              [x: string]: number;
            };
          }[]
        | null;
      TotalBaseCost: {
        [x: string]: number;
      } | null;
      TotalDiscountedCost: {
        [x: string]: number;
      } | null;
      TotalDiscountPercent: number;
      DurationRemainingInSeconds: number;
      WholesaleOnly: boolean;
    };
    Bundles: {
      /** UUID */
      ID: string;
      /** UUID */
      DataAssetID: string;
      /** Currency ID */
      CurrencyID: string;
      Items: {
        Item: {
          /** Item Type ID */
          ItemTypeID: string;
          /** Item ID */
          ItemID: string;
          Amount: number;
        };
        BasePrice: number;
        /** Currency ID */
        CurrencyID: string;
        DiscountPercent: number;
        DiscountedPrice: number;
        IsPromoItem: boolean;
      }[];
      ItemOffers:
        | {
            /** UUID */
            BundleItemOfferID: string;
            Offer: {
              OfferID: string;
              IsDirectPurchase: boolean;
              /** Date in ISO 8601 format */
              StartDate: string;
              Cost: {
                [x: string]: number;
              };
              Rewards: {
                /** Item Type ID */
                ItemTypeID: string;
                /** Item ID */
                ItemID: string;
                Quantity: number;
              }[];
            };
            DiscountPercent: number;
            DiscountedCost: {
              [x: string]: number;
            };
          }[]
        | null;
      TotalBaseCost: {
        [x: string]: number;
      } | null;
      TotalDiscountedCost: {
        [x: string]: number;
      } | null;
      TotalDiscountPercent: number;
      DurationRemainingInSeconds: number;
      WholesaleOnly: boolean;
    }[];
    BundleRemainingDurationInSeconds: number;
  };
  SkinsPanelLayout: {
    SingleItemOffers: string[];
    SingleItemStoreOffers: {
      OfferID: string;
      IsDirectPurchase: boolean;
      /** Date in ISO 8601 format */
      StartDate: string;
      Cost: {
        [x: string]: number;
      };
      Rewards: {
        /** Item Type ID */
        ItemTypeID: string;
        /** Item ID */
        ItemID: string;
        Quantity: number;
      }[];
    }[];
    SingleItemOffersRemainingDurationInSeconds: number;
  };
  UpgradeCurrencyStore: {
    UpgradeCurrencyOffers: {
      /** UUID */
      OfferID: string;
      /** Item ID */
      StorefrontItemID: string;
      Offer: {
        OfferID: string;
        IsDirectPurchase: boolean;
        /** Date in ISO 8601 format */
        StartDate: string;
        Cost: {
          [x: string]: number;
        };
        Rewards: {
          /** Item Type ID */
          ItemTypeID: string;
          /** Item ID */
          ItemID: string;
          Quantity: number;
        }[];
      };
      DiscountedPercent: number;
    }[];
  };
  AccessoryStore: {
    AccessoryStoreOffers: {
      Offer: {
        OfferID: string;
        IsDirectPurchase: boolean;
        /** Date in ISO 8601 format */
        StartDate: string;
        Cost: {
          [x: string]: number;
        };
        Rewards: {
          /** Item Type ID */
          ItemTypeID: string;
          /** Item ID */
          ItemID: string;
          Quantity: number;
        }[];
      };
      /** UUID */
      ContractID: string;
    }[];
    AccessoryStoreRemainingDurationInSeconds: number;
    /** UUID */
    StorefrontID: string;
  };
  /** Night market */
  BonusStore?:
    | {
        BonusStoreOffers: {
          /** UUID */
          BonusOfferID: string;
          Offer: {
            OfferID: string;
            IsDirectPurchase: boolean;
            /** Date in ISO 8601 format */
            StartDate: string;
            Cost: {
              [x: string]: number;
            };
            Rewards: {
              /** Item Type ID */
              ItemTypeID: string;
              /** Item ID */
              ItemID: string;
              Quantity: number;
            }[];
          };
          DiscountPercent: number;
          DiscountCosts: {
            [x: string]: number;
          };
          IsSeen: boolean;
        }[];
        BonusStoreRemainingDurationInSeconds: number;
      }
    | undefined;
};

type PricesResponse = {
  Offers: {
    OfferID: string;
    IsDirectPurchase: boolean;
    /** Date in ISO 8601 format */
    StartDate: string;
    Cost: {
      [x: string]: number;
    };
    Rewards: {
      /** Item Type ID */
      ItemTypeID: string;
      /** Item ID */
      ItemID: string;
      Quantity: number;
    }[];
  }[];
};

type WalletResponse = {
  Balances: {
    [x: string]: number;
  };
};

type EntitlementResponse = {
  entitlements_token: string;
};

type NameServiceResponse = {
  DisplayName: string;
  /** Player UUID */
  Subject: string;
  GameName: string;
  TagLine: string;
}[];

type AccountXPResponse = {
  Version: number;
  /** Player UUID */
  Subject: string;
  Progress: {
    Level: number;
    XP: number;
  };
  History: {
    /** Match ID */
    ID: string;
    /** Date in ISO 8601 format */
    MatchStart: string;
    StartProgress: {
      Level: number;
      XP: number;
    };
    EndProgress: {
      Level: number;
      XP: number;
    };
    XPDelta: number;
    XPSources: {
      ID: "time-played" | "match-win" | "first-win-of-the-day";
      Amount: number;
    }[];
    XPMultipliers: unknown[];
  }[];
  /** Date in ISO 8601 format */
  LastTimeGrantedFirstWin: string;
  /** Date in ISO 8601 format */
  NextTimeFirstWinAvailable: string;
};

type ContractsResponse = {
  Version: number;
  /** Player UUID */
  Subject: string;
  Contracts: {
    /** UUID */
    ContractDefinitionID: string;
    ContractProgression: {
      TotalProgressionEarned: number;
      TotalProgressionEarnedVersion: number;
      HighestRewardedLevel: {
        [x: string]: {
          Amount: number;
          Version: number;
        };
      };
    };
    ProgressionLevelReached: number;
    ProgressionTowardsNextLevel: number;
  }[];
  ProcessedMatches: {
    /** Match ID */
    ID: string;
    /** Milliseconds since epoch */
    StartTime: number;
    XPGrants: {
      GamePlayed: number;
      GameWon: number;
      RoundPlayed: number;
      RoundWon: number;
      Missions: {};
      Modifier: {
        Value: number;
        BaseMultiplierValue: number;
        Modifiers: {
          Value: number;
          Name: "RESTRICTIONS_XP" | "PREMIUM_CONTRACT_XP";
          BaseOnly: boolean;
        }[];
      };
      NumAFKRounds: number;
    } | null;
    RewardGrants: {} | null;
    MissionDeltas: {
      [x: string]: {
        /** UUID */
        ID: string;
        Objectives: {
          [x: string]: number;
        };
        ObjectiveDeltas: {
          [x: string]: {
            /** UUID */
            ID: string;
            ProgressBefore: number;
            ProgressAfter: number;
          };
        };
      };
    } | null;
    ContractDeltas: {
      [x: string]: {
        /** UUID */
        ID: string;
        TotalXPBefore: number;
        TotalXPAfter: number;
      };
    } | null;
    CouldProgressMissions: boolean;
  }[];
  /** UUID */
  ActiveSpecialContract: string;
  Missions: {
    /** UUID */
    ID: string;
    Objectives: {
      [x: string]: number;
    };
    Complete: boolean;
    /** Date in ISO 8601 format */
    ExpirationTime: string;
  }[];
  MissionMetadata: {
    NPECompleted: boolean;
    /** Date in ISO 8601 format */
    WeeklyCheckpoint: string;
    /** Date in ISO 8601 format */
    WeeklyRefillTime: string;
  };
};
