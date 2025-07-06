"use client";

import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  IconCalendar,
  IconChevronRight,
  IconCircleArrowUpRight,
  IconMapPin,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

interface JobCardProps {
  company: string;
  role: "full time" | "part time";
  location: string;
  postedOn: string;
  salary: string;
}

const JobRow = ({ job }: { job: JobCardProps }) => {
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
          <div
            className={`w-4 h-4 rounded-full bg-gradient-to-r ${
              job.role === "part time"
                ? "from-pink-400 via-orange-300 to-yellow-300"
                : "from-blue-500 via-cyan-400 to-green-300"
            }`}
          />
          <span className="font-semibold">{job.company}</span>
          <Badge className="text-xs capitalize">{job.role}</Badge>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Button className="flex gap-1 items-center rounded-xl" size={"sm"}>
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
          {job.postedOn}
        </span>

        <span className="text-green-600 font-medium">{job.salary}</span>
      </div>
    </motion.div>
  );
};

const jobs: JobCardProps[] = [
  {
    company: "TechCorp",
    role: "full time",
    location: "San Francisco, CA",
    postedOn: "2 days ago",
    salary: "$120k - $160k",
  },
  {
    company: "InnovateLab",
    role: "full time",
    location: "New York, NY",
    postedOn: "2 days ago",
    salary: "$130k - $180k",
  },
  {
    company: "DesignStudio",
    role: "full time",
    location: "Remote",
    postedOn: "2 days ago",
    salary: "$80k - $110k",
  },
  {
    company: "AlphaTech",
    role: "part time",
    location: "Austin, TX",
    postedOn: "1 day ago",
    salary: "$60k - $90k",
  },
  {
    company: "BetaWorks",
    role: "full time",
    location: "Seattle, WA",
    postedOn: "3 days ago",
    salary: "$100k - $140k",
  },
  {
    company: "GammaSoft",
    role: "part time",
    location: "Boston, MA",
    postedOn: "5 days ago",
    salary: "$70k - $100k",
  },
];

const Opportunity = () => {
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
        {jobs.map((job, index) => (
          <JobRow job={job} key={index} />
        ))}
      </div>
      <Button className="mt-6 gap-0 hover:gap-2" size={"sm"}>
        Find More Jobs <IconChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Opportunity;
