export interface MockPool {
  id: string;
  name: string;
  feeTier: string;
  tvl: string;
  volume24h: string;
  extracted24h: string;
  status: "ACTIVE" | "CLEAN";
  token0: string;
  token1: string;
}

export interface MockReceipt {
  receiptHash: string;
  poolId: string;
  poolName: string;
  searcher: string;
  victim: string;
  lp: string;
  blockNumber: number;
  extractedUSDC: string;
  injectedSlippageBps: number;
  legitSlippageBps: number;
  lpLvrDelta: string;
  simulationHash: string;
  arkivURI: string;
  status: "DETECTED" | "SIMULATED" | "ARCHIVED" | "REBATED";
  txHashes: string[];
  createdAt: number;
  claimTx?: string;
}

export const MOCK_POOLS: MockPool[] = [
  {
    id: "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
    name: "WETH / USDC",
    feeTier: "0.05%",
    tvl: "$1,250.00",
    volume24h: "$420.00",
    extracted24h: "$2.10",
    status: "ACTIVE",
    token0: "0x4200000000000000000000000000000000000006",
    token1: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  },
  {
    id: "0x2a1b9487c02b8510fbc282901928014810294821092830192830192830192831",
    name: "cbBTC / USDC",
    feeTier: "0.30%",
    tvl: "$890.00",
    volume24h: "$310.00",
    extracted24h: "$1.65",
    status: "ACTIVE",
    token0: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
    token1: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  },
  {
    id: "0x3f5c908129480192830192830192830192830192830192830192830192830192",
    name: "WETH / DEGEN",
    feeTier: "1.00%",
    tvl: "$340.00",
    volume24h: "$95.00",
    extracted24h: "$0.00",
    status: "CLEAN",
    token0: "0x4200000000000000000000000000000000000006",
    token1: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
  },
];

export const MOCK_RECEIPTS: MockReceipt[] = [
  {
    receiptHash: "0x9c8d1f2b3e4a5061728394a5b6c7d8e9f01234567890abcdef1234567890abcd",
    poolId: "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
    poolName: "WETH / USDC",
    searcher: "0x1111111111111111111111111111111111111111",
    victim: "0x2222222222222222222222222222222222222222",
    lp: "0x3333333333333333333333333333333333333333",
    blockNumber: 12489201,
    extractedUSDC: "1.25",
    injectedSlippageBps: 185,
    legitSlippageBps: 12,
    lpLvrDelta: "-$1.21",
    simulationHash: "0xc9ddedeba69e600924875d3ce6c3e2cd554170c510cec4bfd5016182dc156309",
    arkivURI: "arkiv://darktrace.v1/receipt/0x9c8d1f2b3e4a5061728394a5b6c7d8e9f01234567890abcdef1234567890abcd",
    status: "ARCHIVED",
    txHashes: [
      "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
      "0xbbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222",
      "0xcccc3333cccc3333cccc3333cccc3333cccc3333cccc3333cccc3333cccc3333",
    ],
    createdAt: Date.now() - 3600000,
  },
  {
    receiptHash: "0x4a5b6c7d8e9f01234567890abcdef1234567890abcd9c8d1f2b3e4a506172839",
    poolId: "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
    poolName: "WETH / USDC",
    searcher: "0x1111111111111111111111111111111111111111",
    victim: "0x7777777777777777777777777777777777777777",
    lp: "0x3333333333333333333333333333333333333333",
    blockNumber: 12489240,
    extractedUSDC: "0.85",
    injectedSlippageBps: 240,
    legitSlippageBps: 18,
    lpLvrDelta: "-$0.82",
    simulationHash: "0xa1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
    arkivURI: "arkiv://darktrace.v1/receipt/0x4a5b6c7d8e9f01234567890abcdef1234567890abcd9c8d1f2b3e4a506172839",
    status: "ARCHIVED",
    txHashes: [
      "0x1122334455667788990011223344556677889900112233445566778899001122",
      "0x2233445566778899001122334455667788990011223344556677889900112233",
      "0x3344556677889900112233445566778899001122334455667788990011223344",
    ],
    createdAt: Date.now() - 1800000,
  },
  {
    receiptHash: "0x8f7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a291807f6e5d4c3b2a190",
    poolId: "0x2a1b9487c02b8510fbc282901928014810294821092830192830192830192831",
    poolName: "cbBTC / USDC",
    searcher: "0x4444444444444444444444444444444444444444",
    victim: "0x8888888888888888888888888888888888888888",
    lp: "0x5555555555555555555555555555555555555555",
    blockNumber: 12489295,
    extractedUSDC: "1.65",
    injectedSlippageBps: 310,
    legitSlippageBps: 24,
    lpLvrDelta: "-$1.60",
    simulationHash: "0xdeadbeef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
    arkivURI: "arkiv://darktrace.v1/receipt/0x8f7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a291807f6e5d4c3b2a190",
    status: "SIMULATED",
    txHashes: [
      "0x9988776655443322110099887766554433221100998877665544332211009988",
      "0x8877665544332211009988776655443322110099887766554433221100998877",
      "0x7766554433221100998877665544332211009988776655443322110099887766",
    ],
    createdAt: Date.now() - 600000,
  },
];

