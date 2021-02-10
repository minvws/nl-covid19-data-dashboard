# CLI

## Scripts

`yarn validate-json` This validates all JSON files from the `public/json` folder
against their given schema.

`yarn validate-single <schema-name> <json-file>` This validates a single JSON
file from the `public/json` folder against the given schema.

`yarn generate-typescript` Generates the `src/types/data.d.ts` file based on the
JSON schemas.

`yarn validate-last-values` This validates all time series by matching every
last_value object against the last item in the values array.
