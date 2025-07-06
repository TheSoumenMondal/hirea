"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { IconLoader3 } from "@tabler/icons-react";
import React from "react";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

type LoginInputs = {
  email: string;
  password: string;
};

const LogInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginInputs>();

  const { setIsAuth, setUser } = useUserStore();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginInputs> = async (formData) => {
    try {
      const { data } = await axios.post("/api/user/login", {
        email: formData.email,
        password: formData.password,
      });

      setIsAuth(true);
      setUser(data.user);

      toast.success("Logged in successfully");
      reset();

      router.push("/dashboard");
    } catch (err) {
      toast.error("Login failed", {
        description: "Please check your credentials.",
      });
    }
  };

  return (
    <div className="w-full h-[calc(100vh_-_80px)] flex items-center justify-center">
      <div className="w-full max-w-sm h-auto select-none">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Please log into your account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gap-1"
              >
                {isSubmitting ? (
                  <>
                    Logging in
                    <IconLoader3 className="animate-spin" size={16} />
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-xs flex justify-center">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="text-primary ml-1 hover:underline"
            >
              Register
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LogInPage;
