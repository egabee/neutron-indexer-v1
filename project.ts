import { CosmosDatasourceKind, CosmosHandlerKind, CosmosProject } from '@subql/types-cosmos'

// Can expand the Datasource processor types via the genreic param
const project: CosmosProject = {
  specVersion: '1.0.0',
  version: '0.0.1',
  name: 'Egabee-starter',
  description: 'This project can be use as a starting point for developing indexers',
  runner: {
    node: {
      name: '@subql/node-cosmos',
      version: '>=3.0.0',
    },
    query: {
      name: '@subql/query',
      version: '*',
    },
  },
  schema: {
    file: './schema.graphql',
  },
  dataSources: [
    {
      kind: CosmosDatasourceKind.Runtime,
      startBlock: 9000266,
      // endBlock:900267,
      mapping: {
        file: './dist/index.js',
        handlers: [
          {
            handler: 'handleTx',
            kind: CosmosHandlerKind.Transaction,
            filter: { includeFailedTx: true },
          },
        ],
      },
    },
  ],
  network: {
    /* The genesis hash of the network (hash of block 0) */
    /**
     * These endpoint(s) should be non-pruned archive nodes
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * We suggest providing an array of endpoints for increased speed and reliability
     */
    endpoint: ['https://rpc-kralum.neutron-1.neutron.org', "https://rpc.neutron.nodestake.top",
      "https://neutron-rpc.lavenderfive.com",
      "https://rpc-neutron.whispernode.com","https://neutron-rpc.publicnode.com:443"],

    chainId: 'neutron-1',
    chaintypes: new Map([
      // =====================================================
      //------------------------ auth ------------------------
      // =====================================================
      [
        'cosmos.auth.v1beta1.Tx',
        {
          file: './proto/cosmos/auth/v1beta1/tx.proto',
          messages: ['MsgUpdateParams'],
        },
      ],
      [
        'cosmos.auth.v1beta1.auth',
        {
          file: './proto/cosmos/auth/v1beta1/auth.proto',
          messages: ['BaseAccount', 'ModuleAccount', 'ModuleCredential', 'Params'],
        },
      ],
      // =====================================================
      //------------------------ authz ------------------------
      // =====================================================      [
      [
        'cosmos.authz.v1beta1.tx',
        {
          file: './proto/cosmos/authz/v1beta1/tx.proto',
          messages: ['MsgGrant', 'MsgExec', 'MsgRevoke'],
        },
      ],

      [
        'cosmos.authz.v1beta1.autz',
        {
          file: './proto/cosmos/authz/v1beta1/authz.proto',
          messages: ['Grant', 'GenericAuthorization', 'GrantAuthorization', 'GrantQueueItem'],
        },
      ],
      // =====================================================
      //------------------------ bank ------------------------
      // =====================================================
      [
        'cosmos.bank.v1beta1',
        {
          file: './proto/cosmos/bank/v1beta1/tx.proto',
          messages: ['MsgSend', 'MsgMultiSend', 'MsgUpdateParams', 'MsgSetSendEnabled', 'MsgBurn'],
        },
      ],
      [
        'cosmos.bank.v1beta1.bank',
        {
          file: './proto/cosmos/bank/v1beta1/bank.proto',
          messages: ['Input', 'Output', 'Params', 'SendEnabled', 'Supply', 'DenomUnit', 'Metadata'],
        },
      ],
      [
        'cosmos.bank.v1beta1.authz',
        {
          file: './proto/cosmos/bank/v1beta1/authz.proto',
          messages: ['SendAuthorization'],
        },
      ],
      // =====================================================
      //------------------------ base ------------------------
      // =====================================================
      [
        'cosmos.base.v1beta1.coin',
        {
          file: './proto/cosmos/base/v1beta1/coin.proto',
          messages: ['Coin', 'DecCoin', ''],
        },
      ],

      // =====================================================
      // ----------------------- circuit ---------------------
      // =====================================================
      [
        'cosmos.circuit.v1.tx',
        {
          file: './proto/cosmos/circuit/v1/tx.proto',
          messages: ['MsgAuthorizeCircuitBreaker', 'MsgTripCircuitBreaker', 'MsgResetCircuitBreaker'],
        },
      ],
      [
        'cosmos.circuit.v1.types',
        {
          file: './proto/cosmos/circuit/v1/types.proto',
          messages: ['Permissions', 'Level', 'GenesisAccountPermissions', 'GenesisState'],
        },
      ],
      // =====================================================
      // ----------------------- Consensus -------------------
      // =====================================================
      [
        'cosmos.consensus.v1.tx',
        {
          file: './proto/cosmos/consensus/v1/tx.proto',
          messages: ['MsgUpdateParams'],
        },
      ],

      // =====================================================
      // ----------------------- crisis -------------------
      // =====================================================
      [
        'cosmos.crisis.v1beta1.Tx',
        {
          file: './proto/cosmos/crisis/v1beta1/tx.proto',
          messages: ['MsgVerifyInvariant', 'MsgUpdateParams'],
        },
      ],

      // =====================================================
      // ----------------------- crypto -------------------
      // =====================================================
      [
        'cosmos.crypto.multisig.Keys',
        {
          file: './proto/cosmos/crypto/multisig/keys.proto',
          messages: ['LegacyAminoPubKey'],
        },
      ],
      [
        'cosmos.crypto.multisig',
        {
          file: './proto/cosmos/crypto/multisig/v1beta1/multisig.proto',
          messages: ['MultiSignature', 'CompactBitArray'],
        },
      ],
      [
        'cosmos.crypto.ed.keys',
        {
          file: './proto/cosmos/crypto/ed25519/keys.proto',
          messages: ['PubKey', 'PrivKey'],
        },
      ],
      [
        'cosmos.crypto.secp256k1.keys',
        {
          file: './proto/cosmos/crypto/secp256k1/keys.proto',
          messages: ['PubKey', 'PrivKey'],
        },
      ],
      // =====================================================
      // ----------------------- distrubtion -----------------
      // =====================================================
      [
        'cosmos.distribution.v1beta1.tx',
        {
          file: './proto/cosmos/distribution/v1beta1/tx.proto',
          messages: [
            'MsgSetWithdrawAddress',
            'MsgWithdrawDelegatorReward',
            'MsgWithdrawValidatorCommission',
            'MsgFundCommunityPool',
            'MsgUpdateParams',
            'MsgCommunityPoolSpend',
            'MsgDepositValidatorRewardsPool',
          ],
        },
      ],
      [
        'cosmos.distribution.v1beta1.distribution',
        {
          file: './proto/cosmos/distribution/v1beta1/distribution.proto',
          messages: [
            'Params',
            'ValidatorHistoricalRewards',
            'ValidatorCurrentRewards',
            'ValidatorAccumulatedCommission',
            'ValidatorOutstandingRewards',
            'ValidatorSlashEvent',
            'ValidatorSlashEvents',
            'FeePool',
            'CommunityPoolSpendProposal',
            'DelegatorStartingInfo',
            'DelegationDelegatorReward',
            'CommunityPoolSpendProposalWithDeposit',
          ],
        },
      ],
      // =====================================================
      // ----------------------- evidence -----------------
      // =====================================================

      [
        'cosmos.evidence.v1beta1.tx',
        {
          file: './proto/cosmos/evidence/v1beta1/tx.proto',
          messages: ['MsgSubmitEvidence'],
        },
      ],
      [
        'cosmos.evidence.v1beta1.evidence',
        {
          file: './proto/cosmos/evidence/v1beta1/evidence.proto',
          messages: ['Equivocation'],
        },
      ],

      // =====================================================
      // ----------------------- feegrant --------------------
      // =====================================================
      [
        'cosmos.feegrant.v1beta1.tx',
        {
          file: './proto/cosmos/feegrant/v1beta1/tx.proto',
          messages: ['MsgGrantAllowance', 'MsgRevokeAllowance'],
        },
      ],
      [
        'cosmos.feegrant.v1beta1.feegrant',
        {
          file: './proto/cosmos/feegrant/v1beta1/feegrant.proto',
          messages: ['Grant', 'AllowedMsgAllowance', 'PeriodicAllowance', 'BasicAllowance'],
        },
      ],
      // =====================================================
      // ----------------------- genesis --------------------
      // =====================================================
      [
        'cosmos.genutil.v1beta1.Genesis',
        {
          file: './proto/cosmos/genutil/v1beta1/genesis.proto',
          messages: ['GenesisState'],
        },
      ],

      // =====================================================
      // ----------------------- gov --------------------
      // =====================================================

      //------------------v1-------------------
      [
        'cosmos.gov.v1',
        {
          file: './proto/cosmos/gov/v1/tx.proto',
          messages: [
            'MsgSubmitProposal',
            'MsgExecLegacyContent',
            'MsgVote',
            'MsgVoteWeighted',
            'MsgDeposit',
            'MsgUpdateParams',
            'MsgCancelProposal',
          ],
        },
      ],
      [
        'cosmos.gov.v1.gov',
        {
          file: './proto/cosmos/gov/v1/gov.proto',
          messages: [
            'VoteOption',
            'WeightedVoteOption',
            'Deposit',
            'Proposal',
            'ProposalStatus',
            'TallyResult',
            'Vote',
            'DepositParams',
            'VotingParams',
            'TallyParams',
            'Params',
          ],
        },
      ],

      //------------------v1beta1-------------------
      [
        'cosmos.gov.v1beta1',
        {
          file: './proto/cosmos/gov/v1beta1/tx.proto',
          messages: ['MsgSubmitProposal', 'MsgVote', 'MsgVoteWeighted', 'MsgDeposit'],
        },
      ],
      [
        'cosmos.gov.v1beta1.option',
        {
          file: './proto/cosmos/gov/v1beta1/gov.proto',
          messages: [
            'VoteOption',
            'WeightedVoteOption',
            'TextProposal',
            'Deposit',
            'Proposal',
            'ProposalStatus',
            'TallyResult',
            'Vote',
            'DepositParams',
            'VotingParams',
            'TallyParams',
          ],
        },
      ],

      // =====================================================
      // ----------------------- group --------------------
      // =====================================================
      [
        'cosmos.group.v1.tx',
        {
          file: './proto/cosmos/group/v1/tx.proto',
          messages: [
            'Exec',
            'MsgCreateGroup',
            'MsgUpdateGroupMembers',
            'MsgUpdateGroupAdmin',
            'MsgUpdateGroupMetadata',
            'MsgCreateGroupPolicy',
            'MsgUpdateGroupPolicyAdmin',
            'MsgCreateGroupWithPolicy',
            'MsgUpdateGroupPolicyDecisionPolicy',
            'MsgUpdateGroupPolicyMetadata',
            'MsgSubmitProposal',
            'MsgWithdrawProposal',
            'MsgVote',
            'MsgExec',
            'MsgLeaveGroup',
          ],
        },
      ],

      [
        'cosmos.group.v1.types',
        {
          file: './proto/cosmos/group/v1/types.proto',
          messages: [
            'Member',
            'MemberRequest',
            'ThresholdDecisionPolicy',
            'PercentageDecisionPolicy',
            'DecisionPolicyWindows',
            'VoteOption',
            'GroupInfo',
            'GroupMember',
            'GroupPolicyInfo',
            'Proposal',
            'ProposalStatus',
            'ProposalExecutorResult',
            'TallyResult',
            'Vote',
          ],
        },
      ],
      // =====================================================
      // ----------------------- ics23 --------------------
      // =====================================================
      ['cosmos.ics23.v1', { file: './proto/cosmos/ics23/v1/proofs.proto', messages: ['ProofSpec'] }],
      // =====================================================
      // ----------------------- mint --------------------
      // =====================================================
      [
        'cosmos.mint.v1beta1.tx',
        {
          file: './proto/cosmos/mint/v1beta1/tx.proto',
          messages: ['MsgUpdateParams'],
        },
      ],
      [
        'cosmos.mint.v1beta1.mint',
        {
          file: './proto/cosmos/mint/v1beta1/mint.proto',
          messages: ['Minter', 'Params'],
        },
      ],

      // =====================================================
      // ----------------------- nft --------------------
      // =====================================================
      [
        'cosmos.nft.v1beta1.tx',
        {
          file: './proto/cosmos/nft/v1beta1/tx.proto',
          messages: ['MsgSend'],
        },
      ],
      [
        'cosmos.nft.v1beta1.nft',
        {
          file: './proto/cosmos/nft/v1beta1/nft.proto',
          messages: ['Class', 'NFT'],
        },
      ],

      // =====================================================
      // ----------------------- slashing --------------------
      // =====================================================
      [
        'cosmos.slashing.v1beta1.tx',
        {
          file: './proto/cosmos/slashing/v1beta1/tx.proto',
          messages: ['MsgUnjail', 'MsgUpdateParams'],
        },
      ],
      [
        'cosmos.slashing.v1beta1.slashing',
        {
          file: './proto/cosmos/slashing/v1beta1/slashing.proto',
          messages: ['ValidatorSigningInfo', 'Params'],
        },
      ],

      // =====================================================
      // ----------------------- staking --------------------
      // =====================================================

      [
        'cosmos.staking.v1beta1',
        {
          file: './proto/cosmos/staking/v1beta1/tx.proto',
          messages: [
            'MsgCreateValidator',
            'MsgEditValidator',
            'MsgDelegate',
            'MsgBeginRedelegate',
            'MsgUndelegate',
            'MsgCancelUnbondingDelegation',
            'MsgUpdateParams',
          ],
        },
      ],
      [
        'cosmos.staking.v1beta1.authz',
        {
          file: './proto/cosmos/staking/v1beta1/authz.proto',
          messages: ['StakeAuthorization', 'AuthorizationType'],
        },
      ],
      [
        'cosmos.staking.v1beta1.staking',
        {
          file: './proto/cosmos/staking/v1beta1/staking.proto',
          messages: [
            'HistoricalInfo',
            'CommissionRates',
            'Commission',
            'Description',
            'Validator',
            'BondStatus',
            'ValAddresses',
            'DVPair',
            'DVPairs',
            'DVVTriplet',
            'DVVTriplets',
            'Delegation',
            'UnbondingDelegation',
            'UnbondingDelegationEntry',
            'RedelegationEntry',
            'Redelegation',
            'Params',
            'DelegationResponse',
            'RedelegationEntryResponse',
            'RedelegationResponse',
            'Pool',
            'Infraction',
            'ValidatorUpdates',
          ],
        },
      ],
      // =====================================================
      // ----------------------- tendermint --------------------
      // =====================================================
      [
        'cosmos.abci',
        {
          file: './proto/cosmos/tendermint/abci/types.proto',
          messages: [
            'Request',
            'RequestEcho',
            'RequestFlush',
            'RequestInfo',
            'RequestInitChain',
            'RequestQuery',
            'CheckTxType',
            'RequestCheckTx',
            'RequestCommit',
            'RequestListSnapshots',
            'RequestOfferSnapshot',
            'RequestLoadSnapshotChunk',
            'RequestApplySnapshotChunk',
            'RequestPrepareProposal',
            'RequestProcessProposal',
            'RequestExtendVote',
            'RequestVerifyVoteExtension',
            'RequestFinalizeBlock',
            'CommitInfo',
            'ExtendedCommitInfo',
            'Event',
            'EventAttribute',
            'ExecTxResult',
            'TxResult',
            'Validator',
            'ValidatorUpdate',
            'VoteInfo',
            'ExtendedVoteInfo',
            'Misbehavior',
            'MisbehaviorType',
            'Snapshot',
          ],
        },
      ],
      [
        '/cosmos.tendermint.crypto.keys',
        {
          file: './proto/cosmos/tendermint/crypto/keys.proto',
          messages: ['PublicKey'],
        },
      ],
      [
        '/cosmos.tendermint.crypto.proof',
        {
          file: './proto/cosmos/tendermint/crypto/proof.proto',
          messages: ['Proof', 'ValueOp', 'DominoOp', 'ProofOp', 'ProofOps'],
        },
      ],
      [
        '/cosmos.tendermint.bits.types',
        {
          file: './proto/cosmos/tendermint/libs/bits/types.proto',
          messages: ['BitArray'],
        },
      ],
      [
        'cosmos.p2p',
        {
          file: './proto/cosmos/tendermint/p2p/types.proto',
          messages: ['NetAddress', 'ProtocolVersion', 'DefaultNodeInfo', 'DefaultNodeInfoOther'],
        },
      ],

      [
        '/cosmos.tendermint.types',
        {
          file: './proto/cosmos/tendermint/types/types.proto',
          messages: [
            'SignedMsgType',
            'PartSetHeader',
            'Part',
            'BlockID',
            'Header',
            'Data',
            'Vote',
            'Commit',
            'CommitSig',
            'ExtendedCommit',
            'ExtendedCommitSig',
            'Proposal',
            'SignedHeader',
            'LightBlock',
            'BlockMeta',
            'TxProof',
          ],
        },
      ],

      [
        '/cosmos.tendermint.types.ValidatorSet',
        {
          file: './proto/cosmos/tendermint/types/validator.proto',
          messages: ['BlockIDFlag', 'SimpleValidator', 'ValidatorSet', 'Validator'],
        },
      ],
      [
        '/cosmos.tendermint.types.block',
        {
          file: './proto/cosmos/tendermint/types/block.proto',
          messages: ['Block'],
        },
      ],
      [
        '/cosmos.tendermint.types.evidence',
        {
          file: './proto/cosmos/tendermint/types/evidence.proto',
          messages: ['Evidence', 'DuplicateVoteEvidence', 'LightClientAttackEvidence', 'EvidenceList'],
        },
      ],
      [
        '/cosmos.tendermint.types.params',
        {
          file: './proto/cosmos/tendermint/types/params.proto',
          messages: [
            'ConsensusParams',
            'BlockParams',
            'EvidenceParams',
            'ValidatorParams',
            'VersionParams',
            'HashedParams',
            'ABCIParams',
          ],
        },
      ],
      [
        '/cosmos.tendermint.version.types',
        {
          file: './proto/cosmos/tendermint/version/types.proto',
          messages: ['App', 'Consensus'],
        },
      ],

      // =====================================================
      // ----------------------- tx --------------------
      // =====================================================
      [
        'cosmos.tx.v1beta1.Tx',
        {
          file: './proto/cosmos/tx/v1beta1/tx.proto',
          messages: [
            'Tx',
            'TxRaw',
            'SignDoc',
            'SignDocDirectAux',
            'TxBody',
            'AuthInfo',
            'SignerInfo',
            'ModeInfo',
            'Fee',
            'Tip',
            'AuxSignerData',
          ],
        },
      ],
      [
        'cosmos.tx.signing.v1beta1.Signing',
        {
          file: './proto/cosmos/tx/signing/v1beta1/signing.proto',
          messages: [
            'SignMode',
            'SignatureDescriptors',
            'SignatureDescriptor',
            // 'SignatureDescriptor.Data',
            // 'SignatureDescriptor.Data.Single',
            // 'SignatureDescriptor.Data.Multi',
          ],
        },
      ],

      // =====================================================
      // ----------------------- upgraded --------------------
      // =====================================================
      [
        'cosmos.upgrade.v1beta1.Tx',
        {
          file: './proto/cosmos/upgrade/v1beta1/tx.proto',
          messages: ['MsgSoftwareUpgrade', 'MsgCancelUpgrade'],
        },
      ],
      [
        'cosmos.upgrade.v1beta1.Tx',
        {
          file: './proto/cosmos/upgrade/v1beta1/upgrade.proto',
          messages: ['SoftwareUpgradeProposal', 'CancelSoftwareUpgradeProposal', 'ModuleVersion'],
        },
      ],

      // =====================================================
      // ----------------------- vesting --------------------
      // =====================================================
      [
        'cosmos.vesting.v1beta1.Tx',
        {
          file: './proto/cosmos/vesting/v1beta1/tx.proto',
          messages: ['MsgCreateVestingAccount', 'MsgCreatePermanentLockedAccount', 'MsgCreatePeriodicVestingAccount'],
        },
      ],
      [
        'cosmos.vesting.v1beta1.vesting',
        {
          file: './proto/cosmos/vesting/v1beta1/vesting.proto',
          messages: [
            'BaseVestingAccount',
            'ContinuousVestingAccount',
            'DelayedVestingAccount',
            'Period',
            'PeriodicVestingAccount',
            'PermanentLockedAccount',
          ],
        },
      ],

      // =====================================================
      // ----------------------- cosmwasm --------------------
      // =====================================================
      [
        'cosmwasm.wasm.v1.tx',
        {
          file: './proto/cosmwasm/wasm/v1/tx.proto',
          messages: [
            'MsgStoreCode',
            'MsgInstantiateContract',
            'MsgInstantiateContract2',
            'MsgExecuteContract',
            'MsgMigrateContract',
            'MsgUpdateAdmin',
            'MsgClearAdmin',
            'MsgUpdateInstantiateConfig',
            'MsgUpdateParams',
            'MsgSudoContract',
            'MsgPinCodes',
            'MsgUnpinCodes',
            'MsgStoreAndInstantiateContract',
            'MsgAddCodeUploadParamsAddresses',
            'MsgRemoveCodeUploadParamsAddresses',
            'MsgStoreAndMigrateContract',
          ],
        },
      ],
      [
        'cosmwasm.wasm.v1.types',
        {
          file: './proto/cosmwasm/wasm/v1/types.proto',
          messages: [
            'AccessType',
            'AccessTypeParam',
            'AccessConfig',
            'Params',
            'CodeInfo',
            'ContractInfo',
            'ContractCodeHistoryOperationType',
            'ContractCodeHistoryEntry',
            'AbsoluteTxPosition',
            'Model',
          ],
        },
      ],

      // =====================================================
      // --------------- ibc (application)--------------------
      // =====================================================
      [
        'ibc.applications.fee.v1.tx',
        {
          file: './proto/ibc/applications/fee/v1/tx.proto',
          messages: ['MsgRegisterPayee', 'MsgRegisterCounterpartyPayee', 'MsgPayPacketFee', 'MsgPayPacketFeeAsync'],
        },
      ],
      [
        'ibc.applications.fee.v1.fee',
        {
          file: './proto/ibc/applications/fee/v1/fee.proto',
          messages: ['Fee', 'PacketFee', 'PacketFees', 'IdentifiedPacketFees'],
        },
      ],
      [
        'ibc.applications.fee.v1.ack',
        {
          file: './proto/ibc/applications/fee/v1/ack.proto',
          messages: ['IncentivizedAcknowledgement'],
        },
      ],
      [
        'ibc.applications.interchain_accounts.controller.tx',
        {
          file: './proto/ibc/applications/interchain_accounts/controller/v1/tx.proto',
          messages: ['MsgRegisterInterchainAccount', 'MsgSendTx', 'MsgUpdateParams'],
        },
      ],
      [
        'ibc.applications.interchain_accounts.controller',
        {
          file: './proto/ibc/applications/interchain_accounts/controller/v1/controller.proto',
          messages: ['Params'],
        },
      ],
      [
        'ibc.applications.interchain_accounts.v1.packet',
        {
          file: './proto/ibc/applications/interchain_accounts/v1/packet.proto',
          messages: ['Type', 'InterchainAccountPacketData', 'CosmosTx'],
        },
      ],
      [
        'ibc.applications.interchain_accounts',
        {
          file: './proto/ibc/applications/interchain_accounts/host/v1/tx.proto',
          messages: ['MsgUpdateParams'],
        },
      ],
      [
        'ibc.applications.interchain_accounts.host',
        {
          file: './proto/ibc/applications/interchain_accounts/host/v1/host.proto',
          messages: ['Params'],
        },
      ],

      [
        'ibc.applications.transfer.v1.tx',
        {
          file: './proto/ibc/applications/transfer/v1/tx.proto',
          messages: ['MsgTransfer', 'MsgUpdateParams'],
        },
      ],
      [
        'ibc.applications.transfer.v1.transfer',
        {
          file: './proto/ibc/applications/transfer/v1/transfer.proto',
          messages: ['DenomTrace', 'Params'],
        },
      ],
      [
        'ibc.applications.transfer.v1.authz',
        {
          file: './proto/ibc/applications/transfer/v1/authz.proto',
          messages: ['Allocation', 'TransferAuthorization'],
        },
      ],
      [
        'ibc.applications.transfer.v2.packet',
        {
          file: './proto/ibc/applications/transfer/v2/packet.proto',
          messages: ['FungibleTokenPacketData'],
        },
      ],
      // =====================================================
      // --------------- ibc (core) --------------------
      // =====================================================

      [
        'ibc.core.channel.v1.tx',
        {
          file: './proto/ibc/core/channel/v1/tx.proto',
          messages: [
            'ResponseResultType',
            'MsgChannelOpenInit',
            'MsgChannelOpenTry',
            'MsgChannelOpenAck',
            'MsgChannelOpenConfirm',
            'MsgChannelCloseInit',
            'MsgChannelCloseConfirm',
            'MsgRecvPacket',
            'MsgTimeout',
            'MsgTimeoutOnClose',
            'MsgAcknowledgement',
          ],
        },
      ],
      [
        'ibc.core.channel.v1.channle',
        {
          file: './proto/ibc/core/channel/v1/channel.proto',
          messages: [
            'Channel',
            'IdentifiedChannel',
            'State',
            'Order',
            'Counterparty',
            'Packet',
            'PacketState',
            'PacketId',
            'Acknowledgement',
            'Timeout',
          ],
        },
      ],
      [
        'ibc.core.client.v1.tx',
        {
          file: './proto/ibc/core/client/v1/tx.proto',
          messages: [
            'MsgCreateClient',
            'MsgUpdateClient',
            'MsgUpgradeClient',
            'MsgSubmitMisbehaviour',
            'MsgRecoverClient',
            'MsgIBCSoftwareUpgrade',
            'MsgUpdateParams',
          ],
        },
      ],

      [
        'ibc.core.client.v1.client',
        {
          file: './proto/ibc/core/client/v1/client.proto',
          messages: [
            'IdentifiedClientState',
            'ConsensusStateWithHeight',
            'ClientConsensusStates',
            'Height',
            'Params',
            'ClientUpdateProposal',
            'UpgradeProposal',
          ],
        },
      ],
      [
        'ibc.core.connection.v1.tx',
        {
          file: './proto/ibc/core/connection/v1/tx.proto',
          messages: [
            'MsgConnectionOpenInit',
            'MsgConnectionOpenTry',
            'MsgConnectionOpenAck',
            'MsgConnectionOpenConfirm',
            'MsgUpdateParams',
          ],
        },
      ],
      [
        'ibc.core.connection.v1.connection',
        {
          file: './proto/ibc/core/connection/v1/connection.proto',
          messages: [
            'ConnectionEnd',
            'IdentifiedConnection',
            'State',
            'Counterparty',
            'ClientPaths',
            'ConnectionPaths',
            'Version',
            'Params',
          ],
        },
      ],
      [
        'ibc.core.commitment.v1.Commitment',
        {
          file: './proto/ibc/core/commitment/v1/commitment.proto',
          messages: ['MerklePath', 'MerkleProof'],
        },
      ],

      // =====================================================
      // --------------- ibc (lightclients) --------------------
      // =====================================================
      [
        'ibc.lightclients.localhost.v2.Localhost',
        {
          file: './proto/ibc/lightclients/localhost/v2/localhost.proto',
          messages: ['ClientState'],
        },
      ],
      [
        'ibc.lightclients.solomachine.v2.Solomachine',
        {
          file: './proto/ibc/lightclients/solomachine/v2/solomachine.proto',
          messages: [
            'ClientState',
            'ConsensusState',
            'Header',
            'Misbehaviour',
            'SignatureAndData',
            'TimestampedSignatureData',
            'SignBytes',
            'DataType',
            'HeaderData',
            'ClientStateData',
            'ConsensusStateData',
            'ConnectionStateData',
            'ChannelStateData',
            'PacketCommitmentData',
            'PacketAcknowledgementData',
            'PacketReceiptAbsenceData',
            'NextSequenceRecvData',
          ],
        },
      ],
      [
        'ibc.lightclients.tendermint.v1',
        {
          file: './proto/ibc/lightclients/tendermint/v1/tendermint.proto',
          messages: ['ClientState', 'ConsensusState', 'Misbehaviour', 'Header', 'Fraction'],
        },
      ],
      [
        'ibc.lightclients.solomachine.v2.Solomachine',
        {
          file: './proto/ibc/lightclients/solomachine/v2/solomachine.proto',
          messages: [
            'ClientState',
            'ConsensusState',
            'Header',
            'Misbehaviour',
            'SignatureAndData',
            'TimestampedSignatureData',
            'SignBytes',
            'HeaderData',
          ],
        },
      ],
      [
        'cosmos.staking.v1beta1',
        {
          file: './proto/cosmos/staking/v1beta1/tx.proto',
          messages: [
            'MsgCreateValidator',
            'MsgEditValidator',
            'MsgDelegate',
            'MsgBeginRedelegate',
            'MsgUndelegate',
            'MsgCancelUnbondingDelegation',
            'MsgUpdateParams',
          ],
        },
      ],
      [
        'google.protobuf.descriptor.DescriptorProto',
        {
          file: './proto/google/protobuf/descriptor.proto',
          messages: [
            'FileDescriptorProto',
            'DescriptorProto',
            'ExtensionRange',
            'FieldDescriptorProto',
            'OneofDescriptorProto',
            'EnumDescriptorProto',
            'EnumValueDescriptorProto',
            'ServiceDescriptorProto',
            'MethodDescriptorProto',
            'OptimizeMode',
            'FileOptions',
            'MessageOptions',
            'FieldOptions',
            'OneofOptions',
            'EnumOptions',
            'EnumValueOptions',
            'ServiceOptions',
            'MethodOptions',
            'UninterpretedOption',
            'SourceCodeInfo',
            'GeneratedCodeInfo',
          ],
        },
      ],
      ['google.protobuf.Any', { file: './proto/google/protobuf/any.proto', messages: ['Any'] }],
      ['google.protobuf.Duration', { file: './proto/google/protobuf/duration.proto', messages: ['Duration'] }],
      ['google.protobuf.Timestamp', { file: './proto/google/protobuf/timestamp.proto', messages: ['Timestamp'] }],

      
      // =====================================================
      // ---------------------- Neutron --------------------
      // =====================================================
      [
        '/transfer.v1.tx',
        {
          file: './proto/transfer/v1/tx.proto',
          messages: ['MsgTransfer'],
        },
      ],
      
      
    ]),
  },
}

// Must set default to the project instance
export default project