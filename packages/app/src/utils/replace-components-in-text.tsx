import { assert } from '~/utils/assert';
import { ReactNode, Fragment } from 'react';

/**
 * When lokalize hot reload is enabled we don't want to validate strings
 * client-side
 */
const shouldValidate =
  typeof window === 'undefined' ||
  process.env.NEXT_PUBLIC_HOT_RELOAD_LOKALIZE !== '1';

/**
 * Provided text can be filled with placeholders such as
 * `This is the {{exampleName}} example`
 * can be replaced with whatever ReactNode
 * is provided in `replacementMap.exampleName`.
 */
export function replaceComponentsInText(
  text: string,
  replacementMap: Record<string, ReactNode>
): ReactNode {
  // Regex captures eg "name" in "Hello {{name}}" for all placeholders
  // and parts becomes ["Hello", "name", ""]
  const parts = text.split(/\{\{([^}]+)\}\}/g);
  return (
    <>
      {parts.map((part, index) => {
        const isVariable = index % 2 === 1;

        if (isVariable && shouldValidate) {
          assert(
            replacementMap[part],
            `Replacement text or component ${part} is not provided.`
          );
        }

        const replacement = replacementMap[part] ?? `{{${part}}}`;

        return (
          <Fragment key={index}>{isVariable ? replacement : part}</Fragment>
        );
      })}
    </>
  );
}
