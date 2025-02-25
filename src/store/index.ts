import Vue from 'vue'
import Vuex from 'vuex'
import { ensureDelay } from 'timed-async'

// @ts-ignore
import { AergoClient, Contract, GrpcWebProvider } from '@herajs/client'

let aergo = new AergoClient(
  {},
  new GrpcWebProvider({ url: 'https://testnet-api-http.aergo.io' })
)

Vue.use(Vuex)

interface State {
  activeAccount: Record<string, any>
  chainInfo: Record<string, any>
  chainId: string
  chainIdHash: string
  chainError: string
  contract: {
    address: any
    abi: any
    status: string
  }
  shouldReset: number
}

export default new Vuex.Store<State>({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    activeAccount: {},
    chainInfo: {},
    chainId: '',
    chainError: '',
    contract: {
      address: null,
      abi: null,
      status: '',
    },
    shouldReset: 0,
  },
  mutations: {
    setChain(state, { chainId, chainInfo, chainIdHash }) {
      state.chainInfo = chainInfo
      state.chainId = chainId
      state.chainIdHash = chainIdHash
    },
    setChainError(state, error) {
      state.chainError = error
    },
    setActiveAccount(state, account) {
      state.activeAccount = account
    },
    setContract(state, { address, abi }) {
      state.contract.address = address
      state.contract.abi = abi
    },
    setContractStatus(state, status) {
      state.contract.status = status
    },
    setShouldReset(state, shouldReset) {
      state.shouldReset = state.shouldReset + 1
    },
  },
  actions: {
    getActiveAccount({ commit, state }) {
      if (state.activeAccount) {
        return new Promise((resolve) => {
          resolve(state.activeAccount)
        })
      }
      return new Promise((resolve, reject) => {
        window.addEventListener(
          'AERGO_ACTIVE_ACCOUNT',
          function (event) {
            const detail = (event as CustomEvent).detail
            if ('error' in event) {
              reject(new Error('request was cancelled by user'))
              return
            }
            commit('setActiveAccount', detail.account)
            resolve(detail.account)
          },
          { once: true }
        )
        window.postMessage(
          {
            type: 'AERGO_REQUEST',
            action: 'ACTIVE_ACCOUNT',
          },
          '*'
        )
      })
    },
    refreshActiveAccount({ commit }) {
      commit('setActiveAccount', null)
      return this.dispatch('getActiveAccount')
    },
    async setContractAddress({ commit }, { address }) {
      try {
        commit('setContractStatus', 'loading')
        const abi = await ensureDelay(aergo.getABI(address))
        commit('setContract', { address, abi })
        commit('setContractStatus', 'loaded')
        return true
      } catch (e) {
        console.error(e)
        commit('setContractStatus', 'error')
        return false
      }
    },
    async reset({ commit }) {
      commit('setContract', { address: null, abi: null })
      commit('setShouldReset')
    },
    async setChain({ commit }, { nodeUrl }) {
      commit('setChainError', '')
      try {
        aergo = new AergoClient({}, new GrpcWebProvider({ url: nodeUrl }))
        const chainInfo = await aergo.getChainInfo()
        const chainId = chainInfo.chainid.magic
        const chainIdHash = (await aergo.blockchain()).bestChainIdHash
        commit('setChain', { chainId, chainInfo, chainIdHash })
      } catch (e) {
        console.error(e)
        commit('setChainError', `${e}`)
      }
    },
    async getReceipt(_unused, { hash }) {
      return await aergo.waitForTransactionReceipt(hash)
    },
    async queryContract(_used, { address, abi, method, args }) {
      const contract = Contract.fromAbi(abi).setAddress(address)
      try {
        return await ensureDelay(
          aergo.queryContract(contract.functions[method](...args))
        )
      } catch (e) {
        return { error: `${e}` }
      }
    },
  },
})
