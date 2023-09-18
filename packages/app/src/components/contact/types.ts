import { RichContentBlock } from '~/types/cms';

export type LinkType = 'regular' | 'email' | 'phone';

interface Base {
  title: string;
  id: string;
}

export interface ItemLink {
  id: string;
  href: string;
  label: string;
  linkType: LinkType;
  titleAboveLink?: string;
}

export interface GroupItem extends Base {
  description: RichContentBlock[];
  links?: ItemLink[];
  titleUrl?: string;
  linkType?: LinkType;
}

interface PageGroups extends Base {
  items: GroupItem[];
}

export interface ContactPage {
  groups: PageGroups[];
  pageTitle?: string | null;
}
