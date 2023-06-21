import { DocumentActionComponent, DocumentActionProps, useDocumentOperation } from 'sanity';
import { assert } from '@corona-dashboard/common';
import { useState, useEffect } from 'react';
import { LokalizeText } from '@corona-dashboard/app/src/types/cms';

/**
 * This action is for handling LokalizeText documents specifically, and replaces
 * the regular Publish action. It will un-flag the is_newly_added flag on the
 * first publish, and also allows us to accept texts if no changes need to be
 * made (and publish is not available).
 *
 * In addition it will increment a counter so that we can track what documents
 * get publish most frequently.
 */
export const PublishOrAcceptAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { id, type, draft, published, onComplete } = props;

  assert(type === 'lokalizeText', `The PublishOrAcceptAction should only be made available for LokalizeText documents, and not: ${type}`);

  const { patch, publish } = useDocumentOperation(id, type);
  const [isPublishing, setIsPublishing] = useState(false);

  const document = (draft || published) as LokalizeText | null;

  // If the isPublishing state was set to true and the draft has changed to become 'null' the document has been published
  useEffect(() => {
    if (isPublishing && !draft) setIsPublishing(false);
  }, [isPublishing, draft]);

  if (!document) return null;

  const onHandle = () => {
    setIsPublishing(true);

    patch.execute([
      {
        set: {
          is_newly_added: false,
          publish_count: document.publish_count + 1,
        },
      },
    ]);

    publish.execute();
    onComplete();
  };

  return {
    disabled: document.is_newly_added ? isPublishing : !!publish.disabled,

    /**
     * It could be that we as developers already supplied the complete text
     * document with correct texts when it got injected. In such case, there is
     * nothing to change/publish. To avoid forcing communication to edit something
     * that is already done, just to get the option to publish we detect this
     * state and provide "accept" as an action to simply un-flag the text document
     * and use as-is.
     */
    label: isPublishing ? 'Publishing…' : document.is_newly_added ? 'Accept' : 'Publish',
    onHandle,
  };
};
