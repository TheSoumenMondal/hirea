'use client'

import { cn } from "@/lib/utils";
import { IconBrightness } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import React from "react";

const ToggleTheme = ({ className }: { className?: string }) => {
  const { setTheme } = useTheme();
  const handleThemeChange = () => {
    setTheme((theme) => (theme === "dark" ? "light" : "dark"));
  };
  return (
    <IconBrightness
      onClick={handleThemeChange}
      className={cn("w-4 h-4", className)}
    />
  );
};

export default ToggleTheme;
