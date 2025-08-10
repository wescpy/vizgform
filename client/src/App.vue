<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <h1>📊 Google Sheets Viewer</h1>
        <nav>
          <router-link to="/" class="nav-link">Home</router-link>
        </nav>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 0;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  color: white;
  font-size: 24px;
  font-weight: 600;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.main {
  flex: 1;
  padding: 32px 0;
}
</style>