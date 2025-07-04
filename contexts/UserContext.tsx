import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentService } from '@/services/PaymentService';

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  status: string;
  checkInCode: string;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  birthday: string;
  referralSource: string;
  literaryType?: string;
  city?: string;
  onboardingComplete: boolean;
  isPremium?: boolean;
  upcomingEvents?: UpcomingEvent[];
  quizProgressCurrentQuestion?: number;
  quizProgressAnswers?: number[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  updateUser: (updates: Partial<User>) => void;
  addUpcomingEvent: (event: UpcomingEvent) => boolean;
  clearUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a fresh initial user state
const createInitialUser = (): User => ({
  id: '',
  phone: '',
  name: '',
  birthday: '',
  referralSource: '',
  literaryType: undefined,
  city: undefined,
  onboardingComplete: false,
  upcomingEvents: [],
  isPremium: false,
  quizProgressCurrentQuestion: undefined,
  quizProgressAnswers: undefined,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('Loading user data from AsyncStorage...');
        
        // Initialize payment service
        try {
          await PaymentService.initialize();
        } catch (error) {
          console.error('Failed to initialize payment service:', error);
        }
        
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('Loaded user data:', parsedUser);
          
          // Check premium status from payment service
          let isPremium = parsedUser.isPremium || false;
          try {
            const customerInfo = await PaymentService.getCustomerInfo();
            isPremium = !!customerInfo.entitlements.active.premium_access?.isActive;
            console.log('Premium status from payment service:', isPremium);
          } catch (error) {
            console.error('Failed to check premium status:', error);
          }
          
          setUser({ ...parsedUser, isPremium });
        } else {
          console.log('No stored user data found');
          // Initialize with clean state instead of null
          setUser(createInitialUser());
        }
      } catch (error) {
        console.error('Failed to load user data from AsyncStorage:', error);
        // On error, also initialize with clean state
        setUser(createInitialUser());
      } finally {
        setIsLoading(false);
        console.log('User data loading complete');
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const saveUserData = async () => {
      try {
        if (user !== null && user.onboardingComplete) {
          console.log('Saving user data to AsyncStorage:', user);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          
          // Set user ID in payment service for analytics
          if (user.id) {
            try {
              await PaymentService.setUserId(user.id);
            } catch (error) {
              console.error('Failed to set user ID in payment service:', error);
            }
          }
        } else {
          console.log('Not saving incomplete user data to AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to save user data to AsyncStorage:', error);
      }
    };

    // Only save if not currently loading to prevent overwriting during initial load
    if (!isLoading) {
      saveUserData();
    }
  }, [user, isLoading]);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) {
        // If no user exists, create a new one with the updates
        return { ...createInitialUser(), ...updates };
      }
      return { ...prev, ...updates };
    });
  };

  const addUpcomingEvent = (event: UpcomingEvent): boolean => {
    if (!user) {
      console.log('UserContext - No user found, cannot add event');
      return false;
    }
    
    console.log('UserContext - Adding upcoming event:', {
      event,
      currentEvents: user.upcomingEvents
    });

    // Check if event already exists
    const existingEvents = user.upcomingEvents || [];
    const isDuplicate = existingEvents.some(existingEvent => existingEvent.id === event.id);
    
    console.log('UserContext - Duplicate check:', {
      isDuplicate,
      existingEventIds: existingEvents.map(e => e.id),
      newEventId: event.id
    });

    if (isDuplicate) {
      console.log('UserContext - Event already exists, not adding');
      return false; // Event already exists
    }
    
    // Add new event
    const updatedEvents = [...existingEvents, event];
    console.log('UserContext - Updating user with new events:', updatedEvents);
    updateUser({ upcomingEvents: updatedEvents });
    return true; // Event successfully added
  };

  const clearUserData = async () => {
    try {
      console.log('Clearing user data from AsyncStorage...');
      await AsyncStorage.removeItem('user');
      
      // Log out from payment service
      try {
        await PaymentService.logOut();
      } catch (error) {
        console.error('Failed to log out from payment service:', error);
      }
      
      // Reset mock subscription if using mock payments
      PaymentService.resetMockSubscription();
      
      // Reset to clean initial state instead of null
      const freshUser = createInitialUser();
      setUser(freshUser);
      console.log('User data cleared and reset to initial state:', freshUser);
    } catch (error) {
      console.error('Error clearing user data:', error);
      // Even on error, reset to clean state
      setUser(createInitialUser());
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, updateUser, addUpcomingEvent, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}