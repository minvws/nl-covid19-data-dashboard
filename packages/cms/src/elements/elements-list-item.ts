import { StructureBuilder as S } from '@sanity/structure';
import uniq from 'lodash/uniq';
import documentStore from 'part:@sanity/base/datastore/document';
import { FaChartLine } from 'react-icons/fa';
import { map } from 'rxjs/operators';

export function elementsListItem() {
  return S.listItem()
    .title('Elements')
    .icon(FaChartLine)
    .child(() => {
      const types = ['timeSeries', 'kpi', 'choropleth'];

      return documentStore
        .listenQuery(
          `*[_type in $types]{ scope, metricName, metricProperty }`,
          { types }
        )
        .pipe(
          map((doc: { scope: string }[]) => {
            const scopes = uniq(doc.map((x) => x.scope));

            return S.list()
              .title('Scope')
              .items(
                scopes
                  .sort((a, b) => a.localeCompare(b))
                  .map((scope) =>
                    S.listItem()
                      .title(scope)
                      .id(scope)
                      .child(
                        S.documentList()
                          .id(`${scope}-element`)
                          .title('Element')
                          .defaultOrdering([
                            { field: 'metricName', direction: 'asc' },
                            { field: '_type', direction: 'asc' },
                            { field: 'metricProperty', direction: 'asc' },
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
    });
}
