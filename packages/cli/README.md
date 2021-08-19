# CLI

## Scripts

`yarn validate-json-all` This validates all JSON files from the `public/json` folder
against their given schema.

`yarn validate-json-single <schema-name> <json-file>` This validates a single JSON
file from the `public/json` folder against the given schema.

`yarn generate-typescript` Generates the `src/types/data.ts` file based on the
JSON schemas.

`yarn validate-last-values` This validates all time series by matching every
last_value object against the last item in the values array.

`yarn validate-features` This validates all features. It enforces the data to be
available for enabled features and also for the data to be absent when a feature
is disabled.
