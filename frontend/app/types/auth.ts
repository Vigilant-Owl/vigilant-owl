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

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}
