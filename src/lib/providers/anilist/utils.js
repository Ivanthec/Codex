export const anilistUrl = "https://graphql.anilist.co/"
export const formatDetails = (media) => {
	const relations = media?.relations?.edges
		?.map((relation) => {
			return {
				relationType: relation?.relationType,
				id: relation?.node?.id,
				title: {
					romaji: relation?.node?.title?.romaji,
					english: relation?.node?.title?.english
				}
			};
		})
		.filter(
			(relation) => relation?.relationType == 'SEQUEL' || relation?.relationType == 'PREQUEL'
		);
	// Format studios
	const studios = media?.studios?.edges?.map((studio) => studio.node.name).join(', ');

	// Format airing date
	if (media.nextAiringEpisode) {
		const airingDate = new Date(media.nextAiringEpisode.airingAt * 1000);
		media.nextAiringEpisode.airingAt = airingDate.toDateString();
	}

	// Format date fields
	const formatDate = (date) => {
		const formattedDate = new Date(date.year, date.month - 1, date.day);
		return formattedDate.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	};

	media.startDate = formatDate(media?.startDate);
	media.endDate = formatDate(media?.endDate);

	// Remove HTML tags and trim description
	media.description = media?.description
        .replaceAll("<br>", "")
        .replaceAll("</br>", "")
        .replaceAll("<i>", "")
        .replaceAll("</i>", "")
		.replace(/<br\s*\/?>/gi, '')
		.replace(/&lt;br&gt;/g, '')
		.replace(/\<br\>/g, '')
		.trim();

	// Extract and format recommendations
	const recommendations = media?.recommendations?.edges?.map(
		(recommendation) => recommendation.node.mediaRecommendation
	);


	// Update the media object with the formatted data
	media.relations = relations;
	media.studios = studios;
	media.genres = media?.genres?.join(', ');
	media.recommendations = recommendations;
	return media;
};
export const watchListQuery = `
query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
	  idMal
      title {
        english
        native
      }
      coverImage {
        extraLarge
      }
      format
      genres
    }
  }`;

export const homeQuery = `
{
	trending: Page(page: 1, perPage: 15) {
	  media(type: ANIME,format: TV,episodes_greater: 0, sort: [TRENDING_DESC]) {
		id
		idMal
		bannerImage
		description(asHtml: false)
		title {
		  english
		  romaji
		}
		format
		genres
		meanScore
		episodes
		nextAiringEpisode {
		  episode
		}
	  }
	}
	popular: Page(page: 1, perPage: 16) {
	  media(type: ANIME, sort: [POPULARITY_DESC]) {
		id
		idMal
		coverImage {
		  extraLarge
		}
		title {
		  english
		  romaji
		}
		format
		genres
	  }
	}
  }`

export const detailsQuery = `
query ($id: Int) {
    Media(id: $id) {
        id
        idMal
        title {
            english
            native
        }
        coverImage {
            extraLarge
        }
        startDate {
            year
            month
            day
        }
        endDate {
            year
            month
            day
        }
        bannerImage
        seasonYear
        description(asHtml: false)
        format
        status(version: 2)
        genres
        meanScore
        nextAiringEpisode {
            airingAt
            timeUntilAiring
            episode
        }
        recommendations {
            edges {
                node {
                    mediaRecommendation {
                        id
						idMal
                        title {
                            romaji
                            english
                        }
                        coverImage {
                            extraLarge
                        }
                        genres
                        format
                    }
                }
            }
        }
        relations {
            edges {
                relationType
                node {
                    id
					idMal
                    title {
                        romaji
                        english
                    }
                }
            }
        }
        studios(isMain: true) {
            edges {
                node {
                    name
                }
            }
        }
    }
}


`
export const detailsQueryIdMal = `
query ($id: Int) {
    Media(idMal: $id) {
        id
        idMal
        title {
            english
            native
        }
        coverImage {
            extraLarge
        }
        startDate {
            year
            month
            day
        }
        endDate {
            year
            month
            day
        }
        bannerImage
        seasonYear
        description(asHtml: false)
        format
        status(version: 2)
        genres
        meanScore
        nextAiringEpisode {
            airingAt
            timeUntilAiring
            episode
        }
        recommendations {
            edges {
                node {
                    mediaRecommendation {
                        id
						idMal
                        title {
                            romaji
                            english
                        }
                        coverImage {
                            extraLarge
                        }
                        genres
                        format
                    }
                }
            }
        }
        relations {
            edges {
                relationType
                node {
                    id
					idMal
                    title {
                        romaji
                        english
                    }
                }
            }
        }
        studios(isMain: true) {
            edges {
                node {
                    name
                }
            }
        }
    }
}


`

export const searchQuery = `
query ($page: Int, $search: String,  $size: Int) {
	Page(page: $page, perPage: $size) {
	  pageInfo {
		currentPage
		lastPage
		hasNextPage
	  }
	  media(search: $search,type: ANIME) {
		id
		idMal
		title {
		  romaji
		  english
		}
		coverImage {
		  extraLarge
		  large
		}
  
		format
  
		genres
  
	  }
	}
  }
  `
