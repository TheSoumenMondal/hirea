"use client";

import { motion } from "framer-motion";
import {
  IconSearch,
  IconBuildingCommunity,
  IconTrendingUp,
} from "@tabler/icons-react";

const ReasonSection = () => {
  const reasons = [
    {
      icon: <IconSearch className="w-6 h-6 text-green-500" />,
      title: "Smart Job Matching",
      description:
        "Our AI-powered algorithm matches you with jobs that fit your skills, experience, and preferences perfectly.",
    },
    {
      icon: <IconBuildingCommunity className="w-6 h-6 text-green-500" />,
      title: "Verified Companies",
      description:
        "All companies are verified and vetted to ensure you're applying to legitimate, quality employers.",
    },
    {
      icon: <IconTrendingUp className="w-6 h-6 text-green-500" />,
      title: "Career Growth",
      description:
        "Access career insights, salary data, and growth opportunities to advance your professional journey.",
    },
  ];

  return (
    <section className="w-full py-10 flex flex-col items-center justify-center px-4 md:px-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 select-none">
        Why Choose{" "}
        <span className="bg-green-300 dark:bg-green-800 pr-3 pl-3 py-1 rounded-lg">
          hirea?
        </span>
      </h2>
      <p className="text-muted-foreground text-center max-w-xl mb-12 select-none text-sm">
        We make job searching and hiring simple, efficient, and successful
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {reasons.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded-xl border bg-background text-center shadow-sm hover:shadow-sm"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">{item.icon}</div>
            </div>
            <h3 className="font-semibold text-lg mb-2 select-none">
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground select-none">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ReasonSection;
