# BLCKCHN-ANT-PROVER

[Blockchain Anteriority Prover](https://github.com/cvagner/blckchn-ant-prover) - Preuve d'antériorité de contenus* dans une blockchain.

Une démonstration est disponible [ici](https://cvagner.keybase.pub/blckchn/ancrage/).

## Démarrage rapide

Avec sa propre blockchain Ethereum de tests / développements [Ganache](https://www.trufflesuite.com/ganache).

### Blockchain Ganache

Après avoir téléchargé le binaire [Ganache](https://www.trufflesuite.com/ganache), ici déposé dans `~/bin` :

```shell
# Nettoyage éventuel d'une ancienne configuration
rm -rf ~/.config/Ganache/
# Lancement de la blockchain (suivre les instructions)
~/bin/ganache-*-linux-x86_64.AppImage
```

### Configuration Metamask

* Configurer et choisir le réseau "development" : http://localhost:7545
* Importer le premier compte de Ganache à partir de la clé privée (cliquer sur la clé à côté du compte dans Ganache) et le sélectionner

### Déploiement des Smart Contracts

```shell
cd ~/projets/atolcd/blckchn-ant-prover/smart-contracts
truffle migrate --network development
truffle migrate --network development --reset
```

### Client

```shell
cd ~/projets/atolcd/blckchn-ant-prover/front
npm run serve
```
Ouvrir la page http://localhost:8080.


## Pour continuer : sur une blockchain publique

Exemple avec le réseau testnet [Ropsten](https://ropsten.etherscan.io/).

### Configuration

#### Wallet infura

[Infura](https://infura.io/) est une API qui permet d'accéder au réseau Ethereum.
Se créer un compte, un projet puis récupérer le `PROJECT ID`.

#### Fichier de configuration

Créer le fichier `smart-contracts/.env` avec le contenu suivant :
```
export METAMASK_MNEMONIC="Le mnemonic Metamask (Paramètres, Sécurité et confidentialité, Révéler les mots Seed)"
export INFURA_PROJECT_ID="Le PROJECT ID Infura"
```

### Déploiement des Smart Contracts

Exécuter les commandes suivantes :
```shell
cd ~/projets/atolcd/blckchn-ant-prover/smart-contracts
source .env
truffle migrate --network ropsten
#truffle migrate --network ropsten --reset
```

Ouvrir à nouveau le client et configurer Metamask pour utiliser le réseau adéquat.
