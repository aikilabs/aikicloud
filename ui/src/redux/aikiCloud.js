import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: "",
  chainId: 0,
  walletConnected: false,
  availableTokens: [],
  selectedToken: [],
  approvedToken: [],
  serviceCount: [],
  mintedServiceCount: [],
  services: [],
  mintedServices: [],
};

export const aikiCloud = createSlice({
  name: "AikiCloud",
  initialState,
  reducers: {
    addUserAddress: (state, action) => {
      state.address = action.payload;
    },
    setChainId: (state, action) => {
      state.chainId = action.payload;
    },
    changeWalletConnectionState: (state, action) => {
      state.walletConnected = action.payload;
    },
    setAllAvailableTokens: (state, action) => {
      state.availableTokens = action.payload;
    },
    setSelectedToken: (state, action) => {
      state.selectedToken = action.payload;
    },
    setApprovedToken: (state, action) => {
      state.approvedToken = action.payload;
    },
    setServiceCount: (state, action) => {
      state.serviceCount = action.payload;
    },
    setMintedServiceCount: (state, action) => {
      state.mintedServiceCount = action.payload;
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setMintedServices: (state, action) => {
      state.mintedServices = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addUserAddress,
  changeWalletConnectionState,
  setAllAvailableTokens,
  setSelectedToken,
  setApprovedToken,
  setChainId,
  setServiceCount,
  setMintedServiceCount,
  setServices,
  setMintedServices,
} = aikiCloud.actions;

export default aikiCloud.reducer;
