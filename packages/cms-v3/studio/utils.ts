import { MetricName } from '@corona-dashboard/common';
import { StructureBuilder } from 'sanity/desk';
import { titleByElementType, titleByMetricName } from './constants';

// Adds a new structure item and any children
export const addStructureItem = (S: StructureBuilder, icon: React.FC, title: string, schemaType: string, documentId = schemaType) => {
  return S.listItem()
    .id(schemaType)
    .title(title)
    .icon(icon)
    .schemaType(schemaType)
    .child((id) => S.editor().id(id).title(title).schemaType(schemaType).documentId(documentId).views([S.view.form()]));
};

// Map a metric name to a user-friendly title
export const getTitleForMetricName = (metricName: MetricName) => titleByMetricName[metricName] || metricName;

// Map an element type to a user-friendly title
export const getTitleForElementType = (elementType: string) => titleByElementType[elementType] || elementType;
