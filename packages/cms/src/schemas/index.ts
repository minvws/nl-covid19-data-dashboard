import { article } from './documents/article';
import { lokalizeText } from './documents/lokalize-text';
import { pageIdentifier } from './documents/page-identifier';
import { articles } from './documents/page-parts/articles';
import { dataExplained as dataExplainedParts } from './documents/page-parts/data-explained';
import { faq as faqParts } from './documents/page-parts/faq';
import { highlights } from './documents/page-parts/highlights';
import { links } from './documents/page-parts/links';
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
import { advice } from './documents/pages/homepage/advice';
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
import { thermometerTrendIcon } from './documents/pages/homepage/thermometer-trend-icon';
import { notFound } from './documents/pages/not-found';
import { notFoundItem } from './documents/pages/not-found/item';
import { notFoundLink } from './documents/pages/not-found/link';
import { trendIcon } from './documents/trend-icon';
import { timeSeries } from './elements/time-series';
import { timelineEvent } from './elements/timeline-event';
import { timelineEventCollection } from './elements/timeline-event-collection';
import { block } from './locale/block';
import { richContentBlock } from './locale/rich-content-block';
import { string } from './locale/string';
import { text } from './locale/text';
import { image } from './locale/image';
import { inlineBlock } from './objects/inline-block';
import { inlineCollapsible } from './objects/inline-collapsible';
import { link } from './objects/link';
import { coronaThermometer } from './documents/pages/corona-thermometer';

const localeSpecificSchemas = [block, richContentBlock, string, text, image];
const richContentSchemas = [inlineBlock, inlineCollapsible];
const documentSchemas = [
  advice,
  article,
  coronaThermometer,
  dataExplainedGroups,
  dataExplainedItem,
  faqGroups,
  faqItem,
  lokalizeText,
  notFoundItem,
  notFoundLink,
  pageIdentifier,
  summary,
  summaryItem,
  theme,
  themeCollection,
  themeLink,
  themeTile,
  themeTileConfig,
  thermometer,
  thermometerLevel,
  thermometerTimeline,
  thermometerTimelineEvent,
  thermometerTrendIcon,
  trendIcon,
];
const pageSchemas = [about, accessibility, contact, dataExplained, faq, homepage, notFound];
const pagePartSchemas = [articles, dataExplainedParts, faqParts, highlights, links];
const elementSchemas = [timelineEvent, timelineEventCollection, timeSeries];
const objectSchemas = [link];

export const schemaTypes = [...localeSpecificSchemas, ...richContentSchemas, ...documentSchemas, ...elementSchemas, ...pageSchemas, ...pagePartSchemas, ...objectSchemas];
