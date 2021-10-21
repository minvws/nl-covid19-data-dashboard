# Developer Notes

## Node-canvas vs Sharp running on Windows

Currently there is a dependency on node-canvas in combination with the sharp image compression library
for serverside rendering of the choropleths.
Unfortunately, this combination leads to a runtime crash under Windows. So, when a developer uses
this OS and runs into this issue, add this the `.env.local` file in the `packages/app` directory:

`DISABLE_COMPRESSION=1`

As the var suggests, this simply turns off the compression and avoids having to import the offending
library at runtime.
