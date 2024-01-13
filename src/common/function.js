import { flag } from "@/api/ethereum";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import { ref, watchEffect } from "vue";
import { utils } from "ethers";
import {
  ConnectorNotFoundError,
  getConfig,
  SwitchChainNotSupportedError,
  switchNetwork,
} from "@wagmi/core";
import { numberToHex } from "viem";
import { from } from "form-data";
import { uint256 } from "starknet";

export const web3 = new Web3(
  window.ethereum ? ethereum : import.meta.env.VITE_WEB3_RPC_URL
);

export let getUserId = localStorage.getItem("userId");

export const getPageUrlData = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substring(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
};

export const fillZero = (s, length) => {
  let str = s;
  if (s.length < length) {
    const number = length - str.length;
    let zero = "";
    for (let i = 0; i < number; i++) {
      zero += "0";
    }
    str = "0x" + zero + str.slice(2, str.length);
  }
  return str;
};

export const getChainData = (allChains, chainId) => {
  let data = allChains.filter((item) => item.chainId == chainId);
  return data[0];
};
export const getNewTokenData = (alltokens, tokenName) => {
  let token = alltokens.filter(
    (item) => item.text.toUpperCase() == tokenName.toUpperCase()
  );
  return token[0];
};

export const getAddress = (alltokens, id) => {
  let address = alltokens.filter((item) => item.chainId == id);
  return address[0].address;
};

export const getTxContractAddress = (allTokens, currentToken, fromChainId) => {
  let tx = allTokens.filter(
    (item) =>
      item.text == currentToken.text &&
      item.baseAddress.toLowerCase() == currentToken.address.toLowerCase() &&
      item.chainId == fromChainId
  );

  return tx[0];
};

export const createHash = async (data) => {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle?.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const getFromChainAddress = (fromTo, chainId) => {
  let chain = fromTo.filter((item) => item.fromChainId == chainId);

  return chain[0].fromAddress;
};
export const getToChainAddress = (fromTo, chainId) => {
  let chain = fromTo.filter((item) => item.toChainId == chainId);
  return chain[0].toAddress;
};

export const getTokenIcon = (allTokens, tokenAdderss) => {
  let token = allTokens.filter(
    (item) => item.address.toLowerCase() == tokenAdderss.toLowerCase()
  );
  return token[0].icon;
};

export const getHistoryTime = (timer) => {
  let date = new Date(+timer * 1000);
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  let h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + " : ";
  let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return M + D + h + m;
};

export const getHistoryTime2 = (timer) => {
  let date = new Date(+timer * 1000);
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  let h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return M + D + h + m;
};

export const getTokenName = (allTokens, tokenAdderss) => {
  let token = allTokens.filter(
    (item) => item.address.toLowerCase() == tokenAdderss.toLowerCase()
  );
  return token[0].text;
};

export const getTokenNameByBaseChainId = (allTokens, baseChainId, address) => {
  let token = allTokens.filter(
    (item) => item.baseChainId === baseChainId && item.address === address
  );
  return token[0].text;
};

export const getTokenIconByBaseChainId = (allTokens, baseChainId, address) => {
  let token = allTokens.filter(
    (item) => item.baseChainId === baseChainId && item.address === address
  );
  return token[0].icon;
};

export const getChainIcon = (allChains, chainId) => {
  let chain = allChains.filter((item) => item.chainId == chainId);
  return chain[0] && chain[0].icon;
};
export const getChainName = (allChains, chainId) => {
  let chain = allChains.filter((item) => item.chainId == chainId);
  return chain[0].text;
};

export const getToChainList = (formChainId, fromToChians, allChains) => {
  let getToId = fromToChians.filter((item) => item.fromChainId == formChainId);
  let toChians = [];
  for (let i of getToId) {
    for (let j of allChains) {
      if (i.toChainId == j.chainId) {
        toChians.push(j);
      }
    }
  }
  // console.log('getToChainList:', toChians);
  return toChians;
};

export const getChainListFun = (arr1, arr2) => {
  let onlyArr = arr1.filter((item, index, arr) => {
    return arr.findIndex((t) => t.fromChainId === item.fromChainId) === index;
  });
  let chainArr = [];
  let arrZero = null;
  for (let i of onlyArr) {
    arrZero = arr2.filter((item) => item.chainId == i.fromChainId);
    chainArr.push(arrZero[0]);
  }
  return chainArr.filter((item) => item);
};

export const forList = (list, item) => {
  for (let allItem of list) {
    for (let listItem of item) {
      if (
        allItem.chainId == listItem.chainId &&
        allItem.address == listItem.address
      ) {
        return allItem;
      }
    }
  }
};

const isOriginal4902 = (error) => {
  if (
    "data" in error &&
    "originalError" in error.data &&
    "code" in error.data.originalError &&
    error.data.originalError.code === 4902
  ) {
    return true;
  }
  return false;
};

export const mySwitchNetwork = async (chainId) => {
  console.log("---");
  const { connector } = getConfig();
  if (!connector) {
    throw new ConnectorNotFoundError();
  }
  if (!connector.switchChain) {
    throw new SwitchChainNotSupportedError({ connector });
  }
  const provider = await connector.getProvider();
  const id = numberToHex(chainId);
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: id }],
    });
    return (
      connector.chains.find((x) => x.id === chainId) ?? {
        id: chainId,
        name: `Chain ${id}`,
        network: `${id}`,
        nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH" },
        rpcUrls: { default: { http: [""] }, public: { http: [""] } },
      }
    );
  } catch (error) {
    const chain = connector.chains.find((x) => x.id === chainId);
    console.log(chain);
    if (!chain)
      throw new ChainNotConfiguredForConnectorError({
        chainId,
        connectorId: connector.id,
      });
    console.log("test error:", error);
    // Indicates chain is not added to provider
    if (error.code === 4902 || isOriginal4902(error)) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: id,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [chain.rpcUrls.public?.http[0] ?? ""],
              blockExplorerUrls: connector.getBlockExplorerUrls(chain),
            },
          ],
        });
        await switchNetwork({ chainId: id });
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: id }],
        });
        return chain;
      } catch (error) {
        throw new UserRejectedRequestError(error);
      }
    }

    throw new SwitchChainError(error);
  }
};

export const getProvider = (providerName) => {
  let provider = window.ethereum;
  if (typeof window.ethereum !== "undefined") {
    switch (providerName) {
      case "COINBASE":
        if (window.ethereum.providers?.length) {
          window.ethereum.providers.forEach(async (p) => {
            if (p.isCoinbaseWallet) provider = p;
          });
        }
        break;
      case "METAMASK":
        if (window.ethereum.providers?.length) {
          window.ethereum.providers.forEach(async (p) => {
            if (p.isMetaMask) provider = p;
          });
        }
        break;
      default:
        console.error("NO Provider");
        break;
    }
    console.log("currentProviderObj", provider);
    return provider;
  } else {
    console.error("no  provider");
    return "";
  }
};

export const updateLocalUserId = (key, defaultValue) => {
  const value = localStorage.getItem(key) || null;
  const data = ref(value);

  watchEffect(() => {
    localStorage.setItem(key, data.value);
  });
  return data;
};

export const debounce = (func, delay = 300) => {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

const tokenNameList = (tokenId = 1) => {
  switch (tokenId) {
    case 1:
      return "ETH";
    case 2:
      return "USDC";
    case 3:
      return "USDT";
    case 4:
      return "DAI";
  }
};

export const getNetworkCode = (toChainid = 421613) => {
  const networkCodeList = [
    {
      netId: 1,
      codeId: 1,
    },
    {
      netId: 5,
      codeId: "5001",
    },
    {
      netId: 280,
      codeId: "5002",
    },
    {
      netId: 420,
      codeId: "5003",
    },
    {
      netId: 421613,
      codeId: "5004",
    },
  ];

  let codeRes = networkCodeList.filter((item) => item.netId == toChainid);
  return codeRes[0].codeId;
};

export const addNewNetworkItem = (tokenId = 1, chainId = 5) => {
  const InternetList = [
    {
      netId: 5,
      netName: "Goerli Testnet",
      tokenName: tokenNameList(tokenId),
      tokenSymbol: tokenNameList(tokenId),
      rpcUrls: "https://eth-goerli.public.blastapi.io",
      blockExplorerUrls: "https://goerli.etherscan.io/",
    },
    {
      netId: 421613,
      netName: "Arbitrum Goerli Testnet",
      tokenName: tokenNameList(tokenId),
      tokenSymbol: tokenNameList(tokenId),
      rpcUrls: "https://goerli-rollup.arbitrum.io/rpc",
      blockExplorerUrls: "https://goerli.arbiscan.io/",
    },
    {
      netId: 280,
      netName: "zkSync Era Testnet",
      tokenName: tokenNameList(tokenId),
      tokenSymbol: tokenNameList(tokenId),
      rpcUrls: "https://testnet.era.zksync.dev",
      blockExplorerUrls: "https://goerli.explorer.zksync.io",
    },
    {
      netId: 420,
      netName: "Optimism Goerli Testnet",
      tokenName: tokenNameList(tokenId),
      tokenSymbol: tokenNameList(tokenId),
      rpcUrls: "https://optimism-goerli.public.blastapi.io",
      blockExplorerUrls: "https://optimism.io",
    },
  ];
  const formalInternetList = [
    {
      netId: 5,
      netName: "Goerli Testnet",
      tokenName: tokenNameList(tokenId),
      tokenSymbol: tokenNameList(tokenId),
      rpcUrls: "https://eth-goerli.public.blastapi.io",
      blockExplorerUrls: "https://goerli.etherscan.io/",
    },
    {
      netId: 421613,
      netName: "Arbitrum Goerli Testnet",
      tokenName: tokenNameList(tokenId),
      tokenSymbol: tokenNameList(tokenId),
      rpcUrls: "https://goerli-rollup.arbitrum.io/rpc",
      blockExplorerUrls: "https://goerli.arbiscan.io/",
    },
    {
      netId: 280,
      netName: "zkSync Era Testnet",
      tokenName: tokenNameList(tokenId),
      tokenSymbol: tokenNameList(tokenId),
      rpcUrls: "https://testnet.era.zksync.dev",
      blockExplorerUrls: "https://goerli.explorer.zksync.io",
    },
    {
      netId: 420,
      netName: "Optimism Goerli Testnet",
      tokenName: tokenNameList(tokenId),
      tokenSymbol: tokenNameList(tokenId),
      rpcUrls: "https://optimism-goerli.public.blastapi.io",
      blockExplorerUrls: "https://optimism.io",
    },
  ];
  let network = flag
    ? formalInternetList.filter((item) => item.netId == chainId)
    : InternetList.filter((item) => item.netId == chainId);
  return network[0];
};

export const addNetwork = async (tokenId = 1, fromId = 5, provider) => {
  let networkId = web3.utils.numberToHex(fromId);
  // console.log('currentProvider', currentProviderName);
  // let provider = await getProvider(currentProviderName)
  // console.log('network provider', provider);
  if (provider) {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: networkId,
          },
        ],
      });
    } catch (e) {
      let netItem = addNewNetworkItem(tokenId, fromId);
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: networkId,
              chainName: netItem.netName,
              nativeCurrency: {
                name: netItem.tokenName,
                symbol: netItem.tokenSymbol,
                decimals: 18,
              },
              rpcUrls: [netItem.rpcUrls],
              blockExplorerUrls: [netItem.blockExplorerUrls],
            },
          ],
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
};

export const handOffNetwork = async (netId) => {
  const networkId = web3.utils.numberToHex(netId);
  window.ethereum &&
    window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: networkId,
        },
      ],
    });
};

export const getScanMessage = (id = 5) => {
  const scanList = [
    {
      id: 5,
      name: "Ethereum",
      icon: getImg("Ethereum.png"),
      url: "https://goerli.etherscan.io",
    },
    {
      id: 421613,
      name: "Arbitrum",
      icon: getSvg("Arbitrum.svg"),
      url: "https://goerli.arbiscan.io",
    },
    {
      id: 280,
      name: "zkSync",
      icon: getImg("Zksync.png"),
      url: "https://zksync2-testnet.zkscan.io",
    },
    {
      id: 420,
      name: "Optimism",
      icon: getImg("Optimism.png"),
      url: "https://goerli-optimism.etherscan.io",
    },
    {
      id: 534353,
      name: "Scroll",
      icon: getImg("ScrollChainLost.png"),
      url: "https://blockscout.scroll.io",
    },
  ];
  let scanUrl = scanList.filter((item) => id == item.id);
  return scanUrl[0];
};

export const getToFixed = (num, toFixedNum = 6) => {
  // if (Number.isInteger(num)) {
  //   return String(num);
  // } else {
  //   return num.toString().slice(0, num.toString().indexOf('.') + toFixedNum + 1).replace(/\.?0+$/, "")
  // }
  if (Number.isInteger(num)) {
    return String(num);
  } else {
    const numString = num.toString();
    const decimalIndex = numString.indexOf(".");
    if (decimalIndex !== -1) {
      let slicedNumString = numString.slice(0, decimalIndex + toFixedNum + 1);
      slicedNumString = slicedNumString.replace(/\.?0+$/, "");
      return slicedNumString;
    } else {
      return numString;
    }
  }
};

export const getNumFixed = (value, toFixedNum = 6) => {
  return Number(value.toFixed(toFixedNum));
};

// const uuid = (len, radix) => {
//   var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
//   var uuid = [], i;
//   radix = radix || chars.length;

//   if (len) {
//     // Compact form
//     for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
//   } else {
//     // rfc4122, version 4 form
//     var r;
//     // rfc4122 requires these characters
//     uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
//     uuid[14] = '4';
//     // Fill in random data.  At i==19 set the high bits of clock sequence as
//     // per rfc4122, sec. 4.1.5
//     for (i = 0; i < 36; i++) {
//       if (!uuid[i]) {
//         r = 0 | Math.random() * 16;
//         uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
//       }
//     }
//   }

//   return uuid.join('');
// }
// const sessionId = () => {
//   let date = +new Date()
//   let rund = Math.ceil(Math.random() * 10000000000)
//   let id = date + '' + rund + "" + getUserId + uuid()
//   let res = web3.utils.toBN(web3.utils.keccak256(id))
//   return res
// }
// export const sendSessionId = sessionId()

// maximum
export const maxNum = () => {
  let f_max_num = new BigNumber(2).pow(256).minus(1);
  const max_num = f_max_num.toString(16);
  return max_num;
};

export const initTime = (timer) => {
  let date = new Date(timer);

  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let D =
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
    "&nbsp;&nbsp;&nbsp;";
  let h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  let m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
};

export const formatUserId = (userId, leftLen, rightLen) => {
  if (userId) {
    let firstname = userId.substr(0, leftLen || 6);
    let lastname = userId.substr(rightLen || -4);
    return firstname + "..." + lastname;
  }
};

export const ellipsis2 = (str, leftLen = 6, rightLen = 6) => {
  if (str.length > leftLen) {
    return (
      str.slice(0, Math.floor(leftLen / 2)) +
      "..." +
      str.slice(-Math.floor(rightLen / 2))
    );
  }
  return str;
};

export const ellipsis = (str, len = 10) => {
  if (str.length > len) {
    return (
      str.slice(0, Math.floor(len / 2)) +
      "..." +
      str.slice(-Math.floor(len / 2))
    );
  }
  return str;
};

const accuracyList = [
  {
    key: "noether",
    accuracy: 0,
  },
  {
    key: "wei",
    accuracy: 1,
  },
  {
    key: "kwei",
    accuracy: 3,
  },
  {
    key: "Mwei",
    accuracy: 6,
  },
  {
    key: "gwei",
    accuracy: 9,
  },
  {
    key: "szabo",
    accuracy: 12,
  },
  {
    key: "finney",
    accuracy: 15,
  },
  {
    key: "ether",
    accuracy: 18,
  },
];

export const getNumberByDecimal = (num, decimal = 18) => {
  return new BigNumber(num)
    .div(new BigNumber(10).exponentiatedBy(decimal))
    .toString();
};

export const fromWei = (num, accuracy = 18) => {
  let str = accuracyList.find((item) => item.accuracy == accuracy);

  let key = str.key ?? "ether";

  if (typeof num === "number") {
    return web3.utils.fromWei(num + "", key);
  }
  return web3.utils.fromWei(num, key);
};

export const toWei = async (num, accuracy = 18) => {
  let str = accuracyList.find((item) => item.accuracy == accuracy);
  console.log("toWei accuracy: " + str?.key, str?.accuracy);
  let key = str.key ?? "ether";

  if (typeof num === "number") {
    return web3.utils.toWei(num + "", key);
  }
  return web3.utils.toWei(num, key);
};

export const isMobile = window.navigator.userAgent.match(
  /(phone|pod|iPhone|ios|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
)
  ? true
  : false;

export const getTransactionStatus = async (hash) => {
  var receipt = web3.eth
    .getTransactionReceipt(
      "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b"
    )
    .then((res) => {
      console.log(res);
    });
  console.log(receipt);

  return receipt;
};

export const pointsFormat = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + " B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + " M";
  } else {
    return num;
  }
};

export const getUint256CalldataFromBN = (bn) => {
  return { type: "struct", ...uint256.bnToUint256(bn) };
};

export const parseInputAmountToUint256 = (input, decimals = 18) => {
  return getUint256CalldataFromBN(utils.parseUnits(input, decimals).toString());
};

export const getAssetURL = (image) => {
  return new URL(`../assets/image/${image}`, import.meta.url).href;
};
export const getImg = (image) => {
  return new URL(`../assets/img/${image}`, import.meta.url).href;
};
export const getSvg = (image) => {
  return new URL(`../assets/svg/${image}`, import.meta.url).href;
};
export const getNewImg = (image) => {
  return new URL(`../assets/newImg/${image}`, import.meta.url).href;
};
export const getMoreImg = (image) => {
  return new URL(`../assets/moreImg/${image}`, import.meta.url).href;
};
export const getNewSvg = (image) => {
  return new URL(`../assets/newsvg/${image}`, import.meta.url).href;
};

export const getWalletIcon = (image) => {
  return new URL(`../assets/wallet/${image}`, import.meta.url).href;
};
export const getNewLink = (link) => {
  return new URL(`../assets/rewards/link/${link}`, import.meta.url).href;
};

export const getRankImg = (image) => {
  return new URL(`../assets/rewards/rank/${image}`, import.meta.url).href;
};

export const getLotteryImg = (image) => {
  return new URL(`../assets/lottery/year/${image}`, import.meta.url).href;
};
