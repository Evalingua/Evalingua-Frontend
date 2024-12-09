import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, AuthResponse, Role } from '../types/auth.type';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthorized: (roles: Role[]) => boolean;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_INVALID' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        isAuthenticated: true,
        user: {
          username: action.payload.username,
          role: action.payload.role,
        },
        token: action.payload.token,
      };
    case 'LOGOUT':
    case 'TOKEN_INVALID':
      return initialState;
    default:
      return state;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Función para verificar la validez del token
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/v1/auth/validate',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // Función para verificar el estado de autenticación
  const checkAuthStatus = async (): Promise<boolean> => {
    const savedAuth = localStorage.getItem('auth');
    if (!savedAuth) return false;

    try {
      const authData = JSON.parse(savedAuth);
      const isValid = await validateToken(authData.data.token);

      if (!isValid) {
        dispatch({ type: 'TOKEN_INVALID' });
        localStorage.removeItem('auth');
        return false;
      }

      if (!state.isAuthenticated) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: authData });
      }

      return true;
    } catch (error) {
      console.error('Auth status check error:', error);
      dispatch({ type: 'TOKEN_INVALID' });
      localStorage.removeItem('auth');
      return false;
    }
  };

  useEffect(() => {
    // Verificar token al cargar y periódicamente
    const validateSession = async () => {
      await checkAuthStatus();
    };

    validateSession();

    // Verificar el token cada 5 minutos
    const intervalId = setInterval(validateSession, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data: AuthResponse = await response.json();
      localStorage.setItem('auth', JSON.stringify(data));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    dispatch({ type: 'LOGOUT' });
  };

  const isAuthorized = (roles: Role[]) => {
    return state.user ? roles.includes(state.user.role) : false;
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, isAuthorized, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
