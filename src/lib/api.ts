import { AppCfg, loadRuntimeConfig } from './runtimeConfig';

export interface Banner {
  id: number;
  key: string;
  title?: string;
  image_url: string;
  link_url?: string;
  price: number;
  currency: string;
  active: boolean;
  position: number;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  image_url?: string;
  slug: string;
  stock: number;
  is_active: boolean;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email_or_phone: string;
  password: string;
  username: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

let cfg = { API_BASE: '/api/v1' };
export function setRuntimeCfg(c: { API_BASE: string }) { cfg = c; }

type FetchOpts = RequestInit & { auth?: boolean };
export async function api<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const url = `${cfg.API_BASE}${path}`;
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (opts.auth) {
    const t = localStorage.getItem('auth_token');
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(url, { ...opts, headers: { ...headers, ...(opts.headers||{}) } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

class ApiClient {
  private baseUrl = '';
  private token: string | null = null;

  async init() {
    if (!this.baseUrl) {
      const config = await loadRuntimeConfig();
      this.baseUrl = config.API_BASE;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    await this.init();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Authentication required');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${cfg.API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: data.identifier,
        password: data.password,
      }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const result = await response.json();
    this.setToken(result.access_token);
    return result;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/user');
  }

  // Banners
  async getBanners(): Promise<Banner[]> {
    return this.request('/banners');
  }

  async getBanner(key: string): Promise<Banner> {
    return this.request(`/banners/${key}`);
  }

  async updateBanner(key: string, data: Partial<Banner>): Promise<Banner> {
    return this.request(`/banners/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.request('/products');
  }

  async getProduct(id: number): Promise<Product> {
    return this.request(`/products/${id}`);
  }

  async createProduct(data: FormData | any): Promise<Product> {
    await this.init();
    const token = this.getToken();
    
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: data instanceof FormData ? headers : { ...headers, 'Content-Type': 'application/json' },
      body: data instanceof FormData ? data : JSON.stringify(data),
    };

    const response = await fetch(`${this.baseUrl}/products`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`);
    }

    return response.json();
  }

  // Search products
  async searchProducts(query: string, limit: number = 6): Promise<Product[]> {
    return this.request(`/products?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // Orders
  async createOrder(orderData: {
    items: Array<{ product_id: number; quantity: number; price: number }>;
    total: number;
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();