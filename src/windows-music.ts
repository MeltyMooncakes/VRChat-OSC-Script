import winplayer, { Status, Position } from "@innei/winplayer-rs/emitter";


export async function getPlayer() {
	const playerManager = await winplayer();
	if (playerManager) {
		playerManager.on("MediaPropertiesChanged", (status: Status) => {
			console.log(status);
		});
	
		playerManager.on("PlaybackInfoChanged", (status: Status) => {
			console.log(status);
		});
	
		playerManager.on("TimelinePropertiesChanged", (position: Position) => {
			console.log(position);
		});
	}
}