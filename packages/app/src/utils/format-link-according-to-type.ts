/**
 * Returns a formatted link based on the link type of email, phone, regular
 */
export const formatLinkAccordingToType = (href: string, linkType: string | undefined) => {
  switch (linkType) {
    case 'email':
      return `mailto:${href}`;
    case 'phone':
      return `tel:${href.replace(/\s/g, '').replaceAll('-', '')}`;
    default:
      return href;
  }
};
