import css from '@styled-system/css';
import Link from 'next/link';
import { ReactNode } from 'react';
import styled from 'styled-components';
import {
  Metadata,
  MetadataProps,
} from '~/components-styled/content-header/metadata';
import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { Heading, Text } from '~/components-styled/typography';
import { Box } from '../base';

/*
  the left margin '-100w' and left padding '100w' hack ensures skip link anchors to have a (non visible) start at the left side of the screen.
  This fixes odd skip-link behavior in IE11
*/
const HeaderBox = styled.header<{
  hasCategory: boolean;
  hasIcon: boolean;
  skipLinkAnchor: boolean;
}>((x) =>
  css({
    mt: x.hasCategory ? undefined : 4,
    ml: x.skipLinkAnchor ? '-100vw' : x.hasIcon ? undefined : 5,
    pl: x.skipLinkAnchor ? '100vw' : undefined,
  })
);

interface HeaderProps {
  id?: string;
  skipLinkAnchor?: boolean;
  hasCategory: boolean;
  hasIcon: boolean;
  children: ReactNode;
}

const Header = (props: HeaderProps) => {
  const { hasCategory, hasIcon, children, skipLinkAnchor, id } = props;
  return (
    <HeaderBox
      id={id}
      hasCategory={hasCategory}
      hasIcon={hasIcon}
      skipLinkAnchor={Boolean(skipLinkAnchor)}
    >
      {children}
    </HeaderBox>
  );
};

const CategoryText = styled(Text)(
  css({
    fontSize: 3,
    fontWeight: 'bold',
    color: 'category',
    margin: 0,
    marginBottom: 1,
    marginLeft: 5,
  })
);

const BodyBox = styled(Box)(
  css({
    display: [null, null, null, 'flex'],
    marginLeft: [null, null, null, 5],
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
    category,
    icon,
    title,
    subtitle,
    metadata,
    skipLinkAnchor,
    reference,
    id,
  } = props;

  return (
    <Header
      id={id}
      skipLinkAnchor={skipLinkAnchor}
      hasCategory={Boolean(category)}
      hasIcon={Boolean(icon)}
    >
      {category && <CategoryText>{category}</CategoryText>}
      {icon ? (
        <HeadingWithIcon icon={icon} title={title} headingLevel={2} />
      ) : (
        <Heading level={2}>{title}</Heading>
      )}

      <BodyBox>
        <ReferenceBox>
          <Text>
            {subtitle}{' '}
            <Link href={reference.href}>
              <Text as="a" href={reference.href}>
                {reference.text}
              </Text>
            </Link>
          </Text>
        </ReferenceBox>

        <MetadataBox>{metadata && <Metadata {...metadata} />}</MetadataBox>
      </BodyBox>
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
  icon?: JSX.Element;
  skipLinkAnchor?: boolean;
}
