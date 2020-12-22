import { assert } from "~/utils/assert";
import { ReactNode, Fragment } from "react";

export function replaceComponentsInText(text: string, replacementMap: Record<string, ReactNode | string | number>): ReactNode {
  const parts = text.split(/\{\{([^}]+)\}\}/g);
  return <>
    {parts.map((part, index) => {
      const variable = index % 2 === 1
      if (variable) {
        assert(replacementMap[part], `Replacement text or component ${part} is not provided.`);
      }
      return <Fragment key={index}>
        {variable ? replacementMap[part] : part}
      </Fragment>
    })}
  </>;
}
