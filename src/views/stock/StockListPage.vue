<template>
  <div class="gt-box page-container">
    <h1 class="main-title">Market</h1>
    <StockListComponent />
  </div>
</template>

<script setup>
import StockListComponent from '@/components/stock/StockListComponent.vue';
</script>

<style scoped>
.page-container {
  padding: 2rem; /* Add some padding around the content */
  background-color: #2b2417; /* Dark background */
  min-height: calc(100vh - var(--header-height, 0px) - var(--footer-height, 0px)); /* Fill remaining height, adjust for header/footer if any */
  color: #f6c749; /* Default text color for the page */
}

.main-title {
    font-size: 64px;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 25px;
    color: #f6c749;
    text-align: left; /* Center the title */
    margin-top: -10px; /* Add some space from the top */
}
</style>
