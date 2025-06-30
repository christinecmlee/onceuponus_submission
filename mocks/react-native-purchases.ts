// Mock implementation of react-native-purchases for web compatibility
// This file provides dummy implementations to prevent bundling errors on web
// The actual RevenueCat functionality is handled by Platform.OS checks in the real code

console.log('RevenueCat Mock - Loading mock implementation for web platform');

// Mock types and interfaces
export interface PurchasesOffering {
  identifier: string;
  availablePackages: PurchasesPackage[];
  monthly?: PurchasesPackage;
}

export interface PurchasesPackage {
  packageType: string;
  identifier: string;
  product: {
    identifier: string;
    priceString: string;
  };
}

export interface CustomerInfo {
  originalAppUserId: string;
  entitlements: {
    active: Record<string, PurchasesEntitlementInfo>;
  };
}

export interface PurchasesEntitlementInfo {
  identifier: string;
  isActive: boolean;
}

// Mock constants
export const LOG_LEVEL = {
  VERBOSE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
} as const;

// Mock Purchases class
class MockPurchases {
  static LOG_LEVEL = LOG_LEVEL;

  static configure(options: { apiKey: string; appUserID?: string | null }) {
    console.log('RevenueCat Mock - configure() called with options:', options);
    return Promise.resolve();
  }

  static setLogLevel(level: number) {
    console.log('RevenueCat Mock - setLogLevel() called with level:', level);
  }

  static getOfferings(): Promise<{ current: PurchasesOffering | null; all: Record<string, PurchasesOffering> }> {
    console.log('RevenueCat Mock - getOfferings() called');
    return Promise.resolve({
      current: null,
      all: {}
    });
  }

  static purchasePackage(pkg: PurchasesPackage): Promise<{ customerInfo: CustomerInfo }> {
    console.log('RevenueCat Mock - purchasePackage() called with package:', pkg);
    return Promise.reject(new Error('RevenueCat not available on web platform'));
  }

  static restorePurchases(): Promise<CustomerInfo> {
    console.log('RevenueCat Mock - restorePurchases() called');
    return Promise.reject(new Error('RevenueCat not available on web platform'));
  }

  static getCustomerInfo(): Promise<CustomerInfo> {
    console.log('RevenueCat Mock - getCustomerInfo() called');
    return Promise.resolve({
      originalAppUserId: 'web-user',
      entitlements: {
        active: {}
      }
    });
  }

  static addCustomerInfoUpdateListener(listener: (info: CustomerInfo) => void) {
    console.log('RevenueCat Mock - addCustomerInfoUpdateListener() called');
    return {
      remove: () => {
        console.log('RevenueCat Mock - Customer info listener removed');
      }
    };
  }
}

// Export the mock as default
export default MockPurchases;

// Also export named exports for compatibility
export const configure = MockPurchases.configure;
export const setLogLevel = MockPurchases.setLogLevel;
export const getOfferings = MockPurchases.getOfferings;
export const purchasePackage = MockPurchases.purchasePackage;
export const restorePurchases = MockPurchases.restorePurchases;
export const getCustomerInfo = MockPurchases.getCustomerInfo;
export const addCustomerInfoUpdateListener = MockPurchases.addCustomerInfoUpdateListener;