import { withDocument } from 'part:@sanity/form-builder';
import React, { forwardRef } from 'react';
import { dataStructure } from '../../../data/data-structure';

function getDropdownValues(area: 'in' | 'gm' | 'vr') {
  const collection = dataStructure[`${area}_collection`];

  return collection;
}

export const CollectionMetricSelectInput = withDocument(
  forwardRef((props: any, ref: any) => {
    const { type, value, onChange, document, compareValue, markers } = props;

    return <div>Collection</div>;
  })
);
