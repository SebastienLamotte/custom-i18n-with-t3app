import "server-only";
import { type Translator, getTranslation } from "./utils";
import { type LANGS, dictionaries } from "../config";

export type Lang = (typeof LANGS)[number];

export type DictionaryGetter = (typeof dictionaries)[Lang];

export async function getTranslator(lang: Lang): Promise<Translator> {
  const dict = await dictionaries[lang]();
  return (key, textVars) => getTranslation(key, dict, textVars);
}
