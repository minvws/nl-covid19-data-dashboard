// eslint-disable-next-line no-restricted-imports
import NextLink, { LinkProps } from 'next/link';
import { useIntl } from '~/intl';

/**
 * Link component which disables the default Next/Link scroll behavior
 */

export function Link(props: LinkProps & { children?: React.ReactNode }) {
  const defaultLocale = useIntl().locale ?? 'nl';
  const { locale = defaultLocale } = props;
  return <NextLink {...props} scroll={props.scroll ?? false} locale={locale} />;
}
