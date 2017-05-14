<template>
  <modal v-if="show" @close="toggle">
    <dropzone
      id="dz"
      slot="body"
      :url="uploadUrl"
      :showRemoveLink="false"
      :thumbnailHeight="100"
      :thumbnailWidth="100"
      :maxFileSizeInMB="1000000000000"
      :useFontAwesome="true"
      :maxNumberOfFiles="1000000">
    </dropzone>
    <h3 slot="header">File Upload</h3>
    <span slot="close-button-title">Hide</span>
  </modal>
</template>

<script>
import Dropzone from 'vue2-dropzone'
import Modal from '@/components/Modal.vue'

export default {
  name: 'UploadModal',
  components: { Modal, Dropzone },
  data () {
    return {
      show: false
    }
  },
  computed: {
    uploadUrl () {
      return window.url + '/files'
    }
  },
  methods: {
    toggle () {
      this.show = !this.show

      if (this.show === false) {
        this.$parent.reload()
      }
    }
  }
}
</script>

<style>
</style>
