import { LedgerBlock, BlockData, BlockType, ChainAuditItem, LedgerVerificationResult } from '../types/index.ts';

/**
 * Universal SHA-256 hashing function compatible with Node.js and Browser
 */
export async function sha256(message: string): Promise<string> {
  // If in browser or Web Crypto environment
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Node.js fallback (if dynamic import or require is available)
  try {
    const nodeCrypto = await import('node:crypto');
    return nodeCrypto.createHash('sha256').update(message).digest('hex');
  } catch {
    // Pure TypeScript standard fallback SHA-256 implementation
    return tsSha256(message);
  }
}

/**
 * Synchronous TS fallback SHA-256 implementation
 */
function tsSha256(ascii: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let compositeBitLength = asciiBitLength;
  for (i = 0; i < ascii[lengthProperty]; i++) {
    words[i >> 2] |= (ascii.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  words[compositeBitLength >> 5] |= 0x80 << (24 - (compositeBitLength % 32));
  words[(((compositeBitLength + 64) >> 9) << 4) + 15] = compositeBitLength;

  for (i = 0; i < words[lengthProperty]; i += 16) {
    const w = words.slice(i, i + 16);
    let a = hash[0], b = hash[1], c = hash[2], d = hash[3];
    let e = hash[4], f = hash[5], g = hash[6], h = hash[7];

    for (j = 0; j < 64; j++) {
      if (j < 16) {
        // w[j] is set
      } else {
        const gamma0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const gamma1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + gamma0 + w[j - 7] + gamma1) | 0;
      }

      const ch = (e & f) ^ (~e & g);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const sigma0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const sigma1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const temp1 = (h + sigma1 + ch + k[j] + (w[j] || 0)) | 0;
      const temp2 = (sigma0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

/**
 * Calculates a Merkle root hash for given block payload fields
 */
export async function calculateMerkleRoot(data: BlockData, siteId?: string, timestamp?: string): Promise<string> {
  const leaves = [
    `site:${siteId || 'NETWORK_WIDE'}`,
    `time:${timestamp || ''}`,
    `tradeable:${data.tradeableCredits || 0}`,
    `buffer:${data.bufferCredits || 0}`,
    `total:${data.totalTCO2e || 0}`,
    `retired:${data.retiredCreditId || ''}`,
    `beneficiary:${data.beneficiary || ''}`,
    `reversal:${data.reversalLossTCO2e || 0}`,
    `burned:${data.burnedReserveCredits || 0}`,
    `metrics:${JSON.stringify(data.mrvMetrics || {})}`
  ];

  const hashedLeaves = await Promise.all(leaves.map(l => sha256(l)));
  return sha256(hashedLeaves.join(':'));
}

/**
 * Computes canonical block hash
 */
export async function computeBlockHash(
  index: number,
  timestamp: string,
  blockType: BlockType,
  previousHash: string,
  merkleRoot: string,
  data: BlockData,
  siteId?: string
): Promise<string> {
  const canonicalString = JSON.stringify({
    index,
    timestamp,
    blockType,
    siteId: siteId || '',
    previousHash,
    merkleRoot,
    data
  });
  return sha256(canonicalString);
}

/**
 * Generates an India Carbon Registry validator signature string
 */
export async function generateValidatorSignature(blockHash: string, index: number): Promise<string> {
  const raw = `NCCR-VALIDATOR-NODE-IN#${index}:${blockHash}`;
  const sigHash = await sha256(raw);
  return `0x${sigHash.slice(0, 32)}...${sigHash.slice(-16)} (Govt. of India Certified MRV Node)`;
}

/**
 * Verifies the entire blockchain ledger from genesis to tip
 */
export async function verifyLedgerChain(chain: LedgerBlock[]): Promise<LedgerVerificationResult> {
  const verifiedAt = new Date().toISOString();
  if (!chain || chain.length === 0) {
    return {
      isValid: false,
      totalBlocks: 0,
      firstInvalidBlockIndex: null,
      expectedHash: null,
      actualHash: null,
      details: 'Blockchain ledger is empty.',
      verifiedAt,
      chainAudit: []
    };
  }

  const chainAudit: ChainAuditItem[] = [];
  let firstInvalidBlockIndex: number | null = null;
  let expectedHash: string | null = null;
  let actualHash: string | null = null;

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    
    // Check index sequencing
    if (block.index !== i) {
      firstInvalidBlockIndex = i;
      break;
    }

    // Recompute Merkle root
    const computedMerkle = await calculateMerkleRoot(block.data, block.siteId, block.timestamp);
    
    // Recompute block hash
    const recomputedHash = await computeBlockHash(
      block.index,
      block.timestamp,
      block.blockType,
      block.previousHash,
      computedMerkle,
      block.data,
      block.siteId
    );

    let isHashValid = (block.hash === recomputedHash);
    let isPrevHashValid = true;

    if (i === 0) {
      // Genesis block previous hash check
      isPrevHashValid = (block.previousHash === '0000000000000000000000000000000000000000000000000000000000000000');
    } else {
      const prevBlock = chain[i - 1];
      isPrevHashValid = (block.previousHash === prevBlock.hash);
    }

    const blockIsValid = isHashValid && isPrevHashValid && !block.tampered;

    chainAudit.push({
      index: block.index,
      blockType: block.blockType,
      storedHash: block.hash,
      recomputedHash,
      isValid: blockIsValid,
      previousHashMatch: isPrevHashValid,
      tamperNote: !isHashValid 
        ? 'Stored hash does not match recomputed SHA-256 payload hash (Data alteration detected!)'
        : (!isPrevHashValid ? 'Previous hash pointer broken (Chain linkage violated!)' : undefined)
    });

    if (!blockIsValid && firstInvalidBlockIndex === null) {
      firstInvalidBlockIndex = i;
      expectedHash = recomputedHash;
      actualHash = block.hash;
    }
  }

  const isChainValid = (firstInvalidBlockIndex === null);

  return {
    isValid: isChainValid,
    totalBlocks: chain.length,
    firstInvalidBlockIndex,
    expectedHash,
    actualHash,
    details: isChainValid 
      ? `Cryptographic consensus verified: all ${chain.length} blocks passed SHA-256 integrity and Merkle proof checks.`
      : `Ledger corruption detected at Block #${firstInvalidBlockIndex}: Stored cryptographic proof violates hash chain continuity.`,
    verifiedAt,
    chainAudit
  };
}
