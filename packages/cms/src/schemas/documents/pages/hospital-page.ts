import { HIGHLIGHTED_ARTICLES } from '../fields/highlighted-articles';
import MESSAGES from '../../messages/hospitalPage';

export default {
  title: 'Ziekenhuis opnames',
  name: 'hospitalPage',
  type: 'document',
  fields: [
    HIGHLIGHTED_ARTICLES,
    MESSAGES,
    {
      name: 'messageExceptions',
      type: 'array',
      of: [{ type: 'messageException' }],
    },
  ],
};
