var HDWalletProvider = require("truffle-hdwallet-provider");

// Avant de lancer truffle : export METAMASK_MNEMONIC="XXX" && export INFURA_PROJECT_ID="YYY"
// Metamask mnemonic
const METAMASK_MNEMONIC = process.env.METAMASK_MNEMONIC;
// Project ID du projet infura "content-registry"
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "5777"
        },
        ropsten: {
            provider: function () {
                return new HDWalletProvider(METAMASK_MNEMONIC, "https://ropsten.infura.io/v3/" + INFURA_PROJECT_ID)
            },
            network_id: 3,
            gas: 4000000 // make sure this gas allocation isn't over 4M, which is the max
        },
        goerli: {
            provider: function () {
                return new HDWalletProvider(METAMASK_MNEMONIC, "https://goerli.infura.io/v3/" + INFURA_PROJECT_ID)
            },
            network_id: 5,
            gas: 4000000 // make sure this gas allocation isn't over 4M, which is the max
        },
        kovan: {
            provider: function () {
                return new HDWalletProvider(METAMASK_MNEMONIC, "https://kovan.infura.io/v3/" + INFURA_PROJECT_ID)
            },
            network_id: 42,
            gas: 4000000 // make sure this gas allocation isn't over 4M, which is the max
        }
    }
}
