"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitContact } from "@/actions/contact";
import { EmailIcon } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ContactFormSchema,
  type ContactFormValues,
} from "@/schema/contact.schema";

const defaultValues: ContactFormValues = {
  fullName: "",
  email: "",
  businessName: "",
  message: "",
};

const ContactUs = () => {
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ContactFormValues) => {
    setSentMessage(null);
    const result = await submitContact(values);
    if (result.ok) {
      toast.success(result.message);
      setSentMessage(result.message);
      form.reset(defaultValues);
      return;
    }
    toast.error(result.message);
  };

  return (
    <main>
      <div className="bg-primary-50 relative flex h-[291px] w-full flex-col items-center justify-center overflow-hidden md:h-[400px]">
        <div className="space-y-section max-w-[721px] px-4 text-center">
          <h1 className="text-black-500 text-[25px] font-medium md:text-[40px]">
            We would love to work with you
          </h1>

          <p className="text-black-300 md:text-[18px]">
            Have a question, need support, or just want to learn more about
            seil? <br /> Reach out, we&apos;d love to hear from you.
          </p>
        </div>

        <Image
          src="/images/bigCloud.png"
          aria-hidden
          alt=""
          width={445}
          height={447}
          className="absolute top-0 left-40"
        />
        <Image
          src="/images/smallCloud.png"
          aria-hidden
          alt=""
          width={286}
          height={264}
          className="absolute top-0 right-20 bottom-0 my-auto"
        />
      </div>
      <div className="section-class mt-10 mb-30 space-y-10 md:space-y-18">
        <div className="flex items-center gap-5">
          <div className="bg-accent rounded-full p-1.5">
            <EmailIcon className="text-white" />
          </div>

          <div>
            <h2 className="text-black-500 text-[14px] font-bold md:text-lg">
              Email us at
            </h2>
            <p className="text-primary-800 text-[14px] md:text-[16px]">
              useseilhq@email.com
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center space-y-4 rounded-xl border-2 border-gray-100 p-4 md:p-10 md:items-end"
            noValidate
          >
            <div className="mb-8 w-full">
              <h2 className="text-[16px] font-medium md:text-[24px]">
                Send us a message
              </h2>
              <p className="text-black-300 text-[14px] md:text-[16px]">
                Fill this in and we&apos;ll get back to you within one business
                day
              </p>
              {sentMessage ? (
                <p
                  className="border-primary/30 bg-primary/5 text-primary-800 mt-4 rounded-lg border px-4 py-3 text-[14px] md:text-[15px]"
                  role="status"
                >
                  {sentMessage}
                </p>
              ) : null}
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="w-full space-y-2">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="name"
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="you@gmail.com"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem className="w-full space-y-2">
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="organization"
                      placeholder="Acme Inc."
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full space-y-2">
                  <FormLabel>How did your week go?</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell us how your week went"
                      className="min-h-[120px]"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-white w-full md:w-[245px]"
            >
              {isSubmitting ? "Sending…" : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default ContactUs;
