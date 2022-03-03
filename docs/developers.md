# Developer Notes

## Common and icon packages

The monorepo contains two shared packages: common and icons.
These packages are both built automatically whenever 'yarn dev' is ran in
packages/app, packages/cli or packages/cms.
There may be situations where this gets out of sync, for example when
merging develop into a branch.
Whenever strange compile or type check errors occur. The first thing to therefore
try is to explicitly build the common and icon package. This usually solves
the problem.

## Node-canvas vs Sharp running on Windows

Currently there is a dependency on node-canvas in combination with the sharp image compression library
for server-side rendering of the choropleths.
Unfortunately, this combination leads to a runtime crash under Windows. So, when a developer uses
this OS and runs into this issue, add this line to the `packages/app/.env.local` file:

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

Running:

```sh
docker run --init --publish 8080:8080 local-test
```

Debugging a running container:

```sh
# get the containerId first by running
docker ps

# then use the containerId to connect into it
docker exec -ti <containerId> sh

# you can now run certain commands to debug, to inspect file/dir sizes for example:
du -h -d 1 | sort -n
```

## Testing Windows screenreaders on Mac

To properly test accessibility on Mac, screenreaders for Windows should be
included in testing as well. This mainly involves NVDA and JAWS. Especially with
JAWS we already encountered some problems that were specific to how JAWS
navigates around a page, so it is good to test it seperately with tricky
accessibility cases.

To test these screenreaders on Mac, a Windows VM can be used. The following
steps get you through the process of installing it. Mainly inspired by [a
blogpost from
Voorhoede](https://www.voorhoede.nl/en/blog/testing-accessibility-on-windows-with-virtualbox/).

### Preparing the VM

1. Download & install [VirtualBox](https://www.virtualbox.org/wiki/Downloads).
2. Give Oracle permission in Security & Privacy. It needs this to run the
   drivers needed for the VMs.
3. Restart your computer.
4. Download a [Windows VM image from
   Microsoft](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/).
   Windows 10 with Edge is currently probably the best idea.
5. Extract the archive.
6. Start VirtualBox and choose 'Import' in the top bar. Import the .ovf file you
   just extracted.

### Installing the VM

1. Start the VM. The password should be 'Passw0rd!'.
2. For ease of use, it's good to remap VirtualBox's 'host key'. By default
   it's the left Cmd key, which is the Windows key in Windows, and we don't need
   a host key with this VM. Locate the downward pointing arrow in a blue box in
   the right bottom corner, click it and choose 'Keyboard settings'. Remap the
   host key to another key combination here. Something like Cmd+Option should
   work well.
3. Currently, the latest VM (Win 10 with Edge) still ships with the legacy Edge,
   so start by downloading & installing the latest Edge. If you want to test
   with other browsers as well, install those.
4. Since it is a somewhat outdated Windows version, you might want to either
   let it run all its updates, or set your active hours explicitly / pause
   updates to prevent Windows from starting downloading & installing updates
   every time you start the VM (since we will ‘freeze’ the current state of the
   VM later).

### Screenreaders

1. Download and install [NVDA](https://www.nvaccess.org/download/). During the
   installation process, deselect ‘Use NVDA on the Windows logon screen’.
2. Download and install
   [JAWS](https://support.freedomscientific.com/Downloads/JAWS). If you want to
   have support for Dutch, remember to select it in ‘Options’ on the first
   screen of the installation prompt.
3. After restarting the VM JAWS can ask for activation. Just click the
   ‘continue 40-minute trial’.
4. JAWS uses the ‘Insert’ key quite a bit, but most Macs don’t have it. Install
   [SharpKeys](https://github.com/randyrants/sharpkeys/releases) to map another
   key to the Insert key.
5. After installing, open SharpKeys and choose ‘Add’. Under the left column
   click ‘Type key’ and type the key you would like to use as ‘Insert’. Right
   Cmd works well since Windows does not really use it.
6. Click OK, then ‘Write to Registry’. You now have to log out and back in to
   make the remapping work.
7. For NVDA you can click ‘Use Caps Lock as an NVDA modifier key’ at the startup
   screen to use it with your Mac keyboard.

### Snapshot

To make sure our testing setup keeps working, we are going to snapshot the
current state of the VM. This way we can restore the current state every time we
are testing screenreaders.

1. In virtual box, go to the snapshots overview of the VM through the menu you
   get when clicking the menu button on the VM in the left bar.
2. Click ‘Take’ on the left top, and click OK.
3. Now whenever you are done testing with the VM, close the VM by closing the window itself (not through Windows), and choose ‘Power off’ with the ‘Restore snapshot’ option enabled.

[Back to index](index.md)
