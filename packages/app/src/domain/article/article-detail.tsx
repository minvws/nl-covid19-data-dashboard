import ArrowIcon from '~/assets/arrow.svg';
import { Link } from '~/utils/link';
import siteText from '~/locale';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { Heading } from '~/components-styled/typography';
import { Article } from '~/types/cms';
import { RichContent } from '../cms/rich-content';
import { ReactNode } from 'react';
import css from '@styled-system/css';
import { Image } from '~/components-styled/cms/image-block';
import { formatDateFromMilliseconds } from '~/utils/formatDate';

interface ArticleDetailProps {
  article: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <Box bg="white" py={{ _: 4, md: 5 }}>
      <ContentBlock spacing={3}>
        <LinkWithIcon href="/artikelen" icon={<ArrowIcon />}>
          {siteText.article_detail.back_link.text}
        </LinkWithIcon>

        <Box spacing={2}>
          <Heading level={1} mb={0}>
            {article.title}
          </Heading>
          <time css={css({ color: 'gray' })} dateTime={article.publicationDate}>
            {formatDateFromMilliseconds(
              new Date(article.publicationDate).getTime(),
              'medium'
            )}
          </time>
        </Box>

        {article.intro && (
          <Box fontWeight="bold">
            <RichContent blocks={article.intro} />
          </Box>
        )}

        {article.cover && <Image node={article.cover} />}
      </ContentBlock>

      {!!article.content?.length && <RichContent blocks={article.content} />}
    </Box>
  );
}

function LinkWithIcon({
  href,
  icon,
  children,
}: {
  href: string;
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <Link href={href} passHref>
      <a
        css={css({
          display: 'inline-block',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        })}
      >
        <span
          css={css({
            svg: {
              height: '10px',
              width: '12px',
              transform: 'rotate(90deg)',
              marginRight: 3,
            },
          })}
        >
          {icon}
        </span>
        {children}
      </a>
    </Link>
  );
}
