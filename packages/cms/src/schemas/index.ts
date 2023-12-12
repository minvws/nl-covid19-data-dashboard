import { about } from './documents/pages/about';
import { accessibility } from './documents/pages/accessibility';
import { advice } from './documents/pages/homepage/advice';
import { article } from './documents/article';
import { articles } from './documents/page-parts/articles';
import { block } from './locale/block';
import { contact } from './documents/pages/contact';
import { contactPageGroup } from './documents/pages/contact/group';
import { contactPageGroupItem } from './documents/pages/contact/item';
import { contactPageItemLink } from './documents/pages/contact/link';
import { coronaThermometer } from './documents/pages/corona-thermometer';
import { dataExplained } from './documents/pages/data-explained';
import { dataExplained as dataExplainedParts } from './documents/page-parts/data-explained';
import { dataExplainedGroups } from './documents/pages/data-explained/groups';
import { dataExplainedItem } from './documents/pages/data-explained/item';
import { faq } from './documents/pages/faq';
import { faq as faqParts } from './documents/page-parts/faq';
import { faqGroups } from './documents/pages/faq/groups';
import { faqItem } from './documents/pages/faq/item';
import { highlights } from './documents/page-parts/highlights';
import { homepage } from './documents/pages/homepage';
import { image } from './locale/image';
import { inlineBlock } from './objects/inline-block';
import { inlineCollapsible } from './objects/inline-collapsible';
import { link } from './objects/link';
import { links } from './documents/page-parts/links';
import { linkType } from './objects/link-type';
import { lokalizeText } from './documents/lokalize-text';
import { notFound } from './documents/pages/not-found';
import { notFoundItem } from './documents/pages/not-found/item';
import { notFoundLink } from './documents/pages/not-found/link';
import { pageIdentifier } from './documents/page-identifier';
import { richContentBlock } from './locale/rich-content-block';
import { string } from './locale/string';
import { summary } from './documents/pages/homepage/summary';
import { summaryItem } from './documents/pages/homepage/summary-item';
import { text } from './locale/text';
import { theme } from './documents/pages/homepage/theme';
import { themeCollection } from './documents/pages/homepage/theme-collection';
import { themeLink } from './documents/pages/homepage/theme-link';
import { themeTile } from './documents/pages/homepage/theme-tile';
import { themeTileConfig } from './documents/pages/homepage/theme-tile-config';
import { thermometer } from './documents/pages/corona-thermometer/thermometer';
import { thermometerLevel } from './documents/pages/corona-thermometer/thermometer-level';
import { thermometerTimeline } from './documents/pages/corona-thermometer/thermometer-timeline';
import { thermometerTimelineEvent } from './documents/pages/corona-thermometer/thermometer-timeline-event';
import { thermometerTrendIcon } from './documents/pages/corona-thermometer/thermometer-trend-icon';
import { timelineEvent } from './elements/timeline-event';
import { timelineEventCollection } from './elements/timeline-event-collection';
import { timeSeries } from './elements/time-series';
import { trendIcon } from './documents/trend-icon';

const localeSpecificSchemas = [block, richContentBlock, string, text, image];
const richContentSchemas = [inlineBlock, inlineCollapsible];
const documentSchemas = [
  advice,
  article,
  contactPageGroup,
  contactPageGroupItem,
  contactPageItemLink,
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
const objectSchemas = [link, linkType];

export const schemaTypes = [...localeSpecificSchemas, ...richContentSchemas, ...documentSchemas, ...elementSchemas, ...pageSchemas, ...pagePartSchemas, ...objectSchemas];
