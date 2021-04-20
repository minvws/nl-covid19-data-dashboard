import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Metadata, MetadataProps } from '~/components/content-header/metadata';
import { HeadingWithIcon } from '~/components/heading-with-icon';
import {
  Heading,
  HeadingLevel,
  InlineText,
  Text,
} from '~/components/typography';
import { Link } from '~/utils/link';
import { asResponsiveArray } from '~/style/utils';
import { Box } from '../base';

/*
  the left margin '-100w' and left padding '100w' hack ensures skip link anchors to have a (non visible) start at the left side of the screen.
  This fixes odd skip-link behavior in IE11

  Since this hack makes the part of the sidebar unclickable because the padding is overlapping it.
  This is fixed by first setting a pointer even none to the HeaderBox element if there is a skip-link and create
  a new child element with the PointerEventBox that resets the pointer-events again so it works as expected.
*/
const HeaderBox = styled.header<{
  hasIcon: boolean;
  skipLinkAnchor?: boolean;
}>((x) =>
  css({
    mt: 0,
    ml: x.skipLinkAnchor ? '-100vw' : undefined,
    pl: x.skipLinkAnchor ? '100vw' : undefined,
    pointerEvents: x.skipLinkAnchor ? 'none' : 'auto',
  })
);

interface HeaderProps {
  children: ReactNode;
  hasIcon: boolean;
  id?: string;
  skipLinkAnchor?: boolean;
}

const Header = (props: HeaderProps) => {
  const { hasIcon, children, skipLinkAnchor, id } = props;
  return (
    <HeaderBox id={id} hasIcon={hasIcon} skipLinkAnchor={skipLinkAnchor}>
      {skipLinkAnchor ? (
        <PointerEventsBox>{children}</PointerEventsBox>
      ) : (
        children
      )}
    </HeaderBox>
  );
};

export const CategoryHeading = styled(Heading)<{
  hide: boolean;
  hasIcon: boolean;
}>(
  css({
    fontSize: 3,
    fontWeight: 'bold',
    color: 'category',
    margin: 0,
    marginBottom: 1,
  }),
  (x) =>
    x.hide &&
    css({
      position: 'absolute',
      left: '-10000px',
      top: 'auto',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    }),
  (x) =>
    x.hasIcon &&
    css({
      marginLeft: 5,
    })
);

const AriaInlineText = styled(InlineText)(
  css({
    position: 'absolute',
    left: '-10000px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  })
);

const ReferenceBox = styled.div(
  css({
    maxWidth: '30em',
    marginRight: 3,
    flex: asResponsiveArray({ md: '1 1 auto', lg: '1 1 60%' }),
  })
);

const MetadataBox = styled(Box)(
  css({
    flex: asResponsiveArray({ md: '1 1 auto', lg: '1 1 40%' }),
  })
);

const PointerEventsBox = styled(Box)(
  css({
    pointerEvents: 'auto',
  })
);

export function ContentHeader(props: ContentHeaderProps) {
  const {
    hideCategory = false,
    category,
    screenReaderCategory,
    icon,
    title,
    subtitle,
    metadata,
    skipLinkAnchor,
    reference,
    headingLevel = 2,
    id,
  } = props;

  const hasIcon = icon !== undefined;

  return (
    <Header id={id} skipLinkAnchor={skipLinkAnchor} hasIcon={hasIcon}>
      <Box px={[3, null, 0]} spacing={1}>
        {category && (
          <CategoryHeading level={1} hide={hideCategory} hasIcon={hasIcon}>
            {category}
            {screenReaderCategory && (
              <AriaInlineText> - {screenReaderCategory}</AriaInlineText>
            )}
          </CategoryHeading>
        )}
        {title && (
          <>
            {icon ? (
              <HeadingWithIcon
                icon={icon}
                title={title}
                headingLevel={headingLevel}
              />
            ) : (
              <Box display="flex" flexWrap="nowrap" alignItems="center" mb={-2}>
                <Box>
                  <Heading level={headingLevel} mb={0}>
                    {title}
                  </Heading>
                </Box>
              </Box>
            )}
          </>
        )}

        <Box
          spacing={{ _: 3, md: 0 }}
          display="flex"
          flexDirection={['column', null, null, null, 'row']}
          ml={[null, null, null, hasIcon ? 5 : null]}
        >
          {reference && (
            <ReferenceBox>
              <Text m={0}>
                {subtitle}{' '}
                <Link href={reference.href}>
                  <Text as="a" href={reference.href}>
                    {reference.text}
                  </Text>
                </Link>
              </Text>
            </ReferenceBox>
          )}

          {metadata && (
            <MetadataBox>
              <Metadata {...metadata} accessibilitySubject={title} />
            </MetadataBox>
          )}
        </Box>
      </Box>
    </Header>
  );
}

interface ContentHeaderProps {
  id?: string;
  title?: string;
  subtitle?: string;
  metadata?: MetadataProps;
  reference?: {
    href: string;
    text: string;
  };
  category?: string;
  screenReaderCategory?: string;
  hideCategory?: boolean;
  icon?: JSX.Element;
  skipLinkAnchor?: boolean;
  headingLevel?: HeadingLevel;
}
