import "server-only";
import { type NextRequest, NextResponse } from "next/server";
import {
  getLangPathname,
  getResponseForUrlWithoutPrefix,
  getResponseForPrefixedUrl,
} from "./utils";
import { LANGS } from "../config";
import type { Lang } from "../translations";

type I18nConfig = {
  // If false: Example with default lang as "fr" => /fr become /
  langPrefix?: boolean;
  // If True: Set the lang from headers except if lang cookie is already set
  langDetection?: boolean;
};

export function i18n(
  request: NextRequest,
  { langPrefix = false, langDetection = false }: I18nConfig = {},
) {
  const pathname = request.nextUrl.pathname.toLowerCase();
  const firstSegment = pathname.split("/")[1] ?? "";
  /**
   * Url with lang prefix
   */
  if (LANGS.includes(firstSegment)) {
    return getResponseForPrefixedUrl(
      request,
      pathname,
      firstSegment as Lang,
      langPrefix,
    );
  }

  /**
   * Url without lang prefix
   */
  const langPathnameInfos = getLangPathname(request, pathname, langDetection);

  if (langPathnameInfos.langFound) {
    return getResponseForUrlWithoutPrefix(
      request,
      langPathnameInfos as {
        langFound: Lang;
        pathnameInEnglish: string;
        isPathnameUnique: boolean;
      },
      langPrefix,
    );
  }

  /**
   * All other request (ex: images, robot.txt, ...)
   */
  return NextResponse.next();
}
