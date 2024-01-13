// import { Connector, Chain, Address } from '@wagmi/core'
// // import { Connector, Chain } from 'wagmi'
// import { MetaMaskSDKOptions } from '@metamask/sdk';
// import { MetaMaskInpageProvider } from '@metamask/providers';
// import { a } from '@wagmi/connectors/dist/base-2dd7facf';



// export class customMetaMaskConnector extends Connector<
//   MetaMaskInpageProvider,
//   MetaMaskSDKOptions
// > {
//   connect(config?: { chainId?: number | undefined; } | undefined): Promise<Required<a>> {
//     throw new Error('Method not implemented.');
//   }
//   disconnect(): Promise<void> {
//     throw new Error('Method not implemented.');
//   }
//   getAccount(): Promise<Address> {
//     throw new Error('Method not implemented.');
//   }
//   getChainId(): Promise<number> {
//     throw new Error('Method not implemented.');
//   }
//   getWalletClient(config?: { chainId?: number | undefined; } | undefined): Promise<WalletClient$1<TTransport, TChain, TAccount>> {
//     throw new Error('Method not implemented.');
//   }
//   isAuthorized(): Promise<boolean> {
//     throw new Error('Method not implemented.');
//   }
//   protected onAccountsChanged(accounts: Address[]): void {
//     throw new Error('Method not implemented.');
//   }
//   protected onChainChanged(chain: string | number): void {
//     throw new Error('Method not implemented.');
//   }
//   protected onDisconnect(error: Error): void {
//     throw new Error('Method not implemented.');
//   }
//   readonly id = 'metaMask'
//   readonly name = 'MetaMask'
//   readonly ready = true

//   #provider?: MetaMaskInpageProvider

//   constructor(config: { chains?: Chain[]; options: MetaMaskSDKOptions }) {
//     super(config)
//   }

//   async getProvider() {
//     if (!this.#provider) {
//       this.#provider = new MetaMaskInpageProvider(this.options)
//     }
//     return this.#provider
//   }

//   // Implement other methods
//   // connect, disconnect, getAccount, etc.
// }
