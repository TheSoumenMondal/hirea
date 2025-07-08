"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type JobType = {
  _id: string;
  title: string;
  companyLogo: string;
  description: string;
  salary: number;
  location: string;
  experience: number;
  openings: number;
  status: string;
  createdAt: string;
};

const Page = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get("/api/job/saved-jobs");
      setJobs(response.data.savedJobs.savedJobs);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 p-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {jobs.length === 0 ? (
        <p>No saved jobs found.</p>
      ) : (
        jobs &&
        jobs.map((job) => (
          <Card
            key={job._id}
            className="cursor-pointer transition hover:shadow-xl"
            onClick={() => router.push(`/jobs/${job._id}`)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                {job.title}
              </CardTitle>
              <Image
                src={job.companyLogo}
                alt="logo"
                className="rounded-full object-cover"
                width={20}
                height={20}
              />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {job.description}
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="outline">₹{job.salary.toLocaleString()}</Badge>
                <Badge variant="outline">Exp: {job.experience} yrs</Badge>
                <Badge variant="outline">Openings: {job.openings}</Badge>
                <Badge variant="outline">Status: {job.status}</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end items-center">
              <Button size={"icon"} variant={"outline"}>
                <IconChevronRight />
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default Page;
