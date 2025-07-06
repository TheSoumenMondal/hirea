"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "1",
    title: "Create Your Profile",
    description:
      "Build a comprehensive profile showcasing your skills, experience, and career goals.",
  },
  {
    number: "2",
    title: "Discover Opportunities",
    description:
      "Browse curated job listings or let our smart matching system find perfect fits for you.",
  },
  {
    number: "3",
    title: "Land Your Dream Job",
    description:
      "Apply with confidence and get hired by companies that value your unique talents.",
  },
];

const Working = () => {
  return (
    <section className="relative z-10 w-full bg-background py-16 px-4">
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          How It Works
        </h2>
        <p className="text-muted-foreground mb-12 text-sm">
          Get started in just a few simple steps
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={cn(
                "bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300"
              )}
            >
              <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-md">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Working;
