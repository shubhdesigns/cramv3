import { User, AuthResponse, UserPreferences } from '../types';
import { apiClient } from './api';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  setupTokenRefresh();
  return data;
}

export async function signup(email: string, password: string, name?: string): Promise<AuthResponse> {
  const data = await apiClient.post<AuthResponse>('/auth/signup', { email, password, name });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  setupTokenRefresh();
  return data;
}

export async function refreshToken(): Promise<AuthResponse> {
  const data = await apiClient.post<AuthResponse>('/auth/refresh', {});
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  setupTokenRefresh();
  return data;
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  apiClient.clearCache();
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function getUser(): User | null {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function updateUserProfile(updates: Partial<User>): Promise<User> {
  const data = await apiClient.put<User>('/auth/profile', updates);
  localStorage.setItem('user', JSON.stringify(data));
  return data;
}

export async function updateUserPreferences(preferences: Partial<UserPreferences>): Promise<User> {
  const data = await apiClient.put<User>('/auth/preferences', { preferences });
  localStorage.setItem('user', JSON.stringify(data));
  return data;
}

export function getUserPreferences(): UserPreferences {
  const user = getUser();
  return user?.preferences || {
    theme: 'system',
    notifications: true,
    defaultDifficulty: 'Medium'
  };
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.post('/auth/change-password', { currentPassword, newPassword });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.post('/auth/request-password-reset', { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await apiClient.post('/auth/reset-password', { token, newPassword });
}

// Token refresh logic
let refreshTimeout: NodeJS.Timeout | null = null;

export function setupTokenRefresh(): void {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  const token = getToken();
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresIn = payload.exp * 1000 - Date.now();
    
    // Refresh token 5 minutes before expiry
    refreshTimeout = setTimeout(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        logout();
      }
    }, expiresIn - 5 * 60 * 1000);
  } catch (error) {
    console.error('Error parsing token:', error);
    logout();
  }
} 