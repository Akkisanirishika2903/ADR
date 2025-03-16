from web3 import Web3

# Connect to Ethereum node
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

# Check connection
if w3.isConnected():
    print("Connected to Ethereum network!")

# Example: Storing ADR data on the blockchain
adr_data = {"drug": "Aspirin", "adr": "headache"}

# Assuming you have a deployed contract
contract_address = 'YOUR_CONTRACT_ADDRESS'
contract_abi = 'YOUR_CONTRACT_ABI'

contract = w3.eth.contract(address=contract_address, abi=contract_abi)
tx = contract.functions.storeADRData(adr_data["drug"], adr_data["adr"]).transact()
