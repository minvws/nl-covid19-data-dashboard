import { PortableTextEntry } from '@sanity/block-content-to-react';
import { ImageBlock } from '~/types/cms';

type Link = {
  id?: string;
  linkIcon?: string;
  linkLabel: string;
  linkUrl: string;
};

export type NotFoundPageConfiguration = {
  description: PortableTextEntry[];
  image: ImageBlock;
  isGeneralPage: boolean;
  isGmPage: boolean;
  title: string;
  cta?: {
    ctaIcon?: string;
    ctaLabel: string;
    ctaLink: string;
  };
  links?: Link[];
};

export interface NotFoundProps {
  lastGenerated: string;
  notFoundPageConfiguration: NotFoundPageConfiguration;
}

export interface NotFoundLinkProps {
  alignItems: string;
  display: string;
  link: Link;
  border?: string;
  borderRadius?: string;
  className?: string;
  hasChevron?: boolean;
  isCTA?: boolean;
  marginBottom?: string;
  maxWidth?: string;
  order?: number;
  padding?: string;
}
