<template>
  <div class="modal fade" tabindex="-1" aria-labelledby="" aria-hidden="true" ref="modalEle">
    <div class="modal-dialog" :class="size">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Закрыть"
          ></button>
        </div>
        <div class="modal-body">
          <slot name="body" />
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'

export default {
  name: 'b-modal',
  data() {
    return {
      modal: null
    }
  },

  props: {
    title: {
      type: String,
      default: '<<Title goes here>>'
    },
    size: null
  },

  mounted() {
    this.modal = new Modal(this.$refs.modalEle)
    this.$refs.modalEle.addEventListener('hidden.bs.modal', () => {
      this.$emit('close')
    })
    this.modal.show()
  }
}
</script>
