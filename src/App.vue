<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
::-webkit-scrollbar {
  width: 9px
}

::-webkit-scrollbar-track {
  background: rgba(102, 128, 153, .1)
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 128, 153, .5)
}

::-webkit-scrollbar-thumb {
  background: rgba(102, 128, 153, .2)
}

::-webkit-scrollbar-corner,
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(102, 128, 153, .1)
}
</style>
