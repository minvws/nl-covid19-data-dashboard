# NL Coronavirus Dashboard - CMS

The Coronavirus Dashboard uses Sanity for its CMS. This document is aimed at
developers that have access to the CMS.

## Usage

Run `yarn dev` to serve the CMS. This will run the `sanity dev` command. The CMS can be run on an alternate port using `--port XXXX` in which `XXXX` is the port number. The command cannot be run in parallel with `yarn dev`from the app root folder.

Previewing production builds of the CMS are done using `yarn build` and `yarn start` from this directory respectively.

## Lokalize Texts

Part of the CMS contains short-copy translations, which we (for historical
reasons) refer to as Lokalize texts.For a more detailed explanation of how they
are used please read [the documentation](/docs/lokalize-texts.md)
