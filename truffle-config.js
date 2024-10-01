module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // Localhost
      port: 7545,         
      network_id: "*",    
    },
    sepolia: {
      host: "127.0.0.1",  // Local node address
      port: 8545,         // Port where your local Sepolia node is running
      network_id: 11155111, // Sepolia's network id
      gas: 3000000,
      gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: "0.5.16"  // Specify the Solidity version
    }
  }
};
