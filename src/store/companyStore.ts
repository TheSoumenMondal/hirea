import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Company = {
  _id: string;
  name: string;
  description: string;
  logo: string;
  location: string;
  website: string;
  recruiter: string;
};

type CompanyStore = {
  company: Company | null;
  companies: Company[];
  setCompany: (cmp: Company) => void;
  setCompanies: (cmp: Company) => void;
  setAllCompanies: (cmps: Company[]) => void;
  clearCompany: () => void;
  clearCompanies: () => void;
};

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      company: null,
      companies: [],
      setCompany: (cmp: Company) => set({ company: cmp }),

      // ✅ This adds a single company
      setCompanies: (cmp: Company) =>
        set({ companies: [...get().companies, cmp] }),

      // ✅ This sets the full list — use this for /api/company/all
      setAllCompanies: (cmps: Company[]) => set({ companies: cmps }),

      clearCompany: () => set({ company: null }),
      clearCompanies: () => set({ companies: [] }),
    }),
    {
      name: "company-storage",
    }
  )
);
