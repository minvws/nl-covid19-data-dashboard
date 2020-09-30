# JSON input data validation

## Basic usage

From the root directory of the project run the following command: `yarn validate-json`

This will automatically validate all of the json files present in the `<root-folder>`/public/json folder.

## Validating a single JSON file

When generating data it can be useful to check simply one file instead of every file that lives in the public/json directory.

Therefore it is also possible to execute this command with the given parameters: `yarn validate-single <schema-name> <json-filename>`

## Technical details

The schemas are located in the `<project-name>`/schema folder. This folder also contains a folder named _validator_ which contains the scripts that perform the actual validation logic.
Each other folder contains a schema where the main entry point has the same name as its containing folder.
I.e. The folder ‘national’ contains a file called national.json. The other files present in the same folder are sub schemas that are referenced by the main
one. This is done to keep things readable.

## Typescript generation

The schemas are also used to generate Typescript interfaces from. This way the data shape is always synchronized with the frontend implementations.
To execute this functionality run the `yarn generate-typescript` command from the project root directory.
The output of this script is saved to the **src/types/data.d.ts** file.
