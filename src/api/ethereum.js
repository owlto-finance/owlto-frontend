import Web3 from 'web3'
import usdcAbi from './abi/usdc.json'
import usdtAbi from './abi/usdt.json'
import lpAbi from './abi/lp.json'
import lpArbitrumAbi from './abi/lpArbitrum.json'
import birdgeAbi from './abi/bridge.json'
import { getUserId } from '@/common/function'
import fromalLpAbi from './abi/formalLpArbitrum.json'
import { request } from './request'
import { erc20ABI } from '@wagmi/core'

// true => Formal service   false => Test suits
export const flag = false
// export const web3 = window.ethereum ? new Web3(ethereum) : alert('You should consider trying MetaMask!')

export const web3 = new Web3(window.ethereum ? ethereum : 'https://eth-goerli.public.blastapi.io')
export const changeProvider = (chainId = 5) => {
  switch (chainId) {
    case 5:
      return 'https://eth-goerli.public.blastapi.io'
    case 3:
      return 'https://poly-rpc.gateway.pokt.network'
    case 421613:
      return 'https://goerli-rollup.arbitrum.io/rpc'
    case 280:
      return 'https://testnet.era.zksync.dev'
    case 420:
      return 'https://optimism-goerli.public.blastapi.io'
  }
}

export const fromWeb3 = new Web3(changeProvider(5))
export const toWeb3 = new Web3(changeProvider(421613))

// web3.eth.defaultAccount = getUserId;
export const lpAddress = flag ? '' : '0x2771eF8193b982115d9E6BF64cC0a94D65d7472e'
// export const lpAddress = flag ? '' : '0xdA0646d5c7DA8328f68E2E250fa0d36Ff9cAcf4e'
export const usdcAddress = flag ? '' : '0x07865c6e87b9f70255377e024ace6630c1eaa37f'
export const usdtAddress = flag ? '' : '0x509ee0d083ddf8ac028f2a56731412edd63223b9'
export const daiAddress = flag ? '' : '0x73967c6a0904aa032c103b4104747e88c566b1a2'
export const birdgeEthereumAddress = flag ? '' : '0x74657b7d7281fbf5edd6909b87B76df0160a7d3b'
export const birdgeArbitrumAddress = flag ? '' : '0x95cA6b98aDc4326Da79c308Da8404B61e76aA33e'
export const birdgeZksyncAddress = flag ? '' : '0x202A3e5e72FC34e16E2330c60fD777d7FA865ba7'
export const birdgeOptimismAddress = flag ? '' : '0xed2fc44da32adb8b57a19e289fc7d0b42d674294'




export const usdcContract = new web3.eth.Contract(usdtAbi, usdcAddress)
export const usdtContract = new web3.eth.Contract(usdtAbi, usdtAddress)

export const bridgeEthereumContract = new web3.eth.Contract(birdgeAbi, birdgeEthereumAddress)
export const bridgeArbitrumContract = new web3.eth.Contract(birdgeAbi, birdgeArbitrumAddress)
export const bridgeZksyncContract = new web3.eth.Contract(birdgeAbi, birdgeZksyncAddress)
export const bridgeOptimismContract = new web3.eth.Contract(birdgeAbi, birdgeOptimismAddress)

// Get the currency balnace
// USDC
export const getUsdcBalance = () => usdcContract.methods.balanceOf(getUserId).call()
// USDT
export const getUsdtBalance = () => usdtContract.methods.balanceOf(getUserId).call()
