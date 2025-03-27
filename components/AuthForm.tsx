"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";

import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  type: "sign-up" | "sign-in";
};

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z
      .string()
      .email
      //       {
      //   message: "Please enter a valid email address.",
      //       }
      (),
    password: z.string().min(3),
  });
};

function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);

      toast.error("An error occurred. Please try again later.");
    }
  }

  return (
    <div className=" card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={50} height={50} />
          <h2 className="text-primary-100">Prewise</h2>
        </div>
        <h3 className="text-center">Practice job interviews with AI</h3>{" "}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-2 form p-10"
          >
            {type === "sign-up" && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button className="btn w-full" type="submit">
              {type === "sign-up" ? "Create an Account" : "Sign In"}
            </Button>
          </form>
        </Form>
        <p className="text-center p-4">
          {type === "sign-up"
            ? "Already have an account?"
            : "Don't have an account yet?"}
          <Link
            href={type === "sign-up" ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {type === "sign-up" ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
