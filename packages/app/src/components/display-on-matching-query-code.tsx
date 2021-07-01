import { useRouter } from 'next/router';
import { ReactNode } from 'react';

/**
 * This components reads the `code` value from the router's query. The children
 * will be rendered when that `code` matches the `code` on the props.
 *
 * It can be used for conditionally rendering components for a safety region or
 * municipality.
 */
export function DisplayOnMatchingQueryCode({
  children,
  code,
}: {
  children: ReactNode;
  code: string;
}) {
  const codes = code.toLowerCase().split(',');
  const codeFromQuery = (
    (useRouter().query.code as string) || ''
  ).toLowerCase();
  const isMatchingCode = codes.some((x) => codeFromQuery === x);

  return isMatchingCode ? <>{children}</> : null;
}
