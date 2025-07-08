"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconEye } from "@tabler/icons-react";
import Link from "next/link";

interface Application {
  _id: string;
  applicant: {
    name: string;
    email: string;
    profilePhoto?: string;
    [key: string]: any;
  };
  createdAt: string;
  job: any;
  jobName: string;
  jobSalary: string;
  status: string;
  updatedAt: string;
}

const Page = () => {
  const [applicants, setApplicants] = useState<Application[]>([]);

  const getAllApplications = async () => {
    try {
      const { data } = await axios.get("/api/application/all");
      setApplicants(data.applications);
      console.log(data.applications);
      toast.success("Applications fetched successfully");
    } catch (error: any) {
      toast.error(error.message || "Internal Server Error");
    }
  };

  useEffect(() => {
    getAllApplications();
  }, []);

  return (
    <div className="w-full h-[calc(100vh_-_100px)]">
      <div className="w-full">
        <div className="[&>div]:rounded-sm [&>div]:border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Resume</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Job Name</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((application, index) => (
                <TableRow key={application._id || index}>
                  <TableCell>
                    <Button
                      size={"sm"}
                      variant={"secondary"}
                      className="rounded-lg"
                    >
                      
                      <Link href={application.applicant.resume} target="_blank">
                      <IconEye/>
                      </Link>

                    </Button>
                  </TableCell>
                  <TableCell>{application.jobSalary}</TableCell>
                  <TableCell>{application.status}</TableCell>
                  <TableCell>{application.jobName}</TableCell>
                  <TableCell>{application.job.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Table with avatar
        </p>
      </div>
    </div>
  );
};

export default Page;
