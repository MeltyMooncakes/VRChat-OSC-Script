# Just a silly little script for VRChat OSC Chatbox


---

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
## Running
```bash
pnpm start
```

Media players will NOT work on windows at the current moment, if you are running windows, please help implement it.
Working media players (put in conifg exactly as listed): `VLC`, `YoutubeMusic`
