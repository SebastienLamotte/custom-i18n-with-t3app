import Link from "@/lib/i18n/routing/Link";
import { getTranslator } from "@/lib/i18n/translations";
import type { PageProps } from "@/types/pageProps";

export default async function Home({ params: { lang } }: PageProps) {
  const t = await getTranslator(lang);

  return (
    <main>
      <Link href="/" lang={lang}>
        {t("test.testa", { num: "7", text: "ici " })}
      </Link>
    </main>
  );
}
