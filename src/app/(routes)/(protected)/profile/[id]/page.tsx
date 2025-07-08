"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { IconLoader3 } from "@tabler/icons-react";
import GithubSVG from "@/assets/icons/github.svg";
import LightGithubSVG from "@/assets/icons/lightgithub.svg";
import FacebookSVG from "@/assets/icons/facebook.svg";
import InstagramSVG from "@/assets/icons/instagram.svg";
import LinkedInSVGSVG from "@/assets/icons/linkedin.svg";
import Image from "next/image";
import { useTheme } from "next-themes";

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  bio: string;
  role: string;
  skills: string[];
  profilePhoto: string;
  resume: string;
  socialMediaProfiles: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}

const Page = () => {
  const { theme } = useTheme();
  const [fetchedUser, setFetchedUser] = useState<User | null>(null);
  const params = useParams();
  const id = params.id;
  const fetchUser = async () => {
    try {
      const res = await axios.get(`/api/user/${id}`);
      setFetchedUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  if (!fetchedUser)
    return (
      <div className="text-center w-full flex flex-col items-center justify-center h-[calc(100vh_-_100px)]">
        <IconLoader3 className="w-4 h-4 animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh_-_100px)] px-4 py-12">
      <Avatar className="w-24 h-24">
        <AvatarImage src={fetchedUser.profilePhoto} alt={fetchedUser.name} />
        <AvatarFallback>
          {fetchedUser.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <h1 className="mt-4 text-2xl font-bold">{fetchedUser.name}</h1>
      <p>{fetchedUser.email}</p>
      <p>{fetchedUser.phoneNumber}</p>
      <p className="mt-1 text-sm">{fetchedUser.bio}</p>
      <Badge className="mt-2 px-4 py-1 text-sm capitalize">
        {fetchedUser.role}
      </Badge>
      {fetchedUser.skills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {fetchedUser.skills.map((skill, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="rounded-md px-4 py-1 text-sm"
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}
      <div className="flex gap-4 mt-6">
        {fetchedUser.socialMediaProfiles.github && (
          <a href={fetchedUser.socialMediaProfiles.github} target="_blank">
            {theme === "light" ? (
              <Image src={GithubSVG} alt="Github" width={24} height={24} />
            ) : (
              <Image src={LightGithubSVG} alt="Github" width={24} height={24} />
            )}
          </a>
        )}
        {fetchedUser.socialMediaProfiles.linkedin && (
          <a href={fetchedUser.socialMediaProfiles.linkedin} target="_blank">
            <Image src={LinkedInSVGSVG} alt="LinkedIn" width={24} height={24} />
          </a>
        )}
        {fetchedUser.socialMediaProfiles.instagram && (
          <a href={fetchedUser.socialMediaProfiles.instagram} target="_blank">
            <Image src={InstagramSVG} alt="Instagram" width={24} height={24} />
          </a>
        )}
        {fetchedUser.socialMediaProfiles.facebook && (
          <a href={fetchedUser.socialMediaProfiles.facebook} target="_blank">
            <Image src={FacebookSVG} alt="Facebook" width={24} height={24} />
          </a>
        )}
      </div>
    </div>
  );
};

export default Page;
