<template lang="html">
  <div class="builder-view">
    <div class="form">
      <form ref="form" spellcheck="false">
        <fieldset>
          <h3>Action</h3>
          <div class="actions">
            <ButtonGroup class="row">
              <Button
                v-for="a in ['normal', 'transfer']"
                :class="{ active: action === a }"
                @click="action = a"
                >{{ a }}</Button
              >
            </ButtonGroup>
            <ButtonGroup class="row">
              <Button
                v-for="a in ['call', 'multicall', 'deploy', 'redeploy']"
                :class="{ active: action === a }"
                @click="action = a"
                :disabled="
                  !(a === 'deploy' || a === 'multicall' || contractAbi)
                "
                v-show="a !== 'redeploy' || !publicChain"
                >{{ a }}</Button
              >
            </ButtonGroup>
            <ButtonGroup class="row">
              <Button
                v-for="a in ['nameCreate', 'nameUpdate']"
                :class="{ active: action === a }"
                @click="action = a"
                >{{ a }}</Button
              >
            </ButtonGroup>
            <ButtonGroup class="row" v-if="consensus === 'dpos'">
              <Button
                v-for="a in dposActions"
                :class="{ active: action === a }"
                @click="action = a"
                >{{ a }}</Button
              >
            </ButtonGroup>
            <ButtonGroup class="row" v-if="consensus === 'raft'">
              <Button
                v-for="a in raftActions"
                :class="{ active: action === a }"
                @click="action = a"
                >{{ a }}</Button
              >
            </ButtonGroup>
          </div>
        </fieldset>

        <fieldset>
          <h3>Recipient</h3>
          <input
            class="text-input"
            type="text"
            @change="$refs.form.reportValidity()"
            required
            ref="recipientInput"
            v-model="txBody.to"
            :disabled="!canEditRecipient"
          />

          <h3>Amount</h3>
          <input
            class="text-input"
            type="text"
            pattern="\d+(\.\d+)? ?\w+"
            @change="$refs.form.reportValidity()"
            required
            ref="amountInput"
            v-model="txBody.amount"
            :disabled="!canEditAmount"
          />
        </fieldset>

        <fieldset v-if="action === 'call'">
          <h3>Contract Method</h3>
          <div class="actions">
            <div class="row">
              <div
                class="btn-action"
                v-for="func in availableFunctions"
                :class="{
                  active: contractMethod && contractMethod.name === func.name,
                }"
                @click="contractMethod = func"
              >
                {{ func.name }}
              </div>
            </div>
          </div>
          <h3>Arguments</h3>
          <MethodArgs
            :method="selectedContractFunction"
            v-model="contractArgs"
          ></MethodArgs>
          <h3>Fee delegation</h3>
          <div class="actions">
            <div class="row">
              <div
                class="btn-action"
                :class="{ active: !delegateFee }"
                @click="delegateFee = false"
              >
                No
              </div>
              <div
                class="btn-action"
                :class="{ active: delegateFee }"
                @click="delegateFee = true"
              >
                Yes
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset v-if="action === 'nameCreate'">
          <h3>Name</h3>
          <input class="text-input" type="text" required v-model="name.name" />
        </fieldset>
        <fieldset v-if="action === 'nameUpdate'">
          <h3>Name</h3>
          <input class="text-input" type="text" required v-model="name.name" />
          <h3>New owner</h3>
          <input class="text-input" type="text" required v-model="name.owner" />
        </fieldset>

        <fieldset v-if="action === 'voteBP'">
          <h3>List of BPs (comma separated)</h3>
          <input
            class="text-input"
            type="text"
            required
            v-model="vote.candidates"
          />
        </fieldset>

        <fieldset v-if="action === 'voteDAO'">
          <h3>Vote ID</h3>
          <select v-model="vote.name" class="text-input" style="height: 30px;">
            <option v-for="voteId in voteDAOKeys" :value="voteId">{{
              voteId
            }}</option>
          </select>
          <h3>List of candidates (comma separated)</h3>
          <input
            class="text-input"
            type="text"
            required
            v-model="vote.candidates"
          />
        </fieldset>

        <fieldset v-if="action === 'addAdmin' || action === 'removeAdmin'">
          <h3>Admin address</h3>
          <input class="text-input" type="text" required v-model="raft.admin" />
        </fieldset>

        <fieldset v-if="action === 'changeCluster'">
          <h3>Cluster config (JSON)</h3>
          <input
            class="text-input"
            type="text"
            required
            v-model="raft.jsonArg"
          />
          <span>
            <Icon
              :size="16"
              :name="raft.jsonArgValid ? 'checkmark-circle' : 'danger-circle'"
            ></Icon>
            <span v-if="!raft.jsonArgValid" class="note">Enter valid JSON</span>
          </span>
        </fieldset>

        <fieldset
          v-if="
            action === 'appendConfig' ||
              action === 'removeConfig' ||
              action === 'enableConfig'
          "
        >
          <div style="margin-bottom: 15px">
            <h3>Config key</h3>
            <select
              v-model="raft.configName"
              class="text-input"
              style="height: 30px;"
            >
              <option
                v-for="configKey in ['p2pwhite', 'accountwhite']"
                :value="configKey"
                >{{ configKey }}</option
              >
            </select>
          </div>
          <div v-if="action === 'enableConfig'">
            <h3>Enable/disable</h3>
            <select
              v-model="raft.jsonArg"
              class="text-input"
              style="height: 30px;"
            >
              <option v-for="arg in ['true', 'false']" :value="arg">{{
                arg
              }}</option>
            </select>
          </div>
          <div v-else>
            <h3>Config value</h3>
            <input
              class="text-input"
              type="text"
              required
              v-model="raft.jsonArg"
            />
            <span>
              <Icon
                :size="16"
                :name="raft.jsonArgValid ? 'checkmark-circle' : 'danger-circle'"
              ></Icon>
              <span v-if="!raft.jsonArgValid" class="note"
                >Enter valid JSON</span
              >
            </span>
          </div>
        </fieldset>

        <fieldset v-if="action === 'deploy' || action === 'redeploy'">
          <h3>Contract Code</h3>
          <input
            class="text-input"
            type="file"
            required
            @change="handleContractFile"
            ref="contractCode"
          />
          <p class="note">
            Output of `aergolua --payload code.lua`, or code.lua
          </p>

          <div
            v-if="remoteCompile.loading"
            style="display: flex; align-items: center"
          >
            <LoadingIndicator
              :size="16"
              style="margin-right: 7px"
            ></LoadingIndicator>
            <span>Compiling...</span>
          </div>
          <div
            v-if="remoteCompile.result || remoteCompile.error"
            style="display: flex; align-items: center"
          >
            <Icon
              :size="16"
              :name="remoteCompile.error ? 'danger-circle' : 'checkmark-circle'"
              style="margin-right: 7px"
            ></Icon>
            <span>{{
              remoteCompile.error ? remoteCompile.error : 'Compiled'
            }}</span>
          </div>

          <h3>Arguments</h3>
          <MethodArgs
            :method="deployConstructorAbi"
            v-model="contractDeployArgs"
          ></MethodArgs>
        </fieldset>
      </form>
    </div>
    <div>
      <JsonView :data="txBody" @change="editorChanged"></JsonView>
      <div class="json-view-below">
        <ButtonGroup class="buttons">
          <Button :disabled="isButtonDisabled" size="big" @click="sign"
            >Sign</Button
          >
          <Button
            :disabled="isButtonDisabled"
            size="big"
            type="primary"
            @click="send"
            >Sign & Send</Button
          >
        </ButtonGroup>
        <div class="result">
          <div v-if="signature">
            <div class="receipt-status">
              <Icon :size="24" name="checkmark-circle"></Icon>
              <span>Signed</span>
            </div>
            <pre class="receipt-json">{{ signature }}</pre>
          </div>
          <div v-if="receiptStatus === 'loading'">
            <div class="receipt-status">
              <LoadingIndicator :size="24"></LoadingIndicator>
              <span>Waiting for receipt of {{ hash }}...</span>
            </div>
          </div>
          <div v-if="receiptStatus === 'loaded'">
            <div class="receipt-status">
              <Icon
                :size="24"
                :name="
                  receipt.status === 'ERROR'
                    ? 'danger-circle'
                    : 'checkmark-circle'
                "
              ></Icon>
              <span>{{ receipt.status }} for {{ hash }}</span>
            </div>
            <pre class="receipt-json" v-if="receipt">
            <ButtonGroup>
              <Button
              :class="`receipt-result_button ${receiptResultStatus==='json'? `active` : ``}`"
                @click="changeResultView('json')"
                :disabled="false"
                >JSON</Button
              >
              <Button
              :class="`receipt-result_button ${receiptResultStatus==='events'? `active` : ``}`"
                @click="changeResultView('events')"
                :disabled="false"
                >Events</Button
              >
            </ButtonGroup>
            <pre v-if="receiptResultStatus==='json'">{{JSON.stringify(receipt, null,2)}}</pre>
            <table class="events-table" v-else-if="receiptResultStatus==='events' && receipt.events.length>0">
              <thead>
                <th>Event Name</th>
                <th>Arguments</th>
              </thead>
              <tbody>
                <tr v-for="row in receipt.events" :key="`${row.txHash}${row.eventidx}`">
                  <td>{{ row.eventName }}</td>
                  <td class="args">{{ row.args }}</td>
                </tr>
              </tbody>
            </table>
            <table v-else>No Events Data</table>
            </pre>
          </div>
          <div v-if="receiptStatus === 'error'">
            <div class="receipt-status">
              <Icon :size="24" name="danger-circle"></Icon>
              <span>Failed loading receipt for {{ hash }}</span>
            </div>
            <pre class="receipt-json"></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import JsonView from '../components/JsonView.vue'
import {
  TxTypes,
  Amount,
  Address,
  encodeBuffer,
  decodeToBytes,
} from '@herajs/common'
import { Contract } from '@herajs/client'
import { Icon, LoadingIndicator } from './icons/'
import { Button, ButtonGroup } from './buttons/'
import MethodArgs from './MethodArgs.vue'
import { getFileExtension } from '../utils'
import { ensureDelay } from 'timed-async'

const normalActions = [
  'normal',
  'transfer',
  'call',
  'nameCreate',
  'nameUpdate',
  'deploy',
  'redeploy',
  'multicall',
] as const
const dposActions = ['stake', 'unstake', 'voteBP', 'voteDAO'] as const
const raftActions = [
  'addAdmin',
  'removeAdmin',
  'changeCluster',
  'appendConfig',
  'removeConfig',
  'enableConfig',
] as const
const actions = [...normalActions, ...dposActions, ...raftActions] as const
type Action = typeof actions[number]

const voteDaoDefaults = {
  BPCOUNT: '13',
  STAKINGMIN: '10000000000000000000000',
  GASPRICE: '50000000000',
  NAMEPRICE: '20000000000000000000',
}

const defaultTxBody: Record<string, any> = {
  type: 0,
  from: '',
  to: '',
  amount: '0 aergo',
  limit: 0,
}

function aergoConnectCall(action, responseType, d): Promise<any> {
  const data = { ...d }
  if (!d.payload && !d.payload_json) {
    data.payload = ''
  }
  return new Promise((resolve, reject) => {
    window.addEventListener(
      responseType,
      function(event) {
        if ('error' in event.detail) {
          reject(event.detail.error)
        } else {
          resolve(event.detail)
        }
      },
      { once: true }
    )
    window.postMessage(
      {
        type: 'AERGO_REQUEST',
        action: action,
        data: data,
      },
      '*'
    )
  })
}
async function requestSignTx(data) {
  const result = await aergoConnectCall('SIGN_TX', 'AERGO_SIGN_TX_RESULT', data)
  return result.signature
}
async function requestSendTx(data) {
  const result = await aergoConnectCall('SEND_TX', 'AERGO_SEND_TX_RESULT', data)
  return result.hash
}

@Component({
  components: {
    JsonView,
    LoadingIndicator,
    Icon,
    Button,
    ButtonGroup,
    MethodArgs,
  },
})
export default class BuilderView extends Vue {
  action: Action = 'normal'
  dposActions = dposActions
  raftActions = raftActions

  txBody = { ...defaultTxBody }
  contractMethod = null
  contractArgs = []
  contractDeployPayload = null
  contractDeployArgs = []
  deployConstructorAbi = null
  delegateFee = false
  remoteCompile = { loading: false, result: '', error: '' }

  voteDAODefaults = { ...voteDaoDefaults }
  voteDAOKeys = Object.keys(voteDaoDefaults)

  name = {
    name: '',
    owner: '',
  }

  vote = {
    candidates: '',
    name: '',
  }

  raft = {
    admin: '',
    configName: '',
    jsonArg: '',
    jsonArgValid: false,
  }

  receiptStatus: '' | 'loading' | 'loaded' | 'error' = ''
  receipt: any
  signature = null
  hash = null

  receiptResultStatus = 'json'

  updateTxBody(change) {
    this.txBody = { ...this.txBody, ...change }
  }

  @Watch('txBody.amount')
  amountChanged() {
    // Normalize
    this.txBody.amount = this.txBody.amount.replace(
      /(\d+(\.\d+)?)\s*([^\d\W])/,
      '$1 $3'
    )
    // Validate
    const $amountInput = this.$refs.amountInput as HTMLInputElement
    try {
      new Amount($amountInput.value)
      $amountInput.setCustomValidity('')
    } catch (e) {
      $amountInput.setCustomValidity(`${e.message}`)
    }
  }

  @Watch('txBody.to')
  recipientChanged() {
    const $recipientInput = this.$refs.recipientInput as HTMLInputElement
    try {
      new Address($recipientInput.value)
      $recipientInput.setCustomValidity('')
    } catch (e) {
      $recipientInput.setCustomValidity(`${e.message}`)
    }
  }

  @Watch('contractAddress', { immediate: true })
  contractAddressChanged() {
    this.updateTxBody({ to: this.contractAddress })
  }

  updateContractCallPayload() {
    if (!this.contractMethod) {
      return
    }
    const payload = {
      Name: this.contractMethod.name,
      Args: this.contractArgs.flat(),
    }
    this.updateTxBody({ payload_json: payload })
  }

  @Watch('contractMethod')
  contractMethodChanged() {
    this.updateContractCallPayload()
  }

  @Watch('contractArgs', { deep: true })
  contractArgsChanged() {
    this.updateContractCallPayload()
  }

  updateNameTxPayload() {
    if (this.action === 'nameCreate') {
      this.updateTxBody({
        payload_json: { Name: 'v1createName', Args: [this.name.name] },
      })
    } else if (this.action === 'nameUpdate') {
      this.updateTxBody({
        payload_json: {
          Name: 'v1updateName',
          Args: [this.name.name, this.name.owner],
        },
      })
    }
  }

  @Watch('name', { deep: true })
  nameArgsChanged() {
    this.updateNameTxPayload()
  }

  updateRaftPayload() {
    if (this.action === 'addAdmin') {
      this.updateTxBody({
        payload_json: { Name: 'appendAdmin', Args: [this.raft.admin] },
      })
    } else if (this.action === 'removeAdmin') {
      this.updateTxBody({
        payload_json: { Name: 'removeAdmin', Args: [this.raft.admin] },
      })
    } else {
      try {
        const parsedJson = JSON.parse(this.raft.jsonArg)
        this.raft.jsonArgValid = true
        if (this.action === 'changeCluster') {
          this.updateTxBody({
            payload_json: { Name: 'changeCluster', Args: [parsedJson] },
          })
        } else if (this.action === 'appendConfig') {
          this.updateTxBody({
            payload_json: {
              Name: 'appendConf',
              Args: [this.raft.configName, parsedJson],
            },
          })
        } else if (this.action === 'removeConfig') {
          this.updateTxBody({
            payload_json: {
              Name: 'removeConf',
              Args: [this.raft.configName, parsedJson],
            },
          })
        } else if (this.action === 'enableConfig') {
          this.updateTxBody({
            payload_json: {
              Name: 'enableConf',
              Args: [this.raft.configName, parsedJson],
            },
          })
        }
      } catch (e) {
        this.raft.jsonArgValid = false
      }
    }
  }

  @Watch('raft', { deep: true })
  raftInputChanged() {
    this.updateRaftPayload()
  }

  updateVotePayload() {
    let candidates = this.vote.candidates.split(',')
    if (this.action === 'voteBP') {
      this.updateTxBody({
        amount: '0 aergo',
        payload_json: { Name: 'v1voteBP', Args: [...candidates] },
      })
    } else if (this.action === 'voteDAO') {
      if (
        !candidates.length ||
        candidates[0] === '' ||
        this.txBody.payload_json?.Args[0] !== this.vote.name
      ) {
        // Reset to default value on change of Vote ID
        candidates = [this.voteDAODefaults[this.vote.name]]
        this.vote.candidates = candidates[0] || ''
      }
      this.updateTxBody({
        amount: '0 aergo',
        payload_json: {
          Name: 'v1voteDAO',
          Args: [this.vote.name, ...candidates],
        },
      })
    }
  }

  @Watch('vote', { deep: true })
  voteArgsChanged() {
    this.updateVotePayload()
  }

  @Watch('delegateFee')
  delegateFeeChanged() {
    this.updateTxBody({
      type: this.delegateFee ? TxTypes.FeeDelegation : TxTypes.Call,
      to: this.contractAddress,
    })
  }

  @Watch('action')
  actionChanged(action: Action) {
    if (
      action !== 'nameCreate' &&
      action !== 'nameUpdate' &&
      this.txBody.amount === this.namePrice
    ) {
      this.updateTxBody({ amount: '0 aergo' })
    }
    if (action === 'normal') {
      this.updateTxBody({ type: TxTypes.Normal })
    } else if (action === 'transfer') {
      this.updateTxBody({ type: TxTypes.Transfer })
    } else if (action === 'call') {
      this.updateTxBody({
        type: this.delegateFee ? TxTypes.FeeDelegation : TxTypes.Call,
        to: this.contractAddress,
      })
      this.updateContractCallPayload()
    } else if (action === 'deploy') {
      this.updateTxBody({
        type: TxTypes.Deploy,
        to: '',
        payload_json: undefined,
      })
    } else if (action === 'multicall') {
      this.updateTxBody({ type: TxTypes.MultiCall, to: '' })
    } else if (action === 'redeploy') {
      this.updateTxBody({
        type: TxTypes.Redeploy,
        to: this.contractAddress,
        payload_json: undefined,
      })
    } else if (action === 'nameCreate' || action === 'nameUpdate') {
      this.updateTxBody({
        type: TxTypes.Governance,
        to: 'aergo.name',
        amount: this.namePrice,
      })
      this.updateNameTxPayload()
    } else if (
      dposActions.indexOf(action as typeof dposActions[number]) !== -1 ||
      raftActions.indexOf(action as typeof raftActions[number]) !== -1
    ) {
      let payload_json
      if (action === 'stake') {
        payload_json = { Name: 'v1stake' }
      } else if (action === 'unstake') {
        payload_json = { Name: 'v1unstake' }
      } else if (action === 'voteBP') {
        this.updateTxBody({ amount: '0 aergo' })
        payload_json = { Name: 'v1voteBP', Args: [] }
      } else if (action === 'voteDAO') {
        this.updateTxBody({ amount: '0 aergo' })
        payload_json = { Name: 'v1voteDAO', Args: [] }
        if (!this.vote.name) this.vote.name = 'BPCOUNT'
      }
      this.updateTxBody({
        type: TxTypes.Governance,
        to: 'aergo.system',
        payload: undefined,
        payload_json,
      })
      if (raftActions.indexOf(action as typeof raftActions[number]) !== -1) {
        this.updateTxBody({ to: 'aergo.enterprise' })
        this.updateRaftPayload()
        if (!this.raft.configName) this.raft.configName = 'p2pwhite'
        if (
          !this.raft.jsonArg ||
          ['true', 'false'].indexOf(this.raft.jsonArg) !== -1
        )
          this.raft.jsonArg = '""'
        if (
          this.action === 'enableConfig' &&
          ['true', 'false'].indexOf(this.raft.jsonArg) === -1
        ) {
          this.raft.jsonArg = 'true'
        }
      }
    }
  }

  updateActionFromTxBody() {
    switch (this.txBody.type) {
      case TxTypes.Normal:
        this.action = 'normal'
        break
      case TxTypes.Transfer:
        this.action = 'transfer'
        break
      case TxTypes.Call:
        this.action = 'call'
        this.delegateFee = false
        break
      case TxTypes.FeeDelegation:
        this.action = 'call'
        this.delegateFee = true
        break
      case TxTypes.Deploy:
        this.action = 'deploy'
        break
      case TxTypes.Redeploy:
        this.action = 'redeploy'
        break
      case TxTypes.MultiCall:
        this.action = 'multicall'
        break
      case TxTypes.Governance:
      // TODO: more fine-grained action
    }
  }

  editorChanged(txBody) {
    if (txBody) {
      this.txBody = txBody
      this.updateActionFromTxBody()
    }
  }

  get consensus() {
    return this.chainInfo?.chainid?.consensus
  }

  get publicChain() {
    return this.chainInfo?.chainid?.public
  }

  get chainInfo() {
    return this.$store.state.chainInfo
  }

  get isButtonDisabled() {
    return !this.activeAccount || !this.activeAccount.address
  }

  @Watch('chainInfo')
  chainInfoChanged() {
    // Set DAO defaults to current values from chainInfo
    this.voteDAODefaults.BPCOUNT = `${this.chainInfo.bpnumber}`
    this.voteDAODefaults.STAKINGMIN = this.chainInfo.stakingminimum.formatNumber(
      'aer'
    )
    this.voteDAODefaults.GASPRICE = this.chainInfo.gasprice.formatNumber('aer')
    this.voteDAODefaults.NAMEPRICE = this.chainInfo.nameprice.formatNumber(
      'aer'
    )
  }

  get namePrice() {
    return `${this.$store.state.chainInfo?.nameprice}`
  }

  get activeAccount() {
    return this.$store.state.activeAccount
  }

  @Watch('activeAccount')
  activeAccountChanged() {
    if (this.activeAccount) {
      this.updateTxBody({ from: this.activeAccount.address })
    }
  }

  get contractAddress() {
    return this.$store.state.contract.address
  }

  get contractAbi() {
    return this.$store.state.contract.abi
  }

  get availableFunctions() {
    return (
      this.contractAbi?.functions.filter(
        (func) =>
          !func.view && func.name !== 'constructor' && func.name !== 'default'
      ) || []
    )
  }

  get selectedContractFunction() {
    if (!this.contractMethod) return undefined
    return this.contractAbi?.functions.find(
      (func) => func.name === this.contractMethod.name
    )
  }

  get canEditRecipient() {
    return ['normal', 'transfer', 'redeploy'].indexOf(this.action) !== -1
  }

  get canEditAmount() {
    const noAmount = [
      ...dposActions,
      ...raftActions,
      'nameCreate',
      'nameUpdate',
    ]
    const exceptions = ['stake', 'unstake']
    return (
      noAmount.indexOf(this.action) === -1 ||
      exceptions.indexOf(this.action) !== -1
    )
  }

  changeResultView(receiptResultStatus) {
    this.receiptResultStatus = receiptResultStatus
  }

  handleContractFile(): void {
    const $elem = this.$refs.contractCode as HTMLInputElement
    if (!$elem || !$elem.files || $elem.files.length === 0) return
    const file = $elem.files[0]
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (e.target) {
        const extension = getFileExtension(file.name)
        if (extension === 'lua') {
          try {
            this.remoteCompile.loading = true
            this.remoteCompile.error = this.remoteCompile.result = this.contractDeployPayload = null

            const contractSourceCode = e.target.result as string
            this.contractDeployPayload = contractSourceCode
          } catch (err) {
            // err doesn't contain any useful info
            console.error(err)
            this.remoteCompile.error = 'Failed to compile.'
          } finally {
            this.remoteCompile.loading = false
          }
        } else {
          this.contractDeployPayload = `${e.target.result}`.trim()
        }
        this.deployConstructorAbi = null
        if (!this.contractDeployPayload) return
      }
    }
    reader.readAsText(file)
  }

  updateContractDeployPayload() {
    const contract = Contract.fromCode(this.contractDeployPayload)
    const args = this.contractDeployArgs.flat()
    this.updateTxBody({
      payload: encodeBuffer(contract.asPayload(args), 'base64'),
    })
  }

  @Watch('contractDeployPayload')
  contractDeployPayloadChanged() {
    this.updateContractDeployPayload()
  }

  @Watch('contractDeployArgs', { deep: true })
  contractDeployArgsChanged() {
    this.updateContractDeployPayload()
  }

  async sign() {
    const formValid = (this.$refs.form as HTMLFormElement).reportValidity()
    if (!formValid) {
      return
    }
    this.signature = await requestSignTx(this.txBody)
  }

  async send() {
    const formValid = (this.$refs.form as HTMLFormElement).reportValidity()
    if (!formValid) {
      return
    }
    this.hash = await requestSendTx(this.txBody)
    this.receiptStatus = 'loading'
    this.receipt = null
    try {
      this.receipt = await this.$store.dispatch('getReceipt', {
        hash: this.hash,
      })
      this.receiptStatus = 'loaded'
    } catch (e) {
      console.log(e)
      this.receiptStatus = 'error'
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
  font-size: 0.9em;
  &.active {
    border-color: #00c789;
  }
  &:hover {
    background-color: #343434;
  }
  &:disabled {
    cursor: disabled;
  }
}
.actions {
  padding-right: 20px;
  .button {
    margin-bottom: 15px;
  }
  .row.button-group {
    flex-wrap: wrap;
    > * {
      flex: 100px 0 0;
    }
  }
}
.arguments {
  margin-left: 20px;
}
.json-view-below {
  padding: 0 20px;
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
  font-size: 0.9em;
  opacity: 0.7;
  margin: 0.5em 0;
}
.receipt-status {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon,
  .loading-indicator {
    margin-right: 10px;
  }
}
.receipt-json {
  margin: 20px 0;
  font-size: 0.9em;
  line-height: 1.3;
  background-color: #282828;
  padding: 4px 6px;

  .button-group {
    .receipt-result_button {
      flex: none;
    }
  }
  pre {
    white-space: pre-wrap;
    word-break: break-all;
  }

  .events-table {
    th {
      position: relative;
      height: auto;
      padding-bottom: 5px;
      color: #fff;
      border-bottom: 1px solid #443f51;
      padding-right: 10px;
      font-size: 12px;
      font-weight: bold;
      text-align: left;
    }

    td {
      height: auto;
      color: #fff;
      border-bottom: none;
      padding-right: 10px;
      font-size: 12px;
    }
    .args {
      width: 100%;
    }
  }
}
</style>
