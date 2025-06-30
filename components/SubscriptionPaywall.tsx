import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { 
  X, 
  Crown, 
  Calendar, 
  Coffee, 
  Star, 
  Zap,
  CheckCircle 
} from 'lucide-react-native';
import { useRevenueCat } from '@/hooks/useRevenueCat';

const { width } = Dimensions.get('window');

interface SubscriptionPaywallProps {
  visible: boolean;
  onClose: () => void;
  onSubscribed?: () => void;
}

export default function SubscriptionPaywall({ 
  visible, 
  onClose, 
  onSubscribed 
}: SubscriptionPaywallProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { 
    currentOffering, 
    isLoading, 
    error, 
    purchasePackage, 
    restorePurchases 
  } = useRevenueCat();

  const handlePurchase = async () => {
    if (!currentOffering?.monthly) {
      console.error('No monthly package available');
      return;
    }

    setIsPurchasing(true);
    try {
      const success = await purchasePackage(currentOffering.monthly);
      if (success) {
        onSubscribed?.();
        onClose();
      }
    } catch (err) {
      console.error('Purchase error:', err);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        onSubscribed?.();
        onClose();
      } else {
        if (Platform.OS === 'web') {
          alert('No purchases found to restore');
        } else {
          // You might want to show a toast or other feedback here
        }
      }
    } catch (err) {
      console.error('Restore error:', err);
    } finally {
      setIsPurchasing(false);
    }
  };

  const benefits = [
    {
      icon: Calendar,
      title: 'One Free Event Monthly',
      description: 'Attend any literary gathering at no cost once per month'
    },
    {
      icon: Coffee,
      title: 'Complimentary Refreshments',
      description: 'Enjoy a free drink at every event you attend'
    },
    {
      icon: Star,
      title: 'Priority Booking',
      description: 'Get first access to limited-capacity events'
    },
    {
      icon: Zap,
      title: 'Exclusive Content',
      description: 'Access to premium story collections and author interviews'
    }
  ];

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
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color="#4B2E1E" />
          </TouchableOpacity>
          
          <Animated.View 
            entering={FadeInUp.delay(200).duration(600)}
            style={styles.headerContent}
          >
            <Crown size={48} color="#A58E63" />
            <Text style={styles.title}>Chapter & Verse Premium</Text>
            <Text style={styles.subtitle}>
              Elevate your literary journey with exclusive benefits
            </Text>
          </Animated.View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Benefits Section */}
          <Animated.View 
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.benefitsSection}
          >
            <Text style={styles.sectionTitle}>Premium Benefits</Text>
            
            {benefits.map((benefit, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(600 + index * 100).duration(600)}
                style={styles.benefitCard}
              >
                <View style={styles.benefitIcon}>
                  <benefit.icon size={24} color="#A58E63" />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                </View>
                <CheckCircle size={20} color="#16A34A" />
              </Animated.View>
            ))}
          </Animated.View>

          {/* Pricing Section */}
          <Animated.View 
            entering={FadeInUp.delay(800).duration(600)}
            style={styles.pricingSection}
          >
            <Text style={styles.sectionTitle}>Simple Pricing</Text>
            
            <View style={styles.pricingCard}>
              <View style={styles.pricingHeader}>
                <Text style={styles.pricingTitle}>Monthly Premium</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>$30</Text>
                  <Text style={styles.pricePeriod}>/month</Text>
                </View>
              </View>
              
              <Text style={styles.pricingDescription}>
                Cancel anytime. Your subscription includes all premium benefits 
                and supports our literary community.
              </Text>
            </View>
          </Animated.View>

          {/* Loading/Error States */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#A58E63" />
              <Text style={styles.loadingText}>Loading subscription options...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </ScrollView>

        {/* Footer Actions */}
        <Animated.View 
          entering={FadeInDown.delay(1000).duration(600)}
          style={styles.footer}
        >
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              (isPurchasing || isLoading || !currentOffering) && styles.subscribeButtonDisabled
            ]}
            onPress={handlePurchase}
            disabled={isPurchasing || isLoading || !currentOffering}
          >
            {isPurchasing ? (
              <ActivityIndicator color="#F7F2E7" size="small" />
            ) : (
              <>
                <Crown size={20} color="#F7F2E7" style={styles.buttonIcon} />
                <Text style={styles.subscribeButtonText}>
                  Start Premium Membership
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isPurchasing}
          >
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Subscription automatically renews unless cancelled at least 24 hours 
            before the end of the current period.
          </Text>
        </Animated.View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E3D9C3',
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 28,
    color: '#4B2E1E',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  benefitsSection: {
    paddingVertical: 24,
  },
  sectionTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 20,
    color: '#4B2E1E',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F7F2E7',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
    marginRight: 12,
  },
  benefitTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#4B2E1E',
    marginBottom: 4,
  },
  benefitDescription: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  pricingSection: {
    paddingVertical: 24,
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#A58E63',
    borderRadius: 16,
    padding: 24,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pricingTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 18,
    color: '#4B2E1E',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: '#A58E63',
  },
  pricePeriod: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    marginLeft: 4,
  },
  pricingDescription: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    marginTop: 12,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  errorText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#E3D9C3',
  },
  subscribeButton: {
    backgroundColor: '#A58E63',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  subscribeButtonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#F7F2E7',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    fontFamily: 'Literata-Regular',
    fontSize: 14,
    color: '#A58E63',
  },
  disclaimer: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 12,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 16,
  },
});