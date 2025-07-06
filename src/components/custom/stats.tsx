'use client'

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  IconBriefcase,
  IconDeviceMobileStar,
  IconGps,
  IconGraph,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

interface Stats {
  title: string;
  count: number;
  icon: any;
}

const demoData: Stats[] = [
  {
    title: "Active Job",
    count: 1200,
    icon: <IconGraph className="text-orange-600" />,
  },
  {
    title: "Companies",
    count: 500,
    icon: <IconGps className="text-orange-600" />,
  },
  {
    title: "Job Seekers",
    count: 1235,
    icon: <IconBriefcase className="text-orange-600" />,
  },
  {
    title: "Success Rate",
    count: 95,
    icon: <IconDeviceMobileStar className="text-orange-600" />,
  },
];

const StatCard = ({ item }: { item: Stats }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-xl flex justify-between items-center">
          <span>{item.count}+</span>
          {item.icon}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Stats = () => {
  return (
    <div className="w-full grid grid-cols-1 mt-6 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {demoData.map((data, i) => (
        <StatCard item={data} key={i} />
      ))}
    </div>
  );
};

export default Stats;
