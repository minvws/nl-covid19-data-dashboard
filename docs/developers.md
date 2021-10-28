# Developer Notes

## Node-canvas vs Sharp running on Windows

Currently there is a dependency on node-canvas in combination with the sharp image compression library
for serverside rendering of the choropleths.
Unfortunately, this combination leads to a runtime crash under Windows. So, when a developer uses
this OS and runs into this issue, add this the `.env.local` file in the `packages/app` directory:

`DISABLE_COMPRESSION=1`

As the var suggests, this simply turns off the compression and avoids having to import the offending
library at runtime.

## Building Docker locally

To build the production Docker image locally, you can use the following command, with replaced environment variables:

```sh
docker build \
--build-arg DISABLE_SITEMAP=true \
--build-arg NEXT_PUBLIC_SANITY_PROJECT_ID=5mog5ask \
--build-arg SANITY_API_TOKEN=<token> \
--build-arg SANITY_PREVIEW_SECRET=<secret> \
--build-arg NEXT_PUBLIC_SANITY_DATASET=<development|production> \
--build-arg NEXT_PUBLIC_COMMIT_ID=<some_random_string> \
-t local-test \
.
```
