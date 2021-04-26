import { ActionDescription, DocumentActionProps } from './types';

export function ApproveAction(props: DocumentActionProps): ActionDescription {
  const document = props.draft || props.published;

  if (props.type !== 'lokalizeText' || !document) {
    return { label: 'Approve', disabled: true };
  }

  return {
    // disabled: true,
    label: 'Accepteren',
    onHandle: () => {
      // Here you can perform your actions
      window.alert('👋 Hello from custom action');
    },
  };
}
