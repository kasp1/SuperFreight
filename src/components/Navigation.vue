<template>
<nav class="nav has-shadow">
  <div class="nav-left">
  </div>

  <div class="nav-center">
    <div class="nav-item">
      <strong>SuperFreight</strong>
    </div>
  </div>

  <!-- This "nav-toggle" hamburger menu is only visible on mobile -->
  <!-- You need JavaScript to toggle the "is-active" class on "nav-menu" -->
  <span class="nav-toggle">
    <span></span>
    <span></span>
    <span></span>
  </span>

  <!-- This "nav-menu" is hidden on mobile -->
  <!-- Add the modifier "is-active" to display it on mobile -->
  <div class="nav-right nav-menu">
    <div class="nav-item">
      <div class="field is-grouped">
        <p class="control">
          <a class="button is-default" :click="$parent.refresh()">
            <span class="icon">
              <i class="fa fa-refresh"></i>
            </span>
            <span>Refresh</span>
          </a>
        </p>
      </div>
    </div>
  </div>
</nav>
</template>

<script>
export default {
  name: 'Navigation',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
