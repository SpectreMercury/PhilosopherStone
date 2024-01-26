const RPC_URL = 'https://testnet.ckb.dev/';

const getTransaction = async (txHash: string) => {
  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'get_transaction',
        params: [txHash]
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};

export default getTransaction;
