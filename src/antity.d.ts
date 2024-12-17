type Options = {
  len: number,
  num: boolean,
  ucase: boolean, 
  lcase: boolean,
  sym: boolean,
  strict: boolean,
  exclSimilarChars: boolean,
};
export type { Options };

declare function getSaltRounds(): number;
declare function setSaltRounds(rnds: number): number;
declare function getKeyLen(): number;
declare function setKeyLen(len: number): number;
declare function getDigest(): string;
declare function setDigest(func: string): string;
declare function getDigests(): string[];
declare function encrypt(pwd: string, secret: string): string;
declare function compare(pwd: string, hash: string, secret: string): boolean;
declare function create(opts?: Partial<Options>): string;

export { 
  getSaltRounds,
  setSaltRounds,
  getKeyLen,
  setKeyLen,
  getDigest,
  setDigest,
  getDigests,
  encrypt,
  compare,
  create,
};
