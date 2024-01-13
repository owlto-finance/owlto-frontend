import axios from "axios";
import { flag } from "./ethereum";
import { showToast } from "vant";
import "vant/es/toast/style";
import useUserStore from "@/store/modules/user";
import { createHash } from "../common/function";

// export const baseURL = flag ? '' : 'https://paypto.finance/'
export const baseURL = flag ? "" : "/api";
// export const baseURL = flag ? "" : "http://43.156.97.49:5001/api/";
export async function request(config) {
  const userStore = useUserStore();
  const data = `${userStore.owltoFinanceUserId}${Math.round(
    new Date().getTime() / 1000 / 60 / 60
  )}`;

  const hash = await createHash(data);

  const instance = axios.create({
    baseURL: baseURL,
    method: "get" || config.method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      additional: hash,
    },
    timeout: 7000,
  });

  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (err) => {
      console.error(err);
    }
  );

  instance.interceptors.response.use(
    (res) => {
      if (res.data.code == 0) {
        return Promise.resolve(res.data);
      } else {
        return Promise.resolve(res.data);
      }
      console.log(res);
    },
    (err) => {
      console.error(err);
    }
  );
  return instance(config);
}

export const request2 = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  },
});

request2.interceptors.request.use(async (config) => {
  const userStore = useUserStore();
  const data = `${userStore.owltoFinanceUserId}${Math.round(
    new Date().getTime() / 1000 / 60 / 60
  )}`;

  const hash = await createHash(data);
  return { ...config, headers: { ...config.headers, additional: hash } };
});

request2.interceptors.response.use((res) => {
  return res.data;
});

export const request3 = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  },
});

request3.interceptors.request.use(async (config) => {
  const userStore = useUserStore();
  const data = `${userStore.owltoFinanceUserId}${Math.round(
    new Date().getTime() / 1000 / 60 / 60
  )}`;

  const hash = await createHash(data);
  return { ...config, headers: { ...config.headers, additional: hash } };
});
