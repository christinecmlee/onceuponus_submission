import { PaymentService } from './PaymentService';

export interface PaywallData {
  title: string;
  subtitle: string;
  features: string[];
  packages: PaywallPackage[];
  primaryPackage: PaywallPackage | null;
}

export interface PaywallPackage {
  identifier: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  isPopular?: boolean;
  originalPrice?: string;
  discount?: string;
}

/**
 * PaywallService - Manages paywall presentation and package selection
 * 
 * This service provides a simplified interface for displaying subscription
 * options and handles the complexity of RevenueCat offerings.
 */
export class PaywallService {
  
  /**
   * Get formatted paywall data for display
   */
  static async getPaywallData(): Promise<PaywallData> {
    try {
      const offerings = await PaymentService.getOfferings();
      const currentOffering = offerings.current;
      
      if (!currentOffering) {
        throw new Error('No offerings available');
      }

      // Transform packages for paywall display
      const paywallPackages: PaywallPackage[] = currentOffering.packages.map(pkg => ({
        identifier: pkg.identifier,
        title: this.getPackageDisplayTitle(pkg.packageType),
        description: pkg.product.description,
        price: pkg.product.priceString,
        duration: this.getPackageDuration(pkg.packageType),
        isPopular: pkg.packageType === 'MONTHLY', // Mark monthly as popular
      }));

      // Find primary package (monthly)
      const primaryPackage = paywallPackages.find(pkg => pkg.isPopular) || paywallPackages[0];

      return {
        title: 'Once Upon Us Premium',
        subtitle: 'Unlock unlimited access to literary events and exclusive features',
        features: [
          'Free attendance to all literary events',
          'Early booking privileges (24 hours early)',
          'Priority support and assistance',
          'Exclusive premium content and stories',
          'Access to premium-only events',
          'Ad-free experience'
        ],
        packages: paywallPackages,
        primaryPackage
      };
    } catch (error) {
      console.error('Failed to get paywall data:', error);
      throw error;
    }
  }

  /**
   * Purchase a package from the paywall
   */
  static async purchasePackage(packageIdentifier: string): Promise<void> {
    try {
      console.log('🛒 Purchasing package from paywall:', packageIdentifier);
      await PaymentService.purchasePackage(packageIdentifier);
      console.log('✅ Purchase completed successfully');
    } catch (error) {
      console.error('❌ Purchase failed:', error);
      throw error;
    }
  }

  /**
   * Check if user has premium access
   */
  static async hasPremiumAccess(): Promise<boolean> {
    try {
      return await PaymentService.hasActiveEntitlement('premium_access');
    } catch (error) {
      console.error('Failed to check premium access:', error);
      return false;
    }
  }

  /**
   * Restore purchases
   */
  static async restorePurchases(): Promise<boolean> {
    try {
      console.log('🔄 Restoring purchases...');
      const customerInfo = await PaymentService.restorePurchases();
      const hasPremium = !!customerInfo.entitlements.active.premium_access?.isActive;
      console.log('✅ Purchases restored, premium status:', hasPremium);
      return hasPremium;
    } catch (error) {
      console.error('❌ Failed to restore purchases:', error);
      return false;
    }
  }

  /**
   * Get display title for package type
   */
  private static getPackageDisplayTitle(packageType: string): string {
    switch (packageType.toUpperCase()) {
      case 'MONTHLY':
        return 'Monthly';
      case 'ANNUAL':
        return 'Annual';
      case 'WEEKLY':
        return 'Weekly';
      case 'LIFETIME':
        return 'Lifetime';
      default:
        return 'Subscription';
    }
  }

  /**
   * Get duration description for package type
   */
  private static getPackageDuration(packageType: string): string {
    switch (packageType.toUpperCase()) {
      case 'MONTHLY':
        return 'per month';
      case 'ANNUAL':
        return 'per year';
      case 'WEEKLY':
        return 'per week';
      case 'LIFETIME':
        return 'one time';
      default:
        return 'subscription';
    }
  }

  /**
   * Get platform-specific paywall configuration
   */
  static getPaywallConfig() {
    return {
      isUsingMockPayments: PaymentService.isUsingMockPayments(),
      paymentInfo: PaymentService.getPaymentInfo(),
      environment: __DEV__ ? 'development' : 'production'
    };
  }
}