export function mockWallet() {
  window.__loadCount = 1;
  try {
    window.__loadCount += Number(sessionStorage.getItem('deep.e2e.loads') || 0);
    sessionStorage.setItem('deep.e2e.loads', String(window.__loadCount));
  } catch { /* Opaque origins and blocked storage have no persistent counter. */ }
  const calls = [];
  window.ethereum = {
    isMetaMask: true, __calls: calls, __reject: false,
    request: async ({method, params}) => {
      calls.push({method, params});
      if (window.ethereum.__reject) throw Object.assign(new Error('User rejected request'), {code:4001});
      switch (method) {
        case 'eth_requestAccounts': case 'eth_accounts': return ['0x'+'11'.repeat(20)];
        case 'eth_chainId': return '0xa';
        case 'wallet_switchEthereumChain': return null;
        case 'eth_sendTransaction': return '0x'+'ab'.repeat(32);
        case 'personal_sign': return '0x'+'cd'.repeat(65);
        default: throw new Error(`Unimplemented wallet method: ${method}`);
      }
    }, on() {}, removeListener() {},
  };
}
