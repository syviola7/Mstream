import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "streamland | Movies & TV Shows",
    short_name: "streamland",
    description:
      "Watch Movies & TV Shows Online Free ,plus chat with other users, share your thoughts, and engage in discussions.",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/src/app/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
