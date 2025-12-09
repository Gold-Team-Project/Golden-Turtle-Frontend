<template>
  <div :class="['pagination', className]">
    <div class="frame">
      <div class="text-wrapper">&lt;</div>
    </div>

    <div class="frame">
      <div class="text-wrapper">1</div>
    </div>

    <div class="frame">
      <div class="text-wrapper">2</div>
    </div>

    <div class="frame">
      <div class="text-wrapper">3</div>
    </div>

    <div class="frame">
      <div class="text-wrapper">4</div>
    </div>

    <div class="frame">
      <div class="text-wrapper">5</div>
    </div>

    <div class="frame">
      <div class="text-wrapper">&gt;</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    className: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
.pagination {
  align-items: center;
  display: flex;
  height: 40px;
  justify-content: space-between;
  left: 1082px;
  position: relative;
  top: 3017px;
  width: 220px;
}

.pagination .frame {
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  position: relative;
}

.pagination .text-wrapper {
  align-self: stretch;
  color: #ffffff;
  font-family: "Inter-Black", Helvetica;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0;
  line-height: normal;
  margin-top: -1.00px;
  position: relative;
  text-align: center;
}
</style>