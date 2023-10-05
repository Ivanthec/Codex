import { searchQuery } from '$lib/providers/anilist/utils';
export async function load({ fetch, params }) {
	let animes = null;
	try {
		const response = await fetch('https://graphql.anilist.co/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				query: searchQuery,
				variables: {
					search: params.query
				}
			})
		});
		animes = await response.json();
	} catch (error) {
		console.log(error);
	}
	return {
		page: animes?.data?.Page?.pageinfo || {},
		results: animes?.data?.Page?.media || [],
		params: params.query
	};
}
