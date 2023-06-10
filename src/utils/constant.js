export const FLOW_TYPES = {
  STANDARD: 'standard',
  FIXED: 'fixed-rate',
};

export const EXCHANGE_MODES = {
  FIAT: 'fiat',
  CRYPTO: 'crypto',
};

export const TRANSACTION_STATUS = {
  NEW: 'new',
  WAITING: 'waiting',
  CONFIRMING: 'confirming',
  EXCHANGING: 'exchanging',
  SENDING: 'sending',
  FINISHED: 'finished',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  VERIFYING: 'verifying',
};


export const SUPPORTED_CARDANO_WALLETS = [
  {
    name: 'Nami',
    value: 'nami',
  },
  {
    name: 'Eternl',
    value: 'eternl',
  },
  {
    name: 'Flint',
    value: 'flint',
  },
  {
    name: 'NuFi',
    value: 'nufi',
  },
  {
    name: 'Typhon',
    value: 'typhoncip30',
  },
  {
    name: 'Gero',
    value: 'gerowallet',
  },
];


export const SUPPORTED_TOPUP = [
  {
    "ticker": "ada",
    "name": "Cardano",
    "link": "cardano",
    "network": "ada",
    "image": "https://content-api.changenow.io/uploads/ada_fb42809541.svg",
  },
]

export const SYSTEM_FEE = 20;
