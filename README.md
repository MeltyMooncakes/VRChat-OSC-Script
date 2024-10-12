# Just a silly little script for VRChat OSC Chatbox


> Media players will NOT work on windows at the current moment, if you are running windows, please help implement it.
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
npm install -G typescript pnpm
git clone https://github.com/MeltyMooncakes/VRChat-OSC-Script
cd VRChat-OSC-Script
pnpm build
```
---

## Plugins
Please use the [Plugin Template](https://github.com/MeltyMooncakes/VRCOSC-Script-Plugin-Template/tree/master) to make plugins.

### Installation
To install a plugin, Clone the repository into the plugins folder and run `pnpm build`.

### Uninstalling
Run the command `pnpm removePlugin PLUGIN-NAME`, please do not just delete the folder as runnning the command cleans up the unneeded dependancies.