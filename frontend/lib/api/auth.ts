const BASE_URL = 'http://localhost:3009'

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });

      // Log the full response for debugging
      const responseBody = await response.text();
      console.log('Login Response Status:', response.status);
      console.log('Login Response Body:', responseBody);

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = 'Login failed';
        try {
          const errorData = JSON.parse(responseBody);
          errorMessage = errorData.message || errorData.error || 'Login failed';
        } catch {
          // If parsing fails, use the raw response text
          errorMessage = responseBody;
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful response
      const data = JSON.parse(responseBody);
      
      // Store user token and info in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  register: async (registerData: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};
