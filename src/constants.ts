// Antity.js library constants
export const LOGS_PREFIX = "Antity: ";
export const METHODS = [ "GET", "PATCH", "PUT", "POST", "DELETE" ];

// Password policy constants
declare const process: {
  env: { [key: string]: string | undefined };
};

const {
  PWD_MIN_LENGTH_POLICY,
  PWD_MAX_LENGTH_POLICY,
  PWD_NUMBERS_POLICY,
  PWD_UPPERCASE_POLICY,
  PWD_LOWERCASE_POLICY,
  PWD_SYMBOLS_POLICY
} = process.env;

export const PWD_MIN_LENGTH = PWD_MIN_LENGTH_POLICY ? +PWD_MIN_LENGTH_POLICY : 9;
export const PWD_MAX_LENGTH = PWD_MAX_LENGTH_POLICY ? +PWD_MAX_LENGTH_POLICY : 20;
export const PWD_NUMBERS = PWD_NUMBERS_POLICY ? true : false;
export const PWD_UPPERCASE = PWD_UPPERCASE_POLICY ? true : false;
export const PWD_LOWERCASE = PWD_LOWERCASE_POLICY ? true : false;
export const PWD_SYMBOLS = PWD_SYMBOLS_POLICY ? true : false;
