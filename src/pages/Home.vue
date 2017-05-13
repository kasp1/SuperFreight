<template>
  <div>
    <Navigation></Navigation>
    <div id="list">
      <a v-for="(file, name) in files" class="file" :href="fileLink(name)" target="_blank">
        <span class="icon">
          <i class="fa fa-file"></i>
        </span>
        <span class="name">{{name}}</span>
        <span class="size">{{file.size | filesize}}</span>
      </a>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'
import filesize from 'filesize'

export default {
  name: 'hello',
  components: { Navigation },
  data () {
    return {
      files: null
    }
  },
  computed: {
  },
  methods: {
    fileLink (name) {
      return global.url + 'files/' + name
    },
    refresh () {
      console.log('Refreshing...')

      this.$store.commit('changeLoading', true)

      window.axios.get('/files').then((response) => {
        console.log('HTTP OK:', response)
        this.$store.commit('changeLoading', false)
        this.files = response.data
      }).catch((error) => {
        console.warn('HTTP ERR:', error)
        this.$store.commit('changeLoading', false)
      })
    }
  },
  filters: {
    filesize (size) {
      return filesize(size)
    }
  },
  mounted () {
    this.refresh()
  }
}
</script>

<style scoped>
#list {
  margin-top: 20px;
}

a.file {
  display: inline-block;
  margin: 10px;
  text-align: center;
}

span.icon{
  display: block;
  box-sizing: border-box;
  text-align: center;
  margin: 10px;
  height: 40px;
}

span.icon i {
  display: block;
  text-align: center;
  font-size: 3em;
}

span.size {
  display: block;
  font-size: .8em;
  color: #cccccc;
}
</style>
