"use client";

import React from "react";
import { Button } from "../ui/button";
import ToggleTheme from "./theme-toggle";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar = () => {
  const { isAuth, user } = useUserStore();

  return (
    <div className="w-full flex justify-between items-center h-12 ">
      <Link href={"/"} className=" font-bold">
        hirea
      </Link>
      <div className="md:flex gap-2 items-end justify-end hidden">
        <Link href={"find"} className="text-sm">
          Find Job
        </Link>
        <Link href={"companies"} className="text-sm">
          Companies
        </Link>
        <Link href={"resources"} className="text-sm">
          Resources
        </Link>
      </div>
      <div className="h-full flex gap-4 items-center">
        <ToggleTheme className="cursor-pointer" />
        {isAuth === false ? (
          <Link href={"/login"}>
            <Button
              className="rounded-xl text-sm select-none"
              variant={"outline"}
              size={"sm"}
            >
              Log In
            </Button>
          </Link>
        ) : (
          <Link href={"/profile"}>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user?.profilePhoto} alt="profile" />
              <AvatarFallback>
                {user?.name?.split(" ")[0]?.split("")[0]}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
