<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Signin from './components/Signin.vue'
import Navigation from "./components/Navigation.vue"


</script>

<template>
  <div class="app">
    <Navigation />
    <RouterView />
  </div>
</template>


<style lang="scss">
:root {
  --bg-color: #1f1f21;
  --primary: #4ade80;
  --gray: #64748b;
  --dark: #1e293b;
  --light: #f1f5f9;
  --dark-alt: #334155;
  --sidebar-width: 300px;
  --text-color:#fff;

}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  // background: var(--light);
  // background: rgba(0, 0, 0, 0.918);
  background-color: var(--bg-color);
  color: var(--text-color);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;

  main {
    max-height: 100vh;
    overflow-y: scroll;
    flex: 1 1 0;
    padding: 2rem;
  }
}


@media (max-width: 768px) {
  .app {
    main {
      padding-left: 5rem;
    }
  }
}
</style>