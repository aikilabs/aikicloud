const sshKeygen = require("ssh-keygen-lite");
const sshpk = require("sshpk");
const path = require("path");
const { createAzureVm } = require("../utils/createVm");

const createVm = async (req, res) => {
    const { serviceId, userAddr, duration } = req.body;
    // Step 1: Generate SSH Key Pair
    const keyGenConfig = {
        location: path.join(__dirname, `../keyPairs/${serviceId + userAddr}`),
        type: "rsa",
        read: true,
        force: true,
        destroy: false,
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

module.exports = { createVm };
