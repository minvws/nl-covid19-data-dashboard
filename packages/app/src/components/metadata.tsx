import { Box } from './base';
import { Calendar, Clock, Database, External as ExternalLinkIcon } from '@corona-dashboard/icons';
import { colors } from '@corona-dashboard/common';
import { ExternalLink } from '~/components/external-link';
import { InlineText, Text } from './typography';
import { MarginBottomProps } from 'styled-system';
import { Markdown } from '~/components/markdown';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { space } from '~/style/theme';
import { useIntl } from '~/intl';
import css from '@styled-system/css';
import React from 'react';
import styled from 'styled-components';

type source = {
  text: string;
  href: string;
  aria_text?: string;
};

export interface DateRange {
  start: number;
  end: number;
}

export interface MetadataProps extends MarginBottomProps {
  date?: number | DateRange | string;
  source?: source;
  dataSources?: source[];
  obtainedAt?: number;
  isTileFooter?: boolean;
  datumsText?: string;
  intervalCount?: string;
  disclaimer?: string;

  //Metadata enhacements
  timeInterval?: DateRange;
  dateOfInsertion?: number;
  isArchivedGraph?: boolean;
}

export function Metadata({
  dataSources,
  date,
  dateOfInsertion,
  datumsText,
  disclaimer,
  intervalCount,
  isArchivedGraph = false,
  isTileFooter,
  marginBottom,
  obtainedAt,
  source,
  timeInterval,
}: MetadataProps) {
  const { commonTexts, formatDateFromSeconds } = useIntl();

  const dateString =
    typeof date === 'number'
      ? replaceVariablesInText(commonTexts.common.metadata.date, {
          date: formatDateFromSeconds(date, 'axis-with-year'),
        })
      : typeof date === 'string'
      ? date
      : date && date.start && date.end
      ? replaceVariablesInText(commonTexts.common.metadata.date_from_to, {
          startDate: formatDateFromSeconds(date.start, 'weekday-long'),
          endDate: formatDateFromSeconds(date.end, 'weekday-long'),
        })
      : null;

  const intervalString =
    intervalCount &&
    replaceVariablesInText(commonTexts.common.metadata.interval, {
      count: intervalCount,
    });

  return (
    <>
      {!isTileFooter && source && (
        <Text color="gray7" variant="label1">
          {`${dateString} - ${commonTexts.common.metadata.source}: `}
          <ExternalLink ariaLabel={source.aria_text} href={source.href}>
            {source.text}
            <ExternalLinkIcon width={space[3]} height={space[2]} />
          </ExternalLink>
        </Text>
      )}

      {isTileFooter && (
        /**
         * @TODO Clean up the negative margin by passing the Metadata instance
         * to the Tile via props and position it there properly.
         * @TODO split up the `isTileFooter` vs non `isTileFooter` implementations,
         * should be separate components.
         */
        <Box as="footer" marginTop={space[3]} marginBottom={marginBottom || { _: '0', sm: `-${space[3]}` }} gridArea="metadata">
          <Text color="gray7" variant="label1">
            {datumsText && Array.isArray(date) ? (
              replaceVariablesInText(datumsText, {
                weekStart: formatDateFromSeconds(date[0], 'weekday-long'),
                weekEnd: formatDateFromSeconds(date[1], 'weekday-long'),
              })
            ) : (
              <>
                {timeInterval && (
                  <Box display="flex" alignItems="flex-start" color="gray7">
                    <Icon>
                      <Calendar aria-hidden color={colors.gray7} />
                    </Icon>
                    <Text variant="label1">
                      {replaceVariablesInText(commonTexts.common.metadata.time_interval, {
                        dateStart: formatDateFromSeconds(timeInterval.start, 'weekday-long'),
                        dateEnd: formatDateFromSeconds(timeInterval.end, 'weekday-long'),
                      })}
                    </Text>
                  </Box>
                )}

                {dateOfInsertion && (
                  <Box display="flex" alignItems="flex-start" color="gray7" marginY={space[1]}>
                    <Icon>
                      <Clock aria-hidden color={colors.gray7} />
                    </Icon>
                    <Text variant="label1">
                      {isArchivedGraph
                        ? replaceVariablesInText(commonTexts.common.metadata.last_insertion_date_archived, {
                            dateOfInsertion: formatDateFromSeconds(dateOfInsertion, 'weekday-long'),
                          })
                        : replaceVariablesInText(commonTexts.common.metadata.last_insertion_date, { dateOfInsertion: formatDateFromSeconds(dateOfInsertion, 'weekday-long') })}
                    </Text>
                  </Box>
                )}

                {source ? (
                  <Box display="flex" alignItems="flex-start" color="gray7">
                    <Icon>
                      <Database aria-hidden color={colors.gray7} />
                    </Icon>
                    <Text variant="label1">
                      {commonTexts.common.metadata.source}: {source.text}
                    </Text>
                  </Box>
                ) : dataSources ? (
                  <Box display="flex" alignItems="flex-start" color="gray7">
                    <Icon>
                      <Database aria-hidden color={colors.gray7} />
                    </Icon>
                    <Text variant="label1">
                      {`${commonTexts.common.metadata.source}: `}
                      {dataSources.map((item, index) => (
                        <InlineText key={index}>
                          {index > 0 && (index !== dataSources.length - 1 ? ' , ' : ' & ')}
                          {item.text}
                        </InlineText>
                      ))}
                    </Text>
                  </Box>
                ) : null}

                {disclaimer && (
                  <Box paddingBottom={space[3]}>
                    <Markdown content={disclaimer}></Markdown>
                  </Box>
                )}
                {dateString}
                {obtainedAt &&
                  ` ${replaceVariablesInText(commonTexts.common.metadata.obtained, {
                    date: formatDateFromSeconds(obtainedAt, 'axis-with-year'),
                  })}`}
                {intervalString && `. ${intervalString}`}
                {dateString && source ? ' · ' : null}

                {/* This can go */}
                {source ? (
                  `${commonTexts.common.metadata.source}: ${source.text}`
                ) : dataSources ? (
                  <>
                    {`${commonTexts.common.metadata.source}: `}
                    {dataSources.map((item, index) => (
                      <InlineText key={index}>
                        {index > 0 && (index !== dataSources.length - 1 ? ' , ' : ' & ')}
                        {item.text}
                      </InlineText>
                    ))}
                  </>
                ) : null}
              </>
            )}
          </Text>
        </Box>
      )}
    </>
  );
}

const Icon = styled.span(() =>
  css({
    minWidth: '1.8rem',

    svg: {
      height: '15px',
      width: 'auto',
    },
  })
);
