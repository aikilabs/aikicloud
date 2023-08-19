using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Web3;
using Nethereum.RPC.Eth.DTOs;
using Nethereum.Contracts.CQS;
using Nethereum.Contracts.ContractHandlers;
using Nethereum.Contracts;
using System.Threading;
using Contracts.Contracts.RentalNFTTest.ContractDefinition;

namespace Contracts.Contracts.RentalNFTTest
{
    public partial class RentalNFTTestService
    {
        public static Task<TransactionReceipt> DeployContractAndWaitForReceiptAsync(Nethereum.Web3.Web3 web3, RentalNFTTestDeployment rentalNFTTestDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            return web3.Eth.GetContractDeploymentHandler<RentalNFTTestDeployment>().SendRequestAndWaitForReceiptAsync(rentalNFTTestDeployment, cancellationTokenSource);
        }

        public static Task<string> DeployContractAsync(Nethereum.Web3.Web3 web3, RentalNFTTestDeployment rentalNFTTestDeployment)
        {
            return web3.Eth.GetContractDeploymentHandler<RentalNFTTestDeployment>().SendRequestAsync(rentalNFTTestDeployment);
        }

        public static async Task<RentalNFTTestService> DeployContractAndGetServiceAsync(Nethereum.Web3.Web3 web3, RentalNFTTestDeployment rentalNFTTestDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            var receipt = await DeployContractAndWaitForReceiptAsync(web3, rentalNFTTestDeployment, cancellationTokenSource);
            return new RentalNFTTestService(web3, receipt.ContractAddress);
        }

        protected Nethereum.Web3.IWeb3 Web3{ get; }

        public ContractHandler ContractHandler { get; }

        public RentalNFTTestService(Nethereum.Web3.Web3 web3, string contractAddress)
        {
            Web3 = web3;
            ContractHandler = web3.Eth.GetContractHandler(contractAddress);
        }

        public RentalNFTTestService(Nethereum.Web3.IWeb3 web3, string contractAddress)
        {
            Web3 = web3;
            ContractHandler = web3.Eth.GetContractHandler(contractAddress);
        }

        public Task<bool> IsTestQueryAsync(IsTestFunction isTestFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<IsTestFunction, bool>(isTestFunction, blockParameter);
        }

        
        public Task<bool> IsTestQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<IsTestFunction, bool>(null, blockParameter);
        }

        public Task<BigInteger> OneHourQueryAsync(OneHourFunction oneHourFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<OneHourFunction, BigInteger>(oneHourFunction, blockParameter);
        }

        
        public Task<BigInteger> OneHourQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<OneHourFunction, BigInteger>(null, blockParameter);
        }

        public Task<List<string>> ExcludeArtifactsQueryAsync(ExcludeArtifactsFunction excludeArtifactsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<ExcludeArtifactsFunction, List<string>>(excludeArtifactsFunction, blockParameter);
        }

        
        public Task<List<string>> ExcludeArtifactsQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<ExcludeArtifactsFunction, List<string>>(null, blockParameter);
        }

        public Task<List<string>> ExcludeContractsQueryAsync(ExcludeContractsFunction excludeContractsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<ExcludeContractsFunction, List<string>>(excludeContractsFunction, blockParameter);
        }

        
        public Task<List<string>> ExcludeContractsQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<ExcludeContractsFunction, List<string>>(null, blockParameter);
        }

        public Task<List<string>> ExcludeSendersQueryAsync(ExcludeSendersFunction excludeSendersFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<ExcludeSendersFunction, List<string>>(excludeSendersFunction, blockParameter);
        }

        
        public Task<List<string>> ExcludeSendersQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<ExcludeSendersFunction, List<string>>(null, blockParameter);
        }

        public Task<string> FailedRequestAsync(FailedFunction failedFunction)
        {
             return ContractHandler.SendRequestAsync(failedFunction);
        }

        public Task<string> FailedRequestAsync()
        {
             return ContractHandler.SendRequestAsync<FailedFunction>();
        }

        public Task<TransactionReceipt> FailedRequestAndWaitForReceiptAsync(FailedFunction failedFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(failedFunction, cancellationToken);
        }

        public Task<TransactionReceipt> FailedRequestAndWaitForReceiptAsync(CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync<FailedFunction>(null, cancellationToken);
        }

        public Task<string> SetUpRequestAsync(SetUpFunction setUpFunction)
        {
             return ContractHandler.SendRequestAsync(setUpFunction);
        }

        public Task<string> SetUpRequestAsync()
        {
             return ContractHandler.SendRequestAsync<SetUpFunction>();
        }

        public Task<TransactionReceipt> SetUpRequestAndWaitForReceiptAsync(SetUpFunction setUpFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setUpFunction, cancellationToken);
        }

        public Task<TransactionReceipt> SetUpRequestAndWaitForReceiptAsync(CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync<SetUpFunction>(null, cancellationToken);
        }

        public Task<TargetArtifactSelectorsOutputDTO> TargetArtifactSelectorsQueryAsync(TargetArtifactSelectorsFunction targetArtifactSelectorsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<TargetArtifactSelectorsFunction, TargetArtifactSelectorsOutputDTO>(targetArtifactSelectorsFunction, blockParameter);
        }

        public Task<TargetArtifactSelectorsOutputDTO> TargetArtifactSelectorsQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<TargetArtifactSelectorsFunction, TargetArtifactSelectorsOutputDTO>(null, blockParameter);
        }

        public Task<List<string>> TargetArtifactsQueryAsync(TargetArtifactsFunction targetArtifactsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TargetArtifactsFunction, List<string>>(targetArtifactsFunction, blockParameter);
        }

        
        public Task<List<string>> TargetArtifactsQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TargetArtifactsFunction, List<string>>(null, blockParameter);
        }

        public Task<List<string>> TargetContractsQueryAsync(TargetContractsFunction targetContractsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TargetContractsFunction, List<string>>(targetContractsFunction, blockParameter);
        }

        
        public Task<List<string>> TargetContractsQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TargetContractsFunction, List<string>>(null, blockParameter);
        }

        public Task<TargetSelectorsOutputDTO> TargetSelectorsQueryAsync(TargetSelectorsFunction targetSelectorsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<TargetSelectorsFunction, TargetSelectorsOutputDTO>(targetSelectorsFunction, blockParameter);
        }

        public Task<TargetSelectorsOutputDTO> TargetSelectorsQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<TargetSelectorsFunction, TargetSelectorsOutputDTO>(null, blockParameter);
        }

        public Task<List<string>> TargetSendersQueryAsync(TargetSendersFunction targetSendersFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TargetSendersFunction, List<string>>(targetSendersFunction, blockParameter);
        }

        
        public Task<List<string>> TargetSendersQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TargetSendersFunction, List<string>>(null, blockParameter);
        }

        public Task<string> TestContractstateissetcorrectlyRequestAsync(TestContractstateissetcorrectlyFunction testContractstateissetcorrectlyFunction)
        {
             return ContractHandler.SendRequestAsync(testContractstateissetcorrectlyFunction);
        }

        public Task<string> TestContractstateissetcorrectlyRequestAsync()
        {
             return ContractHandler.SendRequestAsync<TestContractstateissetcorrectlyFunction>();
        }

        public Task<TransactionReceipt> TestContractstateissetcorrectlyRequestAndWaitForReceiptAsync(TestContractstateissetcorrectlyFunction testContractstateissetcorrectlyFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(testContractstateissetcorrectlyFunction, cancellationToken);
        }

        public Task<TransactionReceipt> TestContractstateissetcorrectlyRequestAndWaitForReceiptAsync(CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync<TestContractstateissetcorrectlyFunction>(null, cancellationToken);
        }

        public Task<string> TestWalletcanextendserviceRequestAsync(TestWalletcanextendserviceFunction testWalletcanextendserviceFunction)
        {
             return ContractHandler.SendRequestAsync(testWalletcanextendserviceFunction);
        }

        public Task<string> TestWalletcanextendserviceRequestAsync()
        {
             return ContractHandler.SendRequestAsync<TestWalletcanextendserviceFunction>();
        }

        public Task<TransactionReceipt> TestWalletcanextendserviceRequestAndWaitForReceiptAsync(TestWalletcanextendserviceFunction testWalletcanextendserviceFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(testWalletcanextendserviceFunction, cancellationToken);
        }

        public Task<TransactionReceipt> TestWalletcanextendserviceRequestAndWaitForReceiptAsync(CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync<TestWalletcanextendserviceFunction>(null, cancellationToken);
        }

        public Task<string> TestWalletcanrentserviceRequestAsync(TestWalletcanrentserviceFunction testWalletcanrentserviceFunction)
        {
             return ContractHandler.SendRequestAsync(testWalletcanrentserviceFunction);
        }

        public Task<string> TestWalletcanrentserviceRequestAsync()
        {
             return ContractHandler.SendRequestAsync<TestWalletcanrentserviceFunction>();
        }

        public Task<TransactionReceipt> TestWalletcanrentserviceRequestAndWaitForReceiptAsync(TestWalletcanrentserviceFunction testWalletcanrentserviceFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(testWalletcanrentserviceFunction, cancellationToken);
        }

        public Task<TransactionReceipt> TestWalletcanrentserviceRequestAndWaitForReceiptAsync(CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync<TestWalletcanrentserviceFunction>(null, cancellationToken);
        }

        public Task<string> TestCanaddfeetokensRequestAsync(TestCanaddfeetokensFunction testCanaddfeetokensFunction)
        {
             return ContractHandler.SendRequestAsync(testCanaddfeetokensFunction);
        }

        public Task<string> TestCanaddfeetokensRequestAsync()
        {
             return ContractHandler.SendRequestAsync<TestCanaddfeetokensFunction>();
        }

        public Task<TransactionReceipt> TestCanaddfeetokensRequestAndWaitForReceiptAsync(TestCanaddfeetokensFunction testCanaddfeetokensFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(testCanaddfeetokensFunction, cancellationToken);
        }

        public Task<TransactionReceipt> TestCanaddfeetokensRequestAndWaitForReceiptAsync(CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync<TestCanaddfeetokensFunction>(null, cancellationToken);
        }
    }
}
