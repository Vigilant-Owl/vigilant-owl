"use client";

import React, { 
  createContext, 
  useContext, 
  useState, 
  Dispatch, 
  SetStateAction, 
  useEffect 
} from "react";
import { User } from "@/types";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";

interface UserContextValue {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {}
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response && error.response.status === 401) {
          console.error('Authentication error, redirect to login');
          localStorage.removeItem('token');
          
          try {
            const supabase = createClient();
            await supabase.auth.signOut();
            
            // if (typeof window !== 'undefined') {
            //   window.location.href = '/login';
            // }
          } catch (signOutError) {
            console.error('Error during sign out:', signOutError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserAuth = (): UserContextValue => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error("useUserAuth must be used within a UserProvider");
  }
  
  return context;
};

export default UserProvider;