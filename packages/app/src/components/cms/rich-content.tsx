import {
  AgeDemographicConfiguration,
  ChartConfiguration,
  ChoroplethConfiguration,
  DataScope,
  DataScopeKey,
  DonutChartConfiguration,
  KpiConfiguration,
  MetricKeys,
} from '@corona-dashboard/common';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import css from '@styled-system/css';
import { Fragment, FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { CollapsibleSection } from '~/components/collapsible';
import { ErrorBoundary } from '~/components/error-boundary';
import { ExternalLink } from '~/components/external-link';
import { useIntl } from '~/intl';
import { getFileSrc, PortableText } from '~/lib/sanity';
import { nestedHtml } from '~/style/preset';
import { asResponsiveArray } from '~/style/utils';
import { ImageBlock, InlineAttachment, InlineCollapsibleList, InlineLink, RichContentImageBlock } from '~/types/cms';
import { assert } from '~/utils/assert';
import { isInternalUrl } from '~/utils/is-internal-url';
import { Link } from '~/utils/link';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { Heading } from '../typography';
import { ContentImage } from './content-image';
import { InlineAgeDemographic } from './inline-age-demographic';
import { InlineChoropleth } from './inline-choropleth';
import { InlineDonutChart } from './inline-donut-chart';
import { InlineKpi } from './inline-kpi';
import { InlineTimeSeriesCharts } from './inline-time-series-charts';
import { ChevronRight, Download, External as ExternalLinkIcon } from '@corona-dashboard/icons';

type ElementAlignment = 'start' | 'center' | 'end' | 'stretch';

interface RichContentProps {
  blocks: PortableTextEntry[];
  contentWrapper?: FunctionComponent;
  imageSizes?: number[][];
  elementAlignment?: ElementAlignment;
}

interface ChartConfigNode {
  title: string;
  startDate?: string;
  endDate?: string;
  config: ChartConfiguration<DataScopeKey, MetricKeys<DataScope>>;
}

interface AgeDemographicConfigNode {
  title: string;
  startDate?: string;
  endDate?: string;
  config: AgeDemographicConfiguration<DataScopeKey, MetricKeys<DataScope>, AccessibilityDefinition['key']>;
}

interface ChoroplethConfigNode {
  title: string;
  config: ChoroplethConfiguration<DataScopeKey, MetricKeys<DataScope>>;
}

interface DonutConfigNode {
  title: string;
  startDate?: string;
  endDate?: string;
  config: DonutChartConfiguration<DataScopeKey, MetricKeys<DataScope>>;
}

interface KpiConfigNode {
  endDate?: string;
  config: KpiConfiguration;
}

interface KpisConfigNode {
  _type: string;
  kpis: KpiConfigNode[];
}

export function RichContent({ contentWrapper, blocks, imageSizes, elementAlignment }: RichContentProps) {
  const ContentWrapper = contentWrapper ?? Fragment;
  const serializers = {
    types: {
      inlineBlock: (props: unknown) => {
        assert(PortableText.defaultSerializers.types?.inlineBlock, `[${RichContent.name}] PortableText needs to provide a serializer for inlineBlock content`);
        return <ContentWrapper>{PortableText.defaultSerializers.types.inlineBlock(props)}</ContentWrapper>;
      },
      block: (props: unknown) => {
        assert(PortableText.defaultSerializers.types?.block, `[${RichContent.name}] PortableText needs to provide a serializer for block content`);
        return <ContentWrapper>{PortableText.defaultSerializers.types.block(props)}</ContentWrapper>;
      },
      image: (props: { node: ImageBlock | RichContentImageBlock }) => <ContentImage contentWrapper={contentWrapper} sizes={imageSizes} {...props} />,

      inlineCollapsible: (props: { node: InlineCollapsibleList }) => {
        if (!props.node.content.inlineBlockContent) return null;

        return (
          <ContentWrapper>
            <CollapsibleSection summary={props.node.title}>
              <Box
                py={3}
                css={css({
                  '> div > p': { width: '100%' },

                  /** This is for removing the inline charts default padding
                   * and aligning the KPI's at the start of the flow
                   */
                  '> div > div': {
                    px: 0,
                    alignSelf: 'flex-start',
                    width: '100%',
                  },
                })}
              >
                <RichContent blocks={props.node.content.inlineBlockContent} />
              </Box>
            </CollapsibleSection>
          </ContentWrapper>
        );
      },
      dashboardChart: (props: { node: ChartConfigNode }) => {
        const node = props.node;

        return (
          <Box
            css={css({
              maxWidth: 'infoWidth',
              width: '100%',
              px: asResponsiveArray({ _: 4, md: undefined }),
              pb: 4,
            })}
          >
            <Box pb={4}>
              <Heading level={3} as="h4">
                {node.title}
              </Heading>
            </Box>
            <InlineTimeSeriesCharts configuration={node.config} startDate={node.startDate} endDate={node.endDate} />
          </Box>
        );
      },
      dashboardAgeDemographicChart: (props: { node: AgeDemographicConfigNode }) => {
        const node = props.node;

        return (
          <Box
            css={css({
              maxWidth: 'infoWidth',
              width: '100%',
              px: asResponsiveArray({ _: 4, md: undefined }),
              pb: 4,
            })}
          >
            <Box pb={4}>
              <Box pb={4}>
                <Heading level={3} as="h4">
                  {node.title}
                </Heading>
              </Box>
              <InlineAgeDemographic configuration={node.config} startDate={node.startDate} endDate={node.endDate} />
            </Box>
          </Box>
        );
      },
      dashboardChoropleth: (props: { node: ChoroplethConfigNode }) => {
        const node = props.node;

        return (
          <ContentWrapper>
            <Box pb={4}>
              <Box pb={4}>
                <Heading level={3} as="h4">
                  {node.title}
                </Heading>
              </Box>

              <InlineChoropleth configuration={node.config} title={node.title} />
            </Box>
          </ContentWrapper>
        );
      },
      dashboardDonut: (props: { node: DonutConfigNode }) => {
        const node = props.node;

        return (
          <ContentWrapper>
            <Box pb={4}>
              <Box pb={4}>
                <Heading level={3} as="h4">
                  {node.title}
                </Heading>
              </Box>

              <InlineDonutChart configuration={node.config} startDate={node.startDate} endDate={node.endDate} />
            </Box>
          </ContentWrapper>
        );
      },
      dashboardKpi: (props: { node: KpiConfigNode }) => {
        const node = props.node;

        return (
          <ContentWrapper>
            <InlineKpi configuration={node.config} date={node.endDate} />
          </ContentWrapper>
        );
      },
      dashboardKpis: (props: { node: KpisConfigNode }) => {
        const kpiLeft = props.node.kpis[0];
        const kpiRight = props.node.kpis[1];

        return (
          <ContentWrapper>
            <Box spacing={{ _: 4, md: 2 }} display="flex" py={3} flexDirection={{ _: 'column', md: 'row' }}>
              <InlineKpi configuration={kpiLeft.config} date={kpiLeft.endDate} />
              <InlineKpi configuration={kpiRight.config} date={kpiRight.endDate} />
            </Box>
          </ContentWrapper>
        );
      },
    },
    marks: {
      inlineAttachment: InlineAttachmentMark,
      link: InlineLinkMark,
    },
  };

  return (
    <ErrorBoundary>
      <StyledPortableText blocks={blocks} serializers={serializers} elementAlignment={elementAlignment} />
    </ErrorBoundary>
  );
}

function InlineAttachmentMark(props: { children: ReactNode; mark: InlineAttachment }) {
  if (!props.mark.asset) return <>{props.children}</>;

  return (
    <a css={css({ textDecoration: 'underline' })} download href={getFileSrc(props.mark.asset)}>
      {props.children} <Download width={15} height={11} />
    </a>
  );
}

function InlineLinkMark(props: { children: ReactNode; mark: InlineLink }) {
  const { mark, children } = props;

  const { locale } = useIntl();

  if (!mark.href) return <>{children}</>;

  return isInternalUrl(mark.href) ? (
    <Link href={mark.href} passHref locale={locale}>
      <a css={css({ textDecoration: 'underline' })}>
        {children} <ChevronRight width={10} height={10} />
      </a>
    </Link>
  ) : (
    <ExternalLink href={mark.href} underline>
      {children}
      <ExternalLinkIcon width={20} height={11} />
    </ExternalLink>
  );
}

const StyledPortableText = styled(PortableText)<{
  elementAlignment?: ElementAlignment;
}>(({ elementAlignment }) =>
  css({
    ...nestedHtml,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: elementAlignment ? elementAlignment : 'center',

    '& > ul': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
    },
  })
);
