import { create } from "zustand";
import { persist } from "zustand/middleware";

export type JobType = {
  _id: string;
  title: string;
  description: string;
  role: string;
  salary: number;
  experience: number;
  location: string;
  status: "open" | "closed";
  openings: number;
  company: any;
  companyLogo: string;
  recruiter: any;
  applications: any;
};

type JobStore = {
  jobs: JobType[];
  setJobs: (jobs: JobType[]) => void;
  addJob: (job: JobType) => void;
};

export const useJobStore = create<JobStore>()(
  persist(
    (set) => ({
      jobs: [],
      setJobs: (jobs) => set({ jobs }),
      addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
    }),
    {
      name: "job-storage",
      partialize: (state) => ({ jobs: state.jobs }),
    }
  )
);

export const useJobActions = () => {
  const { jobs, setJobs, addJob } = useJobStore();
  return { jobs, setJobs, addJob };
};
