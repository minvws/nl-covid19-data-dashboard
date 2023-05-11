import { lokalizeText } from './documents/lokalize-text';
import { overDitDashboard } from './documents/pages/over-dit-dashboard';
import { localeBlock } from './locale/locale-block';
import { localeString } from './locale/locale-string';
import { localeText } from './locale/locale-text';
import { inlineBlock } from './objects/inline-block';
import { inlineCollapsible } from './objects/inline-collapsible';

const localeSpecificSchemas = [localeString, localeBlock, localeText];
const richContentSchemas = [inlineCollapsible, inlineBlock];
const documentSchemas = [lokalizeText, overDitDashboard];

export const schemaTypes = [...localeSpecificSchemas, ...richContentSchemas, ...documentSchemas];
