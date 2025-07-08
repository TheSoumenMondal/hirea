"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { JobType } from "@/store/jobStore";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const JobsPage = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    title: "",
    location: "",
    company: "",
    experience: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchPaginatedJobs = async (
    currentPage = 1,
    limit = 6,
    appliedFilters = filters
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());
      if (appliedFilters.title) params.append("title", appliedFilters.title);
      if (appliedFilters.location) params.append("location", appliedFilters.location);
      if (appliedFilters.company) params.append("company", appliedFilters.company);
      if (appliedFilters.experience) params.append("experience", appliedFilters.experience);
      const { data } = await axios.get(`/api/job/all?${params.toString()}`);
      setJobs(data.jobs);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialFilters = {
      title: searchParams.get("title") || "",
      location: searchParams.get("location") || "",
      company: searchParams.get("company") || "",
      experience: searchParams.get("experience") || "",
    };
    setFilters(initialFilters);
    fetchPaginatedJobs(1, 6, initialFilters);
  }, []);

  const handlePrev = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchPaginatedJobs(newPage, 6, filters);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchPaginatedJobs(newPage, 6, filters);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setPage(1);
    fetchPaginatedJobs(1, 6, filters);
  };

  return (
    <div className="h-[calc(100vh_-_100px)] flex flex-col">
      <div className="bg-background px-4 py-6 border-b sticky top-0 z-10">
        <h1 className="text-2xl font-bold mb-4">Find Jobs</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input name="title" value={filters.title} onChange={handleChange} placeholder="Title" />
          <Input name="location" value={filters.location} onChange={handleChange} placeholder="Location" />
          <Input name="company" value={filters.company} onChange={handleChange} placeholder="Company ID" />
          <Input
            name="experience"
            value={filters.experience}
            onChange={handleChange}
            placeholder="Max Experience"
            type="number"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-[200px] w-full rounded-xl" />
              ))
            : jobs.map((job: JobType) => (
                <Card
                  key={job._id}
                  className={`rounded-2xl border px-4 py-6 flex flex-col justify-between relative transition hover:shadow-md ${
                    job.status === "closed" ? "bg-muted" : ""
                  }`}
                >
                  <div>
                    <div className="text-muted-foreground text-sm mb-2 font-medium">
                      ₹{job.salary.toLocaleString()} P.A
                    </div>
                    <CardTitle className="text-xl font-semibold mb-8">{job.title}</CardTitle>
                  </div>
                  <CardFooter className="flex items-center justify-between mt-4 px-1">
                    <Avatar className="flex items-center gap-2">
                      <AvatarImage src={job.companyLogo} alt={job.company} />
                      <AvatarFallback className="text-sm font-medium text-muted-foreground">
                        {job.role?.[0] ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/jobs/${job._id}`)}
                      size="sm"
                      className="text-xs rounded-lg gap-1"
                    >
                      View
                      <IconChevronRight />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          <Button variant="secondary" size="sm" onClick={handlePrev} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button variant="secondary" size="sm" onClick={handleNext} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
