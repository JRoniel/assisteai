// server/index.js
const express = require("express");
const path = require("node:path");
const { getRecomended } = require("./middleware/getMovies");
const { searchMovies } = require("./middleware/getMovies");
const { getGenresMovies } = require("./middleware/getGenres");

const app = express();
const port = 3000;

app.use(express.json());

// Servindo arquivos estáticos da pasta 'dist'
app.use(express.static(path.join(__dirname, "../dist")));

app.get("/api", async (req, res) => {
	try {
		const recommendedMovies = await getRecomended();
		res.status(200).json(recommendedMovies);
	} catch (error) {
		res.status(500).json({ error: "Erro ao recomendar filmes" });
	}
});

app.get("/api/genres", async (req, res) => {
	try {
		const getGenres = await getGenresMovies();
		res.status(200).json(getGenres);
	} catch (error) {
		res.status(500).json({ error: "Erro ao retornar filmes" });
	}
});

app.get("/api/movies", async (req, res) => {
	try {
		const recommendedMovies = await searchMovies(req.query.genres.split(","));
		res.status(200).json(recommendedMovies);
	} catch (error) {
		res.status(500).json({ error: "Erro ao recomendar filmes" });
	}
});

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
