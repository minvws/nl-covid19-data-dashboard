import { MarginBottomProps } from 'styled-system';

/**
 * @typedef Source
 * @type {object}
 * @property {string} text - The display text of the source.
 * @property {string} href - The URL of the source.
 * @property {string} [aria_text] - The aria text of the source, optional.
 */
type Source = {
  text: string;
  href: string;
  ariaText?: string;
};

/**
 * @interface Datasource
 * @property {string} href - The URL of the data source.
 * @property {string} text - The display text of the data source.
 * @property {string} [download] - The URL to download the data source, optional.
 */
interface Datasource {
  href: string;
  text: string;
  download?: string;
}

/**
 * @interface DateRange
 * @property {number} start - The start date in Unix timestamp.
 * @property {number} end - The end date in Unix timestamp.
 */
export interface DateRange {
  start: number;
  end: number;
}

/**
 * @type
 * @typedef MetadataProps
 * @property {number|DateRange|string} [date] - Date of the metadata item. It can be a number, a DateRange object, or a string.
 * @property {Source} [source] - Source of the metadata.
 * @property {Source[]} [dataSources] - Array of data sources for the metadata.
 * @property {number} [obtainedAt] - Unix timestamp of when the metadata was obtained.
 * @property {boolean} [isTileFooter] - Flag indicating whether the metadata is for a tile footer.
 * @property {boolean} [isPageInformationBlock] - Flag indicating whether the metadata is for a page information block.
 * @property {string} [datumsText] - Textual representation of the metadata date.
 * @property {string} [intervalCount] - Interval count for the metadata.
 * @property {string} [disclaimer] - Disclaimer text for the metadata.
 * @property {DateRange} [datePeriod] - Date range for the metadata.
 * @property {number} [dateOfInsertion] - Unix timestamp of when the metadata was inserted.
 * @property {boolean} [isArchivedGraph] - Flag indicating whether the metadata is for an archived graph.
 * @property {number|DateRange} [dateOrRange] - Date or date range of the metadata.
 * @property {string} [accessibilitySubject] - Accessibility subject text for the metadata.
 * @property {string} [moreInformationLabel] - Label for the "More Information" link.
 * @property {{href: string, text: string}} [moreInformationLink] - "More Information" link object, with href and text properties.
 * @property {string} [referenceLink] - Reference link for the metadata.
 * @property {Datasource[]} [jsonSources] - Array of JSON data sources for the metadata.
 * @memberof module:Metadata
 */
export type MetadataProps = {
  date?: number | DateRange | string;
  source?: Source;
  dataSources?: Source[];
  obtainedAt?: number;
  isTileFooter?: boolean;
  isPageInformationBlock?: boolean;
  datumsText?: string;
  intervalCount?: string;
  disclaimer?: string;
  timeframePeriod?: DateRange;
  dateOfInsertion?: number;
  isArchivedGraph?: boolean;
  dateOrRange?: number | DateRange;
  accessibilitySubject?: string;
  moreInformationLabel?: string;
  moreInformationLink?: {
    href: string;
    text: string;
  };
  referenceLink?: string;
  jsonSources?: Datasource[];
} & MarginBottomProps;
