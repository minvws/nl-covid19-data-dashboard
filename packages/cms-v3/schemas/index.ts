import { lokalizeText } from './documents/lokalize-text';
import { overDitDashboard } from './documents/pages/over-dit-dashboard';
import { timeSeries } from './elements/time-series';
import { timelineEvent } from './elements/timeline-event';
import { timelineEventCollection } from './elements/timeline-event-collection';
import { localeBlock } from './locale/locale-block';
import { localeString } from './locale/locale-string';
import { localeText } from './locale/locale-text';
import { inlineBlock } from './objects/inline-block';
import { inlineCollapsible } from './objects/inline-collapsible';

const localeSpecificSchemas = [localeString, localeBlock, localeText];
const richContentSchemas = [inlineCollapsible, inlineBlock];
const documentSchemas = [lokalizeText, overDitDashboard];
const elementSchemas = [timelineEvent, timelineEventCollection, timeSeries];

export const schemaTypes = [...localeSpecificSchemas, ...richContentSchemas, ...documentSchemas, ...elementSchemas];
