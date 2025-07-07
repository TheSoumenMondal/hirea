"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyStore } from "@/store/companyStore";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconGps, IconLink, IconLoader3, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import JobAdderSheet from "@/components/custom/job-adder-sheet";
import { useJobActions } from "@/store/jobStore";
import JobTable from "@/components/custom/job.table";

const CompanyPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [jobsLoading, setJobsLoading] = useState(true);
  const [companyLoading, setCompanyLoading] = useState(true);

  const { company, setCompany } = useCompanyStore();
  const { jobs, setJobs } = useJobActions();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const { data } = await axios.get(`/api/company/single?id=${id}`);
        setCompany(data.company);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch company details");
      } finally {
        setCompanyLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id, setCompany]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`/api/job/all?id=${id}`);
        setJobs(res.data.jobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setJobsLoading(false);
      }
    };

    if (id) {
      fetchJobs();
    }
  }, [id, setJobs]);

  if (jobsLoading || companyLoading) {
    return (
      <div className="w-full h-[calc(100vh-100px)] flex items-center justify-center">
        <IconLoader3 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 flex flex-col-reverse gap-6 lg:flex-row">
      {/* Left: Job Listings */}
      <div className="w-full lg:w-3/4 space-y-4">
        <h2 className="text-xl font-semibold">Jobs at {company?.name}</h2>
        <div className="rounded-xl shadow-sm">
          <JobTable jobs={jobs} />
        </div>
      </div>

      {/* Right: Company Info */}
      <div className="w-full lg:w-1/4 space-y-4">
        <div className="bg-card rounded-xl p-4 shadow-sm border flex flex-col items-center text-center space-y-3">
          {/* Company Avatar */}
          <div className="relative w-fit">
            <Avatar className="ring-2 ring-green-600 dark:ring-green-400 w-20 h-20">
              <AvatarImage src={company?.logo} alt="logo" />
              <AvatarFallback className="text-xs">
                {company?.name?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="absolute end-1.5 -bottom-1.5 inline-flex size-4 items-center justify-center rounded-full bg-green-600 dark:bg-green-400">
              <CheckIcon className="size-3 text-white" />
            </span>
          </div>

          <p className="text-lg font-semibold">{company?.name}</p>
          <p className="text-sm text-muted-foreground">
            {company?.description?.split(" ").slice(0, 15).join(" ")}
            {company?.description &&
              company.description.split(" ").length > 15 &&
              "..."}
          </p>

          <div className="flex items-center gap-2 text-sm text-primary/80 justify-center">
            <IconGps className="w-4 h-4" />
            <span>{company?.location}</span>
          </div>

          <Button variant="link" size="sm" asChild className="text-sm">
            <a
              href={company?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <IconLink className="w-4 h-4" />
              Visit Website
            </a>
          </Button>
        </div>

        {/* Actions */}
        <div className="rounded-xl flex flex-col gap-3">
          <JobAdderSheet companyId={company?._id as string} />

          <Button variant="destructive" size="sm" className="rounded-lg w-full">
            <IconTrash className="w-4 h-4" />
            Delete Company
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
