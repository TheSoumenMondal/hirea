import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface JobItem {
  id?: string;
  title: string;
  status: string;
  openings: number;
  salary: number;
}

type JobTableProps = {
  jobs: JobItem[];
  onDelete?: (id: string) => void;
};

const JobTable: React.FC<JobTableProps> = ({ jobs }) => {
  return (
    <div className="w-full">
      <div className="[&>div]:max-h-70 [&>div]:rounded-sm [&>div]:border overflow-auto ">
        <Table>
          <TableHeader>
            <TableRow className="bg-background sticky top-0">
              <TableHead>Job</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Openings</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {jobs.map((job, index) => (
              <TableRow key={job.id || index}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>{job.openings}</TableCell>
                <TableCell>{job.salary}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-muted-foreground mt-4 text-center text-sm">
        Job listings table
      </p>
    </div>
  );
};

export default JobTable;
