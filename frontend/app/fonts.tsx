import { Lato, Roboto_Mono } from "next/font/google";

const lato = Lato({
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

const roboto = Roboto_Mono({
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

export {
  lato,
  roboto
};