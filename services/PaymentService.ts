import { Platform } from 'react-native';
import { MockRevenueCatService } from './MockRevenueCatService';
import { RevenueCatService } from './RevenueCatService';

// Environment configuration
const USE_MOCK_PAYMENTS = __DEV__ && Platform.OS === 'web';
const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || 'your_revenuecat_api_key_here';

// Common interfaces that both services implement
export interface PaymentCustomerInfo {
  originalAppUserId: string;
  entitlements: {
    active: Record<string, PaymentEntitlement>;
    all: Record<string, PaymentEntitlement>;
  };
  activeSubscriptions: string[];
}

export interface PaymentEntitlement {
  identifier: string;
  isActive: boolean;
  productIdentifier: string;
  purchaseDate: string;
  expirationDate: string | null;
}

export interface PaymentOffering {
  identifier: string;
  serverDescription: string;
  packages: PaymentPackage[];
  monthly: PaymentPackage | null;
}

export interface PaymentPackage {
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

export interface PaymentPurchaseResult {
  customerInfo: PaymentCustomerInfo;
  productIdentifier: string;
  purchaseDate: string;
}

/**
 * PaymentService - Abstraction layer for payment processing
 * 
 * This service automatically switches between:
 * - MockRevenueCatService for web/development
 * - RevenueCatService for production mobile apps
 */
export class PaymentService {
  private static isInitialized = false;

  /**
   * Initialize the payment service
   * Automatically chooses the appropriate implementation based on platform
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (USE_MOCK_PAYMENTS) {
        console.log('🎭 Initializing Mock Payment Service (Web/Development)');
        await MockRevenueCatService.initialize();
      } else {
        console.log('💳 Initializing RevenueCat Service (Production)');
        await RevenueCatService.initialize(REVENUECAT_API_KEY);
      }
      
      this.isInitialized = true;
      console.log('✅ Payment Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Payment Service:', error);
      throw error;
    }
  }

  /**
   * Get available subscription offerings
   */
  static async getOfferings(): Promise<{ current: PaymentOffering | null }> {
    if (USE_MOCK_PAYMENTS) {
      return MockRevenueCatService.getOfferings();
    } else {
      return RevenueCatService.getOfferings();
    }
  }

  /**
   * Purchase a subscription package
   */
  static async purchasePackage(packageIdentifier: string): Promise<PaymentPurchaseResult> {
    if (USE_MOCK_PAYMENTS) {
      return MockRevenueCatService.purchasePackage(packageIdentifier);
    } else {
      return RevenueCatService.purchasePackage(packageIdentifier);
    }
  }

  /**
   * Get current customer information and subscription status
   */
  static async getCustomerInfo(): Promise<PaymentCustomerInfo> {
    if (USE_MOCK_PAYMENTS) {
      return MockRevenueCatService.getCustomerInfo();
    } else {
      return RevenueCatService.getCustomerInfo();
    }
  }

  /**
   * Restore previous purchases
   */
  static async restorePurchases(): Promise<PaymentCustomerInfo> {
    if (USE_MOCK_PAYMENTS) {
      return MockRevenueCatService.restorePurchases();
    } else {
      return RevenueCatService.restorePurchases();
    }
  }

  /**
   * Check if user has an active entitlement
   */
  static async hasActiveEntitlement(entitlementId: string): Promise<boolean> {
    if (USE_MOCK_PAYMENTS) {
      return MockRevenueCatService.hasActiveEntitlement(entitlementId);
    } else {
      return RevenueCatService.hasActiveEntitlement(entitlementId);
    }
  }

  /**
   * Set user ID for analytics and customer tracking
   * Only available in RevenueCat, ignored in mock
   */
  static async setUserId(userId: string): Promise<void> {
    if (!USE_MOCK_PAYMENTS && RevenueCatService.setUserId) {
      return RevenueCatService.setUserId(userId);
    }
  }

  /**
   * Log out user from payment service
   */
  static async logOut(): Promise<PaymentCustomerInfo> {
    if (USE_MOCK_PAYMENTS) {
      // Mock service doesn't have logout, just return current info
      return MockRevenueCatService.getCustomerInfo();
    } else {
      return RevenueCatService.logOut();
    }
  }

  /**
   * Reset mock subscription status (development only)
   */
  static resetMockSubscription(): void {
    if (USE_MOCK_PAYMENTS) {
      MockRevenueCatService.resetMockSubscription();
    }
  }

  /**
   * Check if currently using mock payments
   */
  static isUsingMockPayments(): boolean {
    return USE_MOCK_PAYMENTS;
  }

  /**
   * Get platform-specific payment info for debugging
   */
  static getPaymentInfo(): { platform: string; usingMock: boolean; service: string } {
    return {
      platform: Platform.OS,
      usingMock: USE_MOCK_PAYMENTS,
      service: USE_MOCK_PAYMENTS ? 'MockRevenueCatService' : 'RevenueCatService'
    };
  }
}