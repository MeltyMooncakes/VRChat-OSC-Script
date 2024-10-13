# Just a silly little script for VRChat OSC Chatbox


> Media players semi-work, if you run into a bug please make an issue on the github page.
 Working media players (put in conifg exactly as listed): `VLC`, `YoutubeMusic`

---

To run, just do `pnpm start`

## Installing


### Arch
```bash
paru -Sy typescript pnpm nodejs git
git clone https://github.com/MeltyMooncakes/VRChat-OSC-Script
cd VRChat-OSC-Script
pnpm build
```
<br>

### Windows
Make sure you install [Git](https://git-scm.com/download/win) and [NodeJS](https://nodejs.org/en/download), then run:
```cmd
npm install -G typescript pnpm @pnpm/exe
git clone https://github.com/MeltyMooncakes/VRChat-OSC-Script
cd VRChat-OSC-Script
pnpm build
```
---

## Plugins
Please use the [Plugin Template](https://github.com/MeltyMooncakes/VRCOSC-Script-Plugin-Template/tree/master) to make plugins.

### Installation
To install a plugin, clone the repository into the plugins folder and run `pnpm build`.

### Uninstalling
Run the command `pnpm removePlugin PLUGIN-NAME`, please do not just delete the folder as runnning the command cleans up the unneeded dependancies.