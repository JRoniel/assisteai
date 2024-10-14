<template>
  <div class="genre-selector">
    <div class="header">
      <div class="three">
        <h2>Sua escolha</h2>
      </div>
      <button @click="resetCheck" class="clear-button">Limpar escolhas</button>
    </div>

    <!-- Checkboxes para seleção de gêneros -->
    <div class="checkbox-container">
      <label v-for="genre in genres" :key="genre.id" class="genre-label">
        <input type="checkbox" :value="genre.name" v-model="selectedGenres" @change="fetchMoviesByGenres" />
        {{ genre.name }}
      </label>

    </div>

    <!-- Carrossel com filmes retornados do backend -->
    <div v-if="movies.length > 0" class="carousel-container">
      <button class="carousel-button prev" @click="scrollLeft">⟨</button>
      <div class="carousel" ref="carousel">
        <div class="movie-card" v-for="movie in movies" :key="movie.title" @mouseover="hover = movie.title"
          @mouseleave="hover = ''">

          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster}`" :alt="movie.title" />

          <h3>{{ movie.title }} / {{ movie.release_date }}</h3>

          <!-- Botão de remover ao passar o mouse -->
          <button v-if="hover === movie.title" class="remove-button" @click="addToWatchlist(movie)">
            Assistir depois
          </button>
        </div>
      </div>
      <button class="carousel-button next" @click="scrollRight">⟩</button>
    </div>

    <!-- Skeleton screen placeholder enquanto não houver filmes -->
    <div v-else class="skeleton-container">
      <div class="skeleton-card" v-for="n in 2" :key="n">
        <div class="skeleton-image"></div>
        <div class="skeleton-text"></div>
      </div>
    </div>

    <div v-if="movies.length === 0 && selectedGenres.length > 0">
      <p>Nenhum filme encontrado para os gêneros selecionados.</p>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      genres: [], // Gêneros de filmes carregados do backend
      selectedGenres: [], // Gêneros selecionados pelo usuário
      movies: [], // Filmes filtrados baseados nos gêneros
    };
  },
  created() {
    this.fetchGenres(); // Carrega os gêneros ao montar o componente
  },
  methods: {

    resetCheck() {
      this.selectedGenres = [];
      // biome-ignore lint/complexity/noForEach: <explanation>
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      document.querySelectorAll(".genre-selector input[type=checkbox]").forEach(el => el.checked = false);
    },

    // Faz uma requisição para carregar os gêneros de filmes
    async fetchGenres() {
      try {
        const response = await fetch('http://localhost:3000/api/genres');
        const data = await response.json();
        this.genres = Object.entries(data).map(([name, id]) => ({ name, id })); // Mapeia nome e id
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      }
    },

    // Faz uma requisição com base nos gêneros selecionados para buscar filmes
    async fetchMoviesByGenres() {
      if (this.selectedGenres.length === 0) {
        this.movies = []; // Limpa os filmes se nenhum gênero for selecionado
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/movies?genres=${this.selectedGenres.join(',')}`);
        const data = await response.json();
        this.movies = data.map(movie => ({
          title: movie.title,
          poster: movie.poster,
          release_date: movie.release_date.slice(0, 4)
        }));
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
      }
    },

    // Funções de scroll para o carrossel
    loadWatchlist() {
      const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
      this.watchlist = storedWatchlist;
    },
    loadWatchedList() {
      const storedWatchedList = JSON.parse(localStorage.getItem('watchedList')) || [];
      this.watchedList = storedWatchedList;
    },
    scrollLeft() {
      const carousel = this.$refs.carousel;
      if (carousel.scrollLeft === 0) {
        carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: -300, behavior: 'smooth' });
      }
    },
    scrollRight() {
      const carousel = this.$refs.carousel;
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScrollLeft) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
      }
    },
    addToWatchlist(movie) {
      const watchlist = [...this.watchlist];
      if (!watchlist.some(item => item.title === movie.title)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        console.log(`${movie.title} adicionado à lista de "quero assistir".`);
        this.loadWatchlist();
      } else {
        console.log(`${movie.title} j  est  na lista de "quero assistir".`);
      }
    },
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.clear-button {
  background-color: red;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
}

.clear-button:hover {
  background-color: darkred;
}


.movie-card {
  display: inline-block;
  margin: 0 10px;
  text-align: center;
  width: 150px;
  /* Limita o tamanho dos quadros */
  flex-shrink: 0;
  position: relative;
  /* Para permitir a sobreposição dos botões */
}

.movie-poster {
  position: relative;
}

.movie-card img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: opacity 0.3s ease;
  /* Transição suave para o efeito de escurecimento */
}


.remove-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 15px;
  font-size: 12px;
  display: none;
  /* Inicialmente escondido */
}

.movie-card:hover .remove-button {
  display: block;
  /* Exibe o botão ao passar o mouse */
}

/* Escurece o poster ao passar o mouse */
.movie-poster:hover img {
  opacity: 0.3;
}

.skeleton-container {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.skeleton-card {
  width: 150px;
  height: 244px;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skeleton-image {
  width: 150px;
  height: 244px;
  background-color: #e0e0e0;
  border-radius: 8px;
}

.skeleton-text {
  width: 80%;
  height: 15px;
  background-color: #e0e0e0;
  margin-top: 10px;
  border-radius: 4px;
}

.checkbox-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px;
}

.genre-label {
  font-size: 1.1rem;
}

.carousel-container {
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 20px;
}

.carousel {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  white-space: nowrap;
  padding: 10px 0;
}

.movie-card {
  display: inline-block;
  margin: 0 10px;
  text-align: center;
  width: 150px;
  flex-shrink: 0;
}

.movie-card img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.movie-card h3 {
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  margin: 0 auto;
}

.carousel-button {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 24px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.prev {
  left: 0;
}

.next {
  right: 0;
}

.carousel::-webkit-scrollbar {
  display: none;
}
</style>