import { DocumentListWidgetConfig } from 'sanity-plugin-dashboard-widget-document-list';
import { DashboardDocumentListWidget } from '../components/dashboard-document-list-widget';
import { DashboardWidget } from '@sanity/dashboard';

type TDashboardWidget = DocumentListWidgetConfig & Pick<DashboardWidget, 'name'> & { countQuery: string };

export const dashboardWidgets: TDashboardWidget[] = [
  {
    name: 'unpublished-documents',
    title: 'Niet-gepubliceerde documenten',
    query: `*[_id in path("drafts.**") && (defined(text))] | order(_updatedAt desc)`,
    countQuery: `count(*[_id in path("drafts.**") && (defined(text))])`,
  },
  {
    name: 'recently-published-documents',
    title: 'Recent gepubliceerde documenten',
    query: `*[!(_id in path("drafts.**")) && (defined(text)) && (defined(key))] | order(_publishedAt desc)`,
    countQuery: `count(*[!(_id in path("drafts.**")) && (defined(text)) && (defined(key))])`,
  },
  {
    name: 'untranslated-lokalize-keys',
    title: 'Onvertaalde Lokalize teksten',
    query: `*[_type == "lokalizeText" && (!defined(text.en) || text.en == "")] | order(_updatedAt desc)`,
    countQuery: `count(*[_type == "lokalizeText" && (!defined(text.en) || text.en == "")])`,
  },
  {
    name: 'new-lokalize-keys',
    title: 'Nieuwe Lokalize teksten',
    query: `*[_type == "lokalizeText" && is_newly_added == true] | order(key asc)`,
    countQuery: `count(*[_type == "lokalizeText" && is_newly_added == true])`,
  },
  {
    name: 'recently-updated-articles',
    title: 'Laatst gewijzigde artikelen',
    query: `*[_type == 'article'] | order(_updatedAt desc)`,
    countQuery: `count(*[_type == 'article'])`,
    createButtonText: 'Nieuw artikel',
    types: ['article'],
  },
];

export const widgets = dashboardWidgets.map(({ name, title, query, countQuery, createButtonText = null, types = null }, index): DashboardWidget => {
  return {
    name: name,
    component: () => <DashboardDocumentListWidget key={index} title={title} query={query} createButtonText={createButtonText} types={types} countQuery={countQuery} />,
    layout: { width: 'large' },
  };
});
