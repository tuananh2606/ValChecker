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
  Contracts: Contract[];
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

type Contract = {
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
};

type PlayerLoadoutResponse = {
  /** Player UUID */
  Subject: string;
  Version: number;
  Guns: {
    /** UUID */
    ID: string;
    /** UUID */
    CharmInstanceID?: string | undefined;
    /** UUID */
    CharmID?: string | undefined;
    /** UUID */
    CharmLevelID?: string | undefined;
    /** UUID */
    SkinID: string;
    /** UUID */
    SkinLevelID: string;
    /** UUID */
    ChromaID: string;
    Attachments: unknown[];
  }[];
  Sprays: {
    /** UUID */
    EquipSlotID: string;
    /** UUID */
    SprayID: string;
    SprayLevelID: null;
  }[];
  Identity: {
    /** UUID */
    PlayerCardID: string;
    /** UUID */
    PlayerTitleID: string;
    AccountLevel: number;
    /** UUID */
    PreferredLevelBorderID: string;
    HideAccountLevel: boolean;
  };
  Incognito: boolean;
};

type OwnedItemsResponse = {
  ItemTypeID: string;
  Entitlements: {
    /** UUID */
    TypeID: string;
    /** Item ID */
    ItemID: string;
    /** UUID */
    InstanceID?: string | undefined;
  }[];
};
type LeaderboardResponse = {
  Deployment: string;
  /** Queue ID */
  QueueID: string;
  /** Season ID */
  SeasonID: string;
  Players: {
    /** Card ID */
    PlayerCardID: string;
    /** Title ID */
    TitleID: string;
    IsBanned: boolean;
    IsAnonymized: boolean;
    /** Player UUID */
    puuid: string;
    gameName: string;
    tagLine: string;
    leaderboardRank: number;
    rankedRating: number;
    numberOfWins: number;
    competitiveTier: number;
    rankTier?: ValorantCompetitiveTier;
  }[];
  totalPlayers: number;
  immortalStartingPage: number;
  immortalStartingIndex: number;
  topTierRRThreshold: number;
  tierDetails: {
    [x: string]: {
      rankedRatingThreshold: number;
      startingPage: number;
      startingIndex: number;
    };
  };
  startIndex: number;
  query: string;
};
type CompetitiveUpdatesResponse = {
  Version: number;
  /** Player UUID */
  Subject: string;
  Matches: MatchCompetitiveUpdatesResponse[];
};

type MatchCompetitiveUpdatesResponse = {
  /** Match ID */
  MatchID: string;
  /** Map ID */
  MapID: string;
  /** Season ID */
  SeasonID: string;
  /** Milliseconds since epoch */
  MatchStartTime: number;
  TierAfterUpdate: number;
  TierBeforeUpdate: number;
  RankedRatingAfterUpdate: number;
  RankedRatingBeforeUpdate: number;
  RankedRatingEarned: number;
  RankedRatingPerformanceBonus: number;
  CompetitiveMovement: "MOVEMENT_UNKNOWN";
  AFKPenalty: number;
};

type PlayerMMRResponse = {
  Version: number;
  /** Player UUID */
  Subject: string;
  NewPlayerExperienceFinished: boolean;
  QueueSkills: {
    [x: string]: {
      TotalGamesNeededForRating: number;
      TotalGamesNeededForLeaderboard: number;
      CurrentSeasonGamesNeededForRating: number;
      SeasonalInfoBySeasonID: {
        [x: string]: {
          /** Season ID */
          SeasonID: string;
          NumberOfWins: number;
          NumberOfWinsWithPlacements: number;
          NumberOfGames: number;
          Rank: number;
          CapstoneWins: number;
          LeaderboardRank: number;
          CompetitiveTier: number;
          RankedRating: number;
          WinsByTier: {
            [x: string]: number;
          } | null;
          GamesNeededForRating: number;
          TotalWinsNeededForRank: number;
        };
      };
    };
  };
  LatestCompetitiveUpdate: {
    /** Match ID */
    MatchID: string;
    /** Map ID */
    MapID: string;
    /** Season ID */
    SeasonID: string;
    MatchStartTime: number;
    TierAfterUpdate: number;
    TierBeforeUpdate: number;
    RankedRatingAfterUpdate: number;
    RankedRatingBeforeUpdate: number;
    RankedRatingEarned: number;
    RankedRatingPerformanceBonus: number;
    CompetitiveMovement: "MOVEMENT_UNKNOWN";
    AFKPenalty: number;
  };
  IsLeaderboardAnonymized: boolean;
  IsActRankBadgeHidden: boolean;
};

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

type MatchHistory = {
  /** Match ID */
  MatchID: string;
  /** Milliseconds since epoch */
  GameStartTime: number;
  /** Queue ID */
  QueueID: string;
};

type MatchHistoryResponse = {
  /** Player UUID */
  Subject: string;
  BeginIndex: number;
  EndIndex: number;
  Total: number;
  History: MatchHistory[];
};

type MatchPlayer = {
  subject: string;
  gameName: string;
  tagLine: string;
  platformInfo: {
    platformType: "PC";
    platformOS: "Windows";
    platformOSVersion: string;
    platformChipset: "Unknown";
  };
  teamId: ("Blue" | "Red") | string;
  /** Party ID */
  partyId: string;
  /** Character ID */
  characterId: string;
  character: {
    uuid: string;
    displayName: string;
    displayIcon: string;
  };
  stats: {
    score: number;
    roundsPlayed: number;
    kills: number;
    deaths: number;
    assists: number;
    playtimeMillis: number;
    abilityCasts?:
      | ({
          grenadeCasts: number;
          ability1Casts: number;
          ability2Casts: number;
          ultimateCasts: number;
        } | null)
      | undefined;
  } | null;
  roundDamage:
    | {
        round: number;
        /** Player UUID */
        receiver: string;
        damage: number;
      }[]
    | null;
  competitiveTier: number;
  competitiveRank: ValorantCompetitiveTier;
  isObserver: boolean;
  /** Card ID */
  playerCard: string;
  /** Title ID */
  playerTitle: string;
  /** Preferred Level Border ID */
  preferredLevelBorder?: (string | "") | undefined;
  accountLevel: number;
  sessionPlaytimeMinutes?: (number | null) | undefined;
  xpModifications?:
    | {
        /** XP multiplier */
        Value: number;
        /** XP Modification ID */
        ID: string;
      }[]
    | undefined;
  behaviorFactors?:
    | {
        afkRounds: number;
        /** Float value of unknown significance. Possibly used to quantify how much the player was in the way of their teammates? */
        collisions?: number | undefined;
        commsRatingRecovery: number;
        damageParticipationOutgoing: number;
        friendlyFireIncoming?: number | undefined;
        friendlyFireOutgoing?: number | undefined;
        mouseMovement?: number | undefined;
        stayedInSpawnRounds?: number | undefined;
      }
    | undefined;
  newPlayerExperienceDetails?:
    | {
        basicMovement: {
          idleTimeMillis: 0;
          objectiveCompleteTimeMillis: 0;
        };
        basicGunSkill: {
          idleTimeMillis: 0;
          objectiveCompleteTimeMillis: 0;
        };
        adaptiveBots: {
          adaptiveBotAverageDurationMillisAllAttempts: 0;
          adaptiveBotAverageDurationMillisFirstAttempt: 0;
          killDetailsFirstAttempt: null;
          idleTimeMillis: 0;
          objectiveCompleteTimeMillis: 0;
        };
        ability: {
          idleTimeMillis: 0;
          objectiveCompleteTimeMillis: 0;
        };
        bombPlant: {
          idleTimeMillis: 0;
          objectiveCompleteTimeMillis: 0;
        };
        defendBombSite: {
          success: false;
          idleTimeMillis: 0;
          objectiveCompleteTimeMillis: 0;
        };
        settingStatus: {
          isMouseSensitivityDefault: boolean;
          isCrosshairDefault: boolean;
        };
        versionString: "";
      }
    | undefined;
};

type MatchDetailsResponse = {
  matchInfo: {
    /** Match ID */
    matchId: string;
    /** Map ID */
    mapId: string;
    gamePodId: string;
    gameLoopZone: string;
    gameServerAddress: string;
    gameVersion: string;
    gameLengthMillis: number | null;
    gameStartMillis: number;
    provisioningFlowID: "Matchmaking" | "CustomGame";
    isCompleted: boolean;
    customGameName: string;
    forcePostProcessing: boolean;
    /** Queue ID */
    queueID: string;
    /** Game Mode */
    gameMode: string;
    isRanked: boolean;
    isMatchSampled: boolean;
    /** Season ID */
    seasonId: string;
    completionState: "Surrendered" | "Completed" | "VoteDraw" | "";
    platformType: "PC";
    premierMatchInfo: {};
    partyRRPenalties?:
      | {
          [x: string]: number;
        }
      | undefined;
    shouldMatchDisablePenalties: boolean;
  };
  players: MatchPlayer[];
  bots: unknown[];
  coaches: {
    /** Player UUID */
    subject: string;
    teamId: "Blue" | "Red";
  }[];
  teams:
    | {
        teamId: ("Blue" | "Red") | string;
        won: boolean;
        roundsPlayed: number;
        roundsWon: number;
        numPoints: number;
      }[]
    | null;
  roundResults:
    | {
        roundNum: number;
        roundResult:
          | "Eliminated"
          | "Bomb detonated"
          | "Bomb defused"
          | "Surrendered"
          | "Round timer expired";
        roundCeremony:
          | "CeremonyDefault"
          | "CeremonyTeamAce"
          | "CeremonyFlawless"
          | "CeremonyCloser"
          | "CeremonyClutch"
          | "CeremonyThrifty"
          | "CeremonyAce"
          | "";
        winningTeam: ("Blue" | "Red") | string;
        /** Player UUID */
        bombPlanter?: string | undefined;
        bombDefuser?: (("Blue" | "Red") | string) | undefined;
        /** Time in milliseconds since the start of the round when the bomb was planted. 0 if not planted */
        plantRoundTime?: number | undefined;
        plantPlayerLocations:
          | {
              /** Player UUID */
              subject: string;
              viewRadians: number;
              location: {
                x: number;
                y: number;
              };
            }[]
          | null;
        plantLocation: {
          x: number;
          y: number;
        };
        plantSite: "A" | "B" | "C" | "";
        /** Time in milliseconds since the start of the round when the bomb was defused. 0 if not defused */
        defuseRoundTime?: number | undefined;
        defusePlayerLocations:
          | {
              /** Player UUID */
              subject: string;
              viewRadians: number;
              location: {
                x: number;
                y: number;
              };
            }[]
          | null;
        defuseLocation: {
          x: number;
          y: number;
        };
        playerStats: {
          /** Player UUID */
          subject: string;
          kills: {
            /** Time in milliseconds since the start of the game */
            gameTime: number;
            /** Time in milliseconds since the start of the round */
            roundTime: number;
            /** Player UUID */
            killer: string;
            /** Player UUID */
            victim: string;
            victimLocation: {
              x: number;
              y: number;
            };
            assistants: string[];
            playerLocations: {
              /** Player UUID */
              subject: string;
              viewRadians: number;
              location: {
                x: number;
                y: number;
              };
            }[];
            finishingDamage: {
              damageType:
                | "Weapon"
                | "Bomb"
                | "Ability"
                | "Fall"
                | "Melee"
                | "Invalid"
                | "";
              /** Item ID of the weapon used to kill the player. Empty string if the player was killed by the spike, fall damage, or melee. */
              damageItem:
                | (
                    | string
                    | (
                        | "Ultimate"
                        | "Ability1"
                        | "Ability2"
                        | "GrenadeAbility"
                        | "Primary"
                      )
                  )
                | "";
              isSecondaryFireMode: boolean;
            };
          }[];
          damage: {
            /** Player UUID */
            receiver: string;
            damage: number;
            legshots: number;
            bodyshots: number;
            headshots: number;
          }[];
          score: number;
          economy: {
            loadoutValue: number;
            /** Item ID */
            weapon: string | "";
            /** Armor ID */
            armor: string | "";
            remaining: number;
            spent: number;
          };
          ability: {
            grenadeEffects: null;
            ability1Effects: null;
            ability2Effects: null;
            ultimateEffects: null;
          };
          wasAfk: boolean;
          wasPenalized: boolean;
          stayedInSpawn: boolean;
        }[];
        /** Empty string if the timer expired */
        roundResultCode:
          | "Elimination"
          | "Detonate"
          | "Defuse"
          | "Surrendered"
          | "";
        playerEconomies:
          | {
              /** Player UUID */
              subject: string;
              loadoutValue: number;
              /** Item ID */
              weapon: string | "";
              /** Armor ID */
              armor: string | "";
              remaining: number;
              spent: number;
            }[]
          | null;
        playerScores:
          | {
              /** Player UUID */
              subject: string;
              score: number;
            }[]
          | null;
      }[]
    | null;
  kills:
    | {
        /** Time in milliseconds since the start of the game */
        gameTime: number;
        /** Time in milliseconds since the start of the round */
        roundTime: number;
        /** Player UUID */
        killer: string;
        /** Player UUID */
        victim: string;
        victimLocation: {
          x: number;
          y: number;
        };
        assistants: string[];
        playerLocations: {
          /** Player UUID */
          subject: string;
          viewRadians: number;
          location: {
            x: number;
            y: number;
          };
        }[];
        finishingDamage: {
          damageType:
            | "Weapon"
            | "Bomb"
            | "Ability"
            | "Fall"
            | "Melee"
            | "Invalid"
            | "";
          /** Item ID of the weapon used to kill the player. Empty string if the player was killed by the spike, fall damage, or melee. */
          damageItem:
            | (
                | string
                | (
                    | "Ultimate"
                    | "Ability1"
                    | "Ability2"
                    | "GrenadeAbility"
                    | "Primary"
                  )
              )
            | "";
          isSecondaryFireMode: boolean;
        };
        round: number;
      }[]
    | null;
};

type MatchDetails = MatchDetailsResponse & {
  map: {
    uuid: string;
    splash: string;
    displayName: string;
    listViewIcon: string;
    mapUrl: string;
  };
  competitiveUpdates?: MatchCompetitiveUpdatesResponse;
};
