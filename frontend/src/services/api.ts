import { ApiError } from '../types';
import { getToken } from './auth';

const API_URL = 'http://localhost:3001/api';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiClient {
  private cache: Map<string, CacheEntry<any>> = new Map();

  private async getHeaders(): Promise<Headers> {
    const token = getToken();
    return new Headers({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    });
  }

  private getCacheKey(method: string, url: string, body?: any): string {
    return `${method}:${url}:${JSON.stringify(body || {})}`;
  }

  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
      return entry.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async get<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const cacheKey = this.getCacheKey('GET', url);

    if (useCache) {
      const cached = this.getCached<T>(cacheKey);
      if (cached) return cached;
    }

    const response = await fetch(url, {
      headers: await this.getHeaders(),
    });

    const data = await this.handleResponse<T>(response);
    if (useCache) {
      this.setCache(cacheKey, data);
    }
    return data;
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete(endpoint: string): Promise<void> {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  clearCache(): void {
    this.cache.clear();
  }

  clearCacheForEndpoint(endpoint: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(endpoint)) {
        this.cache.delete(key);
      }
    }
  }
}

export const apiClient = new ApiClient(); 