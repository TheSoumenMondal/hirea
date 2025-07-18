"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { IconChevronRight } from "@tabler/icons-react";


const Footer = () => {
  return (
    <section className="w-full py-16 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tighter mb-4">
          Ready to Find Your Next{" "}
          <span className="font-bold text-green-400">Opportunity?</span>
        </h2>
        <p className="text-sm mb-8">
          Join thousands of professionals who have already found their dream
          jobs through hirea
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-green-500 hover:bg-green-600 ">
            Find Jobs <IconChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-green-500 text-green-600 hover:text-green-700 hover:bg-orange-100"
          >
            Post a Job
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Footer;
