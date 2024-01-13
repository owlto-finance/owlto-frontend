import useUserStore from "./modules/user";
import useTokenStore from "./modules/token";
import useWalletStore from "./modules/wallet";
import useStarkNetStore from "./modules/starknet";

const useStore = () => ({
  useUserStore: useUserStore(),
  useTokenStore: useTokenStore(),
  useWalletStore: useWalletStore(),
  useStarkNetStore: useStarkNetStore(),
});

export default useStore;
