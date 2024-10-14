<template>
  <div class="header">
    <div class="three">
      <h2>Assistir depois</h2>
    </div>
    <button @click="resetList" class="clear-button">Limpar lista</button>
  </div>
  <div class="carousel-container" v-if="watchlist.length > 0">
    <button class="carousel-button prev" @click="scrollLeft">⟨</button>
    <div class="carousel" ref="carousel">
      <div class="movie-card" v-for="movie in watchlist" :key="movie.title" @mouseover="hover = movie.title"
        @mouseleave="hover = ''">
        <img :src="`https://image.tmdb.org/t/p/w500${movie.poster}`" :alt="movie.title" />
        <h3>{{ movie.title }} / {{ movie.release_date }}</h3>

        <!-- Botão de remover ao passar o mouse -->
        <button v-if="hover === movie.title" class="remove-button" @click="removeFromWatchlist(movie)">
          Remover
        </button>
      </div>
    </div>
    <button class="carousel-button next" @click="scrollRight">⟩</button>
  </div>
  <div v-else class="carousel-not-movie">
    <p>Nenhum filme adicionado à watchlist ainda.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      watchlist: [], // Armazena a lista de filmes do localStorage
      hover: '', // Para controlar o hover nos filmes
    };
  },
  created() {
    this.loadWatchlist(); // Carrega a watchlist ao montar o componente
  },
  methods: {


    updateWatchlist(newMovie) {
      if (!this.watchlist.some(movie => movie.title === newMovie.title)) {
        this.watchlist.push(newMovie);
        localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
        console.log(`${newMovie.title} adicionado  + a watchlist.`);
      } else {
        console.log(`${newMovie.title} já  está  na watchlist.`);
      }
    },

    resetList() {
      localStorage.removeItem('watchlist');
      this.watchlist = []; // Limpa a lista no estado também
    },

    loadWatchlist() {
      const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
      this.watchlist = storedWatchlist;
    },

    scrollLeft() {
      const carousel = this.$refs.carousel;
      if (carousel.scrollLeft === 0) {
        // Se estiver no início, rola para o final
        carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: -300, behavior: 'smooth' }); // Rola 300px para a esquerda
      }
    },

    scrollRight() {
      const carousel = this.$refs.carousel;
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScrollLeft) {
        // Se estiver no final, volta para o início
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: 300, behavior: 'smooth' }); // Rola 300px para a direita
      }
    },

    removeFromWatchlist(movie) {
      // Remove o filme da lista
      this.watchlist = this.watchlist.filter(item => item.title !== movie.title);
      // Atualiza o localStorage
      localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
      this.loadWatchlist();
    }
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

.carousel-not-movie {
  display: block;
  padding-left: 15px;
  margin: auto;
}

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
  flex-shrink: 0;
  position: relative;
  /* Necessário para posicionar o botão de remoção */
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
