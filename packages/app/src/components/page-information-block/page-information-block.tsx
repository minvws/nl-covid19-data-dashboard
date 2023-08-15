import { colors } from '@corona-dashboard/common';
import { ChevronDown, ChevronRight, Warning } from '@corona-dashboard/icons';
import { ReactNode, isValidElement } from 'react';
import styled from 'styled-components';
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
    dataExplained?: {
      button: {
        header: string;
        text: RichContentBlock[];
      };
      link: string;
    };
    faq?: {
      button: {
        header: string;
        text: RichContentBlock[];
      };
      link: string;
    };
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

  const hasPageInformationHeader = !!pageInformationHeader;

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
          <Grid>
            <Box spacing={3}>
              {DescriptionBlock}
              {MetaDataBlock}
            </Box>

            {hasPageInformationHeader && (
              <Box flex="1" display="flex" flexDirection="column" spacing={3}>
                {pageInformationHeader.dataExplained && (
                  <PageInformationButton href={pageInformationHeader.dataExplained.link}>
                    <BoldText>{pageInformationHeader.dataExplained.button.header}</BoldText>
                    <RichContent blocks={pageInformationHeader.dataExplained.button.text} />

                    <ChevronRight class="arrow" />
                  </PageInformationButton>
                )}

                {pageInformationHeader.faq && (
                  <PageInformationButton href={`#${pageInformationHeader.faq.link}`}>
                    <BoldText>{pageInformationHeader.faq.button.header}</BoldText>
                    <RichContent blocks={pageInformationHeader.faq.button.text} />

                    <ChevronDown />
                  </PageInformationButton>
                )}
              </Box>
            )}
          </Grid>

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

const Grid = styled(Box)`
  display: grid;

  @media ${mediaQueries.md} {
    gap: ${space[4]};
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PageInformationButton = styled(Anchor)`
  background-color: ${colors.white};
  border-radius: ${radii[2]}px;
  border: 1px solid ${colors.gray3};
  color: ${colors.black};
  cursor: pointer;
  padding: ${space[3]} ${space[3]} ${space[3]} ${space[4]};
  position: relative;
  text-align: left;
  display: inline-grid;
  grid-template-columns: 3fr 3fr 1.25fr;
  grid-template-rows: 1fr;
  column-gap: ${space[5]};

  
  @media ${mediaQueries.xs} {
    grid-template-columns: 4fr 4fr 1fr;

  }


  @media ${mediaQueries.sm} {
    grid-template-columns: 5fr 5fr 0.75fr;

  }

  @media ${mediaQueries.md} {
    grid-template-columns: 3fr 3fr 2.25fr;

  }

  @media ${mediaQueries.lg} {
    grid-template-columns: 4fr 4fr 1.5fr;

  }


  p, strong {
    grid-column-start: 1;
    grid-column-end: 3;
  }

  svg {
    color: ${colors.primary};
    grid-column-start: 3;
    grid-column-end: 3;
    width: 24px;
    transform: translate(-10%, -50%);
    display: block;
    margin-top: auto:
  }

  .underline {
    text-decoration: underline;
  }
`;

interface ArchiveButtonProps {
  isActive?: boolean;
}

const ArchiveButton = styled.button<ArchiveButtonProps>`
  background: ${({ isActive }) => (isActive ? colors.blue1 : colors.white)};
  border-radius: 5px;
  border: 1px solid ${({ isActive }) => (isActive ? colors.transparent : colors.gray3)};
  color: ${({ isActive }) => (isActive ? colors.blue8 : colors.blue8)};
  cursor: pointer;
  min-height: 36px;
  padding: 12px ${space[3]};

  &:hover {
    background: ${colors.blue8};
    border-color: ${colors.transparent};
    color: ${colors.white};
  }

  &:hover:focus-visible {
    outline: 2px dotted ${colors.magenta3};
  }
`;
