import type { Lang } from "@/lib/i18n/translations";
import type { PropsWithChildren } from "react";

export interface PageProps extends PropsWithChildren {
  params: { lang: Lang };
}
