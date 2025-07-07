"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { IconLoader3 } from "@tabler/icons-react";

type PasswordFormInput = {
  password: string;
};

const Page = () => {
  const router = useRouter()
  const { token } = useParams() as { token: string };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormInput>();

  const onSubmit: SubmitHandler<PasswordFormInput> = async (formData) => {
    try {
      const { data } = await axios.post(`/api/user/reset?token=${token}`, {
        password: formData.password,
      });
      console.log(data)
      toast.success("Password changed successfully");
      reset();
      router.push("/login")
    } catch (error: any) {
      toast.error("Error", {
        description:
          error.response?.data?.message || error.message || "Internal server error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-[75vh]">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-xl">Enter a new password</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter new password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="mt-4">
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? (
                <>
                  <IconLoader3 className="animate-spin mr-2" /> Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Page;
