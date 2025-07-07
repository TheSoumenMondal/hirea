"use client";

import ProfileUpdateSheet from "@/components/custom/profileupdate-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import {
  IconCancel,
  IconChevronRight,
  IconLink,
  IconLoader3,
  IconPencil,
  IconPlus,
  IconRocket,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import LinkedInSVG from "@/assets/icons/linkedin.svg";
import FacebookSVG from "@/assets/icons/facebook.svg";
import GithubSVG from "@/assets/icons/github.svg";
import LightGithubSVG from "@/assets/icons/lightgithub.svg";
import InstagramSVG from "@/assets/icons/instagram.svg";
import Image from "next/image";
import { useTheme } from "next-themes";
import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";
import MultiSelect from "@/components/custom/select-32";
import { Badge } from "@/components/ui/badge";
import CompanyAdderSheet from "@/components/custom/company-adder-sheet";
import { useCompanyStore } from "@/store/companyStore";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const ProfilePage = () => {
  const router = useRouter();
  const { user, setIsAuth, setUser } = useUserStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCompanySheetOpen, setIsCompanySheetOpen] = useState<boolean>(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const { setAllCompanies, companies } = useCompanyStore();

  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get("/api/company/all");
      console.log(data.companies);
      setAllCompanies(data.companies);
    } catch (error: any) {
      console.log("Full error object:", error); // Debug log

      if (error.response) {
        console.log("Server error:", error.response.data);
        const errorMessage =
          error.response.data?.message || "Server error occurred";
        toast.error(errorMessage);
      } else if (error.request) {
        console.log("Network error:", error.request);
        toast.error("Network error - please try again");
      } else {
        console.log("Error:", error.message);
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    setMounted(true);
  }, [user]);

  useEffect(() => {
    {
      user?.role === "recruiter" && fetchCompanies();
    }
  }, [user]);

  useEffect(() => {
    if (!user && mounted) {
      router.push("/login");
    }
  }, [user, mounted]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await axios.get("/api/user/logout");
      setIsAuth(false);
      setUser(null);
      toast.success("Logged out");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  if (!mounted || !user || loggingOut) {
    return (
      <div className="w-full h-[calc(100vh_-_120px)] flex items-center justify-center">
        <IconLoader3 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const handleClick = (id: string) => {
    router.push(`/company?id=${id}`);
  };

  return (
    <div className="w-full h-[calc(100vh_-_120px)] flex items-center justify-center">
      <Card className="w-full relative overflow-x-hidden">
        <CardHeader className="w-full flex justify-center flex-col items-center gap-2">
          {user?.resume ? (
            <div className="relative w-fit select-none">
              <Avatar className="size-18">
                <AvatarImage src={user?.profilePhoto} alt="Profile" />
                <AvatarFallback className="text-xs">HR</AvatarFallback>
              </Avatar>
              <span className="absolute right-1 -bottom-2">
                <span className="sr-only">Verified</span>
                <BadgeCheckIcon className="text-background size-5 fill-sky-500" />
              </span>
            </div>
          ) : (
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.profilePhoto} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          )}

          <CardTitle className="text-xl">{user?.name}</CardTitle>
        </CardHeader>

        <CardContent className="w-full flex items-center justify-center gap-2 flex-col">
          <CardDescription className="flex flex-col items-center justify-center space-y-2">
            <p className="text-center">{user?.email}</p>
            <p className="text-center">{user?.phoneNumber}</p>
            <p className="text-center">{user?.bio}</p>

            <Button className="relative cursor-not-allowed dark:bg-white dark:hover:bg-white/90 bg-black hover:bg-black/90 overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]">
              {user?.role}
            </Button>

            <div className="w-full my-3">
              <div className="max-w-md flex-wrap flex items-center justify-center">
                {user.role === "jobseeker" ? (
                  <>
                    {" "}
                    {user?.skills?.map((skill, index) => (
                      <Badge className="m-1" variant="secondary" key={index}>
                        {skill}
                      </Badge>
                    ))}
                  </>
                ) : (
                  <div className="w-screen flex justify-center items-center gap-2 flex-wrap">
                    {companies.map((com, ind) => (
                      <HoverCard openDelay={0} closeDelay={0} key={ind}>
                        <HoverCardTrigger asChild>
                          <div className="flex gap-1 items-center justify-center">
                            <Button
                              size={"sm"}
                              variant={"outline"}
                              onClick={() => handleClick(com._id)}
                            >
                              {com.name}
                            </Button>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <div className="space-y-2">
                            <Avatar>
                              <AvatarImage src={com.logo} alt={com.name} />
                              <AvatarFallback>
                                {com.name.split("")[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{com.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {com.description}
                                <a
                                  href={com.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-foreground flex w-fit underline"
                                >
                                  Learn More about {com.name}
                                  <IconChevronRight className="size-4" />
                                </a>
                              </p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex gap-2 flex-row items-center justify-center">
              {mounted && theme === "dark" ? (
                <Image
                  src={LightGithubSVG}
                  alt="github"
                  width={25}
                  height={25}
                />
              ) : (
                <Image src={GithubSVG} alt="github" width={25} height={25} />
              )}
              <Image src={LinkedInSVG} alt="linkedin" width={25} height={25} />
              <Image
                src={InstagramSVG}
                alt="instagram"
                width={25}
                height={25}
              />
              <Image src={FacebookSVG} alt="facebook" width={25} height={25} />
            </div>

            {user.role === "jobseeker" && (
              <div className="flex items-center gap-2">
                Your Resume{" "}
                <Link
                  href={(user?.resume as string) || "/profile"}
                  target="_blank"
                >
                  <IconLink className="w-4 h-4 hover:text-green-600 hover:rotate-180 transition-transform duration-300 hover:cursor-pointer" />
                </Link>
              </div>
            )}
          </CardDescription>
        </CardContent>

        <CardFooter className="flex gap-3 flex-col w-full md:flex-row items-center justify-center">
          {user.role === "jobseeker" ? (
            <> {user?.resume && <MultiSelect />}</>
          ) : (
            <Button
              onClick={() => setIsCompanySheetOpen(true)}
              className="rounded-xl gap-0 text-sm"
              size={"sm"}
              variant={"secondary"}
            >
              Add Company
              <IconPlus />
            </Button>
          )}

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsSheetOpen(true)}
            className="gap-1 w-full md:w-auto rounded-xl"
          >
            Edit Profile <IconPencil size={16} />
          </Button>
          <Button
            onClick={handleLogout}
            variant="destructive"
            size="sm"
            className="gap-1 w-full md:w-auto rounded-xl"
          >
            Log out <IconRocket size={16} />
          </Button>
        </CardFooter>
      </Card>
      <CompanyAdderSheet
        open={isCompanySheetOpen}
        setOpen={setIsCompanySheetOpen}
      />
      <ProfileUpdateSheet open={isSheetOpen} setOpen={setIsSheetOpen} />
    </div>
  );
};

export default ProfilePage;
