<template lang="html">
  <div class="builder-view">
    <div class="form">
      <form ref="form" spellcheck="false">
        <fieldset>
          <h3>Action</h3>
          <div class="actions">
            <div class="row">
              <div class="btn-action" v-for="a in ['normal', 'transfer']" :class="{ active: action === a }" @click="action = a">{{a}}</div>
            </div>
            <div class="row">
              <div class="btn-action" v-for="a in ['call', 'feeDelegation']" :class="{ active: action === a }" @click="action = a">{{a}}</div>
            </div>
            <div class="row">
              <div class="btn-action" v-for="a in ['deploy', 'redeploy']" :class="{ active: action === a }" @click="action = a">{{a}}</div>
            </div>
            <div class="row">
              <div class="btn-action" v-for="a in ['nameCreate', 'nameUpdate']" :class="{ active: action === a }" @click="action = a">{{a}}</div>
            </div>
            <div class="row" v-if="consensus === 'dpos'">
              <div class="btn-action" v-for="a in dposActions" :class="{ active: action === a }" @click="action = a">{{a}}</div>
            </div>
            <div class="row" v-if="consensus === 'raft'">
              <div class="btn-action" v-for="a in raftActions" :class="{ active: action === a }" @click="action = a">{{a}}</div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <h3>Recipient</h3>
          <input class="text-input" type="text" @change="$refs.form.reportValidity()" required ref="recipientInput"
            v-model="txBody.to" :disabled="!canEditRecipient">
            
          <h3>Amount</h3>
          <input class="text-input" type="text" pattern="\d+ \w+" @change="$refs.form.reportValidity()" required ref="amountInput"
            v-model="txBody.amount" :disabled="!canEditAmount">
        </fieldset>

        <fieldset v-if="action === 'call' || action === 'feeDelegation'">
          <h3>Contract Method</h3>
          <div class="actions">
            <div class="row">
              <div class="btn-action"
                v-for="func in availableFunctions"
                :class="{ active: contractMethod && contractMethod.name === func.name }"
                @click="contractMethod = func">{{func.name}}</div>
            </div>
          </div>
          <h3>Arguments</h3>
          <div v-if="selectedContractFunction && selectedContractFunction.arguments" class="arguments">
            <div v-for="arg in selectedContractFunction.arguments">
              <h4>{{arg.name}}</h4>
              <input class="text-input" type="text" v-model="contractArgs[arg.name]">
            </div>
          </div>
        </fieldset>

        <fieldset v-if="action === 'nameCreate'">
          <h3>Name</h3>
          <input class="text-input" type="text" v-model="name.name">
        </fieldset>
        <fieldset v-if="action === 'nameUpdate'">
          <h3>Name</h3>
          <input class="text-input" type="text" v-model="name.name">
          <h3>New owner</h3>
          <input class="text-input" type="text" v-model="name.owner">
        </fieldset>

        <fieldset v-if="action === 'deploy' || action === 'redeploy'">
          <h3>Contract Code Payload</h3>
          <input class="text-input" type="file" @change="handleContractFile" ref="contractCode">
          <p class="note">Output of `aergolua --payload code.lua`</p>

          <h3>Arguments</h3>
          <div v-if="deployConstructorAbi && deployConstructorAbi.length" class="arguments">
            <div v-for="arg in deployConstructorAbi">
              <h4>{{arg.name}}</h4>
              <input class="text-input" type="text" v-model="contractDeployArgs[arg.name]">
            </div>
          </div>

        </fieldset>

      </form>
    </div>
    <div>
      <JsonView :data="txBody" @change="editorChanged"></JsonView>
      <div class="buttons">
        <div class="btn-big" @click="sign">Sign</div>
        <div class="btn-big primary" @click="send">Sign & Send</div>
      </div>
      <div class="result">
        <div v-if="receiptStatus === 'loading'">
          <div class="receipt-status">
            <LoadingIndicator :size="24"></LoadingIndicator>
            <span>Waiting for receipt...</span>
          </div>
        </div>
        <div v-if="receiptStatus === 'loaded'" style="padding: 0 20px;">
          <div class="receipt-status">
            <Icon :size="24" :name="receipt.status === 'ERROR' ? 'danger-circle' : 'checkmark-circle'"></Icon>
            <span>{{receipt.status}}</span>
          </div>
          <pre class="receipt-json" v-if="receipt">{{JSON.stringify(receipt, null, 2)}}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import JsonView from '../components/JsonView.vue';
import { TxTypes, Amount, Address, encodeBuffer, decodeToBytes } from '@herajs/common';
import { Contract } from '@herajs/client';
import { Icon, LoadingIndicator } from './icons/';

const normalActions = ['normal', 'transfer', 'call', 'feeDelegation', 'nameCreate', 'nameUpdate', 'deploy', 'redeploy'] as const;
const dposActions = ['stake', 'unstake', 'vote', 'voteDAO'] as const;
const raftActions = ['addAdmin', 'removeAdmin', 'changeCluster', 'addConfig', 'enableConfig', 'removeConfig'] as const;
const actions = [...normalActions, ...dposActions, ...raftActions] as const;
type Action = typeof actions[number];

const defaultTxBody = {
  type: 0,
  from: "",
  to: "",
  amount: "0 aergo",
  limit: 0,
};

function aergoConnectCall(action, responseType, d): Promise<any> {
  const data = {...d};
  if (!d.payload && !d.payload_json) {
    data.payload = '';
  }
  return new Promise((resolve, reject) => {
    window.addEventListener(responseType, function(event) {
      if ('error' in event.detail) {
        reject(event.detail.error);
      } else {
        resolve(event.detail);
      }
    }, { once: true });
    window.postMessage({
      type: 'AERGO_REQUEST',
      action: action,
      data: data,
    }, '*');
  });
}
async function requestSignTx(data) {
  const result = await aergoConnectCall('SIGN_TX', 'AERGO_SIGN_TX_RESULT', data);
  return result.signature;
}
async function requestSendTx(data) {
  const result = await aergoConnectCall('SEND_TX', 'AERGO_SEND_TX_RESULT', data);
  return result.hash;
}

@Component({ components: { JsonView, LoadingIndicator, Icon, }})
export default class BuilderView extends Vue {
  action: Action = 'normal';
  dposActions = dposActions;
  raftActions = raftActions;

  txBody = defaultTxBody;
  contractMethod = null;
  contractArgs = {};
  contractDeployPayload = null;
  contractDeployArgs = {};
  deployConstructorAbi = [];

  name = {
    name: '',
    owner: '',
  };

  receiptStatus: '' | 'loading' | 'loaded' | 'error' = '';
  receipt: any;

  updateTxBody(change) {
    this.txBody = {...this.txBody, ...change};
  }

  @Watch('txBody.amount')
  amountChanged() {
    const $amountInput = this.$refs.amountInput as HTMLInputElement;
    try {
      new Amount($amountInput.value);
      $amountInput.setCustomValidity('');
    } catch(e) {
      $amountInput.setCustomValidity(`${e.message}`);
    }
  }

  @Watch('txBody.to')
  recipientChanged() {
    const $recipientInput = this.$refs.recipientInput as HTMLInputElement;
    try {
      new Address($recipientInput.value);
      $recipientInput.setCustomValidity('');
    } catch(e) {
      $recipientInput.setCustomValidity(`${e.message}`);
    }
  }

  @Watch('contractAddress', { immediate: true })
  contractAddressChanged() {
    this.updateTxBody({ to: this.contractAddress });
  }

  updateContractCallPayload() {
    const payload = {
      Name: this.contractMethod.name,
      Args: this.contractMethod.arguments.map(arg => this.contractArgs[arg.name]),
    };
    this.updateTxBody({ payload_json: payload });
  }

  @Watch('contractMethod')
  contractMethodChanged() {
    this.updateContractCallPayload();
  }

  @Watch('contractArgs', { deep: true })
  contractArgsChanged() {
    this.updateContractCallPayload();
  }

  updateNameTxPayload() {
    if (this.action === 'nameCreate') {
      this.updateTxBody({ payload_json: { Name: 'v1createName', Args: [ this.name.name ]}});
    }
    else if (this.action === 'nameUpdate') {
      this.updateTxBody({ payload_json: { Name: 'v1updateName', Args: [ this.name.name, this.name.owner ]}});
    }
  }

  @Watch('name', { deep: true })
  nameArgsChanged() {
    this.updateNameTxPayload();
  }

  @Watch('action')
  actionChanged(action: Action) {
    if (action !== 'nameCreate' && action !== 'nameUpdate' && this.txBody.amount === this.namePrice) {
      this.updateTxBody({ amount: '0 aergo' });
    }
    if (action === 'normal') {
      this.updateTxBody({ type: TxTypes.Normal });
    }
    else if (action === 'transfer') {
      this.updateTxBody({ type: TxTypes.Transfer });
    }
    else if (action === 'call') {
      this.updateTxBody({ type: TxTypes.Call, to: this.contractAddress });
      this.updateContractCallPayload();
    }
    else if (action === 'feeDelegation') {
      this.updateTxBody({ type: TxTypes.FeeDelegation, to: this.contractAddress });
      this.updateContractCallPayload();
    }
    else if (action === 'deploy') {
      this.updateTxBody({ type: TxTypes.Deploy, to: '', payload_json: undefined });
    }
    else if (action === 'redeploy') {
      this.updateTxBody({ type: TxTypes.Redeploy, to: this.contractAddress, payload_json: undefined });
    }
    else if (action === 'nameCreate' || action === 'nameUpdate') {
      this.updateTxBody({ type: TxTypes.Governance, to: 'aergo.name', amount: this.namePrice });
      this.updateNameTxPayload();
    }
    else if (dposActions.indexOf(action as typeof dposActions[number]) !== -1 || raftActions.indexOf(action as typeof raftActions[number]) !== -1) {
      this.updateTxBody({ type: TxTypes.Governance, to: 'aergo.system' });
    }
  }

  updateActionFromTxBody() {
    switch (this.txBody.type) {
      case TxTypes.Normal: this.action = 'normal'; break;
      case TxTypes.Transfer: this.action = 'transfer'; break;
      case TxTypes.Call: this.action = 'call'; break;
      case TxTypes.FeeDelegation: this.action = 'feeDelegation'; break;
      case TxTypes.Deploy: this.action = 'deploy'; break;
      case TxTypes.Redeploy: this.action = 'redeploy'; break;
      case TxTypes.Governance:
        // TODO: more fine-grained action
    }
  }

  editorChanged(txBody) {
    if (txBody) {
      this.txBody = txBody;
      this.updateActionFromTxBody();
    }
  }

  get consensus() {
    return this.$store.state.chainInfo?.chainid?.consensus;
  }

  get namePrice() {
    return `${this.$store.state.chainInfo?.nameprice}`;
  }

  get activeAccount() {
    return this.$store.state.activeAccount;
  }

  @Watch('activeAccount')
  activeAccountChanged() {
    if (this.activeAccount) {
      this.updateTxBody({ from: this.activeAccount.address });
    }
  }

  get contractAddress() {
    return this.$store.state.contract.address;
  }

  get contractAbi() {
    return this.$store.state.contract.abi;
  }

  get availableFunctions() {
    return this.contractAbi.functions.filter(func => !func.view);
  }

  get selectedContractFunction() {
    if (!this.contractMethod) return undefined;
    return this.contractAbi.functions.find(func =>
      func.name === this.contractMethod.name && func.name !== 'constructor' && func.name !== 'default'
    );
  }

  get canEditRecipient() {
    return ['normal', 'transfer', 'redeploy'].indexOf(this.action) !== -1;
  }

  get canEditAmount() {
    const noAmount = [...dposActions, ...raftActions, 'nameCreate', 'nameUpdate'];
    const exceptions = ['stake', 'unstake'];
    return noAmount.indexOf(this.action) === -1 || exceptions.indexOf(this.action) !== -1;
  }

  handleContractFile(): void {
    const $elem = this.$refs.contractCode as HTMLInputElement;
    if (!$elem || !$elem.files || $elem.files.length === 0) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        this.contractDeployPayload = `${e.target.result}`.trim();
        const text = encodeBuffer(decodeToBytes(this.contractDeployPayload, 'base58'), 'ascii');
        const match = text.match(new RegExp(/{"name":"constructor","arguments":(\[.*?\])}/));
        if (match) {
          this.deployConstructorAbi = JSON.parse(match[1]);
        }
      }
    };
    reader.readAsText($elem.files[0]);
  }

  updateContractDeployPayload() {
    const contract = Contract.fromCode(this.contractDeployPayload);
    const args = this.deployConstructorAbi.map(arg => this.contractDeployArgs[arg.name]);
    this.updateTxBody({ payload: encodeBuffer(contract.asPayload(args), 'base64') });
  }

  @Watch('contractDeployPayload')
  contractDeployPayloadChanged() {
    this.updateContractDeployPayload();
  }

  @Watch('contractDeployArgs', { deep: true })
  contractDeployArgsChanged() {
    this.updateContractDeployPayload();
  }

  async sign() {
    const signature = await requestSignTx(this.txBody);
    alert('signed, signature ' + signature);
  }

  async send() {
    const hash = await requestSendTx(this.txBody);
    alert('sent, hash ' + hash);
    this.receiptStatus = 'loading';
    this.receipt = null;
    try {
      this.receipt = {
        hash,
        ...await this.$store.dispatch('getReceipt', { hash }),
      };
      this.receiptStatus = 'loaded';
    } catch(e) {
      this.receiptStatus = 'error';
    }
  }
}
</script>

<style lang="scss">
.builder-view {
  display: flex;
  > div {
    flex: 1;
  }
}

.form {
  border-right: 2px solid #242424;

  [disabled] {
    color: #888;
  }

  fieldset {
    padding: 20px 0 20px 20px;
    border: 0;
    border-bottom: 2px solid #242424;

    &:last-child {
      border-bottom: 0;
    }
  }
}

.text-input {
  background-color: #282828;
  line-height: 30px;
  padding: 0 7px;
  min-width: 220px;
  border: 0;
  color: #fff;
  &:focus {
    outline: 1px solid #105db5;
  }
}
h3 {
  font-size: 1em;
  font-weight: bold;
  margin: 20px 0 1em;
  margin-top: 20px;
}
fieldset h3:first-of-type {
  margin-top: 0;
}
.btn-action {
  display: inline-block;
  background-color: #282828;
  line-height: 30px;
  padding: 0 10px;
  min-width: 80px;
  text-align: center;
  margin-right: 8px;
  margin-bottom: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: .9em;
  &.active {
    border-color:#00C789;
  }
  &:hover {
    background-color: #343434;
  }
}
.actions {
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0px;
  }
}
.arguments {
  margin-left: 20px;
}
.btn-big {
  display: block;
  background-color: #282828;
  line-height: 45px;
  padding: 0 10px;
  font-size: 1.1em;
  text-align: center;
  margin-right: 20px;
  cursor: pointer;
  &.primary {
    background-color: #00C789;
  }
}
.buttons {
  display: flex;
  margin-top: 20px;
  margin-left: 20px;
  > * {
    flex: 1;
  }
}
.note {
  font-size: .9em;
  opacity: .7;
  margin: .5em 0;
}
.receipt-status {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon, .loading-indicator {
    margin-right: 10px;
  }
}
.receipt-json {
  white-space: pre-wrap;
  margin: 20px 0;
  font-size: .9em;
  line-height: 1.3;
  background-color: #282828;
  padding: 4px;
}
</style>