import { assert } from '~/utils/assert';
import { ReactNode, Fragment } from 'react';

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
        const variable = index % 2 === 1;
        if (variable) {
          assert(
            replacementMap[part],
            `Replacement text or component ${part} is not provided.`
          );
        }
        return (
          <Fragment key={index}>
            {variable ? replacementMap[part] : part}
          </Fragment>
        );
      })}
    </>
  );
}
