<template>
  <div class="box">
    <div class="title-box">
      <h2>Bridge The World</h2>
      <p>
        Official partner of Owlto Finance. We are dedicated to building Web3
        together.
      </p>
    </div>

    <div class="banner">
      <div class="nav-box">
        <div
          :class="`nav ${action === index ? 'active' : ''}`"
          @click="() => (action = index)"
          v-for="(item, index) in navList"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <div class="main-box">
        <div
          class="item"
          v-for="(item, index) in action === 1
            ? config.wallets
            : config.networks"
          :key="index"
          @click="toPartner(item.link)"
        >
          <img
            :src="
              'https://owlto.finance/icon/partner/' +
              navList[action] +
              '/' +
              item.logo
            "
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
    {
      name: "Bitget Wallet",
      link: "https://web3.bitget.com",
      logo: "BitgetWallet.png",
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
    padding: 40px 0 100px;

    > .item {
      padding: 20px 40px;
      display: flex;
      gap: 14px;
      align-items: center;
      justify-content: center;
      border: 1px solid #2c2b38;
      border-radius: 8px;
      transition: all 0.2s;
      cursor: pointer;

      &:hover {
        border: 1px solid #f5c336;

        .name {
          color: #f5c336;
        }
      }

      > img {
        width: 44px;
        height: 44px;
      }

      > .name {
        font-size: 22px;
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
    }
  }
}
</style>
