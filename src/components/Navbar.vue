<template>
  <nav class="navbar">
    <div class="logo">AssisteAI</div>
    <ul class="nav-links">
      <li><a href="#">Encontre</a></li>
      <li><a href="#">Minha Lista</a></li>
      <li><a class="apoie" href="#">Apoie</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "AppNavbar",
}; 
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #ca0700;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  list-style: none;
  display: flex;
}

.nav-links li {
  margin-left: 20px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
}

a.apoie {
  background-color: #fff;
  color: #ca0700;
  padding: 10px 20px;
  border-radius: 5px;
}

a.apoie:hover {
  background-color: #ca0700;
  border: #fff 1px solid;
  color: #fff;
}
</style>
