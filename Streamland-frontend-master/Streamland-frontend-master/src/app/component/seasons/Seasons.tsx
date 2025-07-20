"use client";
import { Apis } from "@/app/tmdbApi/TmdbApi";
import { userApis } from "@/app/userApi";
import { useAppSelector } from "@/redux/hooks";
import { AddMediaDataTypes } from "@/types/userTypes";
import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import EpisodeSkeletonLoader from "../loader/EpisodeSkeletonLoader";
import Episode from "./Episodes";
import PlayerButton from "./atoms/PlayerButton";
import SeasonHeader from "./molecules/SeasonHeader";

const Seasons = ({
  seasons,
  Tvshowdata,
}: {
  Tvshowdata: any;
  seasons?: seasonsProps[];
}) => {
  const params = useParams();
  const user = useAppSelector((state) => state.auth);
  const [player, setPlayer] = useState<1 | 2>(1);
  const searchParams = useSearchParams();
  const SeasonId = searchParams.get("s");
  const TotalEpisodes = searchParams.get("e");
  const currentEpisode = searchParams.get("ce");
  const [showSeasondropdown, setShowSeasondropdown] = useState(false);
  const Seasondropdown = useRef<HTMLElement>(null);
  const SeasonBtn = useRef<HTMLElement>(null);
  const SeasonBtn2 = useRef<HTMLDivElement>(null);
  const SeasonBtn4 = useRef<HTMLDivElement>(null);
  const SeasonBtn3 = useRef<HTMLParagraphElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleOutSideClick = (e: Event) => {
      if (
        showSeasondropdown &&
        e.target !== Seasondropdown.current &&
        e.target !== SeasonBtn.current &&
        e.target !== SeasonBtn2.current &&
        e.target !== SeasonBtn3.current &&
        e.target !== SeasonBtn4.current
      ) {
        setShowSeasondropdown(false);
      }
    };
    window.addEventListener("click", handleOutSideClick);
    return () => {
      window.removeEventListener("click", handleOutSideClick);
    };
  }, [showSeasondropdown]);

  const AddtoWatchlist = useMutation((data: AddMediaDataTypes) =>
    userApis.AddMedia(data)
  );

  const HanldeClick = () => {
    localStorage.setItem("tvId", params.id as string);
    const datas: AddMediaDataTypes = {
      id: params.id as string,
      name: Tvshowdata?.name,
      original_title: Tvshowdata?.original_name,
      backdrop_path: Tvshowdata?.backdrop_path,
      poster_path: Tvshowdata?.poster_path,
      media_type: "tv",
      first_air_date: Tvshowdata?.first_air_date,
      vote_average: Tvshowdata?.vote_average,
      type: "history",
    };
    if (user.isUserAuthenticated) {
      AddtoWatchlist.mutate(datas);
    }
    setShowOverlay(false);
  };

  useEffect(() => {
    if (!SeasonId || !TotalEpisodes) {
      router.push(
        `/tv/${params.id}/seasons?s=${seasons![0].season_number}&e=${
          seasons![0].episode_count
        }&ce=1`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SeasonId, TotalEpisodes, params.id]);

  const { data, isLoading, isFetching } = useQuery(
    ["allEpisodes", params.id, SeasonId, TotalEpisodes],
    () => Apis.GetAllEpisodes(params.id as string, SeasonId, TotalEpisodes),
    {
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  return (
    <Suspense>
      <div>
        <div>
          <SeasonHeader SeasonId={SeasonId} currentEpisode={currentEpisode} />
          <div>
            <PlayerButton player={player} setPlayer={setPlayer} />
          </div>
        </div>

        <>
          <div className="flex h-[35rem] max-lg:h-full max-lg:flex-col">
            <div className=" relative w-full py-6 flex-grow-1 max-lg:h-[30rem] max-md:flex-shrink-0">
              {showOverlay && (
                <div
                  className="absolute inset-0  bg-black opacity-0"
                  onClick={HanldeClick}
                ></div>
              )}
              {player == 1 && (
                <iframe
                  src={`https://www.2embed.cc/embedtv/${params.id}&s=${
                    SeasonId ? SeasonId : 1
                  }&e=${currentEpisode ? currentEpisode : 1}`}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  className="h-full full"
                />
              )}
              {player === 2 && (
                <iframe
                  src={`https://autoembed.co/tv/tmdb/${params.id}-${
                    SeasonId ? SeasonId : 1
                  }-${currentEpisode ? currentEpisode : 1}`}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  className="h-full full"
                />
              )}
            </div>
            <div className=" w-[450px] max-lg:w-full  py-6 px-3 max-md:px-1 ">
              <section className="bg-neutral-800 h-full overflow-y-auto rounded-3xl py-5 px-4">
                <section
                  className="flex items-center relative  bg-blue-700 hover:bg-opacity-60 cursor-pointer justify-center rounded-3xl"
                  onClick={() => setShowSeasondropdown(!showSeasondropdown)}
                  ref={SeasonBtn}
                >
                  <div
                    className="flex items-center gap-2 py-1 select-none"
                    ref={SeasonBtn2}
                  >
                    <p
                      className="text-neutral-300 font-normal"
                      ref={SeasonBtn3}
                    >
                      Season {SeasonId ?? seasons![0].season_number}
                    </p>
                    <div
                      className="border-transparent border-[6px] border-t-neutral-400 w-0 h-0 mt-2"
                      ref={SeasonBtn4}
                    />
                  </div>
                  {/* dropdown */}
                  <section
                    className={clsx(
                      "bg-_black_bg border border-neutral-500 z-10 border-opacity-25 absolute mt-2 shadow-lg  top-8 w-full overflow-y-auto duration-200 transition-all ease-in-out  flex flex-col  rounded-3xl seasonScroll",
                      showSeasondropdown ? "max-h-60 py-3 px-3" : "p-0 max-h-0"
                    )}
                    ref={Seasondropdown}
                  >
                    {seasons?.map((item) => {
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            router.push(
                              `/tv/${params.id}/seasons?s=${item.season_number}&e=${item.episode_count}&ce=1`,
                              {
                                scroll: false,
                              }
                            );
                          }}
                          className={clsx(
                            " text-neutral-400 py-1 my-1 text-center font-light  rounded-3xl  px-2 hover:text-_sidenav_bg   duration-200 transition-all ease-linear hover:shadow-lg",
                            SeasonId === item.season_number.toString()
                              ? "bg-_blue bg-opacity-50 font-normal text-white"
                              : "bg-inherit hover:bg-neutral-800"
                          )}
                        >
                          {item.name}
                        </div>
                      );
                    })}
                  </section>
                </section>
                {/* Episodes */}
                <section className="w-80  max-lg:w-full max-md:w-full   h-[26rem] mt-4 seasonScroll overflow-y-auto flex gap-1 flex-col">
                  {isLoading || isFetching ? (
                    <EpisodeSkeletonLoader />
                  ) : (
                    <>
                      {data &&
                        SeasonId &&
                        TotalEpisodes &&
                        data.map((item) => {
                          if (item === null) return;
                          return <Episode {...item} key={item.id} />;
                        })}
                    </>
                  )}
                </section>
              </section>
            </div>
          </div>

          <section className="flex flex-wrap gap-3 max-md:pl-1 py-5 pl-14 mt-10"></section>
        </>
        <section className="flex flex-col gap-5 pb-10 mt-10"></section>
      </div>
    </Suspense>
  );
};

export default Seasons;
