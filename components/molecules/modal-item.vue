<template>
  <div class="modal-item">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.modal-item {
  padding: 0 30px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  border-bottom: 1px $border solid;
  min-height: 73px;
  input {
    width: 100%;
    min-height: inherit;
    display: flex;
    border: 0;
    background: none;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0;
    &::placeholder {
      color: $placeholder;
    }
  }
  label {
    min-width: 110px;
    justify-content: center;
    color: $text;
    flex-shrink: 0;
  }
}
.modal-item.is-vertical {
  flex-direction: column;
  align-self: flex-start;
  align-items: stretch;
  padding: 20px 25px;
  label {
    padding-bottom: 25px;
  }
}
</style>
