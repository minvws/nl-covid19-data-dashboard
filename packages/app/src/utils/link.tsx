// eslint-disable-next-line no-restricted-imports
import NextLink, { LinkProps } from 'next/link';

/**
 * Link component which disables the default Next/Link scroll behavior
 */

export function Link(props: LinkProps & { children?: React.ReactNode }) {
  const { locale = false } = props;
  return (
    <NextLink
      {...props}
      prefetch={false}
      scroll={props.scroll ?? false}
      locale={locale}
    />
  );
}
