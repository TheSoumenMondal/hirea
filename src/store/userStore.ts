import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SocialMediaProfiles = {
  linkedin: string;
  facebook: string;
  github: string;
  instagram: string;
};

export type User = {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "jobseeker" | "recruiter";
  bio?: string;
  skills?: string[];
  resume?: string;
  socialMediaProfiles?: SocialMediaProfiles;
  profilePhoto?: string;
  savedJobs?: string[];
};

type UserStore = {
  user: User | null;
  isAuth: boolean;
  setUser: (user: User | null) => void;
  setIsAuth: (isAuth: boolean) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      setUser: (user) => set({ user }),
      setIsAuth: (isAuth) => set({ isAuth }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user, isAuth: state.isAuth }),
    }
  )
);
