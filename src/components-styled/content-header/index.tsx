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
import { Box, BoxProps } from '../base';

const HeaderBox = styled.header<BoxProps>({
  '&[id]': {
    marginLeft: '-100vw',
    paddingLeft: '100vw',
  },
});

interface HeaderProps {
  id?: string;
  hasCategory: boolean;
  hasIcon: boolean;
  children: ReactNode;
}

const Header = (props: HeaderProps) => {
  const { hasCategory, hasIcon, children, id } = props;
  return (
    <HeaderBox
      id={id}
      marginTop={hasCategory ? undefined : 4}
      marginLeft={hasIcon ? undefined : 5}
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
    flex: [null, null, null, 'flex: 1 1 60%;'],
  })
);

const MetadataBox = styled(Box)(
  css({
    flex: [null, null, null, 'flex: 1 1 40%;'],
  })
);

export function ContentHeader(props: IContentHeaderProps) {
  const { category, icon, title, subtitle, metadata, id, reference } = props;

  return (
    <Header id={id} hasCategory={Boolean(category)} hasIcon={Boolean(icon)}>
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

        <MetadataBox>
          <Metadata {...metadata} />
        </MetadataBox>
      </BodyBox>
    </Header>
  );
}

interface IContentHeaderProps {
  title: string;
  subtitle: string;
  metadata: MetadataProps;
  reference: {
    href: string;
    text: string;
  };
  category?: string;
  icon?: JSX.Element;
  id?: string;
}
