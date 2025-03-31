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

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.actions";
import { log } from "console";

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error("Failed to get user token. Please try again.");
          return;
        }

        const result = await signIn({
          email,
          idToken,
        });

        console.log("result: ", result);

        if (!result?.success) {
          toast.error(result?.message || "Authentication failed");
          return;
        }

        toast.success(result.message || "Signed in successfully.");
        router.push("/");
      }
    } catch (error: any) {
      console.error("Authentication error:", error.code);

      // Improved error handling
      let errorMessage = "An error occurred. Please try again later.";
      if (error.code) {
        switch (error.code) {
          case "auth/user-not-found":
            errorMessage = "No user found with this email.";
            break;
          case "auth/invalid-credential":
            errorMessage = "Invalid email or password.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many attempts. Please try again later.";
            break;
        }
      }

      toast.error(errorMessage);
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
