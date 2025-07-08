"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import ToggleTheme from "./theme-toggle";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { isAuth, user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={"/"} className="font-bold text-lg">
          hirea
        </Link>

        <div className="hidden md:flex gap-4 items-center">
          <Link href={"/jobs"} className="text-sm hover:underline">
            <Button variant="outline" size="sm" className="rounded-xl text-sm">
              Find Job
            </Button>
          </Link>
          <ToggleTheme className="cursor-pointer" />
          {isAuth === false ? (
            <Link href={"/login"}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-sm"
              >
                Log In
              </Button>
            </Link>
          ) : (
            <Link href={"/profile"}>
              <Avatar className="cursor-pointer w-8 h-8">
                <AvatarImage src={user?.profilePhoto} alt="profile" />
                <AvatarFallback>
                  {user?.name?.split(" ")[0]?.[0]}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ToggleTheme className="cursor-pointer" />
          <button onClick={toggleMenu}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-4 pb-6 flex flex-col gap-3 w-full"
          >
            <Link
              href="/jobs"
              className="text-sm"
              onClick={() => setIsOpen(false)}
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-sm w-full"
              >
                Find Job
              </Button>
            </Link>

            {isAuth === false ? (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl"
                >
                  Log In
                </Button>
              </Link>
            ) : (
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profilePhoto} alt="profile" />
                    <AvatarFallback>
                      {user?.name?.split(" ")[0]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user?.name?.split(" ")[0]}</span>
                </div>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
