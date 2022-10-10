import { StructureBuilder as S } from '@sanity/structure';
import documentStore from 'part:@sanity/base/datastore/document';
import { BsBook, BsBookHalf, BsFillPuzzleFill } from 'react-icons/bs';
import { FaLanguage } from 'react-icons/fa';
import { map } from 'rxjs/operators';

interface PagePartPage {
  _id: string;
  identifier: string;
  title: string;
}

interface PagePartChildPage {
  _id: string;
  _type: string;
  title: string;
}

export function pagePartListItem() {
  return S.listItem().id('dashboard-paginas').title("Dashboard Pagina's").icon(BsBook).child(pageIdentifierListemItem);
}

function pageIdentifierListemItem() {
  return documentStore.listenQuery(`*[_type == 'pageIdentifier' && !(_id in path("drafts.**"))]{ _id, identifier, title }`).pipe(
    map((pages: PagePartPage[]) => {
      return S.list()
        .title('Pagina')
        .items(pages.sort((a, b) => a.title.localeCompare(b.title)).map(pageDataListItem));
    })
  );
}

function pageDataListItem(page: PagePartPage) {
  return S.listItem()
    .title(page.title)
    .id(page._id)
    .icon(BsBookHalf)
    .child(
      documentStore.listenQuery(`*[pageIdentifier._ref == $id && !(_id in path("drafts.**"))]{ _id, _type, title }`, { id: page._id }).pipe(
        map((childPages: PagePartChildPage[]) =>
          S.list()
            .title('Pagina onderdelen')
            .items(
              childPages
                .sort((a, b) => a.title.localeCompare(b.title))
                .map(pageDataItem)
                .concat(
                  [
                    { scope: 'nl', title: 'Landelijk lokalize' },
                    { scope: 'gm', title: 'Gemeente lokalize' },
                    { scope: 'vr', title: 'Regio lokalize' },
                    { scope: 'shared', title: 'Gedeelde lokalize' },
                  ].map((item) =>
                    S.listItem()
                      .id(item.scope)
                      .title(item.scope)
                      .icon(FaLanguage)
                      .child(
                        S.documentList()
                          .title(item.title)
                          .filter('_type == "lokalizeText" && key match $subject')
                          .params({
                            subject: `pages.${page.identifier}.${item.scope}.**`,
                          })
                      )
                  )
                )
            )
        )
      )
    );
}

function pageDataItem(pageData: PagePartChildPage) {
  return S.listItem()
    .title(pageData.title)
    .id(pageData._id)
    .icon(BsFillPuzzleFill)
    .child(S.editor().id(pageData._id).schemaType(pageData._type).documentId(pageData._id).views([S.view.form()]));
}
