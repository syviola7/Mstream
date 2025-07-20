import { convertMinutesToHours } from "@/utils/converter";
import Image from "next/image";
import React, { Suspense } from "react";
import { GiRoundStar } from "react-icons/gi";
import AddToWatchlist from "../Buttons/AddToWatchlist";
import Images from "../ImageComponent/Image";
import Trailers from "../Trailer/Trailer";
import Cast from "../cast/Cast";
import SmallLoader from "../loader/SmallLoader";
import CustomModal from "../modal/CustomModal";
import ReccomendationMovie from "../reccomendation_movie/ReccomendationMovie";
import SimilarMovie from "../similar_movie/SimilarMovie";
import Genres from "./Genres";
import SeeMoreModal from "./SeeMoreModal";
import Header from "./atoms/Header";
import WatchButton from "./atoms/WatchButton";

const SingleShow: React.FC<SingleShowProps> = ({
  id,
  backdrop_path,
  poster_path,
  title,
  genres,
  runtime,
  release_date,
  vote_average,
  overview,
  credits,
  first_air_date,
  original_title,
  name,
  original_name,
  number_of_seasons,
  number_of_episodes,
  TYPE,
  status,
  created_by,
  in_production,
  networks,
  spoken_languages,
  tagline,
  homepage,
  last_air_date,
  similar,
  recommendations,
}) => {
  return (
    <div>
      <div className="relative">
        <Image
          src={`https://image.tmdb.org/t/p/original/${backdrop_path!}`}
          width={1000}
          height={1000}
          quality={100}
          priority
          alt={title ?? "poster"}
          style={{ objectFit: "cover" }}
          className=" w-full h-[32rem] select-none object-top"
        />
        <div className="absolute bottom-0 bg-gradient-to-t from-_black_bg inset-x-0 h-40" />
      </div>
      <section className="bg-_black_bg pb-7 relative -translate-y-12 rounded-t-[45px]">
        <div>
          <div className="w-52 max-md:hidden block h-72 absolute -translate-y-36 max-md:translate-x-32 translate-x-16">
            <Images
              src={`https://image.tmdb.org/t/p/w200/${poster_path}`}
              width={500}
              height={500}
              alt={title}
              ImageWidth={"full"}
              Imageheight={288}
              rounded="2xl"
            />
          </div>

          <div className="absolute -top-40 hidden  left-0 bg-transparent right-0 w-full max-md:flex justify-center">
            <Image
              src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
              width={1000}
              height={1000}
              quality={100}
              priority
              alt={title ?? "poster"}
              style={{ objectFit: "cover" }}
              className=" w-56 h-80 rounded-2xl hidden max-md:block select-none object-top"
            />
          </div>

          <section className="pl-72  flex-col max-md:justify-center  max-md:pl-0 max-md:flex-col   max-md:pt-44  max-md:h-full py-6 flex justify-between">
            <div className="flex justify-between items-center max-md:flex-col">
              <Header TYPE={TYPE} name={name} title={title} />
              <div className="max-md:mb-5">
                {" "}
                <WatchButton TYPE={TYPE} id={id} />
              </div>
            </div>

            <div className="mt-4   max-md:flex max-md:justify-center max-md:flex-wrap">
              <Genres TYPE={TYPE} data={genres} />
            </div>
            <div className="mt-3 pl-1 flex-wrap flex max-md:flex-wrap max-md:justify-center items-center gap-2">
              <span className="text-_welcometext_lightblue font-Inter text-[13px]">
                {TYPE === "MOVIE" && runtime && convertMinutesToHours(runtime)}
                {TYPE === "TV" &&
                  number_of_seasons &&
                  number_of_seasons +
                    `${number_of_seasons > 1 ? " Seasons" : " Season"}`}
              </span>
              {TYPE === "TV" && (
                <>
                  <div className="bg-_white w-1 h-1 rounded-full mx-1 " />
                  <span className="text-_welcometext_lightblue font-Inter text-[13px]">
                    {number_of_episodes && number_of_episodes + " episodes"}
                  </span>
                </>
              )}
              <div className="bg-_white w-1 h-1 rounded-full mx-1 " />
              <span className="text-_welcometext_lightblue font-Inter text-[13px]">
                {TYPE === "MOVIE" && release_date ? release_date : ""}
                {TYPE === "TV" && status}
              </span>
              <div className="bg-_white w-1 h-1 rounded-full mx-1" />
              <div className="flex items-center gap-2 ">
                <span className="text-_welcometext_lightblue text-xs">
                  {vote_average.toFixed(1)}
                </span>
                <GiRoundStar className="text-yellow-400 text-sm mb-[1px]" />
              </div>
              <section>
                <Suspense
                  fallback={
                    <p>
                      <SmallLoader size={10} />{" "}
                    </p>
                  }
                >
                  <SeeMoreModal
                    original_name={original_name}
                    created_by={created_by}
                    in_production={in_production}
                    networks={networks}
                    status={status}
                    spoken_languages={spoken_languages}
                    tagline={tagline}
                    homepage={homepage}
                    last_air_date={last_air_date}
                  />
                </Suspense>
              </section>

              <CustomModal
                tooltip="watch Trailer"
                width={"1/2"}
                buttonElement={
                  <p className="text-xs ml-1 hover:border-opacity-80 duration-150 ease-in transition-opacity border-_light_white border-opacity-30 text-_light_white border px-2 py-1 font-light rounded-md">
                    Watch Trailer
                  </p>
                }
                data={
                  <div className="h-80">
                    {<Trailers title={title || name || " "} type={TYPE} />}
                  </div>
                }
              />
              <section>
                {TYPE === "MOVIE" ? (
                  <AddToWatchlist
                    release_date={release_date}
                    backdrop_path={backdrop_path}
                    media_type={"movie"}
                    poster_path={poster_path}
                    id={id}
                    vote_average={vote_average}
                    showAddToWatchlist={true}
                    original_title={original_title}
                    title={title}
                  />
                ) : (
                  <AddToWatchlist
                    first_air_date={first_air_date}
                    backdrop_path={backdrop_path}
                    media_type={"tv"}
                    original_title={original_title}
                    poster_path={poster_path}
                    id={id}
                    vote_average={vote_average}
                    showAddToWatchlist={true}
                    name={name}
                  />
                )}
              </section>
            </div>
          </section>
          <section>
            <p className="text-_welcometext_lightblue font-light tracking-wide px-16 max-md:px-2 text-base font-Helvetica">
              {overview}
            </p>
          </section>
        </div>
        {credits.cast.length > 0 && (
          <section className="px-6 max-md:px-1 max-md:mx-1 mt-10">
            <Cast data={credits.cast} />
          </section>
        )}
        {similar.results.length > 0 && (
          <section className="px-6 max-md:px-1  mt-12">
            <SimilarMovie type={TYPE} results={similar.results} />
          </section>
        )}
        {recommendations.results.length > 0 && (
          <section className="px-6 max-md:px-1 mt-12">
            <ReccomendationMovie
              type={TYPE}
              results={recommendations.results}
            />
          </section>
        )}
      </section>
    </div>
  );
};

export default SingleShow;
