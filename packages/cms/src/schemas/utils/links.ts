import { Link } from '../objects/link';

interface LinkValidationContextParent {
  maxNumber: number;
  links: Link[];
}

export const isLinkValidationContextParent = (parent: unknown): parent is LinkValidationContextParent =>
  typeof parent === 'object' && parent !== null && 'maxNumber' in parent && 'links' in parent;
