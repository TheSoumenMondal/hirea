"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApplicationStore } from "@/store/applicationStore";

import { useUserStore } from "@/store/userStore";
import { IconLoader, IconLoader3 } from "@tabler/icons-react";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProcessingSave, setIsProcessingSave] = useState(false);
  const [justRemoved, setJustRemoved] = useState(false);
  const [applied, setApplied] = useState<boolean>(false);
  const { addApplication } = useApplicationStore();

  const { user, setUser } = useUserStore();

  const fetchJobDetails = async () => {
    try {
      const { data } = await axios.get(`/api/job/${id}`);
      setJob(data.job);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToJob = async () => {
    try {
      setApplied(true);
      if (!user) {
        toast.error("You must be logged in to apply for jobs");
        return;
      }

      const { data } = await axios.post(
        "/api/application/new",
        {
          jobId: id,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Application response:", data);

      addApplication(data.newApplication);

      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setApplied(false);
    }
  };

  useEffect(() => {
    if (id) fetchJobDetails();
  }, [id]);

  const isSaved = user?.savedJobs?.includes(job?._id);

  const handleToggleSaveJob = async () => {
    if (!user) return toast.error("You must be logged in to save jobs");
    if (!job?._id) return toast.error("Invalid job ID");

    try {
      setIsProcessingSave(true);
      const { data } = await axios.put("/api/job/save", { jobid: job._id });

      if (data.removed) {
        const updatedSavedJobs = (user.savedJobs || []).filter(
          (id) => id !== job._id
        );
        setUser({ ...user, savedJobs: updatedSavedJobs });
        toast.success("Job removed from saved list");
        setJustRemoved(true);
        setTimeout(() => setJustRemoved(false), 2000);
      } else {
        setUser({
          ...user,
          savedJobs: Array.from(new Set([...(user.savedJobs || []), job._id])),
        });
        toast.success("Job saved successfully");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update save status");
    } finally {
      setIsProcessingSave(false);
    }
  };

  if (loading)
    return (
      <div className="w-full h-[calc(100vh_-_100px)] flex items-center justify-center">
        <IconLoader3 className="animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 w-full h-[calc(100vh_-_100px)] flex items-center justify-center">
        Error: {error}
      </div>
    );

  if (!job) return <div className="text-center mt-20">No job found.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 flex flex-col gap-6 md:flex-row items-center md:items-start">
      {/* Left Section - Avatar */}
      <div className="flex flex-col items-center gap-5">
        <Avatar className="w-40 h-40">
          <AvatarImage src={job.companyLogo} alt={job.company} />
          <AvatarFallback>{job.title?.[0]}</AvatarFallback>
        </Avatar>
        <Badge variant={"outline"}>{job.status}</Badge>
      </div>

      {/* Right Section - Job Details */}
      <div className="flex-1 space-y-4 w-full">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="whitespace-pre-line">{job.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>
            <strong>Experience:</strong> {job.experience || "Not specified"}
          </p>
          <p>
            <strong>Salary:</strong> {job.salary}
          </p>
          <p>
            <strong>Type:</strong> {job.jobType || "Full Time"}
          </p>
        </div>

        {user?.role === "jobseeker" && (
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              onClick={handleApplyToJob}
              size="sm"
              className="w-full sm:w-auto rounded-lg"
            >
              {applied ? (
                <span className="flex items-center gap-2">
                  <IconLoader className="animate-spin w-4 h-4" /> Applied
                </span>
              ) : (
                "Easy Apply"
              )}
            </Button>

            <Button
              size="sm"
              variant={isSaved ? "default" : "outline"}
              className="w-full sm:w-auto rounded-lg"
              disabled={isProcessingSave}
              onClick={handleToggleSaveJob}
            >
              {isProcessingSave
                ? isSaved
                  ? "Removing..."
                  : "Saving..."
                : isSaved
                ? justRemoved
                  ? "Removed"
                  : "Saved"
                : "Save Job"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
