<template>
  <div class="status">
    <b-card title="📶 Statut de connexion">
      <div v-if="$store.state.providerType=='metamask' && $store.state.provider">
        <ul>
          <li>Fournisseur Metamask <span>{{$store.state.provider.isConnected() ? "✓":"✗"}}</span></li>
          <li>Contrat : Réseau  {{networkId}} /
            <span v-if="!transactionUrl">{{$store.state.contractAddress}}</span>
            <a v-if="transactionUrl" target="_blank" rel="noopener" :href="transactionUrl">{{$store.state.contractAddress}}</a></li>
          <li>Compte : {{contractAddress}}</li>
          </ul>
      </div>
      <div v-if="$store.state.providerType=='http' && $store.state.provider">
        <ul>
          <li>Fournisseur HTTP</li>
          <li>Contrat : {{$store.state.provider.host}} / {{contractAddress}}</li>
          <li class="warning">Veuillez installer et configurer <a target="_blank" rel="noopener" href="https://metamask.io/">Metamask</a> !</li>
        </ul>
      </div>
      <div v-if="$store.state.providerType===false">
        <ul>
          <li class="error">Pas de Fournisseur</li>
          <li class="error">Veuillez installer et configurer <a target="_blank" rel="noopener" href="https://metamask.io/">Metamask</a> !</li>
        </ul>
      </div>
      <div class="networks">Réseaux gérés : Ropsten (3), Goerli (5), Kovan (42)</div>
     </b-card>
  </div>
</template>


<script>
import BlckchnAntProver from "../lib/BlckchnAntProver.js";

export default {
  name: "Status",

  data() {
    return {};
  },

  computed: {
    transactionUrl: function () {
      let baseUrl = BlckchnAntProver.etherscanBaseUrl()
      return baseUrl && this.$store.state.contractAddress  ? baseUrl + '/address/' + this.$store.state.contractAddress : null
    },
    networkId: function () {
      return BlckchnAntProver.getNetworkId()
    },
    contractAddress: function () {
      return BlckchnAntProver.getContractAddress()
    }
  },

  methods: {}
};
</script>

<style scoped>
ul {
  list-style:none;
}
.warning {
  color: #f29400;
}
.warning a {
  font-weight: bold;
}
.error {
  color: red;
}
.networks {
  padding-left: 40px;
}
</style>