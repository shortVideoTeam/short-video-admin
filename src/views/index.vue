<template>
  <div class="dashboard-editor-container">
    <img src="@/assets/images/welcome.gif" />
  </div>
</template>

<script>

export default {
  name: 'Index',
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  position: relative;

  width: 100%;
  height: calc(100vh - 84px);

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
