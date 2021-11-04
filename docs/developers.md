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
--build-arg ARG_NEXT_PUBLIC_SANITY_PROJECT_ID="5mog5ask" \
--build-arg SANITY_API_TOKEN="<sanity_token>" \
--build-arg ARG_NEXT_PUBLIC_SANITY_DATASET="development" \
--build-arg ARG_NEXT_PUBLIC_COMMIT_ID="local-test-random-string" \
--build-arg ARG_API_URL="https://coronadashboard.rijksoverheid.nl/json/latest-data.zip" \
-t local-test \
.
```
