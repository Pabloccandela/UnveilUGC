import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, SocialMediaProfile } from '../src/models/User';
import { MOCK_USERS } from '../src/services/mockData';
type OnboardingData = {
  step1: {
    fullName: string;
    email: string;
    password: string;
    country: string;
    city: string;
  };
  step2: {
    socialMedia: Array<{
      platform: string;
      username: string;
    }>;
    stats: {
      campaigns: number;
      reviews: [];
      level: string;
    };
  };
  step3: {
    interests: string[];
  };
  step4: {
    completed: boolean;
  };
};

interface AuthContextType {
  user: User | null;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  register: (registrationData: { email: string; password: string; role: UserRole }) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  completeOnboarding: () => void;
  onboardingData: OnboardingData | null;
  updateOnboardingData: (step: keyof OnboardingData, data: any) => void;
  resetOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  // Mock login function
  const login = async (user: User): Promise<void> => {
    setIsLoading(true);
    const mockUser = MOCK_USERS.find(u => u.email === user.email && u.password === user.password);
    try {
      if (mockUser) {
        setUser(mockUser);
        setHasCompletedOnboarding(true);
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (registrationData: { email: string; password: string; role: UserRole }): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulación de registro
      if (registrationData.email && registrationData.password) {
        const tempUser: User = {
          id: Math.random().toString(),
          fullName: '',
          password: registrationData.password,
          email: registrationData.email,
          role: registrationData.role,
          country: '',
          city: '',
          socialMedia: [],
          stats: {
            campaigns: 0,
            reviews: [],
            level: 'Principiante',
          },
          interests: [],
        };

        // Limpiar el estado anterior
        setHasCompletedOnboarding(false);
        setOnboardingData(null);
        setUser(tempUser);

        // Inicializar los datos de onboarding
        const initialOnboardingData: OnboardingData = {
          step1: {
            fullName: '',
            email: registrationData.email,
            password: registrationData.password,
            country: '',
            city: '',
          },
          step2: {
            socialMedia: [],
            stats: {
              campaigns: 0,
              reviews: [],
              level: 'Principiante',
            },
          },
          step3: {
            interests: [],
          },
          step4: {
            completed: false,
          },
        };
        setOnboardingData(initialOnboardingData);
      } else {
        throw new Error('Invalid registration data');
      }
    } finally {
      setIsLoading(false);
    }
    await AsyncStorage.removeItem('hasCompletedOnboarding');
    await AsyncStorage.removeItem('onboardingData');
    return Promise.resolve();
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const logout = () => {
    setUser(null);
    setHasCompletedOnboarding(false);
    setOnboardingData(null);
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('onboardingData');
    AsyncStorage.removeItem('hasCompletedOnboarding');
  };

  // Cargar datos del AsyncStorage al iniciar
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [savedUser, savedOnboardingData, savedHasCompletedOnboarding] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('onboardingData'),
          AsyncStorage.getItem('hasCompletedOnboarding')
        ]);

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedOnboardingData) {
          setOnboardingData(JSON.parse(savedOnboardingData));
        }
        if (savedHasCompletedOnboarding) {
          setHasCompletedOnboarding(JSON.parse(savedHasCompletedOnboarding));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadData();
  }, []);

  // Guardar datos en AsyncStorage cuando cambien
  React.useEffect(() => {
    const saveData = async () => {
      try {
        const promises = [];

        if (user) {
          promises.push(AsyncStorage.setItem('user', JSON.stringify(user)));
        }
        if (onboardingData) {
          promises.push(AsyncStorage.setItem('onboardingData', JSON.stringify(onboardingData)));
        }
        promises.push(AsyncStorage.setItem('hasCompletedOnboarding', JSON.stringify(hasCompletedOnboarding)));

        await Promise.all(promises);
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    };

    saveData();
  }, [user, onboardingData, hasCompletedOnboarding]);

  const completeOnboarding = () => {
    if (onboardingData) {
      const newUser: User = {
        id: Math.random().toString(),
        fullName: onboardingData.step1.fullName,
        password: onboardingData.step1.password,
        email: onboardingData.step1.email,
        role: 'creator',
        country: onboardingData.step1.country,
        city: onboardingData.step1.city,
        socialMedia: onboardingData.step2.socialMedia as SocialMediaProfile[],
        stats: onboardingData.step2.stats,
        interests: onboardingData.step3.interests,
      };

      setUser(newUser);
      setHasCompletedOnboarding(true);
    }
  };

  const resetOnboarding = () => {
    setOnboardingData(null);
    setHasCompletedOnboarding(false);
  };

  const updateOnboardingData = (step: keyof OnboardingData, data: any) => {
    if (onboardingData) {
      setOnboardingData({
        ...onboardingData,
        [step]: {
          ...onboardingData[step],
          ...data,
        },
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        hasCompletedOnboarding,
        isLoading,
        login,
        register,
        updateUser,
        logout,
        completeOnboarding,
        onboardingData,
        updateOnboardingData,
        resetOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
