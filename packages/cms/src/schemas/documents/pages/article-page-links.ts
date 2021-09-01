import { Rule } from '~/sanity';

export const pageLinks = {
  title: 'Page Links',
  name: 'articlePageLinks',
  type: 'document',
  fields: [
    {
      name: 'page',
      title: 'Page',
      description: 'Which pages should display these links?',
      type: 'reference',
      to: [{ type: 'articlePage' }],
    },
    {
      title: "'Ook interessant' links",
      description: 'Maximaal 4 links naar interessante onderwerpen.',
      name: 'links',
      type: 'array',
      of: [{ type: 'link' }],
      validation: (rule: Rule) => rule.required().min(1).max(4),
    },
  ],
  preview: {
    select: {
      link0: 'links.0.title.nl',
      link1: 'links.1.title.nl',
      link2: 'links.2.title.nl',
      link3: 'links.3.title.nl',
    },
    prepare(selection: any) {
      const { link0, link1, link2 } = selection;

      const links = [link0, link1, link2].filter(Boolean);
      const title = links.length > 0 ? `${links.join(', ')}` : '';
      const subtitle =
        links.length > 0 ? `${links.length} links` : 'Geen links';

      return {
        title,
        subtitle,
      };
    },
  },
};
