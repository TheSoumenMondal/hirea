"use client";

import React, { useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Image from "next/image";

import LinkedInSVG from "@/assets/icons/linkedin.svg";
import FacebookSVG from "@/assets/icons/facebook.svg";
import GithubSVG from "@/assets/icons/github.svg";
import LightGithubSVG from "@/assets/icons/lightgithub.svg";
import InstagramSVG from "@/assets/icons/instagram.svg";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { SocialMediaProfiles, useUserStore } from "@/store/userStore";

const ProfileUpdateSheet = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { theme } = useTheme();
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  const photoRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const linkedinRef = useRef<HTMLInputElement>(null);
  const facebookRef = useRef<HTMLInputElement>(null);
  const githubRef = useRef<HTMLInputElement>(null);
  const instagramRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    if (nameRef.current?.value) formData.append("name", nameRef.current.value);
    if (bioRef.current?.value) formData.append("bio", bioRef.current.value);
    if (phoneRef.current?.value)
      formData.append("phoneNumber", phoneRef.current.value);

    if (photoRef.current?.files?.[0]) {
      formData.append("profilePhoto", photoRef.current.files[0]);
    }
    if (resumeRef.current?.files?.[0]) {
      formData.append("resume", resumeRef.current.files[0]);
    }

    const socialMediaProfiles = {
      linkedin: linkedinRef.current?.value || "",
      facebook: facebookRef.current?.value || "",
      github: githubRef.current?.value || "",
      instagram: instagramRef.current?.value || "",
    };
    formData.append("socialMediaProfiles", JSON.stringify(socialMediaProfiles));

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data.user);
      toast.success("Profile updated successfully");

      // Reset file inputs
      if (photoRef.current) photoRef.current.value = "";
      if (resumeRef.current) resumeRef.current.value = "";

      setOpen(false);
    } catch (err: any) {
      console.error("Profile update error", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const social = user?.socialMediaProfiles as SocialMediaProfiles;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="bottom"
        className="max-w-2xl mx-auto rounded-t-2xl overflow-y-auto p-6"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold text-center">
            Update Your Profile
          </SheetTitle>
          <SheetDescription className="mt-4 text-center text-muted-foreground">
            You can update your profile details below.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="photo">Profile Photo</Label>
            <Input
              ref={photoRef}
              id="photo"
              type="file"
              accept="image/*"
              aria-label="Profile Photo"
            />
          </div>

          {user?.role === "jobseeker" && (
            <div className="space-y-1">
              <Label htmlFor="resume">Resume</Label>
              <Input
                ref={resumeRef}
                id="resume"
                type="file"
                accept="application/pdf"
                aria-label="Resume"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              ref={nameRef}
              id="fullname"
              type="text"
              placeholder="Your name"
              defaultValue={user?.name || ""}
              aria-label="Full Name"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="bio">Bio</Label>
            <Input
              ref={bioRef}
              id="bio"
              type="text"
              placeholder="Your bio"
              defaultValue={user?.bio || ""}
              aria-label="Bio"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              ref={phoneRef}
              id="mobile"
              type="tel"
              placeholder="XXXXXXXXXX"
              pattern="[0-9]{10}"
              defaultValue={user?.phoneNumber || ""}
              aria-label="Mobile Number"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Image src={LinkedInSVG} alt="LinkedIn" width={24} height={24} />
              <Input
                ref={linkedinRef}
                placeholder="LinkedIn URL"
                defaultValue={social?.linkedin || ""}
                aria-label="LinkedIn"
              />
            </div>
            <div className="flex items-center gap-2">
              <Image src={FacebookSVG} alt="Facebook" width={24} height={24} />
              <Input
                ref={facebookRef}
                placeholder="Facebook URL"
                defaultValue={social?.facebook || ""}
                aria-label="Facebook"
              />
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={theme === "dark" ? LightGithubSVG : GithubSVG}
                alt="GitHub"
                width={24}
                height={24}
              />
              <Input
                ref={githubRef}
                placeholder="GitHub URL"
                defaultValue={social?.github || ""}
                aria-label="GitHub"
              />
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={InstagramSVG}
                alt="Instagram"
                width={24}
                height={24}
              />
              <Input
                ref={instagramRef}
                placeholder="Instagram URL"
                defaultValue={social?.instagram || ""}
                aria-label="Instagram"
              />
            </div>
          </div>

          <div>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileUpdateSheet;
