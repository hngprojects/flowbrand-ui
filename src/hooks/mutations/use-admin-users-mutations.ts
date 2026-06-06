"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAdminAccount,
  deleteAdminUser,
  updateAdminUserStatus,
} from "@/lib/admin-users-api";
import { useIsSuperAdmin } from "@/hooks/use-is-super-admin";
import type { AdminRole } from "@/types/admin";
import { adminUsersKeys } from "@/hooks/queries/use-admin-users-queries";
import type { UserStatus } from "@/components/admin/users/users-table";

export function useCreateAdminMutation() {
  const isSuperAdmin = useIsSuperAdmin();

  return useMutation({
    mutationFn: (input: {
      full_name: string;
      email: string;
      password: string;
      role: AdminRole;
    }) => {
      if (!isSuperAdmin) {
        throw new Error("Only super admins can create admin accounts.");
      }
      return createAdminAccount(input);
    },
    onSuccess: () => {
      toast.success("Admin account created.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create admin account.",
      );
    },
  });
}

export function useDeleteAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteAdminUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminUsersKeys.all() });
    },
  });
}

export function useUpdateAdminUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: UserStatus | "suspended";
    }) => updateAdminUserStatus(userId, status),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminUsersKeys.all() });
      void queryClient.invalidateQueries({
        queryKey: adminUsersKeys.detail(variables.userId),
      });
    },
  });
}
