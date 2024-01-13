# owlto-frontend
Owlto is a Cross-Rollup module developed based on the Ethereum L2 Rollup solution, providing a low-cost, secure, and fast asset transfer solution. It supports asset transfers between networks such as Ethereum, Arbitrum One, Arbitrum Nova, Optimism, zkSync, StarkNet, Linea, Base, Scroll, Taiko, Polygon zkEVM, opBNB and BNB chain, allowing users to freely transfer assets between different networks.

### Features
- High security
- Low cost
- Fast speed
- Friendly to Ethereum native assets

## Project structure
```
Owlto-frontend
├── public/          # static files
│   └── index.html   # html template
│
├── src/             # Project root
│   ├── views/       # Implement project page.
│   ├── components/  # Implement project components
│   ├── assets/      # Static resources that store images, basic styles, icons.
│   ├── common/      # Common project tools.
│   ├── router/      # Project page routing.
│   ├── store/       # Global page status data.
│   ├── wagmi/       # Ethereum interaction framework
│   ├── utils/       # Responsive tool.
│   ├── api/         # Request tool.
│   ├── abi/         # Contract interface.
│   ├── ...
│
├── package.json
└── ...
```

## Install
```
npm install
```
##### Compiles and hot-reloads for development
```
npm run dev
```

##### Compiles and minifies for production
```
npm run build
```

