import { useEffect, useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
// TEMPORARY FIX: Comment out direct import to avoid web bundling issues
// TODO: Uncomment when RevenueCat API key is available and ready for full native integration
// import Purchases, { 
//   PurchasesOffering, 
//   PurchasesPackage, 
//   CustomerInfo,
//   PurchasesEntitlementInfo 
// } from 'react-native-purchases';

// Minimal TypeScript interfaces for the types we need (temporary placeholders)
interface PurchasesPackage {
  packageType: string;
  identifier: string;
  product: {
    identifier: string;
  };
}

interface PurchasesOffering {
  identifier: string;
  availablePackages: PurchasesPackage[];
  monthly?: PurchasesPackage;
}

interface PurchasesEntitlementInfo {
  identifier: string;
  isActive: boolean;
}

interface CustomerInfo {
  originalAppUserId: string;
  entitlements: {
    active: Record<string, PurchasesEntitlementInfo>;
  };
}

import { useUser } from '@/contexts/UserContext';

export interface UseRevenueCatReturn {
  offerings: PurchasesOffering[] | null;
  currentOffering: PurchasesOffering | null;
  isLoading: boolean;
  error: string | null;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  customerInfo: CustomerInfo | null;
  isPremiumSubscriber: boolean;
}

// Mutable variable to hold the dynamically loaded Purchases module
let PurchasesModule: any = null;

export function useRevenueCat(): UseRevenueCatReturn {
  const [offerings, setOfferings] = useState<PurchasesOffering[] | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const { updateUser } = useUser();

  // Check if user has premium entitlement
  const isPremiumSubscriber = customerInfo?.entitlements.active.premium_access !== undefined;

  // Initialize RevenueCat module dynamically on native platforms only
  useEffect(() => {
    const loadRevenueCatModule = async () => {
      // Skip loading on web platform
      if (Platform.OS === 'web') {
        console.log('RevenueCat - Skipping module load on web platform');
        setIsLoading(false);
        return;
      }

      try {
        // Dynamically require the module only on native platforms
        PurchasesModule = require('react-native-purchases').default;
        console.log('RevenueCat - Module loaded successfully');
      } catch (err) {
        console.error('RevenueCat - Failed to load module:', err);
        setError('RevenueCat module not available');
        setIsLoading(false);
        return;
      }
    };

    loadRevenueCatModule();
  }, []);

  const updateUserSubscriptionStatus = useCallback((info: CustomerInfo) => {
    const hasPremiumAccess = info.entitlements.active.premium_access !== undefined;
    console.log('RevenueCat - Updating user subscription status:', {
      hasPremiumAccess,
      entitlements: Object.keys(info.entitlements.active),
      originalAppUserId: info.originalAppUserId
    });
    
    updateUser({ 
      isPremiumSubscriber: hasPremiumAccess 
    });
  }, [updateUser]);

  const fetchOfferings = useCallback(async () => {
    // Check if module is available and we're on a native platform
    if (!PurchasesModule || Platform.OS === 'web') {
      console.log('RevenueCat - Module not available for offerings');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('RevenueCat - Fetching offerings...');
      const offerings = await PurchasesModule.getOfferings();
      
      console.log('RevenueCat - Offerings received:', {
        currentOffering: offerings.current?.identifier,
        allOfferings: Object.keys(offerings.all),
        packagesCount: offerings.current?.availablePackages.length || 0
      });

      if (offerings.current) {
        setCurrentOffering(offerings.current);
        setOfferings(Object.values(offerings.all));
      } else {
        console.warn('RevenueCat - No current offering found');
        setError('No subscription packages available');
      }
    } catch (err) {
      console.error('RevenueCat - Error fetching offerings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription options');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    // Check if module is available and we're on a native platform
    if (!PurchasesModule || Platform.OS === 'web') {
      console.log('RevenueCat - Module not available for purchase');
      setError('Purchases not available on this platform');
      return false;
    }

    try {
      setError(null);
      console.log('RevenueCat - Attempting purchase:', {
        packageType: pkg.packageType,
        identifier: pkg.identifier,
        productIdentifier: pkg.product.identifier
      });

      const purchaseResult = await PurchasesModule.purchasePackage(pkg);
      
      console.log('RevenueCat - Purchase successful:', {
        customerInfo: purchaseResult.customerInfo.originalAppUserId,
        entitlements: Object.keys(purchaseResult.customerInfo.entitlements.active)
      });

      setCustomerInfo(purchaseResult.customerInfo);
      updateUserSubscriptionStatus(purchaseResult.customerInfo);
      
      return true;
    } catch (err: any) {
      console.error('RevenueCat - Purchase failed:', err);
      
      if (!err.userCancelled) {
        const errorMessage = err.message || 'Purchase failed';
        setError(errorMessage);
        
        if (Platform.OS === 'web') {
          alert(`Purchase failed: ${errorMessage}`);
        } else {
          Alert.alert('Purchase Failed', errorMessage);
        }
      } else {
        console.log('RevenueCat - Purchase cancelled by user');
      }
      
      return false;
    }
  }, [updateUserSubscriptionStatus]);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    // Check if module is available and we're on a native platform
    if (!PurchasesModule || Platform.OS === 'web') {
      console.log('RevenueCat - Module not available for restore');
      setError('Purchase restoration not available on this platform');
      return false;
    }

    try {
      setError(null);
      console.log('RevenueCat - Restoring purchases...');
      
      const customerInfo = await PurchasesModule.restorePurchases();
      
      console.log('RevenueCat - Purchases restored:', {
        entitlements: Object.keys(customerInfo.entitlements.active),
        originalAppUserId: customerInfo.originalAppUserId
      });

      setCustomerInfo(customerInfo);
      updateUserSubscriptionStatus(customerInfo);
      
      return Object.keys(customerInfo.entitlements.active).length > 0;
    } catch (err) {
      console.error('RevenueCat - Error restoring purchases:', err);
      setError(err instanceof Error ? err.message : 'Failed to restore purchases');
      return false;
    }
  }, [updateUserSubscriptionStatus]);

  const getCustomerInfo = useCallback(async () => {
    // Check if module is available and we're on a native platform
    if (!PurchasesModule || Platform.OS === 'web') {
      console.log('RevenueCat - Module not available for customer info');
      return;
    }

    try {
      console.log('RevenueCat - Fetching customer info...');
      const info = await PurchasesModule.getCustomerInfo();
      
      console.log('RevenueCat - Customer info received:', {
        entitlements: Object.keys(info.entitlements.active),
        originalAppUserId: info.originalAppUserId
      });

      setCustomerInfo(info);
      updateUserSubscriptionStatus(info);
    } catch (err) {
      console.error('RevenueCat - Error fetching customer info:', err);
    }
  }, [updateUserSubscriptionStatus]);

  useEffect(() => {
    // Only set up listeners and fetch data if module is available and on native platform
    if (!PurchasesModule || Platform.OS === 'web') {
      setIsLoading(false);
      return;
    }

    // Set up customer info update listener
    const listener = PurchasesModule.addCustomerInfoUpdateListener((info: CustomerInfo) => {
      console.log('RevenueCat - Customer info updated via listener:', {
        entitlements: Object.keys(info.entitlements.active),
        originalAppUserId: info.originalAppUserId
      });
      setCustomerInfo(info);
      updateUserSubscriptionStatus(info);
    });

    // Initial data fetch
    const initializeData = async () => {
      await Promise.all([
        fetchOfferings(),
        getCustomerInfo()
      ]);
    };

    initializeData();

    return () => {
      if (listener && listener.remove) {
        listener.remove();
      }
    };
  }, [PurchasesModule, fetchOfferings, getCustomerInfo, updateUserSubscriptionStatus]);

  return {
    offerings,
    currentOffering,
    isLoading,
    error,
    purchasePackage,
    restorePurchases,
    customerInfo,
    isPremiumSubscriber
  };
}