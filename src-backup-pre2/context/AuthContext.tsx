import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getFirebaseAuth } from '../services/firebaseAuth';
import { dataService } from '../services/dataService';
import { normalizeDbRole } from '../services/mappers';
import { UserRole, Guide, Vehicle } from '../components/admin/types';

function normalizeRole(dbRole?: string | null): UserRole {
  // SECURITY: unknown/invalid roles MUST fall back to the least privilege ('customer'),
  // never to an admin role. Reuse the shared mapper so this stays in sync with the DB enum.
  return normalizeDbRole(dbRole) as UserRole;
}

interface AuthContextType {
  currentUser: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    operatorId?: string;
    operatorName?: string;
  } | null;
  currentRole: UserRole;
  currentOperator: string;
  setCurrentRole: (role: UserRole, operatorName?: string) => void;
  setCurrentOperator: (operator: string) => void;
  guides: Guide[];
  vehicles: Vehicle[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthContextType['currentUser']>(null);
  const [currentRole, setCurrentRoleState] = useState<UserRole>('platform-admin');
  const [currentOperator, setCurrentOperatorState] = useState<string>('Andes Expeditions');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResources = async () => {
    try {
      const [guidesData, vehiclesData] = await Promise.all([
        dataService.getGuides(),
        dataService.getVehicles()
      ]);
      setGuides(guidesData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error loading resources:', error);
    }
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await dataService.getCurrentUser();
          if (userData) {
            const role = normalizeRole(userData.role);
            setCurrentUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role,
              operatorId: userData.operatorId,
              operatorName: userData.operatorName
            });
            setCurrentRoleState(role);
            if (userData.operatorName) {
              setCurrentOperatorState(userData.operatorName);
            }
          } else {
            // Default only for local development with emulators.
            // In production, a missing DB user means no session (redirect to login).
            if (import.meta.env.VITE_USE_EMULATORS === 'true') {
              setCurrentUser({
                id: user.uid,
                email: user.email || '',
                name: user.displayName || 'Admin',
                role: 'platform-admin',
                operatorId: 'operator-01',
                operatorName: 'Andes Expeditions'
              });
            } else {
              setCurrentUser(null);
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        // Producción: sin usuario autenticado => null (la UI debe redirigir a login).
        // Solo en desarrollo con emuladores usamos un usuario dev por defecto.
        if (import.meta.env.VITE_USE_EMULATORS === 'true') {
          setCurrentUser({
            id: 'dev-user',
            email: 'dev@buscatours.com',
            name: 'Admin Dev',
            role: 'platform-admin',
            operatorId: 'operator-01',
            operatorName: 'Andes Expeditions'
          });
        } else {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadResources();
  }, []);

  const setCurrentRole = (role: UserRole, operatorName?: string) => {
    setCurrentRoleState(role);
    if (operatorName) {
      setCurrentOperatorState(operatorName);
    }
  };

  const setCurrentOperator = (operator: string) => {
    setCurrentOperatorState(operator);
  };

  const refreshData = async () => {
    await loadResources();
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentRole,
      currentOperator,
      setCurrentRole,
      setCurrentOperator,
      guides,
      vehicles,
      loading,
      refreshData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
