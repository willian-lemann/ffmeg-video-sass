import { twMerge } from "tailwind-merge";

export const classnames = (...classes: string[]) => {
  return twMerge(classes.filter(Boolean).join(" "));
};
