export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword?: string;
}

export interface UserData {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}
