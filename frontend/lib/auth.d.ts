declare module '@/lib/auth' {
  export interface User {
    id: string;
    name: string;
    email: string;
  }

  export function getCurrentUser(): Promise<User | null>;
}
