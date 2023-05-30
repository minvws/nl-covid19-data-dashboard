import uniq from 'lodash/uniq';
import { BsBarChart, BsFolder, BsTags } from 'react-icons/bs';
import { map } from 'rxjs/operators';
import { StructureBuilder, StructureResolverContext } from 'sanity/desk';

export const elementsStructureItem = (S: StructureBuilder, context: StructureResolverContext) => {
  const { documentStore } = context;

  return S.listItem()
    .id('datagerelateerde-content')
    .title('Datagerelateerde content')
    .icon(BsBarChart)
    .child((id) =>
      S.list()
        .id('datagerelateerde-content-list')
        .title('Datagerelateerde content')
        .items([
          S.listItem()
            .id(id)
            .title('Elements')
            .icon(BsBarChart)
            .child(() => {
              // TODO: is only 'timeSeries' now necessary because we have removed other items/types?
              const types = ['timeSeries', 'kpi', 'choropleth', 'warning'];

              return documentStore
                .listenQuery(
                  `//groq
                        *[_type in $types]{ scope, metricName, metricProperty }
                      `,
                  { types },
                  {}
                )
                .pipe(
                  map((documents: { scope: string }[]) => {
                    const scopes = uniq(documents.map((document) => document.scope).filter(Boolean));
                    return elementsStructureItemChild(S, scopes, 'timeSeries');
                  })
                );
            }),
          timelineEventCollectionsListItem(S),
        ])
    );
};

const elementsStructureItemChild = (S: StructureBuilder, scopes: string[], type: string) => {
  return S.list()
    .id('datagerelateerde-content-list-items')
    .title('Scope')
    .items(
      scopes
        .sort((a, b) => a.localeCompare(b))
        .map((scope, index) => {
          return S.listItem()
            .id(`${scope}-${index}`)
            .title(scope)
            .icon(BsFolder)
            .child(
              S.documentList()
                .id(`${scope}-element`)
                .title('Element')
                .defaultOrdering([
                  { field: 'metricName', direction: 'asc' },
                  { field: 'metricProperty', direction: 'asc' },
                  { field: '_type', direction: 'asc' },
                ])
                .filter(
                  `//groq
                  scope == $scope
                `
                )
                .params({ scope })
                .child((id) => S.editor().id(id).title(id).schemaType(type).documentId(id).views([S.view.form()]))
            );
        })
    );
};

const timelineEventCollectionsListItem = (S: StructureBuilder) => {
  return S.listItem()
    .id('timeline-event-collections')
    .title('Timeline Event Collections')
    .icon(BsTags)
    .child(() => S.documentTypeList('timelineEventCollection').defaultOrdering([{ field: 'name', direction: 'asc' }]));
};