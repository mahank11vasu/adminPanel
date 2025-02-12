import { create } from "zustand";
import { getRoles, getRolePermissions, updateRolePermissions } from "../api/roleApi";
import { useQuery, useMutation } from "@tanstack/react-query";

const useRoleStore = create((set) => ({
  roles: [],
  fetchRoles: async () => {
    const roles = await getRoles();
    set({ roles });
  },
  fetchPermissions: async (role) => {
    const permissions = await getRolePermissions(role);
    return permissions;
  }
}));

export const useRolesQuery = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    refetchOnWindowFocus: true,
  });
};

export const useRolePermissionsQuery = (role) => {
  return useQuery({
    queryKey: ["rolePermissions", role],
    queryFn: () => getRolePermissions(role),
    enabled: !!role,
  });
};

export const useRoleUpdateMutation = () => {
  return useMutation(updateRolePermissions);
};

export default useRoleStore;