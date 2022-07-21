import { UnknownObject } from '@corona-dashboard/common';
import fs from 'fs';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { JSONObject, JSONValue } from './types';

export function createChoroplethValidation(
  choroplethCollectionPath: string,
  codeProperty: string,
  excludedProperties: string[] = []
) {
  if (!fs.existsSync(choroplethCollectionPath)) {
    console.warn(
      `${choroplethCollectionPath} does not exist, unable to create Choropleth validation`
    );
    return () => {
      throw new Error(
        `${choroplethCollectionPath} does not exist, unable to to validate!`
      );
    };
  }
  const collectionJson = JSON.parse(
    fs.readFileSync(choroplethCollectionPath, { encoding: 'utf8' })
  );

  return (input: JSONObject) =>
    validateChoroplethValues(
      path.basename(choroplethCollectionPath),
      collectionJson,
      codeProperty,
      input,
      excludedProperties
    );
}

/**
 * This validation function receives a data file (either VR, GM or IN) and a choropleth data file (GM_COLLECTION, VR_COLLECTION).
 * It extracts all of the data points that both files have in common, then it
 * compares the last_value property from each of these data point
 * in the data file with the corresponding value in the choropleth file using the codeProperty to find the correct value.
 *
 * For example, GM0014.json has three data points that are also present in the GM_COLLECTION.json: tested_overall, hospital_nice and sewer.
 * The validator loops over these three properties in the collection file and for each finds the value where the 'gmcode' property
 * is equal to 'GM0014'.
 * It then compares the 'last_value' property of tested_overall, hospital_nice
 * and sewer with each corresponding data point from the collection file.
 *
 */
export const validateChoroplethValues = (
  collectionJsonFilename: string, // GM_COLLECTION.json|VR_COLLECTION.json
  collectionJson: JSONObject, // The contents of the aforementioned json file
  codeProperty: string, //the gmcode, vrcode, country_code property name
  input: JSONObject, // contents of a GM***.json or VR***.json or IN_***.json file
  excludedProperties: string[] //List of properties on the collectionJson that need to be skipped
): string[] | undefined => {
  const commonDataProperties = getCommonDataProperties(
    input,
    collectionJson,
    excludedProperties
  );
  const filePrefix = collectionJsonFilename.startsWith('IN_') ? 'IN_' : '';

  const code = input.code;

  const results = commonDataProperties
    .map((propertyName) => {
      if (!Array.isArray(collectionJson[propertyName])) {
        throw new Error(
          `${propertyName} in ${collectionJsonFilename} is not an array property!`
        );
      }

      const collectionValue = (
        collectionJson[propertyName] as JSONValue[]
      )?.find((x: any) => x[codeProperty] === code) as UnknownObject;

      if (!collectionValue) {
        return `No item with property ${codeProperty} == ${code} was found in the ${propertyName} collection (${collectionJsonFilename})`;
      }

      const lastValue = (input[propertyName] as { last_value: UnknownObject })
        .last_value;
      if (!isDefined(lastValue)) {
        return `No last_value property exists on ${propertyName}`;
      }

      return validateCommonPropertyEquality(
        lastValue,
        collectionValue,
        propertyName
      );
    })
    .filter(isDefined);

  return results.length
    ? [
        `Data in the last_value properties of ${filePrefix}${code}.json was not equal to its counterpart in ${collectionJsonFilename}:`,
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
  return Object.keys(left).filter((key) =>
    Object.prototype.hasOwnProperty.call(right, key)
  );
}

function getCommonDataProperties(
  left: UnknownObject,
  right: UnknownObject,
  excludedProperties: string[]
) {
  return Object.entries(left)
    .filter(([, values]) => typeof values === 'object')
    .map(([key]) => key)
    .filter(
      (key) =>
        Object.prototype.hasOwnProperty.call(right, key) &&
        !excludedProperties.includes(key)
    );
}
