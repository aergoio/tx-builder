export interface ChainConfig {
  chainId: string;
  nodeUrl: string;
}

export const ChainConfigs: ChainConfig[] = [
  {
    chainId: 'testnet.aergo.io',
    nodeUrl: 'https://testnet-api-http.aergo.io',
  },
  {
    chainId: 'aergo.io',
    nodeUrl: 'https://mainnet-api-http.aergo.io',
  },
  {
    chainId: 'sqltestnet.aergo.io',
    nodeUrl: 'https://sqltestnet-api-http.aergo.io',
  },
  {
    chainId: 'alpha.aergo.io',
    nodeUrl: 'https://alpha-api-http.aergo.io',
  },
];