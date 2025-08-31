export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
}
