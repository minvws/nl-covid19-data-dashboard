import { StructureBuilder as S } from '@sanity/structure';
import uniq from 'lodash/uniq';
import documentStore from 'part:@sanity/base/datastore/document';
import { FaChartLine, FaTags } from 'react-icons/fa';
import { map } from 'rxjs/operators';

export function elementsListItem() {
  return S.listItem()
    .id('datagerelateerde-content')
    .title('Datagerelateerde content')
    .icon(FaChartLine)
    .child((id) =>
      S.list()
        .id('datagerelateerde-content-list')
        .title('Datagerelateerde content')
        .items([
          S.listItem()
            .id(id)
            .title('Elements')
            .icon(FaChartLine)
            .child(() => {
              const types = ['timeSeries', 'kpi', 'choropleth', 'warning'];

              return documentStore
                .listenQuery(
                  `*[_type in $types]{ scope, metricName, metricProperty }`,
                  { types }
                )
                .pipe(
                  map((doc: { scope: string }[]) => {
                    const scopes = uniq(doc.map((x) => x.scope)).filter(
                      (s) => s !== undefined
                    );
                    console.log(scopes);

                    return S.list()
                      .id('datagerelateerde-content-list-items')
                      .title('Scope')
                      .items(
                        scopes
                          .sort((a, b) => a.localeCompare(b))
                          .map((scope, index) =>
                            S.listItem()
                              .title(scope)
                              .id(`${scope}-${index}`)
                              .child(
                                S.documentList()
                                  .id(`${scope}-element`)
                                  .title('Element')
                                  .defaultOrdering([
                                    { field: 'metricName', direction: 'asc' },
                                    { field: '_type', direction: 'asc' },
                                    {
                                      field: 'metricProperty',
                                      direction: 'asc',
                                    },
                                  ])
                                  .filter('scope == $scope')
                                  .params({ scope })
                                  .child((id) =>
                                    S.editor()
                                      .id(id)
                                      .title(id)
                                      .documentId(id)
                                      .views([S.view.form()])
                                  )
                              )
                          )
                      );
                  })
                );
            }),
          S.listItem()
            .id('timeline-event-collections')
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
