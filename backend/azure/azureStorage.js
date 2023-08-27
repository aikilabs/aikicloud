const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv").config();

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new DefaultAzureCredential()
);

function blobServiceClientCC() {
    const a = blobServiceClient.findBlobsByTags("serviceId", "userAddr");
    return console.log(a);
}

blobServiceClientCC();

module.exports = blobServiceClient;
