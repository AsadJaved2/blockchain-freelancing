// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract FreelanceMarketplace {
    struct Job {
        uint id;
        string title;
        string description;
        address client;
        address freelancer;
        uint payment;
    }

    Job[] public jobs;
    uint public jobCount = 0;

    // Create a new job with payment in Ether
    function createJob(string memory _title, string memory _description) public payable {
        require(msg.value > 0, "Payment must be greater than zero");

        jobCount++;
        jobs.push(Job(jobCount, _title, _description, msg.sender, address(0), msg.value));
    }

    // Apply for a job by a freelancer
    function applyForJob(uint _jobId) public {
        Job storage job = jobs[_jobId - 1];
        require(job.freelancer == address(0), "Job already taken");
        job.freelancer = msg.sender;
    }
}
