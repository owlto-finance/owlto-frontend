import { getPageUrlData, debounce } from "@/common/function";
import { signMessage, watchAccount } from "@wagmi/core";
import bus from "@/bus";
import { request } from "@/api/request";
import useStore from "@/store";

const { useUserStore } = useStore();
const userStore = useUserStore;

const channelId = getPageUrlData("channel");

watchAccount(
  debounce(async (account) => {
    if (
      channelId &&
      channelId != null &&
      userStore.owltoFinanceUserId &&
      account.isConnected
    ) {
      queryUserState(account.address);
    }
  })
);

const userBinding = (hash) => {
  try {
    const res = request({
      url: `user?method=add&user=${userStore.owltoFinanceUserId}&channel=${channelId}&signature=${hash}`,
    });
    console.log("userBinding State", res);
  } catch (e) {
    console.error(e);
  }
};

const queryUserState = async (account) => {
  try {
    const res = await request({
      url: `user?method=shouldBind&user=${
        account || userStore.owltoFinanceUserId
      }&&channel=${channelId}`,
    });
    console.log("queryUserState res", res);
    if (res.code == 0) {
      const hash = await getChannelIdHash(res.msg.channel_name);
      userBinding(hash);
    }
  } catch (e) {
    console.error(e);
    if (res.code == 0) {
      const hash = await getChannelIdHash(res.msg.channel_name);
      userBinding(hash);
    }
  }
};

const getChannelIdHash = async (channelName) => {
  console.log("abc");
  const signatureHash = await signMessage({
    message:
      "Please sign to accept the special invitation from " +
      channelName +
      ".\n\n" +
      "The prestigious entrance is channel=" +
      channelId +
      "\n\nThis will not request any other permissions and will not cost any gas fees.",
  });
  console.log("signatureHash", signatureHash);
  return signatureHash;
};
