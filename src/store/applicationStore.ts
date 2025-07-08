import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ApplicationStatus = "pending" | "accepted" | "rejected";

export type AppliedJob = {
  job: string;
  applicant: string;
  jobName: string;
  jobSalary: number;
  status: ApplicationStatus;
};

type ApplicationStore = {
  applications: AppliedJob[];
  setApplications: (apps: AppliedJob[]) => void;
  addApplication: (app: AppliedJob) => void;
};

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set) => ({
      applications: [],

      setApplications: (apps) => set({ applications: apps }),

      addApplication: (app) =>
        set((state) => ({
          applications: [app, ...state.applications],
        })),
    }),
    {
      name: "application-storage",
    }
  )
);
