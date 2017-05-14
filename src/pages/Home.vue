<template>
  <div>
    <UploadModal ref="upload"></UploadModal>

    <nav class="nav has-shadow">
      <div class="nav-left">
        <div class="nav-item">
          <img src="../assets/logo.png" alt="SuperFreight logo">
        </div>
      </div>

      <div class="nav-right">
        <div class="nav-item">
          <div class="field is-grouped">
            <p class="control">
              <button class="button is-secondary" @click="toggleIconsList" title="Toggle view">
                <span class="icon">
                  <i v-if="list === 'list'" class="fa fa-th-large"></i>
                  <i v-if="list === 'icons'" class="fa fa-th-list"></i>
                </span>
              </button>
            </p>
            <p class="control">
              <button class="button is-secondary" @click="reload" title="Refresh files">
                <span class="icon">
                  <i class="fa fa-refresh"></i>
                </span>
              </button>
            </p>
            <p class="control">
              <button class="button is-primary" @click="showUpload" title="Upload files">
                <span class="icon">
                  <i class="fa fa-upload"></i>
                </span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="list === 'icons'" id="list-icons">
      <a v-for="(file, name) in files" class="file" :href="fileLink(name)" target="_blank" :title="name">
        <span v-if="hasPreview(file.mime)" class="ic preview" :style="previewImage(name)"></span>
        <span v-else class="ic">
          <i :class="fileIcon(file.mime)"></i>
        </span>
        <span class="name">{{name}}</span>
        <span class="size">{{file.size | filesize}}</span>
      </a>
    </div>

    <div v-if="list === 'list'" id="list-list">
      <table class="table">
        <tbody>
          <tr v-for="(file, name) in files">
            <td><span class="icon"><i :class="fileIcon(file.mime)"></i></span></td>
            <td><a class="file" :href="fileLink(name)" target="_blank">{{name}}</a></td>
            <td>{{file.size | filesize}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import filesize from 'filesize'
import UploadModal from '@/components/UploadModal.vue'

export default {
  name: 'hello',
  components: { UploadModal },
  data () {
    return {
      files: null,
      list: 'icons'
    }
  },
  computed: {
  },
  methods: {
    fileLink (name) {
      return global.url + '/files/' + name
    },
    reload () {
      console.log('Reloading...')

      this.$store.commit('changeLoading', true)

      window.axios.get('/files').then((response) => {
        console.log('HTTP OK:', response)
        this.$store.commit('changeLoading', false)
        this.files = response.data
      }).catch((error) => {
        console.warn('HTTP ERR:', error)
        this.$store.commit('changeLoading', false)
      })
    },
    toggleIconsList () {
      console.log('Toggling view...')

      if (this.list === 'icons') {
        this.list = 'list'
      } else {
        this.list = 'icons'
      }
    },
    showUpload () {
      console.log('Showing upload...')

      this.$refs.upload.toggle()
    },
    hasPreview (mime) {
      switch (mime) {
        // images
        case 'image/jpeg': return true
        case 'image/png': return true
        case 'image/svg': return true
        case 'image/bmp': return true
        case 'image/x-windows-bmp': return true
        case 'image/gif': return true
        case 'image/x-icon': return true
        case 'image/pjpeg': return true
        case 'image/x-jps': return true
        case 'image/tiff': return true
        case 'image/x-tiff': return true
      }

      return false
    },
    previewImage (name) {
      return 'background-image: url(' + this.fileLink(name) + ')'
    },
    fileIcon (mime) {
      let icon = 'fa fa-'
      switch (mime.split('/')[0]) {
        case 'image': icon += 'file-image-o'; break
        case 'video': icon += 'file-video-o'; break
        case 'audio': icon += 'file-sound-o'; break
        case 'text': icon += 'file-text-o'; break
        // default
        default: icon += 'file'; break
      }

      // override specific
      switch (mime) {
        // PDF
        case 'application/pdf': icon = 'fa fa-file-pdf-o'; break
        // Excel
        case 'application/excel': icon = 'fa fa-file-excel-o'; break
        case 'application/vnd.ms-excel': icon = 'fa fa-file-excel-o'; break
        case 'application/x-excel': icon = 'fa fa-file-excel-o'; break
        case 'application/x-msexcel': icon = 'fa fa-file-excel-o'; break
        // Spreadsheets
        case 'application/vnd.sun.xml.calc': icon = 'fa fa-table'; break
        case 'application/vnd.sun.xml.calc.template': icon = 'fa fa-table'; break
        case 'application/vnd.kde.kspread': icon = 'fa fa-table'; break
        case 'application/vnd.stardivision.calc': icon = 'fa fa-table'; break
        // Word
        case 'application/msword': icon = 'fa fa-file-word-o'; break
        // Rich editors
        case 'application/vnd.oasis.opendocument.text': icon = 'fa fa-file-text-o'; break
        case 'application/vnd.sun.xml.writer': icon = 'fa fa-file-text-o'; break
        case 'application/vnd.sun.xml.writer.template': icon = 'fa fa-file-text-o'; break
        case 'application/vnd.kde.kword': icon = 'fa fa-file-text-o'; break
        case 'application/vnd.sun.xml.writer.global': icon = 'fa fa-file-text-o'; break
        case 'application/vnd.stardivision.writer': icon = 'fa fa-file-text-o'; break
        case 'application/vnd.stardivision.writer-global': icon = 'fa fa-file-text-o'; break
        // Archives
        case 'application/x-compressed': icon = 'fa fa-file-zip-o'; break
        case 'application/x-zip-compressed': icon = 'fa fa-file-zip-o'; break
        case 'application/zip': icon = 'fa fa-file-zip-o'; break
        case 'multipart/x-zip': icon = 'fa fa-file-zip-o'; break
        case 'application/x-gzip': icon = 'fa fa-file-zip-o'; break
        case 'application/x-bzip2': icon = 'fa fa-file-zip-o'; break
        case 'application/x-bzip': icon = 'fa fa-file-zip-o'; break
        case 'application/x-tar': icon = 'fa fa-file-zip-o'; break
        case 'application/x-rar-compressed': icon = 'fa fa-file-zip-o'; break
        case 'application/x-7z-compressed': icon = 'fa fa-file-zip-o'; break
        case 'application/x-ace-compressed': icon = 'fa fa-file-zip-o'; break
        // Programming
        case 'text/xml': icon = 'fa fa-file-code-o'; break
        case 'text/html': icon = 'fa fa-file-code-o'; break
        case 'application/javascript': icon = 'fa fa-file-code-o'; break
        case 'application/json': icon = 'fa fa-file-code-o'; break
        case 'text/css': icon = 'fa fa-file-code-o'; break
        case 'application/x-php': icon = 'fa fa-file-code-o'; break
        case 'application/x-python': icon = 'fa fa-file-code-o'; break
        case 'application/xhtml+xml': icon = 'fa fa-file-code-o'; break
      }

      return icon
    }
  },
  filters: {
    filesize (size) {
      return filesize(size)
    }
  },
  mounted () {
    this.reload()
  }
}
</script>

<style scoped>
#list-icons {
  margin-top: 20px;
}

#list-icons a.file {
  display: inline-block;
  margin: 10px;
  text-align: center;
  width: 100px;
  height: 120px
}

#list-icons span.ic{
  display: block;
  box-sizing: border-box;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

span.name {
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  height: 20px;
}

#list-icons span.ic i {
  display: block;
  font-size: 48px;
}

#list-icons span.preview {
  background-size: cover;
  height: 48px;
}

#list-icons span.size {
  font-size: .8em;
  color: #cccccc;
}

#list-list span.icon{
}
</style>
