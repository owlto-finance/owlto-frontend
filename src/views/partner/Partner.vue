<template>
  <div class="box">
    <div class="title-box">
      <h2>Bridge The World</h2>
      <p>
        Official partners of Owlto Finance. We are dedicated to building Web3.0
        together.
      </p>
    </div>

    <div class="banner">
      <div class="nav-box">
        <div class="nav">Networks</div>
      </div>
      <div class="main-box">
        <div
          class="item"
          v-for="(item, index) in config.networks"
          :key="index"
          @click="toPartner(item.link)"
        >
          <img
            v-if="item.name === 'Mantle'"
            :src="
              userStore.isDarkTheme
                ? `https://owlto.finance/icon/partner/Networks/dark/${item.logo}`
                : `https://owlto.finance/icon/partner/Networks/${item.logo}`
            "
            :alt="item.name"
          />
          <img
            v-else
            :src="'https://owlto.finance/icon/partner/Networks/' + item.logo"
            :alt="item.name"
          />
          <div class="name">{{ item.name }}</div>
        </div>
      </div>

      <div class="nav-box">
        <div class="nav">Wallets</div>
      </div>
      <div class="main-box">
        <div
          class="item"
          v-for="(item, index) in config.wallets"
          :key="index"
          @click="toPartner(item.link)"
        >
          <img
            :style="
              item.borderRadius ? 'border-radius:' + item.borderRadius : null
            "
            :src="'https://owlto.finance/icon/partner/Wallet/' + item.logo"
            :alt="item.name"
          />
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <section>
      <div class="title">Dapps</div>
      <div class="card-box">
        <div
          class="card"
          v-for="(item, index) in config.dapps"
          :key="index"
          @click="toPartner(item.link)"
        >
          <div class="head">
            <div class="logo">
              <img
                :style="
                  item.borderRadius ? 'border-radius:' + item.borderRadius : ''
                "
                v-if="userStore.isDarkTheme"
                :src="'https://owlto.finance/icon/partner' + item.darkIcon"
                alt="partner"
              />
              <img
                :style="
                  item.borderRadius ? 'border-radius:' + item.borderRadius : ''
                "
                v-else
                :src="'https://owlto.finance/icon/partner' + item.lightIcon"
                alt="partner"
              />
            </div>
            <div class="desc">
              <div class="title">{{ item.name }}</div>
              <div class="tags" v-for="(tag, i) in item.tags" :key="i">
                <div class="tag">{{ tag }}</div>
              </div>
            </div>
          </div>
          <div class="main">
            {{ item.desc }}
          </div>
          <div class="arrow">
            <img
              v-if="userStore.isDarkTheme"
              src="@/assets/partner/arrow-light.png"
              alt="arrow"
            />
            <img v-else src="@/assets/partner/arrow-dark.png" alt="arrow" />
          </div>
        </div>
        <div class="zhanwei"></div>
        <div class="zhanwei"></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import useStore from "@/store";

const store = useStore();
const { useUserStore } = store;
const userStore = useUserStore;

const action = ref(0);
const navList = ["Networks", "Wallet"];

const config = {
  networks: [
    {
      name: "Arbitrum",
      link: "https://arbitrum.io/",
      logo: "Arbitrum.png",
    },
    {
      name: "Optimism",
      link: "https://www.optimism.io/",
      logo: "Optimism.png",
    },
    {
      name: "zkSync Era",
      link: "https://zksync.io/",
      logo: "zkSyncEra.png",
    },
    {
      name: "Linea",
      link: "https://linea.build",
      logo: "Linea.png",
    },
    {
      name: "Base",
      link: "https://base.org/",
      logo: "Base.png",
    },
    {
      name: "Polygon zkEVM",
      link: "https://polygon.technology/polygon-zkevm",
      logo: "Polygonzkevm.png",
    },
    {
      name: "BNB Chain",
      link: "https://www.bnbchain.org",
      logo: "BNBchain.png",
    },
    {
      name: "Mantle",
      link: "https://www.mantle.xyz/",
      logo: "Mantle.png",
      darkLogo: "Mantle.png",
    },
    {
      name: "Manta",
      link: "https://manta.network/",
      logo: "Manta.png",
    },
    {
      name: "Scroll",
      link: "https://scroll.io/",
      logo: "Scroll.png",
    },
    {
      name: "Taiko",
      link: "https://taiko.xyz/",
      logo: "Taiko.png",
    },
    {
      name: "Starknet",
      link: "https://www.starknet.io/",
      logo: "Starknet.png",
    },
    {
      name: "Kroma",
      link: "https://kroma.network/",
      logo: "Kroma.png",
    },
    {
      name: "ZetaChain",
      link: "https://kroma.network/",
      logo: "ZetaChain.png",
    },
    {
      name: "ZKFair",
      link: "https://zkfair.io/",
      logo: "ZKFair.png",
    },
    {
      name: "X1",
      link: "https://www.okx.com/x1",
      logo: "X1.png",
    },
  ],
  wallets: [
    {
      name: "OKX Wallet",
      link: "https://www.okx.com/web3",
      logo: "OKXWallet.png",
    },
    {
      name: "Token Pocket",
      link: "https://www.tokenpocket.pro/",
      logo: "TokenPocket.png",
      borderRadius: "8px",
    },
    {
      name: "Trust Wallet",
      link: "https://trustwallet.com/",
      logo: "TrustWallet.png",
    },
    {
      name: "Bitget Wallet",
      link: "https://web3.bitget.com",
      logo: "BitgetWallet.png",
      borderRadius: "8px",
    },
    {
      name: "imToken",
      link: "https://token.im/",
      logo: "imToken.png",
    },
    {
      name: "Coin98",
      link: "https://coin98.com/",
      logo: "coin98.png",
    },
  ],
  dapps: [
    {
      name: "Galxe",
      link: "https://galxe.com/",
      darkIcon: "/light/Galxe.png",
      lightIcon: "/light/Galxe.png",
      tags: ["Infra"],
      desc: "Galxe is the leading platform for building Web3 community.",
    },
    {
      name: "QuestN",
      link: "https://questn.com/",
      darkIcon: "/light/QuestN.png",
      lightIcon: "/light/QuestN.png",
      tags: ["Infra"],
      desc: "Marketing, Growth and Analysis for Web3.",
    },
    {
      name: "TaskOn",
      link: "https://taskon.xyz/",
      darkIcon: "/dark/TaskON.png",
      lightIcon: "/light/TaskON.png",
      borderRadius: "12px",
      tags: ["Infra"],
      desc: "Boosts the completion for various Web3 tasks in a decentralized way.",
    },
    {
      name: "Port3",
      link: "https://port3.io/",
      darkIcon: "/light/Port3.png",
      lightIcon: "/light/Port3.png",
      tags: ["Infra"],
      desc: "One-stop platform to create, utilize and evolve your Web3 identity.",
    },
    {
      name: "Space ID",
      link: "https://space.id/",
      darkIcon: "/dark/SpaceID.png",
      lightIcon: "/light/SpaceID.png",
      tags: ["Infra"],
      desc: "SPACE ID is building a hub for you to discover, register, trade, & manage .eth, .bnb, & .arb web3 domains in one stop.",
    },
    {
      name: "VIP3",
      link: "https://www.vip3.io/",
      darkIcon: "/light/VIP3.png",
      lightIcon: "/light/VIP3.png",
      tags: ["Infra"],
      desc: "VIP3 is the FIRST all-in-one web3 benefits and membership platform.",
    },
    {
      name: "d.id",
      link: "https://d.id/",
      darkIcon: "/light/DID.png",
      lightIcon: "/light/DID.png",
      borderRadius: "16px",
      tags: ["Infra"],
      desc: "Your DID-based solutions for empowering identity building and community growth. ",
    },
    {
      name: "Element",
      link: "https://element.market/",
      darkIcon: "/light/Element.png",
      lightIcon: "/light/Element.png",
      borderRadius: "16px",
      tags: ["NFT"],
      desc: "The First Community-driven Aggregated Marketplace.",
    },
    {
      name: "OpenOcean",
      link: "https://openocean.finance/",
      darkIcon: "/light/OpenOcean.png",
      lightIcon: "/light/OpenOcean.png",
      tags: ["Defi"],
      desc: "Leading DEX/DeFi aggregator, one-stop decentralized crypto trading solution.",
    },
    {
      name: "Chainlink",
      link: "https://chain.link/",
      darkIcon: "/light/Chainlink.png",
      lightIcon: "/light/Chainlink.png",
      tags: ["Infra"],
      desc: "The Industry-Standard Web3 Services Platform",
    },
    {
      name: "Alchemy",
      link: "https://www.alchemy.com/",
      darkIcon: "/light/Alchemy.png",
      lightIcon: "/light/Alchemy.png",
      tags: ["Infra"],
      desc: "The platform layer needed to empower developers to build great applications that tap into the blockchain revolution",
    },
    {
      name: "Powerloom",
      link: "https://powerloom.io/",
      darkIcon: "/light/Powerloom.png",
      lightIcon: "/light/Powerloom.png",
      borderRadius: "16px",
      tags: ["Infra"],
      desc: "A decentralized network that can serve customized insights and information on web3 data",
    },

    {
      name: "iZUMi",
      link: "https://izumi.finance/",
      darkIcon: "/light/iZUMi.png",
      lightIcon: "/light/iZUMi.png",
      tags: ["Defi"],
      desc: "Liquidity Redefined - A multi-chain DeFi protocol providing One-Stop Liquidity as a Service (LaaS)",
    },

    {
      name: "SynFutures",
      link: "https://www.synfutures.com/",
      darkIcon: "/light/SynFutures.jpeg",
      lightIcon: "/light/SynFutures.jpeg",
      borderRadius: "16px",
      tags: ["Defi"],
      desc: "Decentralized Derivatives Protocol. Trade Perps. Any Asset, Anytime.",
    },
    {
      name: "Velocore",
      link: "https://velocore.xyz/",
      darkIcon: "/dark/Velocore.png",
      lightIcon: "/light/Velocore.png",
      tags: ["Defi"],
      desc: "Velocore is the first and the most optimal veDEX on multiple chains, built on the strong foundation of Velodrome.",
    },

    {
      name: "Kyber Network",
      link: "https://kyber.network/",
      darkIcon: "/dark/Kyber.png",
      lightIcon: "/dark/Kyber.png",
      tags: ["Defi"],
      desc: "A multi-chain crypto trading and liquidity hub that connects liquidity from different sources to enable trades at the best rates.",
    },
    {
      name: "Rango",
      link: "https://app.rango.exchange/swap/BSC.BNB/AVAX_CCHAIN.AVAX/",
      darkIcon: "/dark/rango.png",
      lightIcon: "/dark/rango.png",
      borderRadius: "50%",
      tags: ["Defi"],
      desc: "The ultimate #crosschain Dex/Bridge Aggregator.",
    },
    {
      name: "UneMeta",
      link: "https://www.unemeta.com/",
      darkIcon: "/dark/unemeta.png",
      lightIcon: "/dark/unemeta.png",
      borderRadius: "16px",
      tags: ["others"],
      desc: "UneMeta is a pioneering market space dedicated to empowering IP holders and creators in the Web3 realm.",
    },
    {
      name: "Certik",
      link: "https://www.certik.com/",
      darkIcon: "/dark/certik.png",
      lightIcon: "/light/certik.png",
      tags: ["infra"],
      borderRadius: "50%",
      desc: "Smart contract audits, KYC, on-chain monitoring, bug bounties, penetration testing, and more.",
    },
    {
      name: "Lynex",
      link: "https://www.lynex.fi/",
      darkIcon: "/dark/lynex.png",
      lightIcon: "/dark/lynex.png",
      tags: ["Dex"],
      desc: "The Native Liquidity Hub of linea. Fusing advanced DEX infrastructure for a more capital-efficient DeFi solution.",
    },
    {
      name: "CrusSwap",
      link: "https://crus.xyz/",
      darkIcon: "/dark/crusswap.jpg",
      lightIcon: "/dark/crusswap.jpg",
      tags: ["Dex"],
      desc: "Crus is a DEX with flexible liquidity management.",
    },

    {
      name: "SyncSwap",
      link: "https://syncswap.xyz/",
      darkIcon: "/dark/SyncSwap.png",
      lightIcon: "/dark/SyncSwap.png",
      tags: ["Defi"],
      desc: "SyncSwap is a seamless decentralized exchange (DEX).",
    },

    {
      name: "Toaster",
      link: "https://www.toaster.finance/",
      darkIcon: "/dark/Toaster.png",
      lightIcon: "/dark/Toaster.png",
      tags: ["Dex"],
      borderRadius: "16px",
      desc: "Toasterfinance is a UX solution which aims to make DeFi as easy as making toast.",
    },
    {
      name: "Fonchain",
      link: "https://fonchain.io/",
      darkIcon: "/dark/Fonchain.png",
      lightIcon: "/dark/Fonchain.png",
      borderRadius: "50%",
      tags: ["Infra"],
      desc: "Distributed public EVM compatible Layer 1 chain with an amazing TPS of 20M and a transaction processing speed of 3S.",
    },
    {
      name: "Dmail",
      link: "https://mail.dmail.ai/sub/DmailNetwork",
      darkIcon: "/dark/Dmail.png",
      lightIcon: "/dark/Dmail.png",
      tags: ["Infra"],
      borderRadius: "16px",
      desc: "One-stop platform for Messaging & Notifications.",
    },

    /* --- */
    {
      name: "Chimp Exchange",
      link: "https://chimp.exchange/",
      darkIcon: "/dark/ChimpExchange.png",
      lightIcon: "/dark/ChimpExchange.png",
      borderRadius: "16px",
      tags: ["Dex"],
      desc: "Chimp Ecosystem provides you every tool you need to succeed in DeFi.",
    },
    {
      name: "Layerbank",
      link: "https://layerbank.finance/",
      darkIcon: "/dark/Layerbank.png",
      lightIcon: "/dark/Layerbank.png",
      tags: ["Dex"],
      borderRadius: "16px",
      desc: "A universal on-chain bank designed to thrive across the omni-chain ecosystem.",
    },
  ],
};

const toPartner = (url) => {
  window.open(url, "_blank");
};
</script>

<style scoped lang="scss">
.box {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  padding: 60px 100px 120px;

  section {
    > .title {
      position: relative;
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 44px;
      padding-left: 12px;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 30px;
        background-color: #f5c336;
      }
    }
    padding-bottom: 60px;
  }

  .banner {
    padding-bottom: 40px;
  }
  .nav-box {
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 12px;
    font-size: 24px;
    gap: 40px;
    height: 40px;

    .nav {
      text-align: center;
      border-bottom: 2px solid rgba($color: #000000, $alpha: 0);
      font-weight: 600;
      height: 100%;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, -50%);
        width: 0px;
        height: 2px;
        background-color: #f5c336;
        transition: all 0.2s;
      }

      &.active {
        color: #f5c336;

        &::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 2px;
          background-color: #f5c336;
        }
      }
    }

    > div {
      transition: all 0.3s;
      cursor: pointer;
      &:hover {
        color: #f5c336;
      }
    }

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-54%);
      width: 4px;
      height: 30px;
      background-color: #f5c336;
    }
  }

  .main-box {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 40px 0 60px;

    > .item {
      padding: 20px 30px;
      display: flex;
      width: 280px;
      gap: 14px;
      align-items: center;
      border: 1px solid #2c2b38;
      border-radius: 8px;
      transition: all 0.2s;

      cursor: pointer;

      img {
        transition: all 0.5s;
        transform-style: preserve-3d;
      }

      &:hover {
        border: 1px solid #f5c336;

        & > img:nth-child(1) {
          transform: rotateY(180deg);
        }

        .name {
          color: #f5c336;
        }
      }

      img {
        width: 44px;
        height: 44px;
      }

      .name {
        font-size: 20px;
        transition: all 0.2s;
      }
    }
  }

  .card-box {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    justify-content: space-between;
    * {
      transition: all 0.2s;
    }

    .zhanwei {
      flex-basis: 400px;
    }

    .card {
      flex-basis: 400px;
      height: 224px;
      padding: 24px;
      border-radius: 16px;
      background: #333;
      position: relative;
      box-shadow: 0px 10px 36px 0px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      cursor: pointer;

      &:hover {
        .head .logo > img {
          transform: rotate(180deg);
          transform-origin: center center;
        }
      }

      .arrow {
        position: absolute;
        right: 24px;
        top: 24px;
        opacity: 1;
        transition: all 0.3s;
      }

      .head {
        display: flex;

        .logo {
          border-radius: 16px;
          margin-right: 18px;

          > img {
            transition: all 0.4s;
            transform: rotate(0deg);
            width: 70px;
          }
        }

        .title {
          font-size: 28px;
          font-weight: 500;
          padding-bottom: 8px;
        }

        .tags {
          display: flex;
          gap: 4px;
        }

        .tag {
          color: #262521;
          border-radius: 12px;
          padding: 2px 4px;
          height: 20px;
          min-width: 62px;
          font-size: 14px;
          background-color: #9a9a9a;
          font-weight: 600;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .main {
        font-size: 16.6px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.85);
        padding-top: 14px;
        word-break: keep-all;
      }
    }
  }

  [data-theme="dark"] & {
    section {
      > .title {
        font-weight: 600;
      }
    }

    .card {
      border-radius: 16px;
      border: 1px solid var(--unnamed, rgba(226, 226, 226, 0.2));
      background: #fff;
      box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.1);

      .title {
        color: #262521;
      }

      .tag {
        background-color: #f5c336 !important;
        color: #262521;
      }

      .main {
        color: #262521;
      }
    }
  }

  .title-box {
    text-align: center;
    padding-bottom: 50px;

    h2 {
      padding-bottom: 16px;
      font-size: 70px;
    }
    p {
      font-size: 24px;
      font-style: italic;
      color: #f5c539;

      [data-theme="dark"] & {
        color: $c3;
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .box {
    padding: 60px 30px 120px;
  }
  .card-box {
    .card {
      flex-basis: 100% !important;
    }
  }
}
</style>
