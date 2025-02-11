import { create } from "zustand";
import {persist} from "zustand/middleware";
import { registerUser as registerUserApi, loginUser, logoutUser, getSessionUser } from "../api/userApi";
import { useQuery } from "@tanstack/react-query"; 

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      error: null,
      success: null,

      setError: (error) => set({ error }),

      registerUser: async (formData) => {
        set({ error: null, success: null });
        try {
          const response = await registerUserApi(formData);
          set({ user: response, success: "User registered successfully!", error: null });
          return response;
        } catch (error) {
          set({ error, success: null });
        }
      },

      login: async (identifier, password) => {
        try {
          const data = await loginUser(identifier, password);
          set({ user: {id: data.user.id , username: data.user.username, role: data.user.role}, error: null });
          const fullUser = await getSessionUser();
          if (fullUser?.user) {
            set({ user: fullUser.user });
          }
        } catch (err) {
          set({ error: err.response?.data?.message || "Login failed!" });
        }
      },
      logout: async () => {
        await logoutUser();
        set({ user: null });
        sessionStorage.clear(); 
      },

      setUser: (userData) => set({ user: userData }),

      fetchSession: async () => {
        try {
          const data = await getSessionUser();
          if (data?.user) {
            set({ user: { 
              id: data.user._id,
              username: data.user.username,
              name: data.user.name,
              role: data.user.role,
              email: data.user.email,
              phone: data.user.phone,
              age: data.user.age,
              profileImage: data.user.profileImage 
            }});
            return data.user;
          } else {
            set({ user: null });
            return null;
          }
        } catch {
          set({ user: null });
          return null;
        }
      },
    }),
    {
      name: "user-session", 
    }
  )
);

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: useUserStore.getState().fetchSession,
    refetchOnWindowFocus: true,
    // refetchInterval: 1000,
    retry: false, 
  });
};

export default useUserStore;