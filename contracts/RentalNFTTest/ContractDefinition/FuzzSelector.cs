using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;

namespace Contracts.Contracts.RentalNFTTest.ContractDefinition
{
    public partial class FuzzSelector : FuzzSelectorBase { }

    public class FuzzSelectorBase 
    {
        [Parameter("address", "addr", 1)]
        public virtual string Addr { get; set; }
        [Parameter("bytes4[]", "selectors", 2)]
        public virtual List<byte[]> Selectors { get; set; }
    }
}
