const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer
async function connectmetamask(){
    await provider.send("eth_requestAccounts", []);  
    signer = provider.getSigner();
    console.log("get address", await signer.getAddress())
}
async function getBalance(){
    const balance= await signer.getBalance();
    const converttoEth=1e18;
    // const balance= await provider.getBalance(signer);
    // const showbalance= await ethers.utils.formatEther(balance); 
    const ethersss="81775.5";
    const dai = ethers.utils.parseUnits(ethersss,"ether").toString();
    console.log(dai,"wei price"); 
    console.log("balance", balance.toString() / converttoEth)
}

const usdtAddress="0x13512979ADE267AB5100878E2e0f485B568328a4";
const abi=[
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address to, uint amount)"
]
// async function readDataFromSmartContract(){
//     const contract= new ethers.Contract("0xb575400Da99E13e2d1a2B21115290Ae669e361f0",abi,provider);
//    const name= await contract.name()
//    const symbol=await contract.symbol()
//    const transfer=await contract.transfer()
//    const totalsupply=await contract.totalsupply()
//    const tokens=await contract.balanceOf("0x494643e1D647307db5DD9fA46F32BC2C3B3e96C4")
//     console.log(`name ${name}`)
//     // console.log("name", transfer);
// }
async function readDataFromSmartContract() {

    const usdtContract = new ethers.Contract(usdtAddress, abi, provider);
    
    const name = await usdtContract.name()
    const symbol = await usdtContract.symbol()
    const decimals = await usdtContract.decimals()
    const totalSupply = await usdtContract.totalSupply()
    const myBalance = await usdtContract.balanceOf("0x494643e1D647307db5DD9fA46F32BC2C3B3e96C4")

    console.log(`name = ${name}`)
    console.log(`symbol = ${symbol}`)
    console.log(`decimals = ${decimals}`)
    console.log(`totalSupply = ${totalSupply / 1e6 }`)
    console.log(`myBalance = ${myBalance / 1e6}`)
}

//send
async function Send(){
    const contract = new ethers.Contract(usdtAddress,abi,provider)
    contract.connect(signer).transfer("0x7EFb34670CAfaFe7B251473139bF909820E2ECF9", "500000000")

}
//deploy
async function deploy(){
    const Abi=[
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "no",
                    "type": "uint256"
                }
            ],
            "name": "number",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "Put",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "add",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const bytecode="6080604052600160005534801561001557600080fd5b50610186806100256000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80630e300c641461003b5780634f2be91f14610045575b600080fd5b610043610063565b005b61004d6100b3565b60405161005a91906100d2565b60405180910390f35b6001600054610072919061011c565b6000819055507f431aabc2c93d4298d704929988144c1eea77325805b8bcfe081f6c26a93894c36000546040516100a991906100d2565b60405180910390a1565b60005481565b6000819050919050565b6100cc816100b9565b82525050565b60006020820190506100e760008301846100c3565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610127826100b9565b9150610132836100b9565b925082820190508082111561014a576101496100ed565b5b9291505056fea2646970667358221220091eb38ff537fec01f04163638579864dfb42427a30c0cd9784534f134b5b38764736f6c63430008120033"

    const factory = new ethers.ContractFactory(Abi, bytecode, signer)
    const contract = await factory.deploy();
    const abc=await contract.deployTransaction.wait()
    console.log(abc)
}

//
async function Put(){
    const addressOf="0x431acAE61477a28710AE0B02C866691D25C69fB7"
    const contractAbi=[
        "function add() view returns (uint)",
        "function Put() external"
    ];
    const contract = new ethers.Contract(addressOf,contractAbi,provider)
    let check= await contract.add()
    console.log("initial number ", check.toString())

    const tx= await contract.connect(signer).Put()
    await tx.wait()
    check=await contract.add()
    console.log("new number ", check.toString())
}
//emit event
async function emitAnEvent(){
    const addressOf="0x431acAE61477a28710AE0B02C866691D25C69fB7"
    const contractAbi=[
        "function Put() external",
    ];
    const Contract = new ethers.Contract(addressOf, contractAbi, provider);
    const tx= await Contract.connect(signer).Put()
    const recipt=await tx.wait()
    console.log("emmited")
    console.log(recipt.events[0])
}
//listen
async function ListenEvent(){
    

    const numberContractAddress = "0xb441B15b9e88C4dA7e13580676296EBc4049F146";
    const numberContractAbi =[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"uint256","name":"randomNumber","type":"uint256"}],"name":"MyEvent","type":"event"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"emitAnEvent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"incrementNumber","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[],"name":"number","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
    // The Contract object
    const numberContract = new ethers.Contract(numberContractAddress, numberContractAbi, provider);

    numberContract.on("MyEvent", (from, number) => {
        console.log(`address emiting the event = ${from}`)
        console.log(`number from event = ${number}`)
    })

}