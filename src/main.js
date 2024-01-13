import "./utils/init.js";
import { createApp } from "vue";
import "./style.scss";
import "./assets/iconfont/iconfont.css";
import "./assets/aliiconfont/iconfont.css";
import "./assets/font/font.css";
import "vant/lib/index.css";
import router from "./router";
import { request } from "@/api/request";
import { Toast } from "vant";
import { setDomFontSize } from "./utils/dom";
import "@vant/touch-emulator";
import { wagmiConfig } from "./wagmi";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";
import { ConfigProvider } from "vant";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import App from "./App.vue";

const store = createPinia();
store.use(piniaPersist);

setDomFontSize();

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);
app.use(store);
app.use(Toast);
app.use(wagmiConfig);
app.use(ConfigProvider);
app.config.globalProperties.$request = request;
app.config.warnHandler = () => null;
app.mount("#app");
