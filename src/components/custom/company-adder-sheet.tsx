"use client";

import React, { useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import axios from "axios";
import { useCompanyStore } from "@/store/companyStore";

// ensure cookies are sent on every request
axios.defaults.withCredentials = true;

interface CompanyAdderSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CompanyAdderSheet: React.FC<CompanyAdderSheetProps> = ({
  open,
  setOpen,
}) => {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const locRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    if (nameRef.current) nameRef.current.value = "";
    if (descRef.current) descRef.current.value = "";
    if (locRef.current) locRef.current.value = "";
    if (websiteRef.current) websiteRef.current.value = "";
    if (logoRef.current) logoRef.current.value = "";
  };

  const { setCompanies } = useCompanyStore();

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Unauthorized. Please log in.");
      return;
    }

    const name = nameRef.current?.value.trim() || "";
    const description = descRef.current?.value.trim() || "";
    const location = locRef.current?.value.trim() || "";
    const websiteInput = websiteRef.current?.value.trim() || "";
    const logoFile = logoRef.current?.files?.[0] || null;

    if (!name || !description || !location || !websiteInput) {
      toast.error("All fields except logo are required.");
      return;
    }

    const website = websiteInput.startsWith("http")
      ? websiteInput
      : `https://${websiteInput}`;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("website", website);
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/company/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Company created successfully");
      resetForm();

      setCompanies(res.data.company);

      setOpen(false);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.error("You already have a company with that name.");
      } else {
        toast.error(
          err.response?.data?.message ??
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-md rounded-t-2xl p-6 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold text-center">
            Add New Company
          </SheetTitle>
          <SheetDescription className="mt-2 text-center text-muted-foreground">
            Fill in the details below to add a company.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              ref={nameRef}
              id="name"
              type="text"
              placeholder="e.g., TechNova"
              aria-label="Company Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              ref={descRef}
              id="description"
              type="text"
              placeholder="Company description"
              aria-label="Company Description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              ref={locRef}
              id="location"
              type="text"
              placeholder="e.g., Bangalore, India"
              aria-label="Company Location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="flex rounded-md border bg-background">
              <span className="inline-flex items-center px-3 text-sm text-muted-foreground">
                https://
              </span>
              <Input
                ref={websiteRef}
                id="website"
                type="text"
                placeholder="yourcompany.com"
                className="-ml-px rounded-l-none"
                aria-label="Company Website"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo (optional)</Label>
            <Input
              ref={logoRef}
              id="logo"
              type="file"
              accept="image/*"
              aria-label="Company Logo"
              className="file:border-input file:px-3 file:py-1 file:text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Company"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              className="w-full"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CompanyAdderSheet;
