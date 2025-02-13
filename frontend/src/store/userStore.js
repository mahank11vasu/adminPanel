import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  registerUser as registerUserApi, 
  loginUser, 
  logoutUser, 
  getSessionUser, 
  getAllUsers, 
  deleteUser, 
  updateUser 
} from "../api/userApi";
import { getRolePermissions } from "../api/roleApi"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; 

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
          set({ 
            user: { 
              id: data.user.id, 
              username: data.user.username, 
              role: data.user.role 
            }, 
            error: null 
          });

          const fullUser = await getSessionUser();
          if (fullUser?.user) {
            const rolePermissions = await getRolePermissions(fullUser.user.role);
            set({ 
              user: { 
                ...fullUser.user, 
                permissions: rolePermissions || [] 
              } 
            });
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

      fetchUsers: () => {
        return useQuery({
          queryKey: ["users"],
          queryFn: getAllUsers,
          onSuccess: (data) => set({ users: data }),
        });
      },

      deleteUser: () => {
        const queryClient = useQueryClient();
        return useMutation({
          mutationFn: (id) => deleteUser(id),
          onSuccess: () => {
            queryClient.invalidateQueries(["users"]); 
          },
        });
      },

      updateUser: () => {
        const queryClient = useQueryClient();
        return useMutation({
          mutationFn: ({ id, formData }) => updateUser(id, formData),
          onSuccess: () => {
            queryClient.invalidateQueries(["users"]); 
          },
        });
      },

      setUser: (userData) => set({ user: userData }),

      fetchSession: async () => {
        try {
          const data = await getSessionUser();
          if (data?.user) {
            const rolePermissions = await getRolePermissions(data.user.role);
            set((state) => {
              if (JSON.stringify(state.user?.permissions) !== JSON.stringify(rolePermissions)) {
                return {
                  user: { 
                    id: data.user._id,
                    username: data.user.username,
                    name: data.user.name,
                    role: data.user.role,
                    email: data.user.email,
                    phone: data.user.phone,
                    age: data.user.age,
                    profileImage: data.user.profileImage,
                    permissions: rolePermissions || [] 
                  } 
                };
              }
              return state; 
            });
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
    enabled: !!useUserStore.getState().user,
    retry: false, 
  });
};

export default useUserStore;