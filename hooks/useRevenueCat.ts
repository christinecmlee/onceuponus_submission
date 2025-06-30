import { useEffect, useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import Purchases, { 
  PurchasesOffering, 
  PurchasesPackage, 
  CustomerInfo,
  PurchasesEntitlementInfo 
} from 'react-native-purchases';
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

export function useRevenueCat(): UseRevenueCatReturn {
  const [offerings, setOfferings] = useState<PurchasesOffering[] | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const { updateUser } = useUser();

  // Check if user has premium entitlement
  const isPremiumSubscriber = customerInfo?.entitlements.active.premium_access !== undefined;

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
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('RevenueCat - Fetching offerings...');
      const offerings = await Purchases.getOfferings();
      
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
    try {
      setError(null);
      console.log('RevenueCat - Attempting purchase:', {
        packageType: pkg.packageType,
        identifier: pkg.identifier,
        productIdentifier: pkg.product.identifier
      });

      const purchaseResult = await Purchases.purchasePackage(pkg);
      
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
    try {
      setError(null);
      console.log('RevenueCat - Restoring purchases...');
      
      const customerInfo = await Purchases.restorePurchases();
      
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
    try {
      console.log('RevenueCat - Fetching customer info...');
      const info = await Purchases.getCustomerInfo();
      
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
    // Set up customer info update listener
    const listener = Purchases.addCustomerInfoUpdateListener((info) => {
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
      listener.remove();
    };
  }, [fetchOfferings, getCustomerInfo, updateUserSubscriptionStatus]);

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