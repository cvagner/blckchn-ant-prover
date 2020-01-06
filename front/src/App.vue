<template>
  <div id="app">
    <h1>Ancrage de contenus dans une Blockchain</h1>
    <button style="position: fixed;top: 1px;right: 1px;" v-on:click="help">&nbsp;<i class="icon-info-sign"></i>&nbsp;</button>
    <div class="summary">
      <p>Cette application décentralisée (dApp) permet de <b>référencer des contenus (fichiers, données brutes) avec des métadonnées
        (un commentaire ici) dans une <a target="_blank" rel="noopener" href="https://www.ethereum.org/"><img style="height: 25px;"
        src="./assets/ethereum-logo.svg"/> blockchain Ethereum</a></b> et de <b>consulter les empreintes déjà indexées</b>.
      </p><p>
      L'empreinte d'un fichier est un code calculé sur son contenu, unique et immuable.
      Le référencement d'un contenu qui consiste à horodater son empreinte et son auteur permet de <b>prouver l'antériorité d'un droit d'auteur</b>.
      </p><p>
      C'est l'extension <img style="height: 25px;" src="./assets/metamask-logo.png"/>&nbsp;<a class="metamask" target="_blank" rel="noopener"
      href="https://metamask.io/">Metamask</a> qui fait la passerelle entre la dApp et la blockchain Ethereum : les informations ne transitent pas
      par un serveur tiers. C'est dans ce portefeuille que l'utilisateur configure le <u>réseau à utiliser et son compte</u> (adresse et clé privée).
      </p>
    </div>
    <Upload class="tile"/>
    <Events class="tile"/>
    <Check class="tile clear-left"/>
    <List class="tile"/>
    <Status class="tile clear-left"/>
    <div class="tile">
      <b-card>
        <a href="https://www.atolcd.com" target="_blank" rel="noopener"><img class="logo" alt="ATOL Blckchn Ant Prover" src="./assets/atolcd-350.png"></a>
      </b-card>
    </div>
  </div>
</template>

<script>
import BlckchnAntProver from './lib/BlckchnAntProver.js'
import Upload from './components/Upload.vue'
import Check from './components/Check.vue'
import List from './components/List.vue'
import Status from './components/Status.vue'
import Events from './components/Events.vue'

import storeJs from 'store'
import introJs from 'intro.js'
import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-nassim.css'

export default {
  name: 'app',
  components: {
    Upload,
    Check,
    List,
    Status,
    Events
  },

  data() {
    return {
    }
  },

  mounted(){
    window.addEventListener('load', async () => {
      await BlckchnAntProver.init(process.env.NODE_ENV !== 'production', eventData => {
        this.$store.dispatch('addNewEvent', eventData)
      })

      let currentProvider = BlckchnAntProver.getCurrentProvider()
      if (currentProvider) {
        this.$store.dispatch('setProvider', currentProvider)
        this.$store.dispatch('setContractAddress', BlckchnAntProver.getContractAddress())
      }
    })
    if (!storeJs.get('blckchn:help-viewed')) {
      this.help()
    }
  },

  methods: {
    help: function() {
      introJs()
        .setOption('showBullets', true).setOption('showProgress', false)
        .setOption('overlayOpacity', 0.5)
        .setOption('skipLabel', 'Arrêter').setOption('prevLabel', 'Précédent').setOption('nextLabel', 'Suivant')
        .setOption('steps', [{ 
                intro: "<h3 style='min-width:10em'>Bienvenue</h3><p>Ce tutoriel fournit une introduction à l'utilisation de cet outil qui permet <b>d'ancrer des contenus dans une blockchain</b>.</p><p>Vous pouvez <b>le relancer à tout moment avec le bouton</b> <button>&nbsp;<i class='icon-info-sign'></i>&nbsp;</button> en haut à droite de la page.</p>"
              },
              {
                element: document.querySelector('.summary'),
                intro: "<h3>L'extension Metamask</h3>est nécessaire au bon fonctionnement. Veuillez <b>l'installer</b> en suivant <a class='metamask' target='_blank' rel='noopener' href='https://metamask.io/'>ces instructions</a> et la configurer comme suggéré dans la suite."
              }, {
                intro: "<h3>Choisir le réseau</h3><p>de tests <i>Goerli</i> par exemple :</p><p><img style='height: 100px;' src='config/3-selectionner-reseau.png'/>.</p><p>Les réseaux gérés sont listés dans le bloc <i>Statut de connexion</i>.</p>"
              }, {
                intro: "<h3>Alimenter son compte en ether</h3><p>à partir de son identifiant :</p><p><img style='height:150px' src='config/1-copier-id-compte.png'/></p><p>Pour les réseaux de tests comme <i>Goerli</i>, le mécanisme de <i>faucet</i> (robinet) permet de récupérer des ethers. Par exemple avec <a href='https://goerli-faucet.slock.it/' target='_blank' rel='noopener'>celui-ci</a> :</p><p><a href='https://goerli-faucet.slock.it/' target='_blank' rel='noopener'><img style='height: 200px;' src='config/2-alimenter-ether.png'/></a></p>"
              }, {
                element: document.querySelector('.status.tile'),
                intro: "<h3>Vérifier la connexion</h3><p>se fait dans le bloc technique <i>Statut de connexion</i>.</p><p>La configuration est terminée ; <b>la suite décrit l'utilisation de l'outil</b>.</p>"
              }, {
                element: document.querySelector('.upload.tile'),
                intro: "<b>Le référencement d'un contenu est asynchrone</b> : la transaction est consultable à partir du lien fourni (QR Code)."
              }, {
                element: document.querySelector('.events.tile'),
                intro: "Lorsqu'une transaction est acceptée et validée, elle apparaît dans le bloc <i>💥 Événements</i>. Si elle concerne l'utilisateur connecté, un lien permet de <b>récupérer le certificat de dépôt (fichier pdf), à conserver avec le contenu référencé</b>."
              }, {
                element: document.querySelector('.check.tile'),
                intro: ""
              }, {
                element: document.querySelector('.list.tile'),
                intro: ""
              }
        ])
        .onexit(() => { storeJs.set('blckchn:help-viewed', true) })
        .start()
    }
  }
}
</script>

<style>
body::after {
  content: "";
  background: url('./assets/network-mesh.svg') no-repeat center center;
  background-size:cover;
  opacity: 0.05;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: fixed;
  z-index: -1;
}

#app {
  font-family: 'Roboto Condensed', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 10px;
}

h1 {
  font-variant-caps: small-caps;
  font-size: 2rem;
  text-align: center;
  color: #007bff;
}
.summary {
  text-align: center;
  margin-top: 3em;
  margin-bottom: 3em;
}

.logo {
  max-height: 5em;
}

.card-text {
  color: #6c757d;
  font-style: italic;
}

.tile {
  border-radius: 0;
  padding: 10px;
  max-width: 900px;
  float: left;
}
.clear-left {
  clear: left;
}

.card.json-code {
  border: none;
  background-color: rgba(0,0,0,.03);
  font-style:italic;
}

label {
  min-width: 200px;
}

button.btn {
  min-width: 170px;
}
</style>
