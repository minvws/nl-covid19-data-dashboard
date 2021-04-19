import { UnknownObject } from '@corona-dashboard/common';
import fs from 'fs';
import path from 'path';
import { isDefined } from 'ts-is-present';

export type CustomValidationFunction = (
  input: Record<string, unknown>
) => string[] | undefined;

export function createChoroplethValidation(
  choroplethCollectionPath: string,
  codeProperty: string
) {
  const collectionJson = JSON.parse(
    fs.readFileSync(choroplethCollectionPath, { encoding: 'utf8' })
  );
  return validateChoroplethValues.bind(
    undefined,
    path.basename(choroplethCollectionPath),
    collectionJson,
    codeProperty
  ) as CustomValidationFunction;
}

/**
 * This validation function receives a data file (either VR of GM) and a choropleth data file (GM_COLLECTION or VR_COLLECTION).
 * It extracts all of the data points that both files have in common, then it
 * compares the last_value property from each of these data points
 * in the datafile with the corresponding value in the choropleth file using the codeProperty to find the correct value.
 *
 * For example, GM0014.json has three data points that are also present in the GM_COLLECTION.json: tested_overall, hospital_nice and sewer.
 * The validator loops over these three properties in the collection file and for each finds the value where the 'gmcode' property
 * is equal to 'GM0014'.
 * It then compares the 'last_value' property of tested_overall, hospital_nice
 * and sewer with each corresponding data point from the collection file.
 *
 */
export const validateChoroplethValues = (
  collectionJsonFilename: string,
  collectionJson: Record<string, any>, // The GM_COLLECTION.sjon or VR_COLLECTION.json
  codeProperty: string, //the gmcode or vrcode property name
  input: Record<string, any> //GM***.json or VR***.json
): string[] | undefined => {
  const commonDataProperties = getCommonDataProperties(input, collectionJson);

  const code = input.code;

  const results = commonDataProperties
    .map((propertyName) => {
      const collectionValue = collectionJson[propertyName].find(
        (x: any) => x[codeProperty] === code
      );
      if (!collectionValue) {
        return `No item with property ${codeProperty} == ${code} was found in the ${propertyName} collection (${collectionJsonFilename})`;
      }
      const lastValue = input[propertyName].last_value;
      return validateCommonPropertyEquality(
        lastValue,
        collectionValue,
        propertyName
      );
    })
    .filter(isDefined);

  return results.length
    ? [
        `Data in the last_value properties of ${code}.json was not equal to its counterpart in ${collectionJsonFilename}:`,
        ...results,
      ]
    : undefined;
};

function validateCommonPropertyEquality(
  lastValue: UnknownObject,
  collectionValue: UnknownObject,
  propertyName: string
) {
  const commonProperties = getCommonProperties(collectionValue, lastValue);
  const result = commonProperties
    .map((key) => {
      return lastValue[key] !== collectionValue[key]
        ? `property ${propertyName}.${key} is not equal: (last_value) ${lastValue[key]} !== (choropleth data) ${collectionValue[key]}`
        : undefined;
    })
    .filter(isDefined);
  return result.length ? result.join(', ') : undefined;
}

function getCommonProperties(left: UnknownObject, right: UnknownObject) {
  return Object.keys(left).filter((key) => right.hasOwnProperty(key));
}

function getCommonDataProperties(left: UnknownObject, right: UnknownObject) {
  return Object.entries(left)
    .filter(([, values]) => typeof values === 'object')
    .map(([key]) => key)
    .filter((key) => right.hasOwnProperty(key));
}
