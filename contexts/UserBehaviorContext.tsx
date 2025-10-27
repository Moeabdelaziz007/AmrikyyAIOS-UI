import React, { createContext, useState, useContext, useCallback } from 'react';
import { UserAction, AppID } from '../types';

const MAX_ACTION_HISTORY = 20;

interface UserBehaviorContextType {
  actions: UserAction[];
  logAction: (appId: AppID, details?: Record<string, any>) => void;
  getFrequentApps: (count: number) => AppID[];
}

const UserBehaviorContext = createContext<UserBehaviorContextType | undefined>(undefined);

export const UserBehaviorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<UserAction[]>([]);
  const [appFrequency, setAppFrequency] = useState<Record<AppID, number>>({});

  const logAction = useCallback((appId: AppID, details?: Record<string, any>) => {
    const newAction: UserAction = { appId, timestamp: Date.now(), details };
    
    setActions(prev => [newAction, ...prev.slice(0, MAX_ACTION_HISTORY - 1)]);
    
    setAppFrequency(prev => ({
        ...prev,
        // FIX: Using a ternary operator for a more explicit type check to ensure
        // the count is correctly incremented, resolving a potential type inference issue.
        [appId]: prev[appId] ? prev[appId] + 1 : 1,
    }));
  }, []);
  
  const getFrequentApps = useCallback((count: number): AppID[] => {
      return Object.entries(appFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, count)
        .map(([appId]) => appId as AppID);
  }, [appFrequency]);


  return (
    <UserBehaviorContext.Provider value={{ actions, logAction, getFrequentApps }}>
      {children}
    </UserBehaviorContext.Provider>
  );
};

export const useUserBehavior = (): UserBehaviorContextType => {
  const context = useContext(UserBehaviorContext);
  if (!context) {
    throw new Error('useUserBehavior must be used within a UserBehaviorProvider');
  }
  return context;
};
