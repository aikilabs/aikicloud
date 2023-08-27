async function createVirtualMachine() {
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
                            path: path.join(
                                __dirname,
                                `../keyPairs/${serviceId + userAddr}`
                            ),
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
                publisher: publisher,
                offer: offer,
                sku: sku,
                version: vmImageVersionNumber,
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
    console.log("6.Creating Virtual Machine: " + vmName);
    console.log(
        " VM create parameters: " + util.inspect(vmParameters, { depth: null })
    );
    const resCreate =
        await computeClient.virtualMachines.beginCreateOrUpdateAndWait(
            resourceGroupName,
            vmName,
            vmParameters
        );
    return await computeClient.virtualMachines.get(resourceGroupName, vmName);
}
