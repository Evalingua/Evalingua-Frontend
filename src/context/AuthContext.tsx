import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Importa jwt-decode
import { AuthState, AuthResponse, Role } from '../types/auth.type';
import { BaseResponse } from '../types/page';

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
  isLoading: true
};

const baseUrl = import.meta.env.VITE_API_BASE_URL;

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { token: string } }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_INVALID' }
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_CHECKED' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true };
    case 'AUTH_CHECKED':
      return { ...state, isLoading: false };
    case 'LOGIN_SUCCESS': {
      // Decodificar el token para extraer el username y el rol
      const decodedToken = jwtDecode(action.payload.token) as {
        sub: string; // Asume que el username está en el claim "sub"
        role: Role;
      };

      return {
        isAuthenticated: true,
        user: {
          username: decodedToken.sub,
          role: decodedToken.role,
        },
        token: action.payload.token,
        isLoading: false,
      };
    }
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      };
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
      const response = await fetch(`${baseUrl}/auth/validate`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // Función para verificar el estado de autenticación
  const checkAuthStatus = async (): Promise<boolean> => {
    dispatch({ type: 'AUTH_LOADING' });
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({ type: 'AUTH_CHECKED' });
      return false;
    }

    try {
      const isValid = await validateToken(token);

      if (!isValid) {
        dispatch({ type: 'TOKEN_INVALID' });
        localStorage.removeItem('token');
        dispatch({ type: 'AUTH_CHECKED' });
        return false;
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: { token } });
      dispatch({ type: 'AUTH_CHECKED' });
      return true;
    } catch (error) {
      console.error('Auth status check error:', error);
      dispatch({ type: 'TOKEN_INVALID' });
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_CHECKED' });
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
      const response = await fetch(`${baseUrl}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.message}`);
      }

      const data: BaseResponse<AuthResponse> = await response.json();
      console.log('Login response:', data);
      localStorage.setItem('token', data.data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token: data.data.token.toString() } });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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