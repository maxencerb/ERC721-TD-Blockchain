const Str = require('@supercharge/strings')

var TDErc20 = artifacts.require("ERC20TD.sol");
var evaluator = artifacts.require("Evaluator.sol");
var evaluator2 = artifacts.require("Evaluator2.sol");
var myNFT = artifacts.require("myNFT.sol");

const account = "0x3Ab484E75884b42AD86BE388D04b7B3208a5c6cD"

module.exports = (deployer, network, accounts) => {
    if(network == 'rinkeby') return
	deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await setPermissionsAndRandomValues(deployer, network, accounts);
        await deployRecap(deployer, network, accounts);
		await makeExercise(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC721-101","TD-ERC721-101",web3.utils.toBN("0"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address)
	Evaluator2 = await evaluator2.new(TDToken.address)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
	await TDToken.setTeacher(Evaluator2.address, true)
	randomNames = []
	randomLegs = []
	randomSex = []
	randomWings = []
	for (i = 0; i < 20; i++) {
		randomNames.push(Str.random(15))
		randomLegs.push(Math.floor(Math.random()*5))
		randomSex.push(Math.floor(Math.random()*2))
		randomWings.push(Math.floor(Math.random()*2))
	}

	console.log(randomNames)
	console.log(randomLegs)
	console.log(randomSex)
	console.log(randomWings)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await Evaluator.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
	await Evaluator2.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function deploySolution(deployer, network, accounts, name, symbol) {
	Solution = await myNFT.new(name, symbol, web3.utils.toBN(web3.utils.toWei('0.001', "ether")), {from: account})
}

async function makeExercise(deployer, network, accounts) {
	const startBalance = await TDToken.balanceOf(accounts[0])
	console.log("startBalance " + startBalance)

	// let send = await web3.eth.sendTransaction({from:accounts[0],to:Evaluator.address, value:web3.utils.toBN(web3.utils.toWei('0.05', "ether"))});

	// Submit Exercise
	console.log("====== Submit Exercise ======")
	await deploySolution(deployer, network, accounts, "Maxence NFT", "MRNFT")
	await Evaluator.submitExercice(Solution.address , {from:account})
	const submit_balance = await TDToken.balanceOf(account)
	console.log("submit_balance " + submit_balance)

	// Exercice 1
	console.log("====== Exercice 1 ======")
	await Solution.mint(Evaluator.address, {from:account})
	await Evaluator.ex1_testERC721({from:account})
	const ex1_balance = await TDToken.balanceOf(account)
	console.log("ex1_balance " + ex1_balance)

	// Exercice 2
	console.log("====== Exercice 2 ======")
	// send the NFT
	// const nft2 = await Solution.mint(Evaluator.address, {from:account})
	// Get animal
	await Evaluator.ex2a_getAnimalToCreateAttributes({from:account})
	const name = await Evaluator.readName(account, {from:account})
	const legs = await Evaluator.readLegs(account, {from:account})
	const sex = await Evaluator.readSex(account, {from: account})
	const wings = await Evaluator.readWings(account, {from: account})
	// Set animal and test
	const nft2 = await createAnNft(Evaluator.address, sex, legs, wings, name);
	await Evaluator.ex2b_testDeclaredAnimal(nft2, {from: account})
	const ex2_balance = await TDToken.balanceOf(account)
	console.log("ex2_balance " + ex2_balance)

	// Exercice 3
	console.log("====== Exercice 3 ======")
	// send ETH
	await web3.eth.sendTransaction({from:account,to:Evaluator.address, value:web3.utils.toBN(web3.utils.toWei('0.01', "ether"))});
	// Evaluator
	await Evaluator.ex3_testRegisterBreeder({from:account})
	const ex3_balance = await TDToken.balanceOf(account)
	console.log("ex3_balance " + ex3_balance) 

	// Exercice 4
	console.log("====== Exercice 4 ======")
	await Evaluator.ex4_testDeclareAnimal();
	const ex4_balance = await TDToken.balanceOf(account)
	console.log("ex4_balance " + ex4_balance)

	// Exercice 5
	console.log("====== Exercice 5 ======")
	// Mint tokent to my adress
	await Solution.mint(account, {from:account})
	await Evaluator.ex5_declareDeadAnimal({from: account});
	const ex5_balance = await TDToken.balanceOf(account)
	console.log("ex5_balance " + ex5_balance)

	// Exercice 6
	console.log("====== Exercice 6 ======")
	await createAnNft(Evaluator.address);
	await Evaluator.ex6a_auctionAnimal_offer({from: account})
	const nft3 = await createAnNft();
	await Solution.offerForSale(nft3, web3.utils.toBN(web3.utils.toWei('0.0001', "ether")), {from: account})
	await Evaluator.ex6b_auctionAnimal_buy(nft3, {from: account})
	const ex6_balance = await TDToken.balanceOf(account)
	console.log("ex6_balance " + ex6_balance)

	// Evaluator 2 submit exercice
	await Evaluator2.submitExercice(Solution.address , {from:account})
	await web3.eth.sendTransaction({from:account,to:Evaluator2.address, value:web3.utils.toBN(web3.utils.toWei('0.005', "ether"))});

	// Exercice 7a
	console.log("====== Exercice 7a ======")
	await Evaluator2.ex2a_getAnimalToCreateAttributes({from: account})
	await Solution.declareAsBreeder(Evaluator2.address, {from: account})
	const parent1 = await createAnNft(Evaluator2.address);
	const parent2 = await createAnNft(Evaluator2.address);
	await Evaluator2.ex7a_breedAnimalWithParents(parent1, parent2, {from: account})
	const ex7a_balance = await TDToken.balanceOf(account)
	console.log("ex7a_balance " + ex7a_balance)

	// Exercice 7b
	console.log("====== Exercice 7b ======")
	await Evaluator2.ex7b_offerAnimalForReproduction()
	const ex7b_balance = await TDToken.balanceOf(account)
	console.log("ex7b_balance " + ex7b_balance)

	// Exercice 7c
	console.log("====== Exercice 7c ======")
	const animalForReproduction = await createAnNft();
	await Solution.offerForReproduction(animalForReproduction, web3.utils.toBN(web3.utils.toWei('0.0001', "ether")));
	await Evaluator2.ex7c_payForReproduction(animalForReproduction);
	const ex7c_balance = await TDToken.balanceOf(account);
	console.log("ex7c_balance " + ex7c_balance);
}


const createAnNft = async (to = account, sex = 1, legs = 4, wings = false, name = "maxence") => {
	await Solution.declareAnimalToSomeone(sex, legs, wings, name, to, {from: account})
	return await Solution.getCurrentId();
}