import { StructureBuilder as S } from '@sanity/structure';
import uniq from 'lodash/uniq';
import documentStore from 'part:@sanity/base/datastore/document';
import { FaChartLine, FaTags } from 'react-icons/fa';
import { map } from 'rxjs/operators';

export function elementsListItem() {
  return S.listItem()
    .title('Datagerelateerde content')
    .icon(FaChartLine)
    .child(
      S.list()
        .title('Datagerelateerde content')
        .items([
          S.listItem()
            .title('Elements')
            .icon(FaChartLine)
            .child(() => {
              const types = ['timeSeries', 'kpi', 'choropleth', 'warning'];

              return documentStore
                .listenQuery(
                  `*[_type in $types]{ scope, metricName, metricProperty, _type }`,
                  { types }
                )
                .pipe(
                  map((doc: { scope: string; _type: string }[]) => {
                    const scopeInfos = uniq(
                      doc.map((x) => ({ scope: x.scope, type: x._type }))
                    );

                    return S.list()
                      .title('Scope')
                      .items(
                        scopeInfos
                          .sort((a, b) => a.scope.localeCompare(b.scope))
                          .map((scopeInfo) =>
                            S.listItem()
                              .title(scopeInfo.scope)
                              .id(scopeInfo.scope)
                              .child(
                                S.documentList()
                                  .id(`${scopeInfo}-element`)
                                  .title('Element')
                                  .schemaType(scopeInfo.type)
                                  .defaultOrdering([
                                    { field: 'metricName', direction: 'asc' },
                                    { field: '_type', direction: 'asc' },
                                    {
                                      field: 'metricProperty',
                                      direction: 'asc',
                                    },
                                  ])
                                  .filter('scope == $scope')
                                  .params({ scope: scopeInfo })
                                  .child((id) =>
                                    S.editor()
                                      .id(id)
                                      .title(id)
                                      .documentId(id)
                                      .schemaType(scopeInfo.type)
                                      .views([S.view.form()])
                                  )
                              )
                          )
                      );
                  })
                );
            }),
          S.listItem()
            .title('Timeline Event Collections')
            .icon(FaTags)
            .child(() =>
              S.documentTypeList('timelineEventCollection')
                .showIcons(true)
                .defaultOrdering([{ field: 'name', direction: 'asc' }])
            ),
        ])
    );
}
