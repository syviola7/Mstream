/* eslint-disable @next/next/no-img-element */
"use client";
import { userApis } from "@/app/userApi";
import { useAppSelector } from "@/redux/hooks";
import { Role } from "@/types/role";
import { getUserDataTypes } from "@/types/userTypes";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { AiOutlineMessage } from "react-icons/ai";
import { BiMoviePlay } from "react-icons/bi";
import { BsCalendar2Week } from "react-icons/bs";
import { HiMail } from "react-icons/hi";
import Images from "../ImageComponent/Image";
import CustomModal from "../modal/CustomModal";
import FollowersList from "./FollowersFollowing/FollowersList";

interface ProfileCardProps extends getUserDataTypes {
  role: Role;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  _id,
  createdAt,
  email_verified,
  followers,
  following,
  fullName,
  genre,
  isFollowing,
  ownProfile,
  profilePic,
  username,
  email,
  role,
}) => {
  const [follow, setFollow] = React.useState<boolean>(isFollowing);
  const user = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showFullImage, setShowFullImage] = React.useState<boolean>(false);
  const updateFollow = useMutation((id: string) => userApis.FollowUser(id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getUser"]);
    },
    onError: (data) => {
      toast.error("Failed to follow Try Again!");
    },
  });

  const createAccessChat = useMutation(
    (id: string) => userApis.createAccessChat(id),
    {
      onSuccess: (data) => {
        router.push(`/chat?id=${data._id}&type=personal`);
      },
      onError: (data) => {
        toast.error("Failed to create access chat Try Again!");
      },
    }
  );

  const handleStartMessage = () => {
    createAccessChat.mutate(_id);
  };

  const Followers = (
    <div>
      <span className="text-neutral-300 font-semibold tracking-wide  text-sm">
        {followers.length}
      </span>
      <span className="ml-2 text-sm text-_light_white font-normal">
        Followers
      </span>
    </div>
  );

  const Following = (
    <div>
      <span className="text-neutral-300 font-semibold tracking-wide text-sm">
        {following.length}
      </span>
      <span className="ml-2 text-sm text-_light_white font-normal">
        {" "}
        Following
      </span>
    </div>
  );

  if (profilePic.includes("s96-c")) {
    if (user.role === Role.admin || ownProfile)
      profilePic = profilePic.replace("s96-c", "s1000-c");
    else profilePic = profilePic.replace("s96-c", "s300-c");
  }

  const HanldeshowFullImage = () => {
    setShowFullImage(!showFullImage);
  };

  return (
    <>
      <div className="flex max-md:flex-col pl-5 py-7 max-md:mx-4 mx-11 bg-neutral-800 border-b-_welcometext_lightblue border-b border-opacity-20  rounded-t-lg">
        <div className="w-48 h-48  rounded-md" onClick={HanldeshowFullImage}>
          {showFullImage && (
            <div className="fixed inset-0 py-2 px-3 bg-neutral-500 bg-opacity-40 backdrop-blur-sm z-50">
              <p className="absolute top-0 right-0 bg-neutral-900 px-2 py-1 mr-3 mt-2 rounded-md hover:bg-neutral-600 cursor-pointer">
                Close
              </p>
              <img
                src={profilePic}
                alt="profilePic"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <Images
            src={profilePic}
            alt={username}
            height={200}
            width={200}
            ImageWidth={"full"}
            Imageheight={"full"}
            rounded="20px"
            objectFit="cover"
          />
        </div>
        <div className="mt-0 pl-7  w-full max-md:pl-0 max-md:mt-2">
          <div className=" w-full flex justify-between ">
            <h4 className="font-semibold text-neutral-100 text-xl flex items-center pb-0">
              {fullName}{" "}
              <span
                className={clsx(
                  "font-light text-[9px] leading-none ml-4 rounded-3xl px-2 py-1 ",
                  email_verified
                    ? "text-green-400 border border-green-500"
                    : "text-red-300 border border-red-300"
                )}
              >
                {email_verified ? "Verified" : "Not Verified"}
              </span>
            </h4>
            <div className="flex gap-3 items-center">
              {!ownProfile && (
                <>
                  <Tooltip
                    title={
                      createAccessChat.isLoading
                        ? "Loading Chat"
                        : "send message"
                    }
                  >
                    <IconButton onClick={handleStartMessage}>
                      {createAccessChat.isLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      ) : (
                        <AiOutlineMessage className="text-2xl text-neutral-400" />
                      )}
                    </IconButton>
                  </Tooltip>

                  <button
                    onClick={() => {
                      updateFollow.mutate(_id);
                      setFollow(!follow);
                    }}
                    className="border flex items-center mr-14 py-1 border-opacity-60 hover:border-opacity-100 transition-colors ease-linear duration-200 border-_light_white px-5 rounded-2xl"
                  >
                    {follow ? (
                      <span className="text-base max-md:text-sm  text-neutral-300 font-normal">
                        Following
                      </span>
                    ) : (
                      <span className="text-base max-md:text-sm text-neutral-300 font-normal">
                        Follow
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
          <p className=" mb-2 pb-2 leading-none">
            <span className="text-[13px] tracking-wide leading-none text-neutral-300 mt-1 font-light">
              @{username}
            </span>
          </p>
          <section>
            <p className="flex items-center mb-3">
              <BsCalendar2Week className="text-neutral-300 mr-3" />
              <span className="text-neutral-300 tracking-wide font-normal text-sm">
                Joined:
              </span>
              {role === Role.admin ? (
                <span className="ml-2 text-sm  text-_light_white font-normal ">
                  {moment(createdAt).format("Y MMM DD")}
                </span>
              ) : (
                <span className="ml-2 text-sm  text-_light_white font-normal ">
                  {moment(createdAt).format("Y MMMM")}
                </span>
              )}
            </p>
            {ownProfile ||
              (role === Role.admin && (
                <p className="flex items-center mb-2 -translate-x-[2px]">
                  <HiMail className="text-neutral-300 mr-3 text-xl " />
                  <span className="text-neutral-300 tracking-wide font-normal text-sm">
                    Email:
                  </span>
                  <span className="ml-2 text-sm text-_light_white font-normal">
                    {email}
                  </span>
                </p>
              ))}
            <div className="flex items-center mb-2 mt-3 -translate-x-[2px]">
              <BiMoviePlay className="text-neutral-300 mr-3 text-xl " />
              <span className="text-neutral-300 tracking-wide font-normal text-sm">
                Genre:
              </span>
              <div className="flex flex-wrap gap-2 ml-2 ">
                {genre.length > 0 ? (
                  genre.map((item, index) => (
                    <span
                      key={index}
                      className=" text-xs shrink-0 py-1 border border-opacity-30 border-_welcometext_lightblue px-2 rounded-2xl  text-_light_white font-normal"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className=" text-xs p    text-_light_white font-normal">
                    Not Available
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center mt-4 gap-8 mb-2  translate-x-[4px]">
              <div>
                <CustomModal
                  buttonElement={Following}
                  data={<FollowersList tab="Following" id={_id} />}
                  key={_id}
                  tooltip="Following"
                  width={"1/2"}
                />
              </div>
              <div>
                <CustomModal
                  buttonElement={Followers}
                  data={<FollowersList tab="Followers" id={_id} />}
                  key={_id}
                  tooltip="Followers"
                  width={"1/2"}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
