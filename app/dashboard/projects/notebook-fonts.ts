import { Gaegu, Permanent_Marker } from "next/font/google";

// Chunky red marker for headings, neat handwriting for everything else
export const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const hand = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});