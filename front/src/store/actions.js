import * as types from './mutation-types'

export const setProvider = ({ commit }, provider) => {
  commit(types.SET_PROVIDER, provider)
}

export const setContractAddress = ({ commit }, contractAddress) => {
  commit(types.SET_CONTRACT_ADDRESS, contractAddress)
}

export const addNewEvent = ({ commit }, eventData) => {
  commit(types.ADD_NEW_EVENT, eventData)
}