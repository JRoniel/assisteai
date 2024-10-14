// middleware/getMovies.js
const axios = require("axios");

// Sua chave de API do TMDb (Bearer Token)
const API_KEY = "";
const BASE_URL = "https://api.themoviedb.org/3";

// Função para obter todos os gêneros disponíveis na API
async function getGenresMovies() {
	const url = `${BASE_URL}/genre/movie/list`;
	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
			params: { language: "pt-BR" },
		});

		const genres = response.data.genres;
		return genres.reduce((acc, genre) => {
			acc[genre.name] = genre.id;
			return acc;
		}, {});
	} catch (error) {
		console.error(`Erro: ${error.response.status}`);
		return {};
	}
}

module.exports = {
	getGenresMovies,
};
