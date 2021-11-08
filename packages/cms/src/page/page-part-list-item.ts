import { StructureBuilder as S } from '@sanity/structure';
import documentStore from 'part:@sanity/base/datastore/document';
import { RiPagesFill } from 'react-icons/ri';
import { map } from 'rxjs/operators';

export function pagePartListItem() {
  return S.listItem()
    .title("Dashboard Pagina's")
    .icon(RiPagesFill)
    .child(pageIdentifierListemItem);
}

function pageIdentifierListemItem() {
  return documentStore
    .listenQuery(
      `*[_type == 'pageIdentifier' && !(_id in path("drafts.**"))]{ title,_id }`
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
    .icon(RiPagesFill)
    .child(
      documentStore
        .listenQuery(
          `*[pageIdentifier._ref == $id && !(_id in path("drafts.**"))]`,
          {
            id: page._id,
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
              )
          )
        )
    );
}

function pageDataItem(pageData: any) {
  return S.listItem()
    .title(pageData.title)
    .id(pageData._id)
    .icon(RiPagesFill)
    .child(
      S.editor()
        .id(pageData._id)
        .schemaType(pageData._type)
        .documentId(pageData._id)
        .views([S.view.form()])
    );
}
