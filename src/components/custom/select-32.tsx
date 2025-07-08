"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multi-select";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {  useUserStore } from "@/store/userStore";
import { motion } from "framer-motion";
import { IconPlus } from "@tabler/icons-react";

const categories: Option[] = [
  { value: "web_development", label: "Web Development" },
  { value: "mobile_development", label: "Mobile Development" },
  { value: "data_science", label: "Data Science" },
  { value: "machine_learning", label: "Machine Learning" },
  { value: "artificial_intelligence", label: "Artificial Intelligence" },
  { value: "devops", label: "DevOps" },
  { value: "cloud_computing", label: "Cloud Computing" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "blockchain", label: "Blockchain" },
  { value: "ui_ux_design", label: "UI/UX Design" },
  { value: "product_management", label: "Product Management" },
  { value: "project_management", label: "Project Management" },
  { value: "digital_marketing", label: "Digital Marketing" },
  { value: "seo", label: "SEO" },
  { value: "content_creation", label: "Content Creation" },
  { value: "video_editing", label: "Video Editing" },
  { value: "graphic_design", label: "Graphic Design" },
  { value: "copywriting", label: "Copywriting" },
  { value: "sales", label: "Sales" },
  { value: "customer_support", label: "Customer Support" },
  { value: "business_analytics", label: "Business Analytics" },
  { value: "finance", label: "Finance" },
  { value: "accounting", label: "Accounting" },
  { value: "hr_management", label: "HR Management" },
  { value: "game_development", label: "Game Development" },
  { value: "robotics", label: "Robotics" },
  { value: "augmented_reality", label: "Augmented Reality (AR)" },
  { value: "virtual_reality", label: "Virtual Reality (VR)" },
  { value: "data_engineering", label: "Data Engineering" },
  { value: "test_automation", label: "Test Automation" },
  { value: "system_design", label: "System Design" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
];

const MultiSelectSkills = () => {
  const { setUser } = useUserStore();
  const [tempSelected, setTempSelected] = useState<Option[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSaveSkills = async () => {
    setIsSaving(true);
    try {
      const { data } = await axios.put("/api/user/addskill", {
        skills: tempSelected.map((s) => s.value).join(","),
      });

      setUser(data.user);

      console.log(data.user);

      toast.success("Skills saved successfully!");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save skills.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="border-border border rounded-xl px-4 text-sm py-2 cursor-pointer flex gap-1 items-center w-full md:w-fit justify-center">
        Add Skill
        <IconPlus className="w-4 h-4" />
      </DialogTrigger>

      <DialogContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <DialogHeader>
            <DialogTitle>Select up to 6 skills</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 mt-4">
            <Label>Select Skills</Label>
            <MultipleSelector
              maxSelected={6}
              value={tempSelected}
              onChange={(newValues) =>
                newValues.length <= 6 ? setTempSelected(newValues) : null
              }
              defaultOptions={categories}
              placeholder="Select skills"
              hideClearAllButton
              hidePlaceholderWhenSelected
              className="w-full"
              emptyIndicator={
                <p className="text-center text-sm text-muted-foreground">
                  No results found
                </p>
              }
            />
            <p className="text-sm text-muted-foreground">
              {tempSelected.length}/6 selected
            </p>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSaveSkills}
                disabled={isSaving || tempSelected.length === 0}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Skills
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiSelectSkills;
