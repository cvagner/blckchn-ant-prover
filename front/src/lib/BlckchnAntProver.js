import Web3 from 'web3'
import jsSHA from 'jssha'

// TODO Améliorer ce référencement
import compiledBlckchnAntProver from '../../../smart-contracts/build/contracts/AntProver.json'
const contractAbi = compiledBlckchnAntProver.abi
const networks = compiledBlckchnAntProver.networks

let web3 = undefined
let contract = undefined
let contractAddress = undefined

let hashAddedSubscription = undefined
let hashAddedCallback = undefined

const getAccounts = () => {
    // TODO
    return web3.eth.getAccounts()
}
const getCurrentProvider = () => {
    return web3 ? web3.currentProvider : null
}
const getContractAddress = () => {
    return contractAddress
}
const getNetworkId = () => {
    return web3 && web3.currentProvider ?
    web3.currentProvider.networkVersion || web3.currentProvider._network
    : null
}
const etherscanBaseUrl = () => {
    let n = getNetworkId()
    if (n == 1) {
        return 'https://etherscan.io'
    } else if (n == 3) {
        return 'https://ropsten.etherscan.io'
    } else if (n == 5) {
        return 'https://goerli.etherscan.io'
    } else if (n == 42) {
        return 'https://kovan.etherscan.io'
    }
    return null
}

const eventsSupported = () => {
    return getNetworkId()
}

const initContract = () => {
    if (hashAddedSubscription) {
        // TODO cibler l'unsuscribe
        web3.eth.clearSubscriptions()
    }
    // 5777 par défaut (cas dans un navigateur privé avec Ganache)
    contractAddress = networks[getNetworkId() || 5777].address
    console.log('contract address', contractAddress)
    contract = new web3.eth.Contract(contractAbi, contractAddress)

    if (!eventsSupported()) {
        console.log('provider does not support event listening')
        return;
    }
    hashAddedSubscription = contract.events.HashAdded((error, t) => {
        if (error) {
            console.log('HashAdded : error', error)
            return;
        }
        console.log('HashAdded', t)
        if (hashAddedCallback) {
            let baseUrl = etherscanBaseUrl()
            let transactionUrl = baseUrl && t.transactionHash  ? baseUrl + '/tx/' + t.transactionHash : null
            let data = {
                date: new Date().toLocaleString(),
                contract : t.address,
                transaction: t.transactionHash,
                transactionUrl: transactionUrl,
                data: {
                    hash: t.returnValues.hash, comment : t.returnValues.comment, from: t.returnValues.from
                }
            }
            hashAddedCallback(data)
        }
    });
}

const init = async (allowGanache, _hashAddedCallback) => {
    hashAddedCallback = _hashAddedCallback
    if (window.ethereum) {
        console.log('window.ethereum (modern dapp browser)')
        web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
            // Acccounts now exposed
            initContract()
            
            // Ecoute changement de network (fonctionnement 30/09/2019 : reload)
            window.ethereum.autoRefreshOnNetworkChange = false
            window.ethereum.on('networkChanged', initContract)
        } catch (error) {
            console.log('User denied account access or network is not accessible...')
        }
    } else if (window.web3) {
        console.log('window.web3 (legacy dapp browser)')
        web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.getAccounts().then(console.log)
        initContract()
    } else {
        console.log('ganache (non dapp browser)')
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        // fallback to Ganache.
        if (allowGanache) {
            web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
            initContract()
        } else {
            console.log('Metamask est indispensable !')
        }
    }
}

const readUploadedFileAsText = (fileInput) => {
    const temporaryFileReader = new FileReader()
    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort()
            reject(new DOMException("Problem parsing input file."))
        }
        temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result)
        }
        temporaryFileReader.readAsArrayBuffer(fileInput)
    });
}

const calculateHashFromBytes = (data) => {
    let shaObj = new jsSHA("SHA-256", "ARRAYBUFFER")
    shaObj.update(data)
    let hash = "0x" + shaObj.getHash("HEX")
    return hash
}


const calculateHashFromFile = async (file) => {
    const fileContent = await readUploadedFileAsText(file)
    return calculateHashFromBytes(fileContent)
}

const getTransaction = (transactionHash, callback) => {
    web3.eth.getTransaction(transactionHash, callback)
}

const getTransactionReceipt = (transactionHash, callback) => {
    web3.eth.getTransactionReceipt(transactionHash, callback)
}

const sendHash = (hash, comment, callback) => {
    web3.eth.getAccounts((error, accounts) => {
        contract.methods.addDocHash(hash, comment).send({
            from: accounts[0]
        }, (error, tx) => {
            if (error) {
                callback(error, null)
            } else {
                callback(null, tx)
            }
        })
    })
}

const findHash = (hash, callback) => {
    if (!(web3.utils.isHexStrict(hash) && web3.utils.hexToBytes(hash).length == 32)) {
        callback('Hashcode non valide', null)
        return
    }
    contract.methods.findDocHash(hash).call((error, result) => {
        if (error) {
            callback(error, null)
        } else {
            let i = 0
            let mineTime = new Date(result[i++] * 1000)
            let block = result[i++]
            let sender = result[i++]
            let comment = result[i++]
            let resultObj = {
                hashcode: hash,
                comment,
                sender,
                block,
                mineTime
            }
            callback(null, resultObj)
        }
    });
}

const size = (callback) => {
    contract.methods.size().call((error, result) => {
        if (error) {
            callback(error, null)
        } else {
            callback(null, result)
        }
    });
}

const list = (callback) => {
    contract.methods.list().call((error, result) => {
        if (error) {
            callback(error, null)
        } else {
            callback(null, result)
        }
    });
}

const listBySender = (sender, callback) => {
    contract.methods.listBySender(sender).call((error, result) => {
        if (error) {
            callback(error, null)
        } else {
            callback(null, result)
        }
    });
}

export default {
    findHash,
    sendHash,
    size,
    list,
    listBySender,
    //
    init,
    getCurrentProvider,
    getNetworkId,
    getContractAddress,
    getAccounts,
    getTransactionReceipt,
    getTransaction,
    etherscanBaseUrl,
    //
    calculateHashFromFile,
    calculateHashFromBytes
}
