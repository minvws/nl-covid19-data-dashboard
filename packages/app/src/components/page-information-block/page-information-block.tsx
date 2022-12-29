import css from '@styled-system/css';
import { Warning } from '@corona-dashboard/icons';
import { isValidElement, ReactNode } from 'react';
import styled from 'styled-components';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { Markdown } from '~/components/markdown';
import { HeadingLevel } from '~/components/typography';
import { asResponsiveArray } from '~/style/utils';
import { RichContentBlock } from '~/types/cms';
import { Articles } from './components/articles';
import { Header } from './components/header';
import { Metadata, MetadataProps } from './components/metadata';
import { PageLinks } from './components/page-links';
import { WarningTile } from '~/components/warning-tile';
import { useScopedWarning } from '~/utils/use-scoped-warning';
import { useIntl } from '~/intl';
import { colors } from '@corona-dashboard/common';
import { space } from '~/style/theme';

interface InformationBlockProps {
  title?: string;
  icon?: JSX.Element;
  description?: string | RichContentBlock[] | ReactNode;
  articles?: ArticleSummary[] | null;
  pageLinks?:
    | {
        title: string;
        href: string;
      }[]
    | null;
  headingLevel?: HeadingLevel;
  metadata?: MetadataProps;
  referenceLink?: string;
  id?: string;
  category?: string;
  screenReaderCategory?: string;
  vrNameOrGmName?: string;
  warning?: string;
  isArchivedHidden?: boolean;
  onToggleArchived?: () => void;
}

export function PageInformationBlock({
  title,
  icon,
  description,
  articles,
  pageLinks,
  metadata,
  referenceLink,
  id,
  category,
  screenReaderCategory,
  vrNameOrGmName,
  warning,
  isArchivedHidden,
  onToggleArchived,
}: InformationBlockProps) {
  const scopedWarning = useScopedWarning(vrNameOrGmName || '', warning || '');
  const showArchivedToggleButton = typeof isArchivedHidden !== 'undefined' && typeof onToggleArchived !== 'undefined';
  const { commonTexts } = useIntl();

  const MetaDataBlock = metadata ? (
    <MetadataBox>
      <Metadata {...metadata} accessibilitySubject={title} referenceLink={referenceLink} />
    </MetadataBox>
  ) : null;

  const DescriptionBlock = description ? (
    <Box maxWidth="maxWidthText">
      {isValidElement(description) ? (
        description
      ) : typeof description === 'string' ? (
        <Markdown content={description} />
      ) : (
        <RichContent blocks={description as RichContentBlock[]} />
      )}
    </Box>
  ) : null;

  return (
    <Box as="header" id={id} spacing={{ _: 3, md: 4 }}>
      {title && <Header icon={icon} title={title} category={category} screenReaderCategory={screenReaderCategory} />}
      {scopedWarning && <WarningTile variant="emphasis" message={scopedWarning} icon={Warning} isFullWidth />}

      {description && (
        <Tile hasTitle={!!title}>
          <Box spacing={3} width="100%">
            <Box
              display={{ md: 'grid' }}
              gridTemplateColumns="repeat(2, 1fr)"
              width="100%"
              spacing={{
                _: pageLinks && pageLinks.length ? 0 : 3,
                md: 0,
              }}
              css={css({
                columnGap: 5,
              })}
            >
              {articles && articles.length ? (
                <>
                  <Box spacing={3}>
                    {DescriptionBlock}
                    {MetaDataBlock}
                  </Box>

                  <Articles articles={articles} />
                </>
              ) : (
                <>
                  {DescriptionBlock}
                  {MetaDataBlock}
                </>
              )}
            </Box>

            {pageLinks && pageLinks.length && <PageLinks links={pageLinks} />}
          </Box>
          <Box my={3}>
            {showArchivedToggleButton && (
              <StyledArchiveButton type="button" onClick={onToggleArchived} isActive={isArchivedHidden}>
                {!isArchivedHidden ? commonTexts.common.show_archived : commonTexts.common.hide_archived}
              </StyledArchiveButton>
            )}
          </Box>
        </Tile>
      )}
    </Box>
  );
}

const Tile = styled.div<{ hasTitle?: boolean }>((x) =>
  css({
    pt: x.hasTitle ? undefined : asResponsiveArray({ _: 2, sm: 3 }),
    display: 'flex',
    flexWrap: 'wrap',
    borderTop: x.hasTitle ? undefined : 'solid 2px gray2',
  })
);

const MetadataBox = styled.div(
  css({
    flex: asResponsiveArray({ md: '1 1 auto', lg: '1 1 40%' }),
    mb: asResponsiveArray({ _: 3, md: 0 }),
  })
);

interface StyledArchiveButtonProps {
  isActive?: boolean;
}

const StyledArchiveButton = styled.button<StyledArchiveButtonProps>`
  background: ${({ isActive }) => (isActive ? colors.blue1 : colors.white)};
  border: ${({ isActive }) => (isActive ? colors.transparent : colors.gray3)};
  border-radius: 5px;
  border-style: solid;
  border-width: 1px;
  color: ${({ isActive }) => (isActive ? colors.blue8 : colors.blue8)};
  cursor: pointer;
  min-height: 36px;
  padding: 12px ${space[3]};

  &:hover {
    background: ${colors.blue8};
    color: ${colors.white};
    border-color: ${colors.transparent};
  }

  &:hover:focus-visible {
    outline: 2px dotted ${colors.magenta3};
  }
`;
