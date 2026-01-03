const crypto = require('crypto');

class SecureRNG {
  generateServerSeed() {
    return crypto.randomBytes(32).toString('hex');
  }

  hashServerSeed(serverSeed) {
    return crypto.createHash('sha256').update(serverSeed).digest('hex');
  }

  generateResult(serverSeed, clientSeed, nonce) {
    const combinedSeed = `${serverSeed}:${clientSeed}:${nonce}`;
    const hash = crypto.createHmac('sha256', serverSeed)
      .update(`${clientSeed}:${nonce}`)
      .digest('hex');

    return hash;
  }

  hashToNumber(hash, min = 0, max = 100) {
    // Take first 8 characters of hash and convert to number
    const hexValue = hash.slice(0, 8);
    const intValue = parseInt(hexValue, 16);
    const range = max - min;

    return min + (intValue % (range + 1));
  }

  hashToFloat(hash) {
    // Convert hash to float between 0 and 1
    const hexValue = hash.slice(0, 13);
    const intValue = parseInt(hexValue, 16);
    return intValue / Math.pow(16, 13);
  }

  // Generate crash point using house edge
  generateCrashPoint(hash, houseEdge = 0.03) {
    const float = this.hashToFloat(hash);

    // Apply house edge
    if (float < houseEdge) {
      return 1.00; // Instant crash
    }

    // Calculate crash point
    const e = Math.E;
    const crashPoint = Math.floor(100 * e ** ((1 - houseEdge) / (1 - float))) / 100;

    return Math.max(1.00, Math.min(crashPoint, 1000)); // Cap at 1000x
  }

  // Generate dice result (0-100)
  generateDiceResult(hash) {
    return this.hashToNumber(hash, 0, 10000) / 100;
  }

  // Generate roulette number (0-36)
  generateRouletteNumber(hash) {
    return this.hashToNumber(hash, 0, 36);
  }

  // Shuffle array using hash
  shuffleArray(array, hash) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const segmentHash = crypto.createHash('sha256')
        .update(`${hash}:${i}`)
        .digest('hex');
      const j = this.hashToNumber(segmentHash, 0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }
}

module.exports = { SecureRNG };
