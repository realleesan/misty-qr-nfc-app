import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = authService.getToken();
    const savedUser = authService.getUser();

    if (token && savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      authService.setToken(data.token);
      authService.setUser(data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return { success: false, error: 'Máy chủ phản hồi quá chậm. Vui lòng thử lại sau.' };
      }
      if (!error.response) {
        return { success: false, error: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.' };
      }
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const data = await authService.register({ name, email, password, phone });
      authService.setToken(data.token);
      authService.setUser(data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return { success: false, error: 'Máy chủ phản hồi quá chậm. Vui lòng thử lại sau.' };
      }
      if (!error.response) {
        return { success: false, error: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.' };
      }
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated, 
      login, 
      register, 
      logout 
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
