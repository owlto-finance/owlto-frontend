<template>
  <div class="box">
    <div class="title-box">
      <h2>Bridge The World</h2>
      <p>
        Official partner of Owlto Finance. We are dedicated to building Web3
        together.
      </p>
    </div>

    <section class="group">
      <div class="title">Networks</div>
      <div class="group-box">
        <div class="group-box-container">
          <div
            class="group-item"
            v-for="(item, index) in config.networks"
            :key="index"
          >
            <a :href="item.link" target="_blank">
              <img
                v-if="userStore.isDarkTheme"
                :src="'https://owlto.finance/icon/partner' + item.darkIcon"
                alt="partner"
              />
              <img
                v-else
                :src="'https://owlto.finance/icon/partner' + item.lightIcon"
                alt="partner"
              />
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="group">
      <div class="title">Wallet</div>
      <div class="group-box">
        <div class="group-box-container">
          <div
            class="group-item"
            v-for="(item, index) in config.wallets"
            :key="index"
          >
            <a :href="item.link" target="_blank">
              <img
                v-if="userStore.isDarkTheme"
                :src="'https://owlto.finance/icon/partner' + item.darkIcon"
                alt="partner"
              />
              <img
                v-else
                :src="'https://owlto.finance/icon/partner' + item.lightIcon"
                alt="partner"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
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
                v-if="userStore.isDarkTheme"
                :src="'https://owlto.finance/icon/partner' + item.darkIcon"
                alt="partner"
              />
              <img
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
      </div>
    </section>
  </div>
</template>

<script setup>
import useStore from "@/store";

const store = useStore();
const { useUserStore } = store;
const userStore = useUserStore;

const config = {
  networks: [
    {
      name: "Arbitrum",
      link: "https://arbitrum.io/",
      darkIcon: "/dark/Arbitrum.png",
      lightIcon: "/light/Arbitrum.png",
    },
    {
      name: "Optimism",
      link: "https://www.optimism.io/",
      darkIcon: "/dark/Optimism.png",
      lightIcon: "/light/Optimism.png",
    },
    {
      name: "zkSync Era",
      link: "https://zksync.io/",
      darkIcon: "/dark/zkSyncEra.png",
      lightIcon: "/light/zkSyncEra.png",
    },
    {
      name: "Linea",
      link: "https://linea.build",
      darkIcon: "/dark/Linea.png",
      lightIcon: "/light/Linea.png",
    },
    {
      name: "Base",
      link: "https://base.org/",
      darkIcon: "/dark/Base.png",
      lightIcon: "/light/Base.png",
    },
    {
      name: "Polygon zkEVM",
      link: "https://polygon.technology/polygon-zkevm",
      darkIcon: "/dark/PolygonzkEVM.png",
      lightIcon: "/light/PolygonzkEVM.png",
    },
    {
      name: "BNB Chain",
      link: "https://www.bnbchain.org",
      darkIcon: "/light/BNBChain.png",
      lightIcon: "/light/BNBChain.png",
    },
    {
      name: "Mantle",
      link: "https://www.mantle.xyz/",
      darkIcon: "/dark/Mantle.png",
      lightIcon: "/light/Mantle.png",
    },
    {
      name: "Manta",
      link: "https://manta.network/",
      darkIcon: "/dark/Manta.png",
      lightIcon: "/light/Manta.png",
    },
    {
      name: "Scroll",
      link: "https://scroll.io/",
      darkIcon: "/dark/Scroll.png",
      lightIcon: "/light/Scroll.png",
    },
    {
      name: "Taiko",
      link: "https://taiko.xyz/",
      darkIcon: "/dark/Taiko.png",
      lightIcon: "/light/Taiko.png",
    },
    {
      name: "Starknet",
      link: "https://www.starknet.io/",
      darkIcon: "/dark/Starknet.png",
      lightIcon: "/light/Starknet.png",
    },
  ],
  wallets: [
    {
      name: "OKX Wallet",
      link: "https://www.okx.com/web3",
      darkIcon: "/dark/OKXWallet.png",
      lightIcon: "/light/OKXWallet.png",
    },
    {
      name: "Token Pocket",
      link: "https://www.tokenpocket.pro/",
      darkIcon: "/dark/TokenPocket.png",
      lightIcon: "/light/TokenPocket.png",
    },
    {
      name: "imToken",
      link: "https://token.im/",
      darkIcon: "/dark/imToken.png",
      lightIcon: "/light/imToken.png",
    },
    {
      name: "Coin98",
      link: "https://coin98.com/",
      darkIcon: "/light/Coin98.png",
      lightIcon: "/dark/Coin98.png",
    },
    {
      name: "Bitget Wallet",
      link: "https://web3.bitget.com",
      darkIcon: "/dark/BitgetWallet.png",
      lightIcon: "/light/BitgetWallet.png",
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
      name: "TaskON",
      link: "https://taskon.xyz/",
      darkIcon: "/dark/TaskON.png",
      lightIcon: "/light/TaskON.png",
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
      name: "D.ID",
      link: "https://d.id/",
      darkIcon: "/light/DID.png",
      lightIcon: "/light/DID.png",
      tags: ["Infra"],
      desc: "Your DID-based solutions for empowering identity building and community growth. ",
    },
    {
      name: "Element",
      link: "https://element.market/",
      darkIcon: "/light/Element.png",
      lightIcon: "/light/Element.png",
      tags: ["NFT"],
      desc: "The First Community-driven Aggregated Marketplace.",
    },
    {
      name: "OpenOcean",
      link: "https://openocean.finance/",
      darkIcon: "/light/OpenOcean.png",
      lightIcon: "/light/OpenOcean.png",
      tags: ["Defi"],
      desc: "Leading DEX/DeFi aggregator, providing traders and dApps with the best prices by combining liquidity from decentralized exchanges and lending protocols",
    },
    {
      name: "Chainlink",
      link: "https://chain.link/",
      darkIcon: "/dark/Chainlink.png",
      lightIcon: "/light/Chainlink.png",
      tags: ["Infra"],
      desc: "The Industry-Standard Web3 Services Platform",
    },
    {
      name: "Alchemy",
      link: "https://www.alchemy.com/",
      darkIcon: "/dark/Alchemy.png",
      lightIcon: "/light/Alchemy.png",
      tags: ["Infra"],
      desc: "Alchemy is the platform layer needed to empower developers to build great applications that tap into the blockchain revolution",
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

    .group-box {
      border-radius: 16px;
      border: 1px solid var(--unnamed, rgba(226, 226, 226, 0.2));
      background: #333;
      box-shadow: 0px 10px 36px 0px rgba(0, 0, 0, 0.2);
      padding: 20px 50px 20px 40px;
      width: auto;
      display: inline-block;
    }

    .group-box-container {
      display: flex;
      flex-wrap: wrap;
      gap: 52px;
    }

    .group-item {
      cursor: pointer;
      transition: all 0.2s;
      padding: 6px 12px;
      border: 1px solid rgba($color: #000000, $alpha: 0);
      border-radius: 0;

      img {
        min-width: 158px;
        height: 46px;
      }

      &:hover {
        transform: translate(0px, -3px);
        box-shadow: 0px 10px 36px 0px rgba(0, 0, 0, 0.2);
        border-radius: 16px;
      }
    }
  }

  .card-box {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    justify-content: space-between;
    &::after {
      content: "";
      flex-basis: 400px;
    }

    .card {
      flex-basis: 400px;
      min-height: 200px;
      padding: 24px;
      border-radius: 16px;
      border: 1px solid var(--unnamed, rgba(226, 226, 226, 0.2));
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
        font-size: 18px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.85);
        padding-top: 14px;
        word-break: break-all;
      }
    }
  }

  [data-theme="dark"] & {
    section {
      > .title {
        font-weight: 600;
      }
    }

    .group-box {
      border-radius: 16px;
      border: 1px solid var(--unnamed, rgba(226, 226, 226, 0.2));
      background: #fff;
      box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.1);

      .group-item {
        &:hover {
          transform: translate(0px, -3px);
          box-shadow: 0px 8px 28px 0px rgba(0, 0, 0, 0.1);
          border-radius: 16px;
        }
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
      font-size: 40px;
    }
  }
}
</style>
