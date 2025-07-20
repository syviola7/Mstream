import SingleShow from "@/app/component/single_movie_tv_show/SingleShow";

async function getSingleMovie(id: string) {
  const res = await fetch(
    `${process.env.BASE_URL}/3/movie/${id}?api_key=${process.env.API_KEY}&append_to_response=credits,recommendations,similar&language=${process.env.NEXT_PUBLIC_LAN}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export async function generateMetadata({ params }: any) {
  const res: SingleShowProps = await getSingleMovie(params.id);
  return {
    title: res.title ?? res.name,
    description: res.overview,
    keywords: [
      `${res?.title! || res?.name! || "streamland"} movie`,
      `${res?.title! || res?.name! || "streamland"} movie online`,
      `${res?.title! || res?.name! || "streamland"} movie free`,
      `${res?.title! || res?.name! || "streamland"} movie free online`,
      `${
        res?.title! || res?.name! || "streamland"
      } movie free online streaming`,
      `${res?.title! || res?.name! || "streamland"} movie free online watch`,
      `${
        res?.title! || res?.name! || "streamland"
      } movie free online watch now`,
      `${
        res?.title! || res?.name! || "streamland"
      } movie free online watch now hd`,
      `${
        res?.title! || res?.name! || "streamland"
      } movie free online watch now hd 1080p`,
    ],
  };
}

const page = async ({ params }: any) => {
  const res: SingleShowProps = await getSingleMovie(params.id);

  return (
    <div className="bg-_black_bg">
      <SingleShow {...res} TYPE="MOVIE" />
    </div>
  );
};

export default page;
