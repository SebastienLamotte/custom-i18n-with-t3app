import NextLink from "next/link";
import type { ComponentProps } from "react";
import type { Lang } from "../translations";

type LinkProps = ComponentProps<typeof NextLink> & {
  lang: Lang;
};

export default function Link({ children, lang, href, ...props }: LinkProps) {
  return (
    <NextLink
      href={typeof href === "string" ? `/${lang}${href}` : href}
      {...props}
    >
      {children}
    </NextLink>
  );
}
