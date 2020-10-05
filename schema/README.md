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
entry point is `__index.json`. The other files in the folder are sub-schemas
that are referenced by the entry point.

## Typescript generation

The schemas are also used to generate Typescript interfaces from their `title`
attribute. This way the data shape is always synchronized with the frontend
implementations. To execute this functionality run the `yarn generate-typescript` command from the project root directory. The output of this
script is saved to the **src/types/data.d.ts** file. The titles are
automatically PascalCased so spaces and \_ are replaced. In other to avoid
naming conflicts it is advised to prefix the titles. See [Guidelines For New
Definitions](#guidelines-for-new-definitions)

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
3. In order to avoid Typescript interface name clashes between national and
   regional and municipal types, the data should have the `national_`,
   `regional_` etc prefix in the titles. That way we can tweak definition per
   source without creating any inter dependencies. An example of this is
   `nursing_home.json` which exists in both national and regional folders.
4. Property names should first say what it measuring is and then optionally
   postfix the how it was measured, but the latter only if required for clarity,
   i.e. `date_of_report_unix` first describes what it is and then how it is
   formatted.
5. Sometimes the JSON file contains only data for 1 measurement. In that case it
   is probably already evident from the title (= generated type) what the
   subject is, and then the property can just describe how it was measured. An
   example is `moving_average` in `hospital_intake (HospitalIntake) > values (HospitalIntakeValue[]) > moving_average`

Most files currently do not follow these guidelines. If you want to see examples
look at `intensive_care_beds_occupied.json`, `intensive_care_intake.json` or
`regional/nursing_home.json`.

### Naming Choices

A lot of things are named differently throughout the schemas. Below is a list of
choices moving forward. Add to this list whenever you make new schema's and
decide on a naming convension.

- nursing_home over nursery
- admissions over intake
- deceased over deaths
- infected over positively_tested
- intensive_care over intensivecare
- "kliniek" is simply referred to as "hospital" by lack of better term.
