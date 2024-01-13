import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

const Bridge = () => import("@/views/bridge/Bridge.vue");
const Maker = () => import("@/views/maker/Maker.vue");
const Test = () => import("@/views/test/Test.vue");
const Invitation = () => import("@/views/invitation/Invitation.vue");
const InvitationV2 = () => import("@/views/invitationV2/Invitation.vue");
const Faucet = () => import("@/views/faucet/Faucet.vue");
const Partner = () => import("@/views/partner/Partner.vue");
const Deploy = () => import("@/views/deploy/Deploy.vue");
const Inscribe = () => import("@/views/inscribe/inscribe.vue");
const Zkfairdrop = () => import("@/views/zkfairdrop/zkfairdrop.vue");
const Mantadrop = () => import("@/views/mantadrop/mantadrop.vue");

const History = () => import("@/components/pages/History.vue");
const Confirm = () => import("@/components/pages/Confirm.vue");
const Completed = () => import("@/components/pages/Completed.vue");
const InvitePage = () => import("@/components/pages/InvitePage.vue");
const DevelopingPage = () => import("@/components/pages/DevelopingPage.vue");
const Query = () => import("@/components/pages/Query.vue");

const routes = [
  {
    path: "/bridge",
    redirect: "/",
  },
  {
    path: "/",
    name: "bridge",
    component: Bridge,
    meta: {
      footerFixed: true,
      backgroundImage: true,
    },
  },
  {
    path: "/maker",
    name: "maker",
    component: Maker,
    meta: {
      footerFixed: true,
    },
  },
  {
    path: "/ecosystem",
    name: "ecosystem",
    component: Partner,
    meta: {
      footerFixed: false,
    },
  },
  {
    path: "/deploy",
    name: "deploy",
    component: Deploy,
    meta: {
      footerFixed: true,
    },
  },
  {
    path: "/inscribe",
    name: "inscribe",
    component: Inscribe,
    meta: {
      footerFixed: true,
      backgroundImage: true,
    },
  },
  // {
  //   path: "/zkfairdrop",
  //   name: "zkfairdrop",
  //   component: Zkfairdrop,
  //   meta: {
  //     footerFixed: true,
  //     backgroundImage: true,
  //   },
  // },
  {
    path: "/mantaairdrop",
    name: "mantaairdrop",
    component: Mantadrop,
    meta: {
      footerFixed: true,
      backgroundImage: true,
    },
  },
  {
    path: "/history",
    name: "history",
    component: History,
    meta: {
      footerFixed: true,
    },
  },
  {
    path: "/confirm",
    name: "confirm",
    component: Confirm,
    meta: {
      footerFixed: true,
      backgroundImage: true,
    },
  },
  {
    path: "/completed",
    name: "completed",
    component: Completed,
    meta: {
      footerFixed: true,
      backgroundImage: true,
    },
  },
  {
    path: "/invitepage",
    name: "invitepage",
    component: InvitePage,
  },
  {
    path: "/developingpage",
    name: "developingpage",
    component: DevelopingPage,
    meta: {
      footerFixed: true,
    },
  },
  {
    path: "/test",
    name: "test",
    component: Test,
  },
  {
    path: "/rewards",
    name: "rewards",
    component: InvitationV2,
    meta: {
      footerFixed: false,
    },
  },
  {
    path: "/rewards-phase1",
    name: "rewards-phase1",
    component: Invitation,
    meta: {
      footerFixed: false,
    },
  },
  {
    path: "/faucet",
    name: "faucet",
    component: Faucet,
  },
  {
    path: "/query",
    name: "query",
    component: Query,
  },
];

const router = createRouter({
  // history: createWebHashHistory(process.env.BASE_URL),
  history: createWebHistory(process.env.BASE_URL),

  routes,
});

export default router;
