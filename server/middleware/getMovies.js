// middleware/getMovies.js
const axios = require("axios");

const { getGenresMovies } = require("./getGenres");

// Sua chave de API do TMDb (Bearer Token)
const API_KEY =
	"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjU2ZWI5MmIxNmFlMjcxYmU5MzE3ZGRiNjBhNjgwZiIsIm5iZiI6MTcyNzc4OTgxNi40MTA3MDksInN1YiI6IjY2ZmJmYTQzZTc4MTFlZjZjYmE2N2VkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.woYB-ZiPY72h90XGnmaXTjKaXzahIjgt4yY1psnS67I";
const BASE_URL = "https://api.themoviedb.org/3";

// Função para obter filmes por gênero
async function getMoviesByGenre(genreIds, page = 1) {
	const url = `${BASE_URL}/discover/movie`;
	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
			params: {
				language: "pt-BR",
				sort_by: "popularity.desc",
				with_genres: genreIds.join(","),
				page: page,
			},
		});

		return response.data.results;
	} catch (error) {
		console.error(`Erro: ${error.response.status}`);
		return [];
	}
}

async function getRecomended(page = 1) {
	const url = `${BASE_URL}/movie/popular`;
	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
			params: {
				language: "pt-BR",
				page,
			},
		});

		if (!response || !response.data || !response.data.results) {
			throw new Error("Erro ao recuperar filmes populares");
		}

		const recommendedMovies = response.data.results;

		// Exibir os títulos dos filmes recomendados
		if (recommendedMovies.length > 0) {
			return recommendedMovies.map((movie) => ({
				title: movie.title,
				popularity: movie.popularity,
				poster: movie.poster_path,
				release_date: movie.release_date,
			}));
		}
	} catch (error) {
		console.error(
			`Erro: ${error.response ? error.response.status : error.message}`,
		);
		return [];
	}
}

// Função principal para recomendar filmes com base nos gêneros predefinidos
async function searchMovies(predefinedGenres) {
	const genres = await getGenresMovies();

	// Mapeia os gêneros predefinidos para seus respectivos IDs
	const selectedGenreIds = predefinedGenres
		.map((genre) => genres[genre])
		.filter((id) => id !== undefined);

	if (selectedGenreIds.length === 0) {
		console.log("Nenhum gênero válido foi selecionado.");
		return []; // Retorna um array vazio se não houver gêneros válidos
	}

	// Obter recomendações com base nos gêneros
	const recommendedMovies = await getMoviesByGenre(selectedGenreIds);

	// Exibir os títulos dos filmes recomendados
	if (recommendedMovies.length > 0) {
		return recommendedMovies.map((movie) => ({
			title: movie.title,
			popularity: movie.popularity,
			poster: movie.poster_path,
			release_date: movie.release_date,
		}));
	}

	console.log("Nenhum filme foi encontrado para esses gêneros.");
	return []; // Retorna um array vazio se não houver filmes recomendados
}

module.exports = {
	searchMovies,
	getMoviesByGenre,
	getRecomended,
};
