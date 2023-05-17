import { lokalizeText } from './documents/lokalize-text';
import { pageIdentifier } from './documents/page-identifier';
import { about } from './documents/pages/about';
import { accessibility } from './documents/pages/accessibility';
import { contact } from './documents/pages/contact';
import { dataExplained } from './documents/pages/data-explained';
import { dataExplainedGroups } from './documents/pages/data-explained/groups';
import { dataExplainedItem } from './documents/pages/data-explained/item';
import { faq } from './documents/pages/faq';
import { faqGroups } from './documents/pages/faq/groups';
import { faqItem } from './documents/pages/faq/item';
import { homepage } from './documents/pages/homepage';
import { summary } from './documents/pages/homepage/summary';
import { summaryItem } from './documents/pages/homepage/summary-item';
import { theme } from './documents/pages/homepage/theme';
import { themeCollection } from './documents/pages/homepage/theme-collection';
import { themeLink } from './documents/pages/homepage/theme-link';
import { themeTile } from './documents/pages/homepage/theme-tile';
import { themeTileConfig } from './documents/pages/homepage/theme-tile-config';
import { thermometer } from './documents/pages/homepage/thermometer';
import { thermometerLevel } from './documents/pages/homepage/thermometer-level';
import { thermometerTimeline } from './documents/pages/homepage/thermometer-timeline';
import { thermometerTimelineEvent } from './documents/pages/homepage/thermometer-timeline-event';
import { notFound } from './documents/pages/not-found';
import { notFoundItem } from './documents/pages/not-found/item';
import { notFoundLink } from './documents/pages/not-found/link';
import { trendIcon } from './documents/trend-icon';
import { timeSeries } from './elements/time-series';
import { timelineEvent } from './elements/timeline-event';
import { timelineEventCollection } from './elements/timeline-event-collection';
import { localeBlock } from './locale/locale-block';
import { localeRichContentBlock } from './locale/locale-rich-content-block';
import { localeString } from './locale/locale-string';
import { localeText } from './locale/locale-text';
import { inlineBlock } from './objects/inline-block';
import { inlineCollapsible } from './objects/inline-collapsible';
import { link } from './objects/link';

const localeSpecificSchemas = [localeBlock, localeRichContentBlock, localeString, localeText];
const richContentSchemas = [inlineBlock, inlineCollapsible];
const documentSchemas = [
  dataExplainedGroups,
  dataExplainedItem,
  faqGroups,
  faqItem,
  summary,
  summaryItem,
  theme,
  themeLink,
  themeTile,
  themeTileConfig,
  themeCollection,
  thermometer,
  thermometerLevel,
  thermometerTimeline,
  thermometerTimelineEvent,
  trendIcon,
  lokalizeText,
  notFoundItem,
  notFoundLink,
  pageIdentifier,
];
const pageSchemas = [about, accessibility, contact, dataExplained, faq, homepage, notFound];
const elementSchemas = [timelineEvent, timelineEventCollection, timeSeries];
const objectSchemas = [link];

export const schemaTypes = [...localeSpecificSchemas, ...richContentSchemas, ...documentSchemas, ...elementSchemas, ...pageSchemas, ...objectSchemas];
