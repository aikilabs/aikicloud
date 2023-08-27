const util = require("util");
const {
    ClientSecretCredential,
    DefaultAzureCredential,
} = require("@azure/identity");
const { ComputeManagementClient } = require("@azure/arm-compute");
const { ResourceManagementClient } = require("@azure/arm-resources");
const { StorageManagementClient } = require("@azure/arm-storage");
const { NetworkManagementClient } = require("@azure/arm-network");
const { generateRandomString } = require("./generateRandomString");
const { BadRequestError } = require("../errors");
require("dotenv").config();
const path = require("path");
const { stat } = require("fs");
const cron = require("node-cron");

const createAzureVm = async (serviceId, userAddr, duration, keyPair) => {
    // Store function output to be used elsewhere
    let randomIds = {};
    let subnetInfo = null;
    let publicIPInfo = null;
    let vmImageInfo = null;
    let nicInfo = null;

    // used as prefix for naming resources
    const yourAlias = serviceId;

    // used to add tags to resources
    const projectName = serviceId + userAddr;

    // Resource configs
    const location = "eastus";
    const accType = "Standard_LRS";

    // Ubuntu config for VM
    const publisher = "Canonical";
    const offer = "UbuntuServer";
    const sku = "14.04.3-LTS";
    const adminUsername = generateRandomString(10);
    // const adminPassword = "Pa$$w0rd92";

    // Check if user has existing resources
    //
    //
    //

    // Azure authentication in environment variables for DefaultAzureCredential
    const tenantId = process.env.AZURE_TENANT_ID;
    const clientId = process.env.AZURE_CLIENT_ID;
    const secret = process.env.AZURE_CLIENT_SECRET;
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

    let credentials = null;

    // if (process.env.production) {
    //     // production
    // credentials = new DefaultAzureCredential();
    // } else {
    //     // development
    credentials = new ClientSecretCredential(tenantId, clientId, secret);
    // }

    // Azure services
    const resourceClient = new ResourceManagementClient(
        credentials,
        subscriptionId
    );
    const computeClient = new ComputeManagementClient(
        credentials,
        subscriptionId
    );
    const storageClient = new StorageManagementClient(
        credentials,
        subscriptionId
    );
    const networkClient = new NetworkManagementClient(
        credentials,
        subscriptionId
    );

    async function createResourceGroup() {
        const groupParameters = {
            location: location,
            tags: { project: projectName },
        };
        const resCreate = await resourceClient.resourceGroups.createOrUpdate(
            resourceGroupName,
            groupParameters
        );
        return resCreate;
    }

    async function createStorageAccount() {
        const createParameters = {
            location: location,
            sku: {
                name: accType,
            },
            kind: "Storage",
            tags: {
                project: projectName,
            },
        };
        return await storageClient.storageAccounts.beginCreateAndWait(
            resourceGroupName,
            storageAccountName,
            createParameters
        );
    }

    async function createVnet() {
        const vnetParameters = {
            location: location,
            addressSpace: {
                addressPrefixes: ["10.0.0.0/16"],
            },
            dhcpOptions: {
                dnsServers: ["10.1.1.1", "10.1.2.4"],
            },
            subnets: [{ name: subnetName, addressPrefix: "10.0.0.0/24" }],
        };
        return await networkClient.virtualNetworks.beginCreateOrUpdateAndWait(
            resourceGroupName,
            vnetName,
            vnetParameters
        );
    }

    async function getSubnetInfo() {
        const getResult = await networkClient.subnets.get(
            resourceGroupName,
            vnetName,
            subnetName
        );
        return getResult;
    }

    async function createPublicIP() {
        const publicIPParameters = {
            location: location,
            publicIPAllocationMethod: "Dynamic",
            dnsSettings: {
                domainNameLabel: domainNameLabel,
            },
        };
        await networkClient.publicIPAddresses.beginCreateOrUpdateAndWait(
            resourceGroupName,
            publicIPName,
            publicIPParameters
        );
        return await networkClient.publicIPAddresses.get(
            resourceGroupName,
            publicIPName
        );
    }

    async function createNIC(subnetInfo, publicIPInfo) {
        const nicParameters = {
            location: location,
            ipConfigurations: [
                {
                    name: ipConfigName,
                    privateIPAllocationMethod: "Dynamic",
                    subnet: subnetInfo,
                    publicIPAddress: publicIPInfo,
                },
            ],
        };
        return await networkClient.networkInterfaces.beginCreateOrUpdateAndWait(
            resourceGroupName,
            networkInterfaceName,
            nicParameters
        );
    }

    async function findVMImage() {
        console.log(
            util.format(
                "\nFinding a VM Image for location %s from " +
                    "publisher %s with offer %s and sku %s",
                location,
                publisher,
                offer,
                sku
            )
        );
        const listResult = new Array();
        for await (const item of computeClient.virtualMachineImages.list(
            location,
            publisher,
            offer,
            sku
        )) {
            listResult.push(item);
        }
        return listResult;
        // const listResult = [];
        // const iterator = computeClient.virtualMachineImages.list(
        //     location,
        //     publisher,
        //     offer,
        //     sku
        // );

        // for (const item of iterator) {
        //     listResult.push(item);
        // }

        // return listResult;
    }

    async function getNICInfo() {
        return await networkClient.networkInterfaces.get(
            resourceGroupName,
            networkInterfaceName
        );
    }

    async function createVirtualMachine(nicId) {
        const vmParameters = {
            location: location,
            osProfile: {
                computerName: vmName,
                adminUsername: adminUsername,
                linuxConfiguration: {
                    disablePasswordAuthentication: true,
                    ssh: {
                        publicKeys: [
                            {
                                path: `/home/${adminUsername}/.ssh/authorized_keys`,
                                keyData: keyPair.pubKey,
                            },
                        ],
                    },
                },
            },
            hardwareProfile: {
                vmSize: "Standard_B1ls",
            },
            storageProfile: {
                imageReference: {
                    publisher: "Canonical",
                    offer: "UbuntuServer",
                    sku: "18.04-LTS",
                    version: "latest",
                },
                osDisk: {
                    name: osDiskName,
                    caching: "None",
                    createOption: "fromImage",
                    vhd: {
                        uri:
                            "https://" +
                            storageAccountName +
                            ".blob.core.windows.net/nodejscontainer/osnodejslinux.vhd",
                    },
                },
            },
            networkProfile: {
                networkInterfaces: [
                    {
                        id: nicId,
                        primary: true,
                    },
                ],
            },
        };
        // console.log("6.Creating Virtual Machine: " + vmName);
        // console.log(
        //     " VM create parameters: " +
        //         util.inspect(vmParameters, { depth: null })
        // );
        const resCreate =
            await computeClient.virtualMachines.beginCreateOrUpdateAndWait(
                resourceGroupName,
                vmName,
                vmParameters
            );

        return await computeClient.virtualMachines.get(
            resourceGroupName,
            vmName
        );
    }

    const _generateRandomId = (prefix, existIds) => {
        var newNumber;
        while (true) {
            newNumber = prefix + Math.floor(Math.random() * 10000);
            if (!existIds || !(newNumber in existIds)) {
                break;
            }
        }
        return newNumber;
    };
    //Random number generator for service names and settings
    const resourceGroupName = `${serviceId + userAddr}-testrg`;
    const vmName = `${serviceId + userAddr}vm`;
    const storageAccountName = _generateRandomId(`${yourAlias}ac`, randomIds);
    const vnetName = _generateRandomId(`${yourAlias}vnet`, randomIds);
    const subnetName = _generateRandomId(`${yourAlias}subnet`, randomIds);
    const publicIPName = `${serviceId + userAddr}-pip`;
    const networkInterfaceName = _generateRandomId(
        `${yourAlias}nic`,
        randomIds
    );
    const ipConfigName = _generateRandomId(`${yourAlias}crpip`, randomIds);
    const domainNameLabel = _generateRandomId(
        `${yourAlias}domainname`,
        randomIds
    );
    const osDiskName = _generateRandomId(`${yourAlias}osdisk`, randomIds);

    // Create resources then manage them (on/off)
    async function createResources() {
        try {
            result = await createResourceGroup();
            accountInfo = await createStorageAccount();
            vnetInfo = await createVnet();
            subnetInfo = await getSubnetInfo();
            publicIPInfo = await createPublicIP();
            nicInfo = await createNIC(subnetInfo, publicIPInfo);
            // vmImageInfo = await findVMImage();
            nicResult = await getNICInfo();
            vmInfo = await createVirtualMachine(
                nicInfo.id
                // vmImageInfo[0].name
            );
            console.log(publicIPInfo);
            console.log(vmInfo);

            return;
        } catch (err) {
            console.log(err);
            const resourceClient = new ResourceManagementClient(
                credentials,
                subscriptionId
            );

            const result = await resourceClient.resourceGroups.beginDelete(
                resourceGroupName
            );
            console.log(JSON.stringify(result));
        }
    }

    async function main() {
        await createResources();
    }

    main()
        .then(() => {
            console.log(
                `success - resource group name: ${resourceGroupName}, vm resource name: ${vmName}`
            );
            setTimeout(async () => {
                try {
                    const resourceClient = new ResourceManagementClient(
                        credentials,
                        subscriptionId
                    );

                    const result =
                        await resourceClient.resourceGroups.beginDelete(
                            resourceGroupName
                        );
                    console.log(JSON.stringify(result));
                } catch (error) {
                    console.log(error);
                }
            }, duration * 1000);
        })
        .catch(async (err) => {
            const resourceClient = new ResourceManagementClient(
                credentials,
                subscriptionId
            );

            const result = await resourceClient.resourceGroups.beginDelete(
                resourceGroupName
            );
            console.log(err);
        });
};

module.exports = { createAzureVm };
