import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, { LOG_LEVEL, PurchasesPackage } from "react-native-purchases";
import { CustomerInfo } from "react-native-purchases";

interface RevenueCatProps {
  purchasePackage?: (pack: PurchasesPackage) => Promise<void>;
  restorePermissions?: () => Promise<void>;
  user: UserState;
  setUserRC: (user: UserState) => void;
  packages: PurchasesPackage[];
}

export interface UserState {
  isPro: boolean;
}

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

// Provide RevenueCat functions to our app
export const RevenueCatProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserState>({
    isPro: false,
  });
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === "android" && process.env.EXPO_PUBLIC_RC_ANDROID) {
        Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_ANDROID });
      }
      await Purchases.setProxyURL("https://api.rc-backup.com/");

      // Use more logging during debug if want!
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      // Listen for customer updates
      Purchases.addCustomerInfoUpdateListener(async (info) => {
        updateCustomerInformation(info);
      });
    };
    init();
  }, []);

  // Load all offerings a user can (currently) purchase
  const loadOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    if (offerings.current) {
      setPackages(offerings.current.availablePackages);
    }
  };

  // Update user state based on previous purchases
  const updateCustomerInformation = async (customerInfo: CustomerInfo) => {
    const newUser: UserState = { isPro: false };

    if (customerInfo?.entitlements.active["Pro Access"] !== undefined) {
      newUser.isPro = true;
    }

    setUser(newUser);
  };

  // // Restore previous purchases
  const restorePermissions = async () => {
    await Purchases.restorePurchases();
  };

  const setUserRC = (user: UserState) => {
    setUser({ ...user });
  };

  const value = {
    restorePermissions,
    user,
    setUserRC,
    packages,
  };

  // Return empty fragment if provider is not ready (Purchase not yet initialised)

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

// Export context for easy usage
export const useRevenueCat = () => {
  return useContext(RevenueCatContext) as RevenueCatProps;
};
