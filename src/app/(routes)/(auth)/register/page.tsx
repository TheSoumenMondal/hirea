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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { toast } from "sonner";
import { IconLoader3 } from "@tabler/icons-react";
import axios from "axios";
import React, { useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useUserStore } from "@/store/userStore";

type Inputs = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "jobseeker" | "recruiter";
};

const STORAGE_KEY = "register-form";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<Inputs>({
    defaultValues: {
      role: "jobseeker",
    },
  });

  const formValues = watch();

  const { setIsAuth, setUser } = useUserStore();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        reset(parsed);
      } catch (e) {
        console.error("Error parsing stored form data", e);
      }
    }
  }, [reset]);

  const debouncedSave = useCallback(
    debounce((data: Inputs) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSave(formValues);
  }, [formValues, debouncedSave]);

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      const { data } = await axios.post("/api/user/register", formData);

      setUser(data.user);
      setIsAuth(true);
      localStorage.removeItem(STORAGE_KEY);
      toast.success("Registered successfully");
      reset();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 409) {
          toast.error("User already exists", {
            description:
              message || "An account with this email already exists.",
          });
        } else {
          toast.error("Registration failed", {
            description: message || "Something went wrong.",
          });
        }
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="w-full h-[calc(100vh_-_80px)] flex items-center justify-center">
      <div className="w-full max-w-sm h-auto select-none">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full h-full space-y-4"
              >
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 6,
                        message: "Name must be at least 6 characters long",
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        // ✅ Improved standard email regex
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                        message:
                          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number must be exactly 10 digits",
                      },
                    })}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Role</Label>
                  <Controller
                    control={control}
                    name="role"
                    rules={{ required: "Role is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Role</SelectLabel>
                            <SelectItem value="jobseeker">
                              Job Seeker
                            </SelectItem>
                            <SelectItem value="recruiter">Recruiter</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <p className="text-red-500 text-xs">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <Button
                  disabled={isSubmitting}
                  className="w-full gap-1"
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      Submitting
                      <IconLoader3 className="animate-spin" />
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </form>
            </CardDescription>
          </CardContent>
          <CardFooter className="text-xs w-full">
            <div className="w-full flex items-center justify-center">
              Already have an account?
              <Link className="text-primary/80 ml-2" href={"/login"}>
                Log In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
