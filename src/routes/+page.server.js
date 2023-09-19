import { proxyUrl } from '$lib/utils';
export async function load({ fetch, setHeaders }) {
	try {
		const queryResponse = await fetch('graphql/home.graphql');
		const queryText = await queryResponse.text();

		const fetchAnilist = async () => {

			const anilistRes = await fetch('https://graphql.anilist.co/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					query: queryText
				})
			});

			let anilistData = await anilistRes.json();

			const result = {
				trendingAnimes: anilistData?.data?.trending?.media || [],
				popularAnimes: anilistData?.data?.popular?.media || []
			};
			return result;
		};


		return fetchAnilist();
	} catch (error) {
		console.log(error)
	}
}
