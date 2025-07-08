"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  IconCalendar,
  IconChevronRight,
  IconCircleArrowUpRight,
  IconMapPin,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JobCardProps {
  _id: string;
  company: string;
  companyLogo: string;
  createdAt: string;
  description: string;
  experience: number;
  location: string;
  openings: number;
  recruiter: string;
  role: string;
  salary: number;
  status: string;
  title: string;
  updatedAt: string;
  postedOn: string;
}

const JobRow = ({ job }: { job: JobCardProps }) => {
  const router = useRouter();

  const handleClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full border border-border/30 rounded-xl px-4 py-3 bg-secondary transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={job.companyLogo} />
            <AvatarFallback>
              {job.company.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold">{job.role}</span>
          <Badge className="text-xs capitalize">{job.openings}</Badge>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Button
            className="flex gap-1 items-center rounded-xl"
            size={"sm"}
            onClick={() => handleClick(job._id)}
          >
            <span className="hidden md:flex">Apply</span>{" "}
            <IconCircleArrowUpRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-3">
        <span className="flex gap-0.5 items-center">
          <IconMapPin className="w-4 h-4" />
          {job.location}
        </span>
        <span className="flex gap-0.5 items-center">
          <IconCalendar className="w-4 h-4" />
          {new Date(job.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>

        <span className="text-green-600">₹{job.salary}</span>
      </div>
    </motion.div>
  );
};

const Opportunity = () => {
  const [latestJobs, setLatestJobs] = useState<JobCardProps[]>([]);

  const fetchLatestJobs = async () => {
    const { data } = await axios.get("/api/job/public");
    setLatestJobs(data.jobs);
    console.log(data);
  };

  useEffect(() => {
    fetchLatestJobs();
  }, []);

  return (
    <div className="w-full flex items-center flex-col space-y-3 my-10 px-4">
      <motion.p
        className="text-2xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Featured Opportunities
      </motion.p>
      <motion.p
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Discover hand-picked jobs from top companies actively hiring
      </motion.p>
      <div className="w-full max-w-xl flex gap-4 flex-col mt-4">
        {latestJobs.map((job, index) => (
          <JobRow job={job} key={index} />
        ))}
      </div>
      <Link href={"/jobs"}>
        <Button className="mt-6 gap-0 hover:gap-2" size={"sm"}>
          Find More Jobs <IconChevronRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

export default Opportunity;
