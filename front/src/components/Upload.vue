<template>
  <div class="upload">
    
    <b-card title="📌 J'ancre un contenu">
        <b-card-text>
          Le fichier que je charge reste confidentiel : il doit être conservé.
          Son empreinte, le commentaire et mon compte sont horodatés.
        </b-card-text>

        <b-form @submit="onSubmit" @reset="onReset" v-if="show">

            <b-form-group label="Fichier" label-for="upload-file" label-cols-sm="2" label-size="lg"
              description="L'empreinte est calculée automatiquement">
              <b-form-file id="upload-file" size="lg"
                v-model="file" :state="Boolean(file)"
                placeholder="Choisir un fichier ou le déposer ici..."
                drop-placeholder="Déposer le fichier ici..."
                v-on:change="fileChosen"
                :file-name-formatter="fileNameFormatter"
              ></b-form-file>
            </b-form-group>

            <b-form-group label="Commentaire" label-for="comment" label-cols-sm="2" label-size="lg">
              <b-form-input id="comment" size="lg" v-model="form.comment" required
                placeholder="Entrer un commentaire..."
              ></b-form-input>
            </b-form-group>

            <b-form-group v-if="form.hashcode" label="Données à ancrer dans la blockchain" label-for="proof-content" label-cols-sm="2" label-size="lg">
              <b-card class="json-code">
                <pre><code id="proof-content">{{form}}</code></pre>
              </b-card>
            </b-form-group>

            <b-form-group label-for="btns" label-cols-sm="2">
                <b-button-group id="btns" size="lg">
                    <b-button type="submit" variant="primary" :title="needMetamask" :disabled="$store.state.providerType===false || computing">
                      <div v-if="computing"><b-spinner type="grow"/> Calcul</div>
                      <div v-else><i class="icon-law"/> Référencer</div>
                    </b-button>
                    <b-button type="reset">Réinitialiser</b-button>
                </b-button-group>
                <div v-if="error" class="error">{{error}}</div>
            </b-form-group>

            <b-form-group v-if="transactionResult" label="Transaction" label-for="transaction-id" label-cols-sm="2" label-size="lg">
                <b-card class="json-code">
                  <pre><code id="transaction-id">{{transactionResult}}</code></pre>
                </b-card>
                <a class="transaction" v-if="transactionResult && transactionUrl" :href="transactionUrl" target="_blank" rel="noopener">
                  <qrcode-vue className="qrcode" :value="transactionUrl" :foreground="'#2c3e50'"></qrcode-vue>
                </a>
                <div v-if="transactionResult" class="info">Lorsqu'elles sont validées, les transacions apparaissent dans le bloc "événements". Veuillez récupérer le certificat afin de le conserver avec le document.</div>
            </b-form-group>
        </b-form>
    </b-card>
  </div>
</template>

<script>

import BlckchnAntProver from '../lib/BlckchnAntProver.js'
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue
  },
  name: 'Upload',
  props: {
  },
  data() {
    return {
      computing: false,
      file: null,
      form: {
        hashcode: null,
        comment: null
      },
      transactionResult: null,
      show: true,
      error: null
    }
  },

  computed: {
    transactionUrl: function () {
      let baseUrl = BlckchnAntProver.etherscanBaseUrl()
      return baseUrl && this.transactionResult  ? baseUrl + '/tx/' + this.transactionResult : null
    },
    needMetamask: function () {
      return this.$store.state.providerType===false ? 'Veuillez installer Metamask' : null
    }
  },
  
  methods: {
      async fileChosen(evt) {
        let theFile = evt.target.files[0]
        this.form.comment = theFile.name
        this.form.hashcode = ''
        this.computing = true
        this.form.hashcode = await BlckchnAntProver.calculateHashFromFile(theFile)
        this.computing = false
      },
      onSubmit(evt) {
        evt.preventDefault()
        this.transactionResult = null
        this.error = null
        BlckchnAntProver.sendHash(this.form.hashcode, this.form.comment, (error, transaction) => {
          if (error) {
            this.error = error
            return
          }
          this.transactionResult = transaction
        })
      },
      onReset(evt) {
        evt.preventDefault()
        this.transactionResult = null
        this.file = null
        this.form.hashcode = null
        this.form.comment = null
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      },
      fileNameFormatter(files) {
        let max = 50
        return files[0].name.length<max ? files[0].name : files[0].name.slice(0, max)+'...'
      }
    }
}
</script>

<style scoped>
>>> .custom-file-input ~ .custom-file-label[data-browse]::after {
  content: 'Parcourir';
}
.error {
  margin-top: 10px;
  color: red;
}
.error::before {
  content: "⛐ ";
}
.transaction {
  margin-top: 5px;
}
.qrcode, .info {
  display: block;
  float: left;
  padding-left: 20px;
}
.qrcode {
  padding-top: 5px;
}
</style>
