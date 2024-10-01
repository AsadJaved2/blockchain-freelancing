document.addEventListener("DOMContentLoaded", () => {
  // Initialize the app
  initApp();
});

async function initApp() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request MetaMask access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const web3 = new Web3(window.ethereum);
      const contractAddress = "0x98201403843759676Ab532F8bD948670615a3DCe"; // Replace with your contract address
      const abi = [
        {
          constant: false,
          inputs: [
            { name: "_title", type: "string" },
            { name: "_description", type: "string" },
            { name: "_payment", type: "uint256" },
          ],
          name: "createJob",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [{ name: "", type: "uint256" }],
          name: "jobs",
          outputs: [
            { name: "id", type: "uint256" },
            { name: "title", type: "string" },
            { name: "description", type: "string" },
            { name: "client", type: "address" },
            { name: "freelancer", type: "address" },
            { name: "payment", type: "uint256" },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "jobCount",
          outputs: [{ name: "", type: "uint256" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ];

      const contract = new web3.eth.Contract(abi, contractAddress);

      const networkId = await web3.eth.net.getId();
      if (networkId !== 11155111) {
        alert("Please connect to the Sepolia testnet in MetaMask");
        return;
      }

      document
        .getElementById("createJobBtn")
        .addEventListener("click", async () => {
          const title = document.getElementById("jobTitle").value;
          const description = document.getElementById("jobDescription").value;
          const payment = document.getElementById("jobPayment").value; // User-defined payment in Ether

          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const paymentInWei = web3.utils.toWei(payment, "ether");

          try {
            await contract.methods
              .createJob(title, description, paymentInWei)
              .send({
                from: accounts[0],
                value: paymentInWei,
                gas: 3000000, // Adjust if necessary
              });
            alert("Job created!");
            loadJobs();
          } catch (error) {
            console.error("Error creating job:", error);
          }
        });

      async function loadJobs() {
        const count = await contract.methods.jobCount().call();
        const jobList = document.getElementById("jobList");
        jobList.innerHTML = "";

        for (let i = 1; i <= count; i++) {
          const job = await contract.methods.jobs(i).call();
          const listItem = document.createElement("li");
          listItem.textContent = `${job.title} - ${
            job.description
          } - ${web3.utils.fromWei(job.payment, "ether")} Ether`;
          jobList.appendChild(listItem);
        }
      }

      loadJobs();
    } catch (error) {
      console.error("User denied access to MetaMask or other error:", error);
    }
  } else {
    alert("Please install MetaMask to use this application.");
  }
}

document.getElementById("createJobBtn").addEventListener("click", async () => {
  const title = document.getElementById("jobTitle").value;
  const description = document.getElementById("jobDescription").value;
  const payment = document.getElementById("jobPayment").value;

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const paymentInWei = web3.utils.toWei(payment, "ether"); // Conversion to Wei

  try {
    // Ensure the contract is deployed on SepoliaETH
    await contract.methods.createJob(title, description).send({
      from: accounts[0],
      value: paymentInWei, // Ensure this is being sent in SepoliaETH
      gas: 3000000, // Adjust gas as needed
    });
    alert("Job created!");
    loadJobs();
  } catch (error) {
    console.error("Error creating job:", error);
  }
});
