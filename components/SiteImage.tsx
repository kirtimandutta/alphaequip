import { asset } from "@/lib/assets";
import Image, { type ImageProps } from "next/image";

export function SiteImage({ src, ...props }: ImageProps) {
  const resolved = typeof src === "string" && src.startsWith("/") ? asset(src) : src;
  return <Image src={resolved} {...props} />;
}
