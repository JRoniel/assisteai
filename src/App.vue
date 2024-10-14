<template>
  <div id="app">
    <AppNavbar />
    <MovieCarousel />
    <WarchList />
    <SearchContainer />
  </div>
</template>

<script>
import MovieCarousel from './components/MovieCarousel.vue';
import AppNavbar from './components/Navbar.vue';
import WarchList from './components/WarchList.vue';
import SearchContainer from './components/SearchContainer.vue';

export default {
  components: {
    AppNavbar,
    MovieCarousel,
    WarchList,
    SearchContainer
  }
};
</script>
