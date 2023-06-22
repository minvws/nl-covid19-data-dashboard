import fs from 'fs';
import { get } from 'lodash';
import path from 'path';
import prettier from 'prettier';
import { isDefined } from 'ts-is-present';
import * as ts from 'typescript';
import { schemaDirectory } from '../config';

const header = `
  /**
   * DO NOT MANUALLY CHANGE THE CONTENTS OF THIS FILE!
   * This file is generated based on the JSON schema's by yarn generate-data-structures in the cli package.
   */
`;

const skippedProperties = ['code', 'vrcode', 'gmcode', 'country_code', 'date_unix', 'date_of_insertion_unix', 'date_start_unix', 'date_end_unix', 'sewer_per_installation'];

(async function () {
  const schemaContent = fs.readdirSync(schemaDirectory);
  const schemaNames = schemaContent.filter((item) => fs.lstatSync(path.join(schemaDirectory, item)).isDirectory());

  const schemas = schemaNames.map(resolveSchema).reduce((aggr, x) => {
    return {
      ...aggr,
      ...x,
    };
  }, {});

  const code = generateCodeStructure(schemas);

  // TODO (COR-1491): change this once CMS V2 has been omitted.
  fs.writeFileSync(path.join(process.cwd(), '../cms/src/studio/data/data-structure.ts'), code, {
    encoding: 'utf-8',
  });
})();

function resolveSchema(schemaName: string) {
  const schemaRoot = path.join(schemaDirectory, schemaName);
  const rootSchema = JSON.parse(
    fs.readFileSync(path.join(schemaRoot, '__index.json'), {
      encoding: 'utf-8',
    })
  );
  const fullSchema = loadRefs(rootSchema, schemaRoot);
  const structure = constructDataStructure(fullSchema, schemaName);

  return { [schemaName]: structure };
}

function constructDataStructure(schema: any, schemaName: string) {
  const { properties } = schema;
  delete schema.properties;

  if (schemaName.endsWith('_collection')) {
    Object.keys(properties).forEach((x) => {
      if (!isDefined(properties[x]?.properties) || skippedProperties.includes(x)) {
        delete properties[x];
      } else {
        const valuesProperties = properties[x]?.properties;
        properties[x] = Object.keys(valuesProperties).filter(skipProperties);
      }
    });
  } else {
    Object.keys(properties).forEach((x) => {
      if (!isDefined(properties[x]?.properties?.values) || skippedProperties.includes(x)) {
        delete properties[x];
      } else {
        delete properties[x]?.properties?.last_value;
        const valuesProperties = properties[x]?.properties?.values?.properties;
        properties[x] = Object.keys(valuesProperties).filter(skipProperties);
      }
    });
  }

  return {
    ...schema,
    ...properties,
  };
}

function loadRefs(schema: any, schemaRoot: string) {
  if (isDefined(schema.properties)) {
    const result = { properties: null };
    result.properties = Object.fromEntries(
      Object.entries(schema.properties as Record<string, any>).map(([key, value]) => {
        if (isDefined(value.$ref) && value.$ref.endsWith('.json')) {
          return [key, loadRef(value.$ref, schemaRoot)];
        }
        if (isDefined(value.$ref) && value.$ref.startsWith('#/')) {
          const path = value.$ref.split('/');
          path.shift();
          return [key, get(schema, path)];
        }
        if (isDefined(value.type) && value.type === 'array') {
          if (value.items.$ref.endsWith('.json')) {
            return [key, loadRef(value.items.$ref, schemaRoot)];
          } else if (value.items.$ref.startsWith('#/')) {
            const path = value.items.$ref.split('/');
            path.shift();
            return [key, get(schema, path)];
          }
        }
        return [key, value];
      })
    ) as any;
    return result;
  }
  return undefined;
}

function loadRef(filename: string, schemaRoot: string) {
  const schemaPath = path.join(schemaRoot, filename);
  const subSchema = JSON.parse(fs.readFileSync(schemaPath, { encoding: 'utf-8' }));
  return loadRefs(subSchema, schemaRoot);
}

export const dataStructure = {
  nl: {
    ziekenhuis: ['naam1', 'naam2', 'naam3'],
  },
  vr_collection: ['naam1', 'naam2'],
};

function generateCodeStructure(schemaInfo: Record<string, any>) {
  const file = ts.createSourceFile('data-structure.ts', '', ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const propertyAssignments = Object.entries(schemaInfo).map(([key, value]) => createPropertyValue(key, value));
  const variableInitializer = ts.factory.createObjectLiteralExpression(propertyAssignments);

  const variableDecl = ts.factory.createVariableDeclaration('dataStructure', undefined, undefined, variableInitializer);

  const exportModifier = ts.factory.createModifier(ts.SyntaxKind.ExportKeyword);
  const variableStatement = ts.factory.createVariableStatement([exportModifier], ts.factory.createVariableDeclarationList([variableDecl], ts.NodeFlags.Const));

  const source = printer.printNode(ts.EmitHint.Unspecified, variableStatement, file);

  return prettier.format(header + source, { parser: 'typescript', singleQuote: true, printWidth: 180 });
}

function createPropertyValue(name: string, value: any) {
  const propertyAssignments = Object.keys(value).map((x) => {
    return ts.factory.createPropertyAssignment(x, ts.factory.createArrayLiteralExpression(value[x].map((y: string) => ts.factory.createStringLiteral(y))));
  });
  const props = ts.factory.createObjectLiteralExpression(propertyAssignments);

  return ts.factory.createPropertyAssignment(name, props);
}

function skipProperties(propertyName: string) {
  return !skippedProperties.includes(propertyName);
}
