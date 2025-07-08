"use client";

import React from "react";
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

type EmailFormInputs = {
  email: string;
};

const Page = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormInputs>();

  const onSubmit: SubmitHandler<EmailFormInputs> = async (formData) => {
    try {
      await axios.post("/api/user/forgot", {
        email: formData.email,
      });

      toast.success(`Reset Password Email send to : ${formData.email}`);
      reset();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Internal server error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-[75vh]">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-xl">Submit Your Email</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="mt-4">
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? (
                <>
                  {" "}
                  <IconLoader3 className="animate-spin" /> Submitting..{" "}
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
