import { redis } from '$lib/server/redis';
import { formatDetails, combineSubAndDub, proxyUrl } from '$lib/utils';
import { META } from '@consumet/extensions';
export async function load({ params, fetch, url }) {
	const fetchDetails = async () => {
		try {
			const query = await fetch('../../graphql/details.graphql');
			const queryText = await query.text();

			const anilistResp = await fetch('https://graphql.anilist.co/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					query: queryText,
					variables: { id: params.id }
				})
			});

			const anilist = await anilistResp.json();
			return formatDetails(anilist.data.Media);
		} catch (error) {
			throw new Error(error);
		}
	};

	const fetchEpisodes = async () => {
		const anilist = new META.Anilist(undefined, {
			url: 'https://cors-anywhere.marsnebulasoup.workers.dev?'
		});

		const [episodesSubArray, episodesDubArray] = await Promise.all([
			anilist.fetchEpisodesListById(params.id, false, true),
			anilist.fetchEpisodesListById(params.id, true, true)
		]);
		return combineSubAndDub(episodesSubArray, episodesDubArray);
	};

	const anime = {
		details: fetchDetails(),
		streamed: {
			episodes: fetchEpisodes()
		}
	};
	return anime;
}

export const actions = {
	
};