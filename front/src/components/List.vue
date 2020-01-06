<template>
  <div class="list">
    <b-card title="☰ Je consulte les empreintes">
      <b-card-text>
        Je liste mes empreintes ou l'ensemble des empreintes référencées. En cliquant sur l'empreinte, j'accède au détail.
      </b-card-text>

        <b-form-group label-for="nothing" label-cols-sm="2">
          <b-form-checkbox switch size="lg"
            v-on:input="scopeInput"
            id="scope" v-model="scope" name="scope" value="myonly" unchecked-value="all"
          >Mes empreintes uniquement</b-form-checkbox>
        
          <b-button id="reload" size="lg" @click="reload" :title="needMetamask" :disabled="$store.state.providerType===false || loading">
            <div v-if="loading"><b-spinner type="grow" style="width: 1.9rem; height: 1.9rem;"/> Chargement</div>
            <div v-else><i class="icon-repeat"/> {{hashes?'Rec':'C'}}harger</div>
          </b-button>
          <div v-if="error" class="error">{{error}}</div>
        </b-form-group>

        <b-table v-if="hashes"
          small borderless hover selectable select-mode="single"
          :items="hashes" :fields="fields"
          :per-page="perPage" :current-page="currentPage" @row-selected="selected">
        </b-table>
        <b-pagination v-if="hashes" v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align=center></b-pagination>
        <b-card v-if="info" class="json-code">
          <pre><code id="info">{{info}}</code></pre>
        </b-card>
    </b-card>
  </div>
</template>

<script>

import BlckchnAntProver from '../lib/BlckchnAntProver.js'

export default {
  name: 'List',
  props: {
  },
  data() {
    return {
      loading: false,
      scope: 'myonly',

      hashes: null,
      info: null,
      error: null,

      fields: [{
        key: 'h',
        label: 'Empreinte'
      }],
      totalRows: 0,
      perPage: 10,
      currentPage: 1
    }
  },

  computed: {
    needMetamask: function () {
      return this.$store.state.providerType===false ? 'Veuillez installer Metamask' : null
    }
  },
  
  methods: {
    reload() {
      this.loading = true
      this.info = null
      this.hashes = null
      this.totalRows = 0
      this.error = null
      if (this.scope == 'myonly') {
        BlckchnAntProver.getAccounts().then((accounts) => {
          let account = accounts[0]
          BlckchnAntProver.listBySender(account, (error, result) => {
            this.loading = false
            if (error) {
              this.error = error
              return
            }
            this.hashes = result.map(c => { return {h: c} })
            this.totalRows = result.length
          })
        })
      } else {
        BlckchnAntProver.list((error, result) => {
          this.loading = false
          if (error) {
            this.error  = error
            return
          }
          this.hashes = result.map(c => { return {h: c} })
          this.totalRows = result.length
        })
      }
    },
    selected(item) {
      console.log('selected', item)
      BlckchnAntProver.findHash(item[0].h, (error, result) => {
        console.log('result', error, result)
        if (error) {
          this.error  = error
          return
        }
        this.info = result
      })
    },
    scopeInput() {
      this.reload()
    }
  }
}
</script>

<style scoped>
#reload {
  margin-top: 10px;
}
.error {
  margin-top: 10px;
  color: red;
}
.error::before {
  content: "⛐ ";
}
</style>
