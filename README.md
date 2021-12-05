# Blockchain TD on ERC20

&copy; Maxence Raballand 2021

The migration automatically validates the exercices.

There is one deployement for local network (ganache) in `1_td_deploy.js` and one for test network (rinkeby) in `2_rinkeby_deploy.js`.

To test it locally, first you will need to install truffle globally :

```bash
yarn add global truffle
# or
npm i -g truffle
```

Then you should install dependencies as such :

```bash
yarn
# or
npm i
```

Then create a `.env` file containing your infura api key and mnemonic.

```
INFURA_API_KEY=<you-api-key>
MNEMONIC=<your-mnemonic>
```

You can then deploy by running :

```bash
# locally with ganache
truffle migrate
# on rinkeby
truffle migrate --network rinkeby --skip-dry-run
```

## Informations about the Exercices

Here are the adresses of the contracts and wallet used to validate these exercices.

| Name | Address |
| --- | --- |
| My ERC721 contract | [0x67ce8303db06e925c7cd2e30a1a1844cfa75e407](https://rinkeby.etherscan.io/address/0x67ce8303db06e925c7cd2e30a1a1844cfa75e407) |
| My address | [0x3Ab484E75884b42AD86BE388D04b7B3208a5c6cD](https://rinkeby.etherscan.io/address/0x3Ab484E75884b42AD86BE388D04b7B3208a5c6cD) |
| Evaluator | [0xa0b9f62A0dC5cCc21cfB71BA70070C3E1C66510E](https://rinkeby.etherscan.io/address/0xa0b9f62A0dC5cCc21cfB71BA70070C3E1C66510E) |
| Evaluator 2 | [0x4f82f7A130821F61931C7675A40fab723b70d1B8](https://rinkeby.etherscan.io/address/0x4f82f7A130821F61931C7675A40fab723b70d1B8) |
| ERC20TD | [0x8B7441Cb0449c71B09B96199cCE660635dE49A1D](https://rinkeby.etherscan.io/address/0x8B7441Cb0449c71B09B96199cCE660635dE49A1D) |
