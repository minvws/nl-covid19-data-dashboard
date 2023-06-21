# NL Coronavirus Dashboard - CMS

The Coronavirus Dashboard uses Sanity for its CMS. This document is aimed at
developers that have access to the CMS.

## Usage

Run `yarn sanity login` and choose the Google option. This retrieves a token
which is then used to talk to the Sanity API.

Run `yarn dev` to start serve the CMS.

## Lokalize Texts

Part of the CMS contains short-copy translations, which we (for historical
reasons) refer to as Lokalize texts.For a more detailed explanation of how they
are used please read [the documentation](/docs/lokalize-texts.md)
