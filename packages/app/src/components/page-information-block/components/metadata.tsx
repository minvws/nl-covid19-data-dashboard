import { colors } from '@corona-dashboard/common';
import { ChevronRight, Clock, Database, MeerInformatie } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { Fragment } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ExternalLink } from '~/components/external-link';
import { Anchor, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { Link } from '~/utils/link';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface Datasource {
  href: string;
  text: string;
  download?: string;
}

interface DateRange {
  start: number;
  end: number;
}

export interface MetadataProps {
  dataSources: Datasource[];
  datumsText: string;
  dateOrRange: number | DateRange;
  dateOfInsertionUnix: number;
  accessibilitySubject?: string;
  moreInformationLabel?: string;
  moreInformationLink?: {
    href: string;
    text: string;
  };
  referenceLink?: string;
}

export function Metadata({
  dataSources = [],
  datumsText,
  dateOrRange,
  dateOfInsertionUnix,
  accessibilitySubject,
  moreInformationLabel,
  moreInformationLink,
  referenceLink,
}: MetadataProps) {
  const { commonTexts } = useIntl();
  const text = commonTexts.common.metadata;

  const dateText = useFormatDateText(dateOrRange, dateOfInsertionUnix, datumsText);

  return (
    <Box spacing={2}>
      <Box display="flex" alignItems="flex-start" color="gray7">
        <Icon>
          <Clock aria-hidden color={colors.gray7} />
        </Icon>
        <Text variant="label1">{dateText}</Text>
      </Box>

      {dataSources.length > 0 && (
        <MetadataItem
          icon={<Database aria-hidden />}
          items={dataSources}
          label={referenceLink ? commonTexts.informatie_header.bron : text.source}
          accessibilityText={commonTexts.accessibility.text_source}
          accessibilitySubject={accessibilitySubject}
          referenceLink={referenceLink}
        />
      )}

      {referenceLink && <MetadataReference icon={<MeerInformatie aria-hidden />} referenceLink={referenceLink} />}

      {moreInformationLabel && <MetadataItem icon={<MeerInformatie aria-hidden />} items={moreInformationLink ? [moreInformationLink] : []} label={moreInformationLabel} />}
    </Box>
  );
}

function useFormatDateText(dateOrRange: number | DateRange, dateOfInsertionUnix: number, datumsText: string) {
  const { formatDateFromSeconds } = useIntl();

  if (typeof dateOrRange === 'number') {
    const dateOfReport = formatDateFromSeconds(dateOrRange, 'weekday-long');
    const dateOfInsertion = formatDateFromSeconds(dateOfInsertionUnix, 'weekday-long');
    return replaceVariablesInText(datumsText, {
      dateOfReport,
      dateOfInsertion,
    });
  } else {
    const weekStart = formatDateFromSeconds(dateOrRange.start, 'weekday-long');
    const weekEnd = formatDateFromSeconds(dateOrRange.end, 'weekday-long');
    const dateOfInsertion = formatDateFromSeconds(dateOfInsertionUnix, 'weekday-long');
    return replaceVariablesInText(datumsText, {
      weekStart,
      weekEnd,
      dateOfInsertion,
    });
  }
}

interface MetadataItemProps {
  icon: JSX.Element;
  label?: string;
  items: {
    href: string;
    text: string;
  }[];
  accessibilityText?: string;
  accessibilitySubject?: string;
  referenceLink?: string;
}

function MetadataItem({ icon, label, items, referenceLink, accessibilityText, accessibilitySubject }: MetadataItemProps) {
  const { commonTexts } = useIntl();

  return (
    <Box display="flex" alignItems="flex-start" color="gray7">
      <Icon>{icon}</Icon>

      <Text variant="label1">
        {referenceLink && !items && (
          <Link href={referenceLink} passHref>
            <a>{commonTexts.informatie_header.meer_informatie_link}</a>
          </Link>
        )}
        {items && referenceLink && (
          <>
            {`${label}: `}
            {items.map((item, index) => (
              <Fragment key={index + item.href}>
                <InlineText>
                  {index > 0 && (index !== items.length - 1 ? ' , ' : ' & ')}
                  {item.text}
                </InlineText>
              </Fragment>
            ))}
          </>
        )}
        {items && !referenceLink && (
          <>
            {`${label}: `}
            {items.map((item, index) => (
              <Fragment key={index + item.href}>
                {index > 0 && ' & '}
                {item.href && (
                  <ExternalLink
                    href={item.href}
                    ariaLabel={
                      accessibilityText && accessibilitySubject
                        ? replaceVariablesInText(accessibilityText, {
                            subject: accessibilitySubject,
                            source: item.text,
                          })
                        : undefined
                    }
                  >
                    {item.text}
                  </ExternalLink>
                )}
                {!item.href && item.text}
              </Fragment>
            ))}
          </>
        )}
      </Text>
    </Box>
  );
}

interface metadataReferenceProps {
  icon: React.ReactNode;
  referenceLink: string;
}

function MetadataReference({ icon, referenceLink }: metadataReferenceProps) {
  const { commonTexts } = useIntl();

  const words = commonTexts.informatie_header.meer_informatie_link.split(' ');

  return (
    <Box display="flex" alignItems="flex-start" color="gray7">
      <Icon>{icon}</Icon>

      <Link href={referenceLink} passHref>
        <Anchor underline="hover" variant="label1">
          {words.map((word, index) => (
            <Fragment key={index}>
              {words.length - 1 === index ? (
                <span
                  css={css({
                    display: 'inline-block',
                    textDecoration: 'inherit',
                  })}
                >
                  {word}&nbsp;
                  <ChevronRight width="10px" height="10px" />
                </span>
              ) : (
                <span>{`${word} `}</span>
              )}
            </Fragment>
          ))}
        </Anchor>
      </Link>
    </Box>
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
