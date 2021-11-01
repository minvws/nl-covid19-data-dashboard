import {
  ChartConfiguration,
  DataScope,
  DataScopeKey,
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
import {
  ImageBlock,
  InlineAttachment,
  InlineCollapsibleList,
  InlineLink,
  RichContentImageBlock,
} from '~/types/cms';
import { assert } from '~/utils/assert';
import { isAbsoluteUrl } from '~/utils/is-absolute-url';
import { Link } from '~/utils/link';
import { Heading } from '../typography';
import { ContentImage } from './content-image';
import { InlineKpi } from './inline-kpi';
import { InlineTimeSeriesCharts } from './inline-time-series-charts';

interface RichContentProps {
  blocks: PortableTextEntry[];
  contentWrapper?: FunctionComponent;
  imageSizes?: number[][];
}

interface ChartConfigNode {
  chart: {
    _type: string;
  };
}

interface KpiConfigNode {
  kpi: {
    _type: string;
  };
}

interface KPI {
  endDate?: string;
  config: KpiConfiguration;
}
interface KpisConfigNode {
  _type: string;
  kpis: KPI[];
}

export function RichContent({
  contentWrapper,
  blocks,
  imageSizes,
}: RichContentProps) {
  const ContentWrapper = contentWrapper ?? Fragment;
  const serializers = {
    types: {
      inlineBlock: (props: unknown) => {
        assert(
          PortableText.defaultSerializers.types?.inlineBlock,
          'PortableText needs to provide a serializer for inlineBlock content'
        );
        return (
          <ContentWrapper>
            {PortableText.defaultSerializers.types.inlineBlock(props)}
          </ContentWrapper>
        );
      },
      block: (props: unknown) => {
        assert(
          PortableText.defaultSerializers.types?.block,
          'PortableText needs to provide a serializer for block content'
        );
        return (
          <ContentWrapper>
            {PortableText.defaultSerializers.types.block(props)}
          </ContentWrapper>
        );
      },
      image: (props: { node: ImageBlock | RichContentImageBlock }) => (
        <ContentImage
          contentWrapper={contentWrapper}
          sizes={imageSizes}
          {...props}
        />
      ),
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
        const node = props.node as unknown as {
          title: string;
          startDate?: string;
          endDate?: string;
          config: ChartConfiguration<DataScopeKey, MetricKeys<DataScope>>;
        };

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
            <InlineTimeSeriesCharts
              configuration={node.config}
              startDate={node.startDate}
              endDate={node.endDate}
            />
          </Box>
        );
      },
      dashboardKpi: (props: { node: KpiConfigNode }) => {
        const kpi = props.node as unknown as KPI;

        return (
          <ContentWrapper>
            <InlineKpi configuration={kpi.config} date={kpi.endDate} />
          </ContentWrapper>
        );
      },
      dashboardKpis: (props: { node: KpisConfigNode }) => {
        const kpiLeft = props.node.kpis[0];
        const kpiRight = props.node.kpis[1];

        return (
          <ContentWrapper>
            <Box
              spacing={{ _: 4, md: 2 }}
              display="flex"
              py={3}
              flexDirection={{ _: 'column', md: 'row' }}
            >
              <InlineKpi
                configuration={kpiLeft.config}
                date={kpiLeft.endDate}
              />
              <InlineKpi
                configuration={kpiRight.config}
                date={kpiRight.endDate}
              />
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
      <StyledPortableText blocks={blocks} serializers={serializers} />
    </ErrorBoundary>
  );
}

function InlineAttachmentMark(props: {
  children: ReactNode;
  mark: InlineAttachment;
}) {
  if (!props.mark.asset) return <>{props.children}</>;

  return (
    <a download href={getFileSrc(props.mark.asset)}>
      {props.children}
    </a>
  );
}

function InlineLinkMark(props: { children: ReactNode; mark: InlineLink }) {
  const { mark, children } = props;

  const { locale } = useIntl();

  if (!mark.href) return <>{children}</>;

  return isAbsoluteUrl(mark.href) ? (
    <ExternalLink href={mark.href}>{children}</ExternalLink>
  ) : (
    <Link href={mark.href} passHref locale={locale}>
      <a>{children}</a>
    </Link>
  );
}

const StyledPortableText = styled(PortableText)(
  css({
    ...nestedHtml,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > ul': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
    },
  })
);
