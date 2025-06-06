export interface UserData {
  id: string;
  username: string;
  email: string;
}

export interface User extends UserData {
  token: string;
}

export interface AuthHookResult {
  user: User | null;
  loadingInitial: boolean;
  loadingUser: boolean;
  login: (userDataWithToken: User) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthResponse {
  success: boolean;
  data?: User;
  message?: string;
}
