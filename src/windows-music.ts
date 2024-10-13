import winplayer, { Status, Position } from "@innei/winplayer-rs/emitter";


export async function getPlayer() {
	return await winplayer();
}