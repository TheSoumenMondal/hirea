"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface Application {
  _id: string;
  applicant: string;
  job: string;
  jobName: string;
  jobSalary: number;
  status: string;
  createdAt: string;
}

const ReceivedApplication = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get("/api/application/allrecruiter");
      setApplications(data.applications);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div>
      <div className="w-full">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead className="text-right">Applied On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell className="font-medium">{app.jobName}</TableCell>
                  <TableCell>{app.status}</TableCell>
                  <TableCell>
                    <Link href={`/profile/${app.applicant}`}>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-stone-800 hover:opacity-80" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{app.jobSalary.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ReceivedApplication;
