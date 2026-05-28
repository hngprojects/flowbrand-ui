"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogoutButton } from "@/components/auth/logout-button";
import { COUNTRY_OPTIONS } from "@/lib/countries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const MyProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  country: z.string().min(1, "Please select a country"),
});

type MyProfileFormValues = z.infer<typeof MyProfileSchema>;

interface MyProfileTabProps {
  onClose: () => void;
}

export default function MyProfileTab({ onClose }: MyProfileTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const form = useForm<MyProfileFormValues>({
    resolver: zodResolver(MyProfileSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "John Adekunle",
      email: "example@gmail.com",
      country: "",
    },
  });

  const { isSubmitting } = form.formState;
  const fullName = useWatch({ control: form.control, name: "fullName" });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const handleDeleteAvatar = () => {
    setAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async () => {
    // Profile save API not wired yet.
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-[20px] font-medium text-black-300">My Profile</h3>

      <div className="flex flex-col items-center gap-[30px] rounded-[12px] border-[0.5px] border-gray-500 p-[24px] w-full">
        <div className="h-[122px] w-[122px] overflow-hidden rounded-full bg-gray-100">
          {avatar ? (
            <Image
              src={avatar}
              alt="Profile"
              width={122}
              height={122}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400 text-2xl font-medium">
              {fullName?.charAt(0).toUpperCase() ?? "?"}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-[40px] whitespace-nowrap rounded-[8px] border border-gray-300 px-[24px] 
            py-[8px] text-sm md:text-base text-foreground hover:bg-gray-50 transition-colors"
          >
            Upload new picture
          </button>
          <button
            type="button"
            onClick={handleDeleteAvatar}
            className="h-[40px] whitespace-nowrap rounded-[8px] border border-red-100 bg-red-50
            px-[24px] py-[8px] text-sm md:text-base  text-red-500 hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="profile-form"
          className="flex flex-col gap-[21px] rounded-[12px] border-[0.5px] border-gray-500 p-[24px] w-full"
        >
          <h4 className="text-[16px] font-medium leading-[150%] text-primary-900">
            Personal Information
          </h4>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-medium leading-[150%] text-primary-900">
                  Full name
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    {...field}
                    className="w-full h-[44px] rounded-[8px] border border-primary-500 px-[16px] 
                    py-[12px] text-[16px] font-medium leading-[150%] text-black-500 outline-none 
                    focus:border-primary-500 transition-colors disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4 md:flex-row">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-[16px] font-medium leading-[150%] text-primary-900">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      disabled={isSubmitting}
                      {...field}
                      className="w-full h-[44px] rounded-[8px] border border-primary-500 px-[16px] 
                      py-[12px] text-[16px] font-medium leading-[150%] text-black-500 outline-none 
                      focus:border-primary-500 transition-colors disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-[16px] font-medium leading-[150%] text-primary-900">
                    Country
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        disabled={isSubmitting}
                        {...field}
                        className="w-full h-[44px] appearance-none rounded-[8px] border border-primary-500 
                        px-[16px] py-[12px] text-[16px] font-medium leading-[150%] text-black-500 
                        outline-none focus:border-primary-500 transition-colors bg-white disabled:opacity-50"
                      >
                        {COUNTRY_OPTIONS.map((c) => (
                          <option
                            key={c.value === "" ? "_placeholder" : c.value}
                            value={c.value}
                          >
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="#6B7280"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <LogoutButton
            variant="menu"
            className="rounded-[8px] border border-red-100 bg-red-50 px-10 py-3 text-sm 
            md:text-base font-medium text-red-500 hover:opacity-90 w-auto text-center"
            onAfterLogout={onClose}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            form="profile-form"
            className="rounded-[10px] bg-primary px-10 py-3 text-sm md:text-base font-medium 
            text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Form>
    </div>
  );
}
