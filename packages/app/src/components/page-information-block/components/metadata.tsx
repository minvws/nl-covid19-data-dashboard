import css from '@styled-system/css';
import { Fragment } from 'react';
import styled from 'styled-components';
import ChevronIcon from '~/assets/chevron.svg';
import ClockIcon from '~/assets/clock.svg';
import DatabaseIcon from '~/assets/database.svg';
import MeerInformatieIcon from '~/assets/meer-informatie.svg';
import { Box } from '~/components/base';
import { ExternalLink } from '~/components/external-link';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { Link } from '~/utils/link';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
interface Datasource {
  href: string;
  text: string;
  download: string;
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
  const { siteText } = useIntl();
  const text = siteText.common.metadata;

  const dateText = useFormateDateText(
    dateOrRange,
    dateOfInsertionUnix,
    datumsText
  );

  return (
    <Box spacing={2}>
      <Box display="flex" alignItems="flex-start" color="annotation">
        <Box as="span" minWidth="1.8rem">
          <ClockIcon aria-hidden color={colors.annotation} />
        </Box>
        <Text margin={0} fontSize={1}>
          {dateText}
        </Text>
      </Box>

      {dataSources.length > 0 && (
        <MetadataItem
          icon={<DatabaseIcon aria-hidden />}
          items={dataSources}
          label={referenceLink ? siteText.informatie_header.bron : text.source}
          accessibilityText={siteText.accessibility.text_source}
          accessibilitySubject={accessibilitySubject}
          referenceLink={referenceLink}
        />
      )}

      {referenceLink && (
        <MetadataReference
          icon={<MeerInformatieIcon aria-hidden />}
          referenceLink={referenceLink}
        />
      )}

      {moreInformationLabel && (
        <MetadataItem
          icon={<MeerInformatieIcon aria-hidden />}
          items={moreInformationLink ? [moreInformationLink] : []}
          label={moreInformationLabel}
        />
      )}
    </Box>
  );
}

function useFormateDateText(
  dateOrRange: number | DateRange,
  dateOfInsertionUnix: number,
  datumsText: string
) {
  const { formatDateFromSeconds } = useIntl();

  if (typeof dateOrRange === 'number') {
    const dateOfReport = formatDateFromSeconds(dateOrRange, 'weekday-medium');
    const dateOfInsertion = formatDateFromSeconds(
      dateOfInsertionUnix,
      'weekday-medium'
    );
    return replaceVariablesInText(datumsText, {
      dateOfReport,
      dateOfInsertion,
    });
  } else {
    const weekStart = formatDateFromSeconds(
      dateOrRange.start,
      'weekday-medium'
    );
    const weekEnd = formatDateFromSeconds(dateOrRange.end, 'weekday-medium');
    const dateOfInsertion = formatDateFromSeconds(
      dateOfInsertionUnix,
      'weekday-medium'
    );
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

function MetadataItem({
  icon,
  label,
  items,
  referenceLink,
  accessibilityText,
  accessibilitySubject,
}: MetadataItemProps) {
  const { siteText } = useIntl();

  return (
    <Box display="flex" alignItems="flex-start" color="annotation">
      <Box as="span" minWidth="1.8rem">
        {icon}
      </Box>

      <Text margin={0} fontSize={1}>
        {referenceLink && !items && (
          <Link href={referenceLink} passHref>
            <Anchor>{siteText.informatie_header.meer_informatie_link}</Anchor>
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
  const { siteText } = useIntl();

  const words = siteText.informatie_header.meer_informatie_link.split(' ');

  return (
    <Box display="flex" alignItems="flex-start" color="annotation">
      <Box minWidth="1.8rem">{icon}</Box>

      <Link href={referenceLink} passHref>
        <Anchor css={css({ fontSize: 1 })}>
          {words.map((word, index) => (
            <Fragment key={index}>
              {words.length - 1 === index ? (
                <InlineText
                  css={css({
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                  })}
                >
                  {word}
                  <ChevronIcon />
                </InlineText>
              ) : (
                `${word} `
              )}
            </Fragment>
          ))}
        </Anchor>
      </Link>
    </Box>
  );
}

const Anchor = styled.a({
  textDecoration: 'none',
  display: 'flex',
  flexWrap: 'wrap',
  whiteSpace: 'pre-wrap',

  '&:hover': {
    textDecoration: 'underline',
  },

  svg: {
    height: 10,
    width: 10,
    marginLeft: '2px',
  },
});
