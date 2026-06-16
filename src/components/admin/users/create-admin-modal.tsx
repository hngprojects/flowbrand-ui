"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BaseModal from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCreateAdminMutation } from "@/hooks/mutations/use-admin-users-mutations";
import type { AdminRole } from "@/types/admin";

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const CreateAdminSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name must be under 100 characters."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(
        PASSWORD_PATTERN,
        "Use uppercase, lowercase, a number, and a symbol.",
      ),
    confirm_password: z.string().min(1, "Confirm the password."),
    role: z.enum(["admin", "super_admin"]),
  })
  .refine((values) => values.password === values.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

type CreateAdminValues = z.infer<typeof CreateAdminSchema>;

type CreateAdminModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateAdminModal({
  open,
  onOpenChange,
}: CreateAdminModalProps) {
  const createAdmin = useCreateAdminMutation();
  const [role, setRole] = useState<AdminRole>("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<CreateAdminValues>({
    resolver: zodResolver(CreateAdminSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "admin",
    },
    mode: "onSubmit",
  });

  function handleClose() {
    onOpenChange(false);
    form.reset();
    setRole("admin");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  function onSubmit(values: CreateAdminValues) {
    createAdmin.mutate(
      {
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.role,
      },
      { onSuccess: () => handleClose() },
    );
  }

  return (
    <BaseModal isOpen={open} onClose={handleClose} title="Create admin account">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="space-y-2">
          <label
            htmlFor="create-admin-name"
            className="text-sm font-medium text-black-500"
          >
            Full name
          </label>
          <Input
            id="create-admin-name"
            className="h-11 rounded-lg"
            {...form.register("full_name")}
          />
          {form.formState.errors.full_name ? (
            <p className="text-xs text-red-500">
              {form.formState.errors.full_name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="create-admin-email"
            className="text-sm font-medium text-black-500"
          >
            Email
          </label>
          <Input
            id="create-admin-email"
            type="email"
            autoComplete="email"
            className="h-11 rounded-lg"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-500">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="create-admin-role"
            className="text-sm font-medium text-black-500"
          >
            Role
          </label>
          <Select
            id="create-admin-role"
            value={role}
            onChange={(event) => {
              const next = event.target.value as AdminRole;
              setRole(next);
              form.setValue("role", next);
            }}
            className="h-11 w-full rounded-lg"
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super admin</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="create-admin-password"
            className="text-sm font-medium text-black-500"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="create-admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="h-11 rounded-lg pr-12"
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-3 flex items-center text-neutral-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="size-5" />
              ) : (
                <EyeOff className="size-5" />
              )}
            </button>
          </div>
          {form.formState.errors.password ? (
            <p className="text-xs text-red-500">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="create-admin-confirm-password"
            className="text-sm font-medium text-black-500"
          >
            Confirm password
          </label>
          <div className="relative">
            <Input
              id="create-admin-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              className="h-11 rounded-lg pr-12"
              {...form.register("confirm_password")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute inset-y-0 right-3 flex items-center text-neutral-400"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <Eye className="size-5" />
              ) : (
                <EyeOff className="size-5" />
              )}
            </button>
          </div>
          {form.formState.errors.confirm_password ? (
            <p className="text-xs text-red-500">
              {form.formState.errors.confirm_password.message}
            </p>
          ) : null}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-lg"
            onClick={handleClose}
            disabled={createAdmin.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 flex-1 rounded-lg"
            disabled={createAdmin.isPending}
          >
            {createAdmin.isPending ? "Creating…" : "Create admin"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
