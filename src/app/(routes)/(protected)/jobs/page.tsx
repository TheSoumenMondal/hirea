"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { JobType } from "@/store/jobStore";
import { useUserStore } from "@/store/userStore";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user, isAuth } = useUserStore();

  const router = useRouter();

  const fetchPaginatedJobs = async (page = 1, limit = 6) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/job/paginated?page=${page}&limit=${limit}`
      );
      setJobs(data.jobs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedJobs(page);
  }, [page]);

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <div className="py-10">
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
                  <CardTitle className="text-xl font-semibold mb-8">
                    {job.title}
                  </CardTitle>
                </div>

                <CardFooter className="flex items-center justify-between mt-4 px-1">
                  <Avatar className="flex items-center gap-2">
                    <AvatarImage src={job.companyLogo} alt={job.company} />
                    <AvatarFallback className="text-sm font-medium text-muted-foreground">
                      {job.role[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant={"secondary"}
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
        <Button
          variant={"secondary"}
          size={"sm"}
          onClick={handlePrev}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant={"secondary"}
          size={"sm"}
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default JobsPage;
