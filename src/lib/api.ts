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
  updated_at?: string;
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
  role?: string;
}

let cfg = { API_BASE: '/api/v1' };
export function setRuntimeCfg(c: { API_BASE: string }) { cfg = c; }

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  isHtmlResponse?: boolean;
  details?: string | object;
}

export interface ValidationError {
  type: string;
  loc: string[];
  msg: string;
  input: any;
}

export interface ErrorResponse {
  detail: string | ValidationError[];
}

type FetchOpts = RequestInit & { auth?: boolean };

// Utility to check if response contains HTML
function isHtmlResponse(contentType: string | null, body: string): boolean {
  if (contentType && contentType.includes('text/html')) return true;
  return body.trim().toLowerCase().startsWith('<!doctype html') || body.trim().toLowerCase().startsWith('<html');
}

// Enhanced API fetch with proper error handling
export async function api<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const url = `${cfg.API_BASE}${path}`;
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (opts.auth) {
    const t = localStorage.getItem('auth_token');
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  
  try {
    const res = await fetch(url, { ...opts, headers: { ...headers, ...(opts.headers||{}) } });
    
    // Get response text to check content
    const text = await res.text();
    const contentType = res.headers.get('content-type');
    
    // Check if we received HTML instead of JSON
    if (isHtmlResponse(contentType, text)) {
      const error = new Error(`API returned HTML instead of JSON. This usually means the API endpoint is not available or there's a routing issue.`) as ApiError;
      error.status = res.status;
      error.statusText = res.statusText;
      error.isHtmlResponse = true;
      throw error;
    }
    
    if (!res.ok) {
      // Try to parse error response as JSON
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const errorData = JSON.parse(text);
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // If not valid JSON, use the text as error message
        errorMessage = text || errorMessage;
      }
      
      const error = new Error(errorMessage) as ApiError;
      error.status = res.status;
      error.statusText = res.statusText;
      throw error;
    }
    
    // Parse JSON response
    try {
      return JSON.parse(text) as T;
    } catch (parseError) {
      const error = new Error('Invalid JSON response from server') as ApiError;
      error.status = res.status;
      error.statusText = res.statusText;
      throw error;
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error
      const apiError = new Error('Network error: Unable to connect to API server. Please check if the server is running.') as ApiError;
      throw apiError;
    }
    throw error;
  }
}

class ApiClient {
  private baseUrl = '/api/v1'; // Use relative path for proxy
  private token: string | null = null;

  async init() {
    // No need to load config, using proxy
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

    // Debug logging for development
    if (process.env.NODE_ENV === 'development' && (endpoint.includes('register') || endpoint.includes('auth'))) {
      console.log('🔧 Auth API Request:', {
        url: `${this.baseUrl}${endpoint}`,
        method: config.method || 'GET'
      });
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      // Get response text to check content
      const text = await response.text();
      const contentType = response.headers.get('content-type');
      
      // Check if we received HTML instead of JSON
      if (isHtmlResponse(contentType, text)) {
        const error = new Error(`API endpoint ${endpoint} returned HTML instead of JSON. This usually means the endpoint is not available.`) as ApiError;
        error.status = response.status;
        error.statusText = response.statusText;
        error.isHtmlResponse = true;
        throw error;
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          const error = new Error('Authentication required') as ApiError;
          error.status = 401;
          error.statusText = 'Unauthorized';
          throw error;
        }
        
        // Try to parse error response as JSON
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData: ErrorResponse | null = null;
        
        try {
          errorData = JSON.parse(text);
          if (errorData?.detail) {
            if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            } else if (Array.isArray(errorData.detail)) {
              // Handle validation errors (422)
              const validationErrors = errorData.detail.map((err: ValidationError) => 
                `${err.loc.join('.')}: ${err.msg}`
              ).join(', ');
              errorMessage = `Validation errors: ${validationErrors}`;
            }
          }
        } catch {
          // If not valid JSON, use the text as error message
          errorMessage = text || errorMessage;
        }
        
        // Debug logging for development
        if (process.env.NODE_ENV === 'development' && (endpoint.includes('register') || endpoint.includes('auth'))) {
          console.log('🔧 Auth API Error:', {
            status: response.status,
            error: errorMessage
          });
        }
        
        const error = new Error(errorMessage) as ApiError;
        error.status = response.status;
        error.statusText = response.statusText;
        error.details = errorData;
        throw error;
      }
      
      // Parse JSON response
      try {
        return JSON.parse(text) as T;
      } catch (parseError) {
        const error = new Error(`Invalid JSON response from ${endpoint}`) as ApiError;
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error
        const apiError = new Error(`Network error: Unable to connect to API server at ${this.baseUrl}${endpoint}`) as ApiError;
        throw apiError;
      }
      throw error;
    }
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
    return this.request('/auth/users/me');
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