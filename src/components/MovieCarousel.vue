<template>
  <div class="three">
    <h2>Em alta</h2>
  </div>
  <div class="carousel-container">
    <button class="carousel-button prev" @click="scrollLeft">⟨</button>
    <div class="carousel" ref="carousel">
      <div class="movie-card" v-for="movie in movies" :key="movie.title" @mouseover="hover = movie.title"
        @mouseleave="hover = ''">
        <div class="movie-poster">
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster}`" :alt="movie.title" />


          <!-- Botão de remover ao passar o mouse -->
          <button v-if="hover === movie.title" class="remove-button" @click="addToWatchlist(movie)">
            Assistir depois
          </button>

        </div>
        <h3>{{ movie.title }} / {{ movie.release_date }}</h3>
      </div>
    </div>
    <button class="carousel-button next" @click="scrollRight">⟩</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movies: [],
      watchlist: [],
      watchedList: [],
      hover: '' // Estado para saber qual filme está sendo hoverado
    }
  },
  created() {
    this.fetchMovies();
    this.loadWatchlist();
    this.loadWatchedList();
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await fetch('http://localhost:3000/api');
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
    markAsWatched(movie) {
      const watchedList = [...this.watchedList];
      watchedList.push(movie);
      localStorage.setItem('watchedList', JSON.stringify(watchedList));
      console.log(`${movie.title} adicionado  lista de "j  assisti".`);
      this.loadWatchedList();
    }
  }
};
</script>

<style scoped>
.carousel-container {
  display: flex;
  align-items: center;
  position: relative;
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

.movie-card h3 {
  font-size: 1rem;
  /* Tamanho da fonte ajustado */
  white-space: nowrap;
  /* Impede que o texto quebre em várias linhas */
  overflow: hidden;
  /* Oculta o excesso de texto */
  text-overflow: ellipsis;
  /* Adiciona reticências (...) no final do texto longo */
  width: 150px;
  /* Define a largura máxima do texto */
  margin: 0 auto;
  /* Centraliza o texto */
}

/* Escurece o poster ao passar o mouse */
.movie-poster:hover img {
  opacity: 0.3;
}

/* Estilo do overlay que cobre o pôster e contém os botões */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* Alinha os botões verticalmente */
  justify-content: space-between;
  /* Espaçamento entre os botões */
}

/* Botões clicáveis sobre o poster */
.overlay button {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  /* Ocupa toda a largura */
  transition: background-color 0.3s ease;
}

/* Botão superior (⭐) e botão inferior (👍) */
.top-button,
.bottom-button {
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay .top-button:hover {
  background-color: rgba(0, 255, 0, 0.5);
}

.overlay .bottom-button:hover {
  background-color: rgba(255, 0, 0, 0.5);
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
  /* Esconde a barra de rolagem */
}
</style>
