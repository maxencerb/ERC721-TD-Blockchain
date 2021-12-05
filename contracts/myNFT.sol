pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract myNFT is ERC721
{

    address public owner;
    uint256 public priceBreeder;
    uint256 internal currentId;

    struct Animal {
        string _name;
        uint256 _legs;
        uint256 _sex;
        bool _wings;
    }

    struct Parents {
        uint256 _parent1;
        uint256 _parent2;
    }

    struct ReproductionInformations {
        uint256 price;
        address authorizedBreeder;
        bool hasPayed;
    }

    mapping(uint256 => Animal) public animals;
    mapping(address => bool) public breeders;
    mapping(uint256 => uint) public animalsOnSale;
    mapping(uint256 => Parents) public childToParents;
    mapping(uint256 => ReproductionInformations) animalForReproduction;

    constructor (string memory name_, string memory symbol_, uint256 _price) public ERC721(name_, symbol_) {
        owner = msg.sender;
        breeders[msg.sender] = true;
        priceBreeder = _price;
        currentId = 0;
    }

    function getCurrentId() external view returns (uint256) {
        return currentId;
    }

    function getNextId() private returns (uint256) {
        currentId++;
        return currentId;
    }

    function mint(address _to) public {
        require(msg.sender == owner);
        ERC721._mint(_to, getNextId());
    }

    function setAttribute(uint256 id, string memory _name, uint256 _legs, uint256 _sex, bool _wings) public {
        require(msg.sender == owner);
        animals[id] = Animal(_name, _legs, _sex, _wings);
    }

	function isBreeder(address account) external view returns (bool) {
        return breeders[account];
    }

	function registrationPrice() external view returns (uint256) {
        return priceBreeder;
    }

	function registerMeAsBreeder() external payable {
        require(msg.value == priceBreeder);
        breeders[msg.sender] = true;
    }

    function declareAsBreeder(address futureBreeder) external {
        require(msg.sender == owner);
        breeders[futureBreeder] = true;
    }

	function getAnimalCharacteristics(uint animalNumber) external view returns (string memory _name, bool _wings, uint _legs, uint _sex) {
        Animal memory _animal = animals[animalNumber];
        return (_animal._name, _animal._wings, _animal._legs, _animal._sex);
    }

    function declareAnimal(uint sex, uint legs, bool wings, string memory name) public returns (uint256) {
        return declareAnimalToSomeone(sex, legs, wings, name, msg.sender);
    }

    function declareAnimalToSomeone(uint sex, uint legs, bool wings, string memory name, address _to) public returns (uint256) {
        require(breeders[msg.sender]);
        uint256 id = getNextId();
        ERC721._mint(_to, id);
        animals[id] = Animal(name, legs, sex, wings);
        return id;
    }

    function declareDeadAnimal(uint animalNumber) external {
        require(ownerOf(animalNumber) == msg.sender);
        _burn(animalNumber);
        delete animals[animalNumber];
    }

    function isAnimalForSale(uint animalNumber) external view returns (bool) {
        return animalsOnSale[animalNumber] != 0;
    }

	function animalPrice(uint animalNumber) external view returns (uint256) {
        return animalsOnSale[animalNumber];
    }

	function buyAnimal(uint animalNumber) external payable {
        require(animalsOnSale[animalNumber] != 0);
        require(msg.value == animalsOnSale[animalNumber]);
        _transfer(ownerOf(animalNumber), msg.sender, animalNumber);
        delete animalsOnSale[animalNumber];
    }

	function offerForSale(uint animalNumber, uint price) external {
        require(ownerOf(animalNumber) == msg.sender);
        require(price > 0);
        animalsOnSale[animalNumber] = price;
    }

    function canUseForReproduction(uint256 parent) private view returns (bool) {
        return ownerOf(parent) == msg.sender || (animalForReproduction[parent].authorizedBreeder == msg.sender && animalForReproduction[parent].hasPayed);
    }

    function declareAnimalWithParents(uint sex, uint legs, bool wings, string calldata name, uint parent1, uint parent2) external returns (uint256) {
        require(parent1 != parent2, "Can't reproduce with only one animal");
        require(canUseForReproduction(parent1) && canUseForReproduction(parent2), "Cannot use these animals for reproduction");
        uint256 id = declareAnimal(sex, legs, wings, name);
        childToParents[id] = Parents(parent1, parent2);
        delete animalForReproduction[parent1];
        delete animalForReproduction[parent2];
        return id;
    }

	function getParents(uint animalNumber) external view returns (uint256, uint256) {
        Parents memory parents = childToParents[animalNumber];
        return (parents._parent1, parents._parent2);
    }

    function canReproduce(uint animalNumber) public view returns (bool) {
        return animalForReproduction[animalNumber].price != 0;
    }

	function reproductionPrice(uint animalNumber) external view returns (uint256) {
        return animalForReproduction[animalNumber].price;
    }

	function offerForReproduction(uint animalNumber, uint priceOfReproduction) external returns (uint256) {
        require(msg.sender == ownerOf(animalNumber), "You are not the owner");
        animalForReproduction[animalNumber] = ReproductionInformations(priceOfReproduction, address(0), false);
    }

	function authorizedBreederToReproduce(uint animalNumber) external view returns (address) {
        return animalForReproduction[animalNumber].authorizedBreeder;
    }

	function payForReproduction(uint animalNumber) external payable {
        require(msg.value == animalForReproduction[animalNumber].price, "Wrong pricing");
        animalForReproduction[animalNumber].hasPayed = true;
        animalForReproduction[animalNumber].authorizedBreeder = msg.sender;
    }
}