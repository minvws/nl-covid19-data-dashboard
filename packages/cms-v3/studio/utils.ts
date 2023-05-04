import { StructureBuilder } from 'sanity/desk';

// Adds a new list item and any children
export const addListItem = (S: StructureBuilder, icon: React.FC, title: string, schemaType: string, documentId = schemaType) => {
  return S.listItem()
    .id(schemaType)
    .title(title)
    .schemaType(schemaType)
    .icon(icon)
    .child((id) => S.editor().id(id).title(title).schemaType(schemaType).documentId(documentId).views([S.view.form()]));
};
