import { Luxurious_Roman } from "next/font/google";
import { Gideon_Roman } from "next/font/google";
import { Romanesco } from "next/font/google";
import { Roboto } from "next/font/google";

export const romanesco = Romanesco({
  subsets: ["latin"],
  weight: "400",
});
export const gideon_roman = Gideon_Roman({
  subsets: ["latin"],
  weight: "400",
});
export const luxurious_roman = Luxurious_Roman({
  subsets: ["latin"],
  weight: "400",
});
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});