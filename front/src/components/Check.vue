<template>
  <div class="check">
    <b-card title="❓ Je vérifie un contenu">
        <b-card-text>
          Je charge le fichier que je souhaite vérifier ou je précise directement son empreinte.
        </b-card-text>

        <b-form @submit="onSubmit">

            <b-form-group label="Fichier" label-for="upload-file" label-cols-sm="2" label-size="lg"
              description="L'empreinte est calculée automatiquement">
              <b-form-file id="upload-file" size="lg"
                v-model="file" 
                placeholder="Choisir un fichier ou le déposer ici..."
                drop-placeholder="Déposer le fichier ici..."
                v-on:change="fileChosen"
                :file-name-formatter="fileNameFormatter"
              ></b-form-file>
            </b-form-group>

            <b-form-group label="Hashcode" label-for="hashcode" label-cols-sm="2" label-size="lg">
              <b-form-input id="hashcode" size="lg" v-model="form.hashcode" required
                placeholder="Entrer le hashcode..."
                v-on:change="hashcodeChange"
              ></b-form-input>
            </b-form-group>

            <b-form-group label-for="hashcode" label-cols-sm="2">
                <b-button-group size="lg">
                    <b-button id="submit" type="submit" variant="primary" :title="needMetamask" :disabled="$store.state.providerType===false || computing">
                      <div v-if="computing"><b-spinner type="grow"/> Calcul</div>
                      <div v-else><i class="icon-question-sign"/> Vérifier</div>
                    </b-button>
                </b-button-group>
                <div v-if="error" class="error">{{error}}</div>
            </b-form-group>

            <b-form-group v-if="info" label="Données ancrées dans la blockchain" label-for="info" label-cols-sm="2" label-size="lg">
                <b-card v-if="info.block>0" class="json-code">
                  <pre><code id="info">{{info}}</code></pre>
                </b-card>
                <b-card v-if="info.block==0" class="json-code">
                  <pre><code id="info">Absent de la blockchain</code></pre>
                </b-card>
                <b-card v-if="typeof(info)=='string'" class="json-code">
                  <pre><code id="info">{{info}}</code></pre>
                </b-card>
            </b-form-group>
        </b-form>
    </b-card>
  </div>
</template>

<script>

import BlckchnAntProver from '../lib/BlckchnAntProver.js'

export default {
  name: 'Check',
  props: {
  },
  data() {
    return {
      computing: false,
      file: null,
      form: {
        hashcode: null,
      },
      info: null,
      error: null
    }
  },

  computed: {
    needMetamask: function () {
      return this.$store.state.providerType===false ? 'Veuillez installer Metamask' : null
    }
  },
  
  methods: {
      async fileChosen(evt) {
        this.form.hashcode = ''
        this.computing = true
        this.form.hashcode = await BlckchnAntProver.calculateHashFromFile(evt.target.files[0])
        this.computing = false
      },
      hashcodeChange(evt) {
        console.log('hashcodeChange', evt)
      },
      onSubmit(evt) {
        evt.preventDefault()
        console.log('check', this.form.hashcode)
        this.info = null
        this.error = null
        BlckchnAntProver.findHash(this.form.hashcode, (error, result) => {
          console.log('result', error, result)
          if (error) {
            this.error = error
          } else {
            this.info = result
          }
        })
      },
      fileNameFormatter(files) {
        let max = 30
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
</style>
