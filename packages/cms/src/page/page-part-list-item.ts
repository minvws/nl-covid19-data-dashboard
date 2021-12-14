import { StructureBuilder as S } from '@sanity/structure';
import documentStore from 'part:@sanity/base/datastore/document';
import { BsBook, BsBookHalf, BsFillPuzzleFill } from 'react-icons/bs';
import { map } from 'rxjs/operators';

const scopes = ['nl', 'gm', 'vr'];

export function pagePartListItem() {
  return S.listItem()
    .title("Dashboard Pagina's")
    .icon(BsBook)
    .child(pageIdentifierListemItem);
}

function pageIdentifierListemItem() {
  return documentStore
    .listenQuery(
      `*[_type == 'pageIdentifier' && !(_id in path("drafts.**"))]{ title,_id,identifier }`
    )
    .pipe(
      map((pages: { title: string; _id: string }[]) => {
        return S.list()
          .title('Pagina')
          .items(
            pages
              .sort((a, b) => a.title.localeCompare(b.title))
              .map(pageDataListItem)
          );
      })
    );
}

function pageDataListItem(page: any) {
  console.log(page);
  return S.listItem()
    .title(page.title)
    .id(page._id)
    .icon(BsBookHalf)
    .child(
      documentStore
        .listenQuery(
          `*[pageIdentifier._ref == $id && !(_id in path("drafts.**")) || _type == "lokalizeText" && subject match $name]`,
          {
            id: page._id,
            name: `${page.identifier}*`,
          }
        )
        .pipe(
          map((childPages: any) =>
            S.list()
              .title('Pagina onderdelen')
              .items(
                childPages
                  .sort((a: any, b: any) => a.title.localeCompare(b.title))
                  .map(pageDataItem)
                  .concat(
                    scopes.map((scope) =>
                      S.listItem()
                        .title(scope)
                        .icon(BsBookHalf)
                        .child(
                          documentStore
                            .listenQuery(
                              `*[_type == "lokalizeText" && subject == $name]`,
                              {
                                name: `deceasedPage_${scope}`,
                              }
                            )
                            .pipe(
                              map((subjects: []) => {
                                console.log(subjects);
                                const type = 'lokalizeText';
                                return S.list()
                                  .title('Onderwerp')
                                  .items(
                                    subjects.map((subject: any) => {
                                      return S.listItem()
                                        .title(subject.key)
                                        .id(subject.key)
                                        .child(
                                          S.documentList()
                                            .id(`${subject}-child`)
                                            .title(subject.subject)
                                            .schemaType(type)
                                            .defaultOrdering([
                                              {
                                                field: 'key',
                                                direction: 'asc',
                                              },
                                            ])
                                            .filter('subject == $subject')
                                            .params({ subject })
                                            .child((id) =>
                                              S.editor()
                                                .id(id)
                                                .schemaType(type)
                                                .documentId(id)
                                                .views([S.view.form()])
                                            )
                                        );
                                    })
                                  );
                              })
                            )
                        )
                    )
                  )
              )
          )
        )
    );
}

function pageDataItem(pageData: any) {
  return S.listItem()
    .title(pageData.title)
    .id(pageData._id)
    .icon(BsFillPuzzleFill)
    .child(
      S.editor()
        .id(pageData._id)
        .schemaType(pageData._type)
        .documentId(pageData._id)
        .views([S.view.form()])
    );
}
