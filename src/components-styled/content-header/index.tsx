import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import {
  Metadata,
  MetadataProps,
} from '~/components-styled/content-header/metadata';
import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import {
  Heading,
  HeadingLevel,
  InlineText,
  Text,
} from '~/components-styled/typography';
import { Link } from '~/utils/link';
import { Box } from '../base';

/*
  the left margin '-100w' and left padding '100w' hack ensures skip link anchors to have a (non visible) start at the left side of the screen.
  This fixes odd skip-link behavior in IE11
*/
const HeaderBox = styled.header<{
  hasIcon: boolean;
  skipLinkAnchor?: boolean;
}>((x) =>
  css({
    mt: 0,
    ml: x.skipLinkAnchor ? '-100vw' : x.hasIcon ? undefined : 5,
    pl: x.skipLinkAnchor ? '100vw' : undefined,
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
      {children}
    </HeaderBox>
  );
};

export const CategoryHeading = styled(Heading)<{ hide: boolean }>(
  css({
    fontSize: 3,
    fontWeight: 'bold',
    color: 'category',
    margin: 0,
    marginBottom: 1,
    marginLeft: 5,
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

const ReferenceBox = styled(Box)(
  css({
    maxWidth: '30em',
    marginRight: 3,
    flex: [null, null, null, '1 1 60%'],
  })
);

const MetadataBox = styled(Box)(
  css({
    flex: [null, null, null, '1 1 40%'],
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

  return (
    <Header id={id} skipLinkAnchor={skipLinkAnchor} hasIcon={!!icon}>
      <Box px={[4, null, 0]} spacing={1}>
        {category && (
          <CategoryHeading level={1} hide={hideCategory}>
            {category}
            {screenReaderCategory && (
              <AriaInlineText> - {screenReaderCategory}</AriaInlineText>
            )}
          </CategoryHeading>
        )}
        {icon ? (
          <HeadingWithIcon
            icon={icon}
            title={title}
            headingLevel={headingLevel}
          />
        ) : (
          <Heading level={headingLevel} fontSize={4}>
            {title}
          </Heading>
        )}

        <Box
          spacing={3}
          display="flex"
          flexDirection={['column', null, null, null, 'row']}
          ml={[null, null, null, 5]}
        >
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

          <MetadataBox>{metadata && <Metadata {...metadata} />}</MetadataBox>
        </Box>
      </Box>
    </Header>
  );
}

interface ContentHeaderProps {
  id?: string;
  title: string;
  subtitle: string;
  metadata?: MetadataProps;
  reference: {
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
