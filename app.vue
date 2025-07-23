<template>
  <NuxtPage />
</template>
<!-- <RouterView -->

<script>
if (import.meta.client) {

  document.addEventListener(
    "touchmove",
    function (event) {
      event.preventDefault();
    },
    { passive: false }
  ); // 禁用默认行为
}
</script>

<style>
html,
body {
  padding: 0px;
  margin: 0px;
}
</style>
