import Footer from "@/components/custom/footer";
import Opportunity from "@/components/custom/opportunity";
import ReasonSection from "@/components/custom/reason-section";
import Stats from "@/components/custom/stats";
import Working from "@/components/custom/working";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconFilter2 } from "@tabler/icons-react";
import React from "react";

const page = () => {
  return (
    <div className="w-full flex flex-col overflow-y-auto">
      <div className="w-full h-[500px] flex items-center justify-center flex-col">
        {/* home hero section  */}
        <div className="max-w-lg flex-col items-center justify-center flex gap-2">
          <Button
            size={"sm"}
            variant={"secondary"}
            className="rounded-2xl text-xs border mb-4"
          >
            🚀 Over 10,000+ jobs posted this month
          </Button>
          <h1 className="text-4xl text-center font-bold select-none">
            Find your dream job or{" "}
            <span className="text-green-500">hire top talent</span>
          </h1>
          <p className="text-sm text-center select-none">
            Connect with opportunities that match your skills and ambitions.
            Join thousands of professionals finding their perfect career match.
          </p>
          <div className="w-full gap-2 flex mt-10 flex-col md:flex-row">
            <Input placeholder="location" className="placeholder:text-xs" />
            <Input
              placeholder="job,title,keyword or company"
              className="placeholder:text-xs"
            />
            <Button
              variant={"default"}
              className="mt-4 md:mt-0 bg-green-400 hover:bg-green-500"
            >
              <IconFilter2 className="w-4 h-4" />
              Search
            </Button>
          </div>
          <div className="flex gap-1 items-center mt-4">
            <p className="text-xs">Today&apos;s popular search</p>
            <div className="flex gap-2">
              <Badge className="bg-green-500">Frontend Developer</Badge>
            </div>
          </div>
        </div>
      </div>
      <Stats />
      <Opportunity />
      <ReasonSection />
      <Working/>
      <Footer/>
    </div>
  );
};

export default page;
