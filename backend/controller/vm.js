const sshKeygen = require("ssh-keygen-lite");
const sshpk = require("sshpk");
const path = require("path");
const { createAzureVm } = require("../utils/createVm");
const { BadRequestError } = require("../errors");
const {
    ClientSecretCredential,
    DefaultAzureCredential,
} = require("@azure/identity");
const { ComputeManagementClient } = require("@azure/arm-compute");
const { ResourceManagementClient } = require("@azure/arm-resources");
const { NetworkManagementClient } = require("@azure/arm-network");
require("dotenv").config();
const virtualMachineServiceId = 0;
const { ethers } = require("ethers");
const checkIfMinted = require("../utils/checkIfMinted");

const createVm = async (req, res) => {
    let { serviceId, userAddr, duration } = req.body;

    if (serviceId == null || userAddr == null || duration == null) {
        throw new BadRequestError("Missing required fields");
    }

    // if (serviceId != virtualMachineServiceId) {
    //     throw new BadRequestError("Invalid serviceId");
    // }

    if (serviceId == 0) {
        serviceId = "vm";
    }

    const isMinted = await checkIfMinted(0, userAddr);

    if (!isMinted) {
        throw new BadRequestError("User has not minted NFT");
    }

    // Step 1: Generate SSH Key Pair
    const keyGenConfig = {
        location: path.join(__dirname, `../keyPairs/${serviceId + userAddr}`),
        type: "rsa",
        read: true,
        force: true,
        destroy: true,
        comment: "joe@foobar.com",
        // password: "keypassword",
        size: "2048",
        format: "PEM",
    };
    sshKeygen(keyGenConfig, async (err, keyPair) => {
        if (err) {
            console.log(err);
            return res
                .status(500)
                .json({ msg: "Failed to generate SSH key pair." });
        }

        // Step 2: Use Azure SDK to Create VM (refer to previous response)
        await createAzureVm(serviceId, userAddr, duration, keyPair);
        // Step 3: Convert Private Key to .pem Format
        console.log(keyPair);
        const privateKeyPEM = sshpk.parsePrivateKey(keyPair.key, "pem");
        const privateKeyPEMString = privateKeyPEM.toString("pem");

        // Step 4: Send Response with Private Key .pem
        res.setHeader("Content-Type", "application/x-pem-file");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=private_key.pem"
        );
        res.send(privateKeyPEMString);
    });
};

const getVmDomain = async (req, res) => {
    // Azure authentication in environment variables for DefaultAzureCredential
    const tenantId = process.env.AZURE_TENANT_ID;
    const clientId = process.env.AZURE_CLIENT_ID;
    const secret = process.env.AZURE_CLIENT_SECRET;
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

    const { serviceId, userAddr } = req.query;

    let credentials = null;
    credentials = new ClientSecretCredential(tenantId, clientId, secret);

    const networkClient = new NetworkManagementClient(
        credentials,
        subscriptionId
    );
    const computeClient = new ComputeManagementClient(
        credentials,
        subscriptionId
    );
    try {
        const { dnsSettings } = await networkClient.publicIPAddresses.get(
            `${"vm" + userAddr}-testrg`,
            `${"vm" + userAddr}-pip`
        );
        const { osProfile } = await computeClient.virtualMachines.get(
            `${"vm" + userAddr}-testrg`,
            `${"vm" + userAddr}vm`
        );

        res.json({ dns: dnsSettings.fqdn, username: osProfile.adminUsername });
    } catch (error) {
        // if (error.code === "ResourceGroupNotFound") {
        //     res.status(404).json({ msg: "Resource not found" });
        // } else {
        throw new BadRequestError(error.message);
        // }
    }
};

const stopVm = async (req, res) => {
    // Azure authentication in environment variables for DefaultAzureCredential
    const tenantId = process.env.AZURE_TENANT_ID;
    const clientId = process.env.AZURE_CLIENT_ID;
    const secret = process.env.AZURE_CLIENT_SECRET;
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

    const { serviceId, userAddr } = req.body;

    let credentials = null;
    credentials = new ClientSecretCredential(tenantId, clientId, secret);

    const resourceClient = new ResourceManagementClient(
        credentials,
        subscriptionId
    );
    try {
        await resourceClient.resourceGroups.beginDelete(
            `${serviceId + userAddr}-testrg`
        );
        res.json({ msg: "VM stopped" });
    } catch (error) {
        throw new BadRequestError(error.message);
    }
};

module.exports = { createVm, getVmDomain, stopVm };
