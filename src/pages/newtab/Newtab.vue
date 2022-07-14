<template>
  <div className="App">
    <header className="App-header">
      <i-custom-vue-logo class="App-logo" alt="logo" />      
      <p>Edit <code>src/pages/newtab/Newtab.vue</code> and save to reload.</p>
      <a
        class="App-link"
        href="https://vuejs.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Vue 3!
      </a>
      <h6>The color of this paragraph is defined using SASS.</h6>
    </header>
  </div>
</template>

<script lang="ts">

import { defineComponent } from "vue";

export default defineComponent({});
</script>

<style lang="scss">
.App {
  text-align: center;

  &-logo {
    height: 40vmin;
    pointer-events: none;
    @media (prefers-reduced-motion: no-preference) {
      animation: App-logo-spin infinite 20s linear;
    }
  }

  &-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }

  &-link {
    color: #61dafb;
  }
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

$myColor: red;

h1,
h2,
h3,
h4,
h5,
h6 {
  color: $myColor;
}
</style>
