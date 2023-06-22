/**
 * Couldn't find the Sanity export for this
 */
export interface DocumentActionProps {
  id: string;
  type: string;
  draft: null | Document;
  published: null | Document;
  onComplete: () => void;
}

export interface ActionDescription {
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  shortcut?: string;
  title?: string;
  // dialog?: ConfirmDialogProps | PopOverDialogProps | ModalDialogProps;
  onHandle?: () => void;
}
