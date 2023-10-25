import { objectEntries } from "@/lib/utils";
import type { DictionaryGetter } from ".";

type Dictionary = Awaited<ReturnType<DictionaryGetter>>;
export type Translator = (
  key: StringifiedPaths<Dictionary>,
  textVars?: Record<string, string>,
) => string;

type StringifiedPaths<TObj> = TObj extends object
  ? {
      [K in keyof TObj & string]: K extends string
        ? TObj[K] extends object
          ? `${K}.${StringifiedPaths<TObj[K]>}`
          : K
        : never;
    }[keyof TObj & string]
  : "";

type NestedObjectOf<T> = T | { [key: string]: NestedObjectOf<T> };

export function getFromDictionnary(
  keys: string[],
  dict: Dictionary | NestedObjectOf<Dictionary> | string | undefined,
): Record<string, string> | string {
  if (typeof dict === "string") return dict;
  if (keys.length === 0 || !dict) return "";
  const key = keys.shift() ?? "";
  return getFromDictionnary(
    keys,
    (dict as Record<string, NestedObjectOf<Dictionary>>)[key],
  );
}

export function getTranslation(
  key: string,
  dict: Dictionary,
  textVars?: Record<string, string>,
) {
  if (!key) return "";
  const keys = key.split(".");
  let text = getFromDictionnary(keys, dict) as string | undefined;
  if (!text) return key;
  if (textVars && typeof textVars === "object") {
    const varsEntries = objectEntries(textVars);
    for (const [textVarKey, textVarValue] of varsEntries) {
      if (text.includes(`{${textVarKey}}`)) {
        text = text.replace(`{${textVarKey}}`, textVarValue);
      }
    }
  }
  return text;
}
