import css from '@styled-system/css';
import Link from 'next/link';
import { ReactNode } from 'react';
import styled from 'styled-components';
import {
  Metadata,
  MetadataProps,
} from '~/components-styled/content-header/metadata';
import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { Heading, HeadingLevel, Text } from '~/components-styled/typography';
import { Box } from '../base';

/*
  the left margin '-100w' and left padding '100w' hack ensures skip link anchors to have a (non visible) start at the left side of the screen.
  This fixes odd skip-link behavior in IE11
*/
const HeaderBox = styled.header<{
  hasIcon: boolean;
  skipLinkAnchor: boolean;
}>((x) =>
  css({
    mt: 0,
    ml: x.skipLinkAnchor ? '-100vw' : x.hasIcon ? undefined : 5,
    pl: x.skipLinkAnchor ? '100vw' : undefined,
  })
);

interface HeaderProps {
  skipLinkAnchor?: boolean;
  hasIcon: boolean;
  children: ReactNode;
}

const Header = (props: HeaderProps) => {
  const { hasIcon, children, skipLinkAnchor } = props;
  return (
    <HeaderBox hasIcon={hasIcon} skipLinkAnchor={Boolean(skipLinkAnchor)}>
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
    headingLevel = 1,
  } = props;

  return (
    <Header skipLinkAnchor={skipLinkAnchor} hasIcon={Boolean(icon)}>
      {category && <CategoryText>{category}</CategoryText>}
      {icon ? (
        <HeadingWithIcon
          icon={icon}
          title={title}
          headingLevel={headingLevel}
        />
      ) : (
        <Heading level={headingLevel}>{title}</Heading>
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

        <MetadataBox>
          <Metadata {...metadata} />
        </MetadataBox>
      </BodyBox>
    </Header>
  );
}

interface ContentHeaderProps {
  title: string;
  subtitle: string;
  metadata: MetadataProps;
  reference: {
    href: string;
    text: string;
  };
  category?: string;
  icon?: JSX.Element;
  skipLinkAnchor?: boolean;
  headingLevel?: HeadingLevel;
}
