<template>
  <button :class="['common-button', buttonClass]">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'CommonButton',
  props: {
    buttonClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.common-button {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  border: none;
}
</style>
