import { colors } from '@corona-dashboard/common';
import { ChevronDown, ChevronRight, Warning } from '@corona-dashboard/icons';
import { ReactNode, isValidElement } from 'react';
import styled from 'styled-components';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { Markdown } from '~/components/markdown';
import { Anchor, BoldText, HeadingLevel } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { useIntl } from '~/intl';
import { mediaQueries, radii, space } from '~/style/theme';
import { RichContentBlock } from '~/types/cms';
import { useScopedWarning } from '~/utils/use-scoped-warning';
import { Header } from './components/header';
import { Metadata, MetadataProps } from './components/metadata';
import { PageLinks } from './components/page-links';

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
  pageInformationHeader?: {
    dataExplainedLink?: string;
    faqLink?: string;
  };
  onToggleArchived?: () => void;
}

export function PageInformationBlock({
  title,
  icon,
  description,
  pageLinks,
  metadata,
  referenceLink,
  id,
  category,
  screenReaderCategory,
  vrNameOrGmName,
  warning,
  isArchivedHidden,
  pageInformationHeader,
  onToggleArchived,
}: InformationBlockProps) {
  const scopedWarning = useScopedWarning(vrNameOrGmName || '', warning || '');
  const showArchivedToggleButton = typeof isArchivedHidden !== 'undefined' && typeof onToggleArchived !== 'undefined';
  const { commonTexts } = useIntl();

  const isPageInformationHeader = !!pageInformationHeader;

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
          <Box spacing={3} display="grid" gridTemplateColumns={{ md: 'repeat(2, 1fr)' }} style={{ gap: space[4] }}>
            <Box spacing={3}>
              {DescriptionBlock}
              {MetaDataBlock}
            </Box>

            {isPageInformationHeader && (
              <Box flex="1" display="flex" flexDirection="column" spacing={3}>
                {pageInformationHeader.dataExplainedLink && (
                  <PageInformationButton href={pageInformationHeader.dataExplainedLink}>
                    {/* TODO: add Lokalize keys for this */}
                    <BoldText>Meer informatie en databestanden</BoldText>
                    <p>Cijferverantwoording</p>
                    <ChevronRight />
                  </PageInformationButton>
                )}

                {pageInformationHeader.faqLink && (
                  <PageInformationButton href={`#${pageInformationHeader.faqLink}`}>
                    {/* TODO: add Lokalize keys for this */}
                    <BoldText>Vragen over dit onderwerp?</BoldText>
                    <p>FAQ</p>
                    <ChevronDown />
                  </PageInformationButton>
                )}
              </Box>
            )}
          </Box>

          {pageLinks && pageLinks.length && <PageLinks links={pageLinks} />}

          {showArchivedToggleButton && (
            <Box marginY={space[3]}>
              <ArchiveButton type="button" onClick={onToggleArchived} isActive={isArchivedHidden}>
                {!isArchivedHidden ? commonTexts.common.show_archived : commonTexts.common.hide_archived}
              </ArchiveButton>
            </Box>
          )}
        </Tile>
      )}
    </Box>
  );
}

interface TileProps {
  hasTitle?: boolean;
}

const Tile = styled.div<TileProps>`
  border-top: ${({ hasTitle }) => (!hasTitle ? `2px solid ${colors.gray2}` : undefined)};
  display: flex;
  flex-wrap: wrap;
  padding-top: ${({ hasTitle }) => (!hasTitle ? space[2] : undefined)};

  @media ${mediaQueries.sm} {
    padding-top: ${({ hasTitle }) => (!hasTitle ? space[3] : undefined)};
  }
`;

const MetadataBox = styled.div`
  flex: 1 1 auto;
  margin-bottom: ${space[3]};

  @media ${mediaQueries.md} {
    margin-bottom: 0;
  }

  @media ${mediaQueries.lg} {
    flex: 1 1 40%;
  }
`;

const PageInformationButton = styled(Anchor)`
  padding: ${space[3]} ${space[4]};
  border: 1px solid ${colors.gray3};
  background-color: ${colors.white};
  border-radius: ${radii[2]}px;
  text-align: left;
  cursor: pointer;
  position: relative;
  color: ${colors.black};

  svg {
    color: ${colors.primary};
    width: 24px;
    position: absolute;
    right: ${space[2]};
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

interface ArchiveButtonProps {
  isActive?: boolean;
}

const ArchiveButton = styled.button<ArchiveButtonProps>`
  background: ${({ isActive }) => (isActive ? colors.blue1 : colors.white)};
  border: 1px solid ${({ isActive }) => (isActive ? colors.transparent : colors.gray3)};
  border-radius: 5px;
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
