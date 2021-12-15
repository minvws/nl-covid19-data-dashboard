import { StructureBuilder as S } from '@sanity/structure';
import documentStore from 'part:@sanity/base/datastore/document';
import { BsBook, BsBookHalf, BsFillPuzzleFill } from 'react-icons/bs';
import { FaLanguage } from 'react-icons/fa';
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
  return S.listItem()
    .title(page.title)
    .id(page._id)
    .icon(BsBookHalf)
    .child(
      documentStore
        .listenQuery(
          `*[pageIdentifier._ref == $id && !(_id in path("drafts.**"))]`,
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
                        .icon(FaLanguage)
                        .child(
                          S.documentList()
                            .title(scope)
                            .filter(
                              '_type == "lokalizeText" && subject == $name'
                            )
                            .params({ name: `deceasedPage_${scope}` })
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
