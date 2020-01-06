<template>
  <div class="events" :class="{ supported: $store.state.providerType == 'metamask' }">
    <b-card title="💥 Événements">
        <b-card-text>
          Depuis le dernier chargement.
        </b-card-text>
        <table class="events">
          <thead><tr><td>Date</td><td>Hashcode</td><td>Transaction</td><td>Certificat</td></tr></thead>
          <tbody>
            <tr class="event" v-for="e in $store.state.newEvents" v-bind:key="e.transaction">
              <td class="date">{{e.date}}</td>
              <td class="hashcode"><code>{{e.data.hash}}</code></td>
              <td v-if="!e.transactionUrl" class="transaction" :title="e.transaction"><i class="icon icon-pin"></i></td>
              <td v-if="e.transactionUrl" class="transaction link" :title="e.transaction"><a :href="e.transactionUrl" target="_blank" rel="noopener"><i class="icon icon-pin"></i></a></td>
              <td v-if="e.data.from.toUpperCase() == $store.state.provider.selectedAddress.toUpperCase()">
                <a class="certificat" href="#" v-on:click="generatePdfCertificate(e, $store.state.provider.networkVersion)"><i class="icon icon-certificatealt"></i></a>
              </td>
            </tr>
          </tbody>
        </table>
    </b-card>
  </div>
</template>

<script>
import BlckchnAntProver from "../lib/BlckchnAntProver.js";

import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
pdfMake.vfs = pdfFonts.pdfMake.vfs

export default {
  name: 'Events',
  props: {
  },
  data() {
    return {
    }
  },

  computed: {
    baseUrl: function () {
      return  BlckchnAntProver.etherscanBaseUrl()
    }
  },

  methods: {
    generatePdfCertificate(certificate, networkVersion) {
      let docDefinition = {
        pageSize: 'A5',
        watermark: { text: 'ATOL Conseils & Développements', color: 'grey', opacity: 0.05, bold: true, italics: false },
        info: {
          title: 'Ancrage de contenu',
          subject: 'Certificat',
          keywords: 'certificat blockchain ethereum'
        },
        content: [{
            image: 'data:image/png;base64,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'
          },
          { text: 'Ancrage de contenus dans une Blockchain', style:'title', margin: [ 0, 10, 0, 20 ]}, 
          { text: 'Certificat', style: 'certificate', margin: [ 0, 5, 0, 20 ]},
          'Données transmises :', {
            ul: [
              { text: 'Auteur : ' + certificate.data.from, bold: true },
              { text: 'Empreinte : ' + certificate.data.hash, bold: true },
              'Commentaire : ' + certificate.data.comment
            ]
          },
          {text: 'Transaction :', margin: [ 0, 10, 0, 0 ]}, {
            ul: [
              { text: 'Réseau : ' + networkVersion + ', Contrat : ' + certificate.contract },
              { text: certificate.transaction, bold: true, color: '#76b861', link: certificate.transactionUrl},
              { qr: certificate.transactionUrl, foreground: '#2c3e50', eccLevel: 'L', fit: '100', margin: [ 0, 3, 0, 0 ], link: certificate.transactionUrl}
            ]
          }
        ],
        styles: {
          title: {
            fontSize: 20,
            bold: true,
            alignment: 'justify',
            color: '#007bff'
          },
          certificate: {
            fontSize: 15,
            bold: true,
            alignment: 'justify',
            color: '#007bff'
          }
        }
      }
      pdfMake.createPdf(docDefinition).download('certificat-' + certificate.data.hash.slice(2, 7) + '.pdf')
    }
  }
}
</script>

<style scoped>
div.events {
  display: none;
}
div.events.supported {
  display: block;
}
table.events {
  text-align: center;
}
.transaction a, .certificat {
  text-decoration: none;
}
.icon {
  font-size: 1.5em;
}
</style>
