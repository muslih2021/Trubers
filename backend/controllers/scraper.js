import Tiktok from "@xct007/tiktok-scraper";
import fetch from "node-fetch";

const _userAgent = process.env.USER_AGENT;
const _xIgAppId = process.env.X_IG_APP_ID;

if (!_userAgent || !_xIgAppId) {
	console.error("Missing USER_AGENT or X_IG_APP_ID in .env");
	process.exit(1);
}

const getId = (url) => {
	const regex =
		/instagram.com\/(?:[A-Za-z0-9_.]+\/)?(p|reels?|stories)\/([A-Za-z0-9-_]+)/;
	const match = url.match(regex);
	return match?.[2] || null;
};

export const getInstagramData = async (url) => {
	const igId = getId(url);
	if (!igId) throw new Error("Invalid Instagram URL");

	const graphql = new URL(`https://www.instagram.com/api/graphql`);
	graphql.searchParams.set("variables", JSON.stringify({ shortcode: igId }));
	graphql.searchParams.set("doc_id", "10015901848480474");
	graphql.searchParams.set("lsd", "AVqbxe3J_YA");

	const response = await fetch(graphql, {
		method: "POST",
		headers: {
			"User-Agent": _userAgent,
			"Content-Type": "application/x-www-form-urlencoded",
			"X-IG-App-ID": _xIgAppId,
			"X-FB-LSD": "AVqbxe3J_YA",
			"X-ASBD-ID": "129477",
			"Sec-Fetch-Site": "same-origin",
		},
	});

	if (!response.ok)
		throw new Error(`Instagram responded with status ${response.status}`);

	const json = await response.json();
	const items = json?.data?.xdt_shortcode_media;
	if (!items) throw new Error("No media found");

	return {
		display_url: items?.display_url || null,
		video_view_count: items?.video_view_count || 0,
		video_play_count: items?.video_play_count || 0,
		caption: items?.edge_media_to_caption?.edges[0]?.node?.text || "",
		owner: items?.owner || {},
		like_count: items?.edge_media_preview_like?.count || 0,
		comment_count: items?.edge_media_to_comment?.count || 0,
		thumbnail_src: items?.thumbnail_src,
		username: items?.owner?.username,
	};
};

export const getTiktokData = async (url) => {
	const rawData = await Tiktok(url, { parse: false });
	const item = rawData[0];
	if (!item) throw new Error("TikTok data not found");

	return {
		desc: item.desc,
		nickname: item.author.nickname,
		comment_count: item.statistics.comment_count,
		digg_count: item.statistics.digg_count,
		play_count: item.statistics.play_count,
		cover: item.video.cover.url_list[0],
		username: item.author.unique_id,
	};
};
