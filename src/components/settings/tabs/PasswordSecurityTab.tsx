"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BaseModal from "@/components/modals/BaseModal";
import UpdateIcon from "@/components/icons/modals/update";

const PasswordSecuritySchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(
        /[@#$%]/,
        "Password must contain at least one symbol (@, #, $, or %)",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordSecurityFormValues = z.infer<typeof PasswordSecuritySchema>;

export default function PasswordSecurityTab() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const form = useForm<PasswordSecurityFormValues>({
    resolver: zodResolver(PasswordSecuritySchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async () => {
    setSuccessOpen(true);
    form.reset();
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <h3 className="text-[20px] font-medium text-black-300">Password</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 rounded-[12px] border border-gray-200 p-6"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-medium leading-[150%] text-primary-900">
                    Old Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type={showOld ? "text" : "password"}
                        disabled={isSubmitting}
                        {...field}
                        style={
                          {
                            WebkitTextSecurity: showOld ? "none" : "asterisk",
                          } as React.CSSProperties
                        }
                        className="w-full rounded-[8px] border border-gray-300 px-3 py-2.5 pr-10 text-sm text-foreground outline-none focus:border-primary transition-colors disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOld((v) => !v)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                        aria-label={showOld ? "Hide password" : "Show password"}
                      >
                        {showOld ? (
                          <Eye size={20} color="#A2A2A2" />
                        ) : (
                          <EyeOff size={20} color="#A2A2A2" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-medium leading-[150%] text-primary-900">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        disabled={isSubmitting}
                        {...field}
                        style={
                          {
                            WebkitTextSecurity: showNew ? "none" : "asterisk",
                          } as React.CSSProperties
                        }
                        className="w-full rounded-[8px] border border-gray-300 px-3 py-2.5 pr-10 text-sm text-foreground outline-none focus:border-primary transition-colors disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((v) => !v)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                        aria-label={showNew ? "Hide password" : "Show password"}
                      >
                        {showNew ? (
                          <Eye size={20} color="#A2A2A2" />
                        ) : (
                          <EyeOff size={20} color="#A2A2A2" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-medium leading-[150%] text-primary-900">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        disabled={isSubmitting}
                        {...field}
                        style={
                          {
                            WebkitTextSecurity: showConfirm
                              ? "none"
                              : "asterisk",
                          } as React.CSSProperties
                        }
                        className="w-full rounded-[8px] border border-gray-300 px-3 py-2.5 pr-10 text-sm text-foreground outline-none focus:border-primary transition-colors disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                        aria-label={
                          showConfirm ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirm ? (
                          <Eye size={20} color="#A2A2A2" />
                        ) : (
                          <EyeOff size={20} color="#A2A2A2" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex justify-center md:justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[10px] bg-primary px-10 py-3 text-sm md:text-base font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>
        </Form>
      </div>

      <BaseModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        icon={<UpdateIcon />}
        title="Password updated"
        subtitle="Your password was successfully updated!"
        confirmText="Done"
        onConfirm={() => setSuccessOpen(false)}
      />
    </>
  );
}
