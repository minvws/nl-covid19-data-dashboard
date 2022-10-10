/**
 * This code was inspired by
 * https://www.sanity.io/schemas/set-slug-on-publish-with-referenced-field-value-ZMcsmDfWFDUo5_BrLtVpY
 */
import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { assert } from '@corona-dashboard/common';
import { useDocumentOperation } from '@sanity/react-hooks';
import { useEffect, useState } from 'react';
import { DocumentActionProps } from './types';

export interface Operation {
  disabled: (args: unknown) => false | string;
  execute: (args?: unknown) => void;
}

/**
 * This action is for handling LokalizeText documents specifically, and replaces
 * the regular Publish action. It will un-flag the is_newly_added flag on the
 * first publish, and also allows us to accept texts if no changes need to be
 * made (and publish is not available).
 *
 * In addition it will increment a counter so that we can track what documents
 * get publish most frequently.
 */
export function PublishOrAcceptAction(props: DocumentActionProps) {
  const { patch, publish } = useDocumentOperation(props.id, props.type) as {
    patch: Operation;
    publish: Operation;
  };

  assert(props.type === 'lokalizeText', `The PublishOrAcceptAction should only be made available for LokalizeText documents, and not: ${props.type}`);

  const document = (props.draft || props.published) as LokalizeText | null;

  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    /**
     * If the isPublishing state was set to true and the draft has changed to
     * become `null` the document has been published
     */
    if (isPublishing && !props.draft) {
      setIsPublishing(false);
    }
  }, [isPublishing, props.draft]);

  if (!document) return;

  /**
   * It could be that we as developers already supplied the complete text
   * document with correct texts when it got injected. In such case, there is
   * nothing to change/publish. To avoid forcing communication to edit something
   * that is already done, just to get the option to publish we detect this
   * state and provide "accept" as an action to simply un-flag the text document
   * and use as-is.
   */
  const isNewlyAddedWithoutDraft = document.is_newly_added;

  const label = isPublishing ? 'Publishing…' : isNewlyAddedWithoutDraft ? 'Accept' : 'Publish';

  /**
   * Normally disabled state is tied directly to publish.disabled, but in case
   * we have a new document we need to enable the Accept state of the button.
   */
  const disabled = document.is_newly_added ? isPublishing : publish.disabled;

  return {
    disabled,
    label,
    onHandle: () => {
      setIsPublishing(true);

      const patchData: Partial<LokalizeText> = {
        is_newly_added: false,
        publish_count: document.publish_count + 1,
      };

      patch.execute([{ set: patchData }]);

      publish.execute();

      props.onComplete();
    },
  };
}
