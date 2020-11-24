import css from '@styled-system/css';
import Link from 'next/link';
import {
  IContentHeaderMetadataProps,
  Metadata,
} from '~/components-styled/content-header-metadata';
import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { Heading, Text } from '~/components-styled/typography';
import { Box } from './base';

export function ContentHeader(props: IContentHeaderProps) {
  const { category, icon, title, subtitle, metadata, id, reference } = props;

  const cssRules: any = {
    '&[id]': {
      marginLeft: '-100vw',
      paddingLeft: '-100vw',
    },
  };
  if (!category) {
    cssRules.marginTop = '2rem';
  }
  if (!icon) {
    cssRules.marginLeft = '4rem';
  }

  return (
    <Box as="header" id={id} css={css(cssRules)}>
      {category && (
        <Text
          fontSize={3}
          fontWeight="600"
          color="category"
          margin={0}
          marginBottom={1}
          marginLeft={5}
        >
          {category}
        </Text>
      )}
      {icon && <HeadingWithIcon icon={icon} title={title} headingLevel={2} />}
      {!icon && <Heading level={2}>{title}</Heading>}

      <Box display={{ lg: 'flex' }} marginLeft={{ lg: 5 }}>
        <Box maxWidth="30em" marginRight={3} flex={{ lg: 'flex: 1 1 60%;' }}>
          <Text>
            {subtitle}{' '}
            <Link href={reference.href}>
              <Text as="a">{reference.text}</Text>
            </Link>
          </Text>
        </Box>

        <Box flex={{ lg: 'flex: 1 1 40%;' }}>
          <Metadata {...metadata} />
        </Box>
      </Box>
    </Box>
  );
}

interface IContentHeaderProps {
  title: string;
  subtitle: string;
  metadata: IContentHeaderMetadataProps;
  reference: {
    href: string;
    text: string;
  };
  category?: string;
  icon?: JSX.Element;
  id?: string;
}
