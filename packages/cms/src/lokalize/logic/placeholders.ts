import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { MOVE_PLACEHOLDER_ID_PREFIX } from './mutations';

export function createMovePlaceholderFromDocument(
  originalDocument: LokalizeText,
  moveToKey: string
) {
  const [subject] = moveToKey.split('.');

  const placeholder: LokalizeText = {
    ...originalDocument,
    _id: MOVE_PLACEHOLDER_ID_PREFIX + originalDocument._id,
    key: moveToKey,
    subject,
    is_newly_added: false,
    is_move_placeholder: true,
  };

  return placeholder;
}
