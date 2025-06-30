import Purchases, { 
  CustomerInfo, 
  Offerings, 
  PurchasesOffering,
  PurchasesPackage,
  PurchaseResult 
} from 'react-native-purchases';

export interface RevenueCatCustomerInfo {
  originalAppUserId: string;
  entitlements: {
    active: Record<string, RevenueCatEntitlement>;
    all: Record<string, RevenueCatEntitlement>;
  };
  activeSubscriptions: string[];
}

export interface RevenueCatEntitlement {
  identifier: string;
  isActive: boolean;
  productIdentifier: string;
  purchaseDate: string;
  expirationDate: string | null;
}

export interface RevenueCatOffering {
  identifier: string;
  serverDescription: string;
  packages: RevenueCatPackage[];
  monthly: RevenueCatPackage | null;
}

export interface RevenueCatPackage {
  identifier: string;
  packageType: string;
  product: {
    identifier: string;
    title: string;
    description: string;
    price: number;
    priceString: string;
  };
}

export interface RevenueCatPurchaseResult {
  customerInfo: RevenueCatCustomerInfo;
  productIdentifier: string;
  purchaseDate: string;
}

export class RevenueCatService {
  private static isInitialized = false;

  // Initialize RevenueCat with your API key
  static async initialize(apiKey: string): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      await Purchases.configure({ apiKey });
      console.log('✅ RevenueCat initialized successfully');
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  // Get current offerings (subscription plans)
  static async getOfferings(): Promise<{ current: RevenueCatOffering | null }> {
    try {
      const offerings: Offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      if (!currentOffering) {
        return { current: null };
      }

      const transformedOffering: RevenueCatOffering = {
        identifier: currentOffering.identifier,
        serverDescription: currentOffering.serverDescription,
        packages: currentOffering.availablePackages.map(this.transformPackage),
        monthly: currentOffering.monthly ? this.transformPackage(currentOffering.monthly) : null
      };

      return { current: transformedOffering };
    } catch (error) {
      console.error('❌ Failed to get offerings:', error);
      throw error;
    }
  }

  // Purchase a package
  static async purchasePackage(packageIdentifier: string): Promise<RevenueCatPurchaseResult> {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      if (!currentOffering) {
        throw new Error('No current offering available');
      }

      const targetPackage = currentOffering.availablePackages.find(
        pkg => pkg.identifier === packageIdentifier
      );

      if (!targetPackage) {
        throw new Error(`Package with identifier ${packageIdentifier} not found`);
      }

      console.log('🛒 Purchasing package:', packageIdentifier);
      const purchaseResult: PurchaseResult = await Purchases.purchasePackage(targetPackage);
      
      return {
        customerInfo: this.transformCustomerInfo(purchaseResult.customerInfo),
        productIdentifier: targetPackage.product.identifier,
        purchaseDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Purchase failed:', error);
      throw error;
    }
  }

  // Get current customer info
  static async getCustomerInfo(): Promise<RevenueCatCustomerInfo> {
    try {
      const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
      return this.transformCustomerInfo(customerInfo);
    } catch (error) {
      console.error('❌ Failed to get customer info:', error);
      throw error;
    }
  }

  // Restore purchases
  static async restorePurchases(): Promise<RevenueCatCustomerInfo> {
    try {
      console.log('🔄 Restoring purchases');
      const customerInfo: CustomerInfo = await Purchases.restorePurchases();
      return this.transformCustomerInfo(customerInfo);
    } catch (error) {
      console.error('❌ Failed to restore purchases:', error);
      throw error;
    }
  }

  // Check if user has active entitlement
  static async hasActiveEntitlement(entitlementId: string): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return !!customerInfo.entitlements.active[entitlementId]?.isActive;
    } catch (error) {
      console.error('❌ Failed to check entitlement:', error);
      return false;
    }
  }

  // Helper method to transform CustomerInfo
  private static transformCustomerInfo(customerInfo: CustomerInfo): RevenueCatCustomerInfo {
    const transformEntitlement = (entitlement: any): RevenueCatEntitlement => ({
      identifier: entitlement.identifier,
      isActive: entitlement.isActive,
      productIdentifier: entitlement.productIdentifier,
      purchaseDate: entitlement.latestPurchaseDate,
      expirationDate: entitlement.expirationDate
    });

    return {
      originalAppUserId: customerInfo.originalAppUserId,
      entitlements: {
        active: Object.fromEntries(
          Object.entries(customerInfo.entitlements.active).map(([key, value]) => [
            key,
            transformEntitlement(value)
          ])
        ),
        all: Object.fromEntries(
          Object.entries(customerInfo.entitlements.all).map(([key, value]) => [
            key,
            transformEntitlement(value)
          ])
        )
      },
      activeSubscriptions: customerInfo.activeSubscriptions
    };
  }

  // Helper method to transform Package
  private static transformPackage(rcPackage: PurchasesPackage): RevenueCatPackage {
    return {
      identifier: rcPackage.identifier,
      packageType: rcPackage.packageType,
      product: {
        identifier: rcPackage.product.identifier,
        title: rcPackage.product.title,
        description: rcPackage.product.description,
        price: rcPackage.product.price,
        priceString: rcPackage.product.priceString
      }
    };
  }

  // Set user ID for RevenueCat (useful for analytics)
  static async setUserId(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
      console.log('✅ User ID set in RevenueCat:', userId);
    } catch (error) {
      console.error('❌ Failed to set user ID:', error);
    }
  }

  // Log out user (clears user ID)
  static async logOut(): Promise<RevenueCatCustomerInfo> {
    try {
      const customerInfo: CustomerInfo = await Purchases.logOut();
      console.log('✅ User logged out from RevenueCat');
      return this.transformCustomerInfo(customerInfo);
    } catch (error) {
      console.error('❌ Failed to log out user:', error);
      throw error;
    }
  }
}