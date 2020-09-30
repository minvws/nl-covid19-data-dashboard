# JSON input data validation

## Basic usage

From the root directory of the project run the following command: `yarn validate-json`

This will automatically validate all of the json files present in the
`<root-folder>`/public/json folder.

## Validating a single JSON file

When generating data it can be useful to check simply one file instead of every
file that lives in the public/json directory.

Therefore it is also possible to execute this command with the given parameters:
`yarn validate-single <schema-name> <json-filename>`

## Technical details

The schemas are located in the `<project-name>`/schema folder. This folder also
contains a folder named _validator_ which contains the scripts that perform the
actual validation logic. Each other folder contains a schema where the main
entry point has the same name as its containing folder. I.e. The folder
‘national’ contains a file called national.json. The other files present in the
same folder are sub schemas that are referenced by the main one. This is done to
keep things readable.

## Typescript generation

The schemas are also used to generate Typescript interfaces from. This way the
data shape is always synchronized with the frontend implementations. To execute
this functionality run the `yarn generate-typescript` command from the project
root directory. The output of this script is saved to the
**src/types/data.d.ts** file.

## JSON Dataformat

### Restrictions

- File names are not important for the backend, so we are free to rename them.
- The top-level object definition **can not** have nested object definitions for
  different indicators. We can not for example group different data sources
  belonging to intensive care in a single JSON definition. This is the result of
  a software limitation at the backend. Every "indicator" requires all of its
  properties to be specified in the root of the file definition.
- The root property names `values` and `last_value` are set in stone. This is a
  result of software limitations at the backend. We choose the property names
  that are used in the "value" definition.
- Other property names are allowed to change, but we need to coordinate it with
  backend.
- Since we can not group data by context like "everything intensive care", we
  group data by context + source, thus using a single JSON definition for each
  combination. For example "bedbezetting" for hospitals and IC are coming from a
  single source, so we could have them in a single JSON file, but we split them
  into intensive_care_beds_occupied and hospitals_beds_occupied, so that
  intensive_care_beds_occupied can live next to intensive_care_intake.

### Guidelines For New Definitions

Use these guidelines when defining a new schema:

1. Name files starting with context and appended by subject. For example
   `intensive_care_beds_occupied.json` or `intensive_care_intake.json`. This way
   the files will sort naturally. Context is **singular** i.e. intensive_care
   and not intensive_cares.
2. The titles of the root and the definition, are used to generate the
   Typescript interfaces. To keep it simple name the definition with \_value
   suffix but keep otherwise the same as the root title.
3. Property names should first describe what it is and then optionally postfix
   how it is formatted, but the latter only if required for clarity, i.e.
   `date_of_report_unix` first describes what it is and then how it is
   formatted.

Most files currently do not follow these guidelines. If you want to see examples
look at `intensive_care_beds_occupied.json`, `intensive_care_intake.json` or `regional/nursing_home.json`.
