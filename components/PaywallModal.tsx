import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { X, Check, Star, RefreshCw } from 'lucide-react-native';
import { PaywallService, PaywallData, PaywallPackage } from '@/services/PaywallService';
import { useUser } from '@/contexts/UserContext';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseSuccess?: () => void;
  onRestoreSuccess?: () => void;
}

export default function PaywallModal({ 
  visible, 
  onClose, 
  onPurchaseSuccess,
  onRestoreSuccess 
}: PaywallModalProps) {
  const { updateUser } = useUser();
  const [paywallData, setPaywallData] = useState<PaywallData | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PaywallPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (visible) {
      loadPaywallData();
    }
  }, [visible]);

  const loadPaywallData = async () => {
    try {
      setIsLoading(true);
      const data = await PaywallService.getPaywallData();
      setPaywallData(data);
      setSelectedPackage(data.primaryPackage);
    } catch (error) {
      console.error('Failed to load paywall data:', error);
      if (Platform.OS === 'web') {
        alert('Failed to load subscription options. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to load subscription options. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    try {
      setIsPurchasing(true);
      await PaywallService.purchasePackage(selectedPackage.identifier);
      
      // Update user premium status
      updateUser({ isPremium: true });
      
      // Show success message
      const successMessage = 'Welcome to Premium! You now have unlimited access to all events.';
      if (Platform.OS === 'web') {
        alert(successMessage);
      } else {
        Alert.alert('Purchase Successful!', successMessage);
      }
      
      onPurchaseSuccess?.();
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed. Please try again.';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Purchase Failed', errorMessage);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setIsRestoring(true);
      const hasPremium = await PaywallService.restorePurchases();
      
      if (hasPremium) {
        updateUser({ isPremium: true });
        
        const successMessage = 'Purchases restored successfully! Premium access has been restored.';
        if (Platform.OS === 'web') {
          alert(successMessage);
        } else {
          Alert.alert('Restore Successful', successMessage);
        }
        
        onRestoreSuccess?.();
        onClose();
      } else {
        const noRestoreMessage = 'No previous purchases found to restore.';
        if (Platform.OS === 'web') {
          alert(noRestoreMessage);
        } else {
          Alert.alert('No Purchases Found', noRestoreMessage);
        }
      }
    } catch (error) {
      console.error('Restore failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore purchases. Please try again.';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Restore Failed', errorMessage);
      }
    } finally {
      setIsRestoring(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#4B2E1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Premium Membership</Text>
          <View style={styles.placeholder} />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A58E63" />
            <Text style={styles.loadingText}>Loading subscription options...</Text>
          </View>
        ) : paywallData ? (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>{paywallData.title}</Text>
              <Text style={styles.subtitle}>{paywallData.subtitle}</Text>
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              <Text style={styles.featuresTitle}>What's Included:</Text>
              {paywallData.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Check size={18} color="#16A34A" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Package Selection */}
            <View style={styles.packagesSection}>
              <Text style={styles.packagesTitle}>Choose Your Plan:</Text>
              {paywallData.packages.map((pkg) => (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[
                    styles.packageCard,
                    selectedPackage?.identifier === pkg.identifier && styles.packageCardSelected,
                    pkg.isPopular && styles.packageCardPopular
                  ]}
                  onPress={() => setSelectedPackage(pkg)}
                >
                  {pkg.isPopular && (
                    <View style={styles.popularBadge}>
                      <Star size={12} color="#FFFFFF" />
                      <Text style={styles.popularText}>MOST POPULAR</Text>
                    </View>
                  )}
                  
                  <View style={styles.packageHeader}>
                    <Text style={styles.packageTitle}>{pkg.title}</Text>
                    <Text style={styles.packagePrice}>{pkg.price}</Text>
                  </View>
                  
                  <Text style={styles.packageDuration}>{pkg.duration}</Text>
                  <Text style={styles.packageDescription}>{pkg.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load subscription options</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadPaywallData}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Actions */}
        {!isLoading && paywallData && (
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={[
                styles.purchaseButton,
                (!selectedPackage || isPurchasing) && styles.purchaseButtonDisabled
              ]}
              onPress={handlePurchase}
              disabled={!selectedPackage || isPurchasing}
            >
              {isPurchasing ? (
                <ActivityIndicator size="small" color="#F7F2E7" />
              ) : (
                <Text style={styles.purchaseButtonText}>
                  Start Premium - {selectedPackage?.price || ''}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestorePurchases}
              disabled={isRestoring}
            >
              {isRestoring ? (
                <ActivityIndicator size="small" color="#A58E63" />
              ) : (
                <>
                  <RefreshCw size={16} color="#A58E63" />
                  <Text style={styles.restoreButtonText}>Restore Purchases</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Subscription will automatically renew unless cancelled at least 24 hours before the end of the current period.
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F2E7',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E3D9C3',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Playfair-SemiBold',
    fontSize: 18,
    color: '#4B2E1E',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#A58E63',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 14,
    color: '#F7F2E7',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 28,
    color: '#4B2E1E',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  featuresTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 18,
    color: '#4B2E1E',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    marginLeft: 12,
    flex: 1,
  },
  packagesSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  packagesTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 18,
    color: '#4B2E1E',
    marginBottom: 16,
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    position: 'relative',
  },
  packageCardSelected: {
    borderColor: '#A58E63',
    backgroundColor: '#FEF7ED',
  },
  packageCardPopular: {
    borderColor: '#F59E0B',
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    right: 16,
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  popularText: {
    fontFamily: 'Literata-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  packageTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 18,
    color: '#4B2E1E',
  },
  packagePrice: {
    fontFamily: 'Literata-Bold',
    fontSize: 20,
    color: '#A58E63',
  },
  packageDuration: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 12,
    color: '#5C3D2E',
    marginBottom: 8,
  },
  packageDescription: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 18,
  },
  bottomActions: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#E3D9C3',
  },
  purchaseButton: {
    backgroundColor: '#A58E63',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#F7F2E7',
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  restoreButtonText: {
    fontFamily: 'Literata-Regular',
    fontSize: 14,
    color: '#A58E63',
    marginLeft: 8,
  },
  disclaimer: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 10,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 14,
  },
});