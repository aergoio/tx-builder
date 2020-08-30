import Vue from 'vue';
import Vuex from 'vuex';
import { timedAsync } from 'timed-async';

// @ts-ignore
import { AergoClient, Contract, GrpcWebProvider } from '@herajs/client';

let aergo = new AergoClient({}, new GrpcWebProvider({url: 'https://testnet-api-http.aergo.io'}));

Vue.use(Vuex);

interface State {
  activeAccount: Record<string, any>;
  chainInfo: Record<string, any>;
  chainId: string;
  chainError: string;
  contract: {
    address: any;
    abi: any;
    status: string;
  }
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
    }
  },
  mutations: {
    setChain(state, { chainId, chainInfo }) {
      state.chainInfo = chainInfo;
      state.chainId = chainId;
    },
    setChainError(state, error) {
      state.chainError = error;
    },
    setActiveAccount(state, account) {
      state.activeAccount = account;
    },
    setContract(state, { address, abi }) {
      state.contract.address = address;
      state.contract.abi = abi;
    },
    setContractStatus(state, status) {
      state.contract.status = status;
    }
  },
  actions: {
    getActiveAccount({ commit, state }) {
      if (state.activeAccount) {
        return new Promise((resolve) => {
          resolve(state.activeAccount);
        });
      }
      return new Promise((resolve, reject) => {
        window.addEventListener('AERGO_ACTIVE_ACCOUNT', function (event) {
          const detail = (event as CustomEvent).detail;
          if ('error' in event) {
            reject(new Error('request was cancelled by user'));
            return;
          }
          commit('setActiveAccount', detail.account);
          resolve(detail.account);
        }, { once: true });
        window.postMessage({
          type: 'AERGO_REQUEST',
          action: 'ACTIVE_ACCOUNT'
        }, '*');
      })
    },
    refreshActiveAccount({ commit }) {
      commit('setActiveAccount', null);
      return this.dispatch('getActiveAccount');
    },
    async setContractAddress({ commit }, { address }) {
      try {
        commit('setContractStatus', 'loading');
        const abi = await timedAsync(aergo.getABI(address));
        commit('setContract', { address, abi });
        commit('setContractStatus', 'loaded');
        return true;
      } catch (e) {
        console.error(e);
        commit('setContractStatus', 'error');
        return false;
      }
    },
    async setChain({ commit }, { nodeUrl }) {
      commit('setChainError', '');
      try {
        aergo = new AergoClient({}, new GrpcWebProvider({url: nodeUrl}));
        const chainInfo = await aergo.getChainInfo();
        const chainId = chainInfo.chainid.magic;
        commit('setChain', { chainId, chainInfo });
      } catch(e) {
        console.error(e);
        commit('setChainError', `${e}`);
      }
    },
    async getReceipt(_unused, { hash }) {
      return await aergo.waitForTransactionReceipt(hash);
    },
    async queryContract(_used, { address, abi, method, args }) {
      const contract = Contract.fromAbi(abi).setAddress(address);
      try {
        return await timedAsync(aergo.queryContract(contract.functions[method](...args)));
      } catch(e) {
        return { error: `${e}` };
      }
    }
  }
});
