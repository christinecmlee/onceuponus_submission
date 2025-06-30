// Mock RevenueCat Service for testing subscription flow
// This simulates the behavior of the actual RevenueCat SDK

export interface MockPackage {
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

export interface MockOffering {
  identifier: string;
  serverDescription: string;
  packages: MockPackage[];
  monthly: MockPackage | null;
}

export interface MockCustomerInfo {
  originalAppUserId: string;
  entitlements: {
    active: Record<string, MockEntitlement>;
    all: Record<string, MockEntitlement>;
  };
  activeSubscriptions: string[];
}

export interface MockEntitlement {
  identifier: string;
  isActive: boolean;
  productIdentifier: string;
  purchaseDate: string;
  expirationDate: string | null;
}

export interface MockPurchaseResult {
  customerInfo: MockCustomerInfo;
  productIdentifier: string;
  purchaseDate: string;
}

// Simulate persistent storage for mock subscription status
let mockSubscriptionStatus = false;
let mockSubscriptionDate: string | null = null;

export class MockRevenueCatService {
  private static isInitialized = false;

  // Initialize the mock service
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    console.log('🎭 Mock RevenueCat Service initialized');
    this.isInitialized = true;
    
    // Load any persisted mock subscription status
    // In a real app, this would come from RevenueCat
    return Promise.resolve();
  }

  // Get current offerings (subscription plans)
  static async getOfferings(): Promise<{ current: MockOffering | null }> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const mockOffering: MockOffering = {
      identifier: 'premium_offering',
      serverDescription: 'Once Upon Us Premium Membership',
      packages: [
        {
          identifier: 'premium_monthly',
          packageType: 'MONTHLY',
          product: {
            identifier: 'premium_monthly_30',
            title: 'Once Upon Us Premium',
            description: 'Unlimited event access and early booking privileges',
            price: 30.00,
            priceString: '$30.00'
          }
        }
      ],
      monthly: {
        identifier: 'premium_monthly',
        packageType: 'MONTHLY',
        product: {
          identifier: 'premium_monthly_30',
          title: 'Once Upon Us Premium',
          description: 'Unlimited event access and early booking privileges',
          price: 30.00,
          priceString: '$30.00'
        }
      }
    };

    return { current: mockOffering };
  }

  // Purchase a package
  static async purchasePackage(packageIdentifier: string): Promise<MockPurchaseResult> {
    console.log('🛒 Mock purchasing package:', packageIdentifier);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate potential failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Payment failed. Please try again.');
    }

    // Update mock subscription status
    mockSubscriptionStatus = true;
    mockSubscriptionDate = new Date().toISOString();

    const customerInfo: MockCustomerInfo = {
      originalAppUserId: 'mock_user_123',
      entitlements: {
        active: {
          premium_access: {
            identifier: 'premium_access',
            isActive: true,
            productIdentifier: 'premium_monthly_30',
            purchaseDate: mockSubscriptionDate,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }
        },
        all: {
          premium_access: {
            identifier: 'premium_access',
            isActive: true,
            productIdentifier: 'premium_monthly_30',
            purchaseDate: mockSubscriptionDate,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      },
      activeSubscriptions: ['premium_monthly_30']
    };

    return {
      customerInfo,
      productIdentifier: 'premium_monthly_30',
      purchaseDate: mockSubscriptionDate
    };
  }

  // Get current customer info
  static async getCustomerInfo(): Promise<MockCustomerInfo> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

    const hasActivePremium = mockSubscriptionStatus && mockSubscriptionDate;

    return {
      originalAppUserId: 'mock_user_123',
      entitlements: {
        active: hasActivePremium ? {
          premium_access: {
            identifier: 'premium_access',
            isActive: true,
            productIdentifier: 'premium_monthly_30',
            purchaseDate: mockSubscriptionDate!,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        } : {},
        all: hasActivePremium ? {
          premium_access: {
            identifier: 'premium_access',
            isActive: true,
            productIdentifier: 'premium_monthly_30',
            purchaseDate: mockSubscriptionDate!,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        } : {}
      },
      activeSubscriptions: hasActivePremium ? ['premium_monthly_30'] : []
    };
  }

  // Restore purchases
  static async restorePurchases(): Promise<MockCustomerInfo> {
    console.log('🔄 Mock restoring purchases');
    return this.getCustomerInfo();
  }

  // Check if user has active entitlement
  static async hasActiveEntitlement(entitlementId: string): Promise<boolean> {
    const customerInfo = await this.getCustomerInfo();
    return !!customerInfo.entitlements.active[entitlementId]?.isActive;
  }

  // Reset mock subscription (for testing)
  static resetMockSubscription(): void {
    mockSubscriptionStatus = false;
    mockSubscriptionDate = null;
    console.log('🔄 Mock subscription reset');
  }
}