import { match } from "@formatjs/intl-localematcher";
import { NextResponse, type NextRequest } from "next/server";
import { routeFr, routeEn, LANGS, DEFAULT_LANG } from "../config";
import type { Lang } from "../translations";
import Negotiator from "negotiator";

function getLang(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  try {
    return match(languages, LANGS, DEFAULT_LANG) as Lang;
  } catch (err) {
    return DEFAULT_LANG;
  }
}

export function getLangPathname(
  request: NextRequest,
  pathname: string,
  langDetection?: boolean,
) {
  const routes = { fr: routeFr, en: routeEn } as Record<Lang, string[]>;

  let lang: Lang | undefined;
  const langCookieValue = request.cookies.get("lang")?.value ?? "";
  if (LANGS.includes(langCookieValue)) {
    lang = langCookieValue as Lang;
  } else if (langDetection) {
    lang = getLang(request);
  }

  if (lang) {
    const index = routes[lang].indexOf(pathname);
    if (index !== -1) {
      return {
        langFound: lang,
        pathnameInEnglish: routes.en[index],
        isPathnameUnique: true,
      };
    }
    return {};
  }

  const pathnameInfos = LANGS.reduce(
    (acc, lang) => {
      const index = routes[lang].indexOf(pathname);

      if (index !== -1) {
        acc.langFound = lang;
        acc.pathnameInEnglish = routes.en[index]!;
        acc.isPathnameUnique = !acc.langFound;
      }

      return acc;
    },
    {} as {
      langFound?: Lang;
      pathnameInEnglish?: string;
      isPathnameUnique?: boolean;
    },
  );

  if (!pathnameInfos.langFound) {
    console.log(`${pathname} skipped by i18n`);
  }
  return pathnameInfos;
}

export function getResponseForPrefixedUrl(
  request: NextRequest,
  pathname: string,
  lang: Lang,
  hasLangPrefixOption: boolean,
) {
  const canRemoveLangPrefix = !hasLangPrefixOption && lang === DEFAULT_LANG;
  const response = canRemoveLangPrefix
    ? NextResponse.redirect(
        new URL(pathname.replace(`/${DEFAULT_LANG}`, "") || "/", request.url),
      )
    : NextResponse.next();

  response.cookies.set("lang", lang, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export function getResponseForUrlWithoutPrefix(
  request: NextRequest,
  langPathnameInfos: {
    langFound: Lang;
    pathnameInEnglish: string;
    isPathnameUnique: boolean;
  },
  hasLangPrefixOption: boolean,
) {
  const { langFound, pathnameInEnglish, isPathnameUnique } = langPathnameInfos;
  const shouldUrlBeWithoutPrefix =
    !hasLangPrefixOption && langFound === DEFAULT_LANG;

  const response = shouldUrlBeWithoutPrefix
    ? NextResponse.rewrite(
        new URL(`/${DEFAULT_LANG}${pathnameInEnglish}`, request.url),
      )
    : NextResponse.redirect(
        new URL(
          `/${isPathnameUnique ? langFound : DEFAULT_LANG}${pathnameInEnglish}`,
          request.url,
        ),
      );

  response.cookies.set("lang", langFound, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
