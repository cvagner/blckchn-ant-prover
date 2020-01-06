import * as types from './mutation-types'

export const mutations = {
  [types.SET_PROVIDER](state, provider) {
    state.provider = provider
    state.providerType = state.provider.isMetaMask ? 'metamask' : 'http'
  },
  [types.SET_CONTRACT_ADDRESS](state, contractAddress) {
    state.contractAddress = contractAddress
  },
  [types.ADD_NEW_EVENT](state, eventData) {
    state.newEvents.slice(Math.max(state.newEvents.length - 9, 1))
    state.newEvents.push(eventData)
  }
}
