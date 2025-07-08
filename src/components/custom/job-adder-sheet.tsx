"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { IconPlus } from "@tabler/icons-react";
import { useJobActions } from "@/store/jobStore";

type JobForm = {
  title: string;
  description: string;
  role: string;
  salary: string;
  experience: string;
  location: string;
  openings: number;
};

const JobAdderSheet = ({ companyId }: { companyId: string }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobForm>();

  const { addJob } = useJobActions();

  const onSubmit = async (data: JobForm) => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/job/new?id=${companyId}`, data);
      toast.success("Job posted successfully!");
      addJob(res.data.job);
      reset();
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            className="gap-2 font-medium rounded-lg"
            size={"sm"}
            variant={"secondary"}
          >
            <IconPlus className="w-5 h-5" />
            Add Job
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-full max-w-3xl mx-auto sm:max-w-xl md:max-w-2xl px-6 rounded-t-lg"
          side="bottom"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <SheetHeader className=" text-center">
              <SheetTitle className="flex items-center justify-center gap-2 text-xl">
                Post a New Job
              </SheetTitle>
              <SheetDescription className="text-center">
                Provide complete job details to add it under this company.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-1">
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Frontend Developer"
                    className={errors.title ? "border-red-500" : ""}
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Describe the job responsibilities and requirements"
                    className={errors.description ? "border-red-500" : ""}
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      placeholder="e.g. Engineering"
                      {...register("role", { required: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. Remote, New York, etc."
                      {...register("location", { required: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      placeholder="e.g. $80,000 - $120,000"
                      {...register("salary")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      placeholder="e.g. 2+ years"
                      {...register("experience")}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2 md:col-span-1">
                    <Label htmlFor="openings">Openings</Label>
                    <Input
                      type="number"
                      id="openings"
                      placeholder="Number of positions"
                      min="1"
                      {...register("openings", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter className="flex justify-end gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loading} className="px-6">
                {loading && <Loader2 className="animate-spin size-4 mr-2" />}
                {loading ? "Posting..." : "Post Job"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default JobAdderSheet;
