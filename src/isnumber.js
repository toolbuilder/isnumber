const isString = (item) => typeof item === 'string' || item instanceof String

/**
 * Test if n is a number.
 *
 * Includes Infinities and NaN, does not include strings that look like numbers
 * @type {(n: any) => boolean}
 * @param {any} n - value to test
 * @returns {boolean} - true if is number, false otherwise
 * @example
 * isNumber(1.23) // true
 * isNumber(Infinity) // true
 * isNumber(NaN) // true
 * isNumber('1.23') // false
 */
export const isNumber = (n) => (typeof n === 'number' || n instanceof Number)

/**
 * Test if n is a number, or string that parses to a number. Includes infinities and NaN.
 *
 * Non-finite strings are: 'Infinity', '-Infinity', and 'NaN'.
 * @type {(n: any) => boolean}
 * @param {any} n - value to test
 * @returns {boolean} - true if is numeric, false otherwise
 * @example
 * isNumeric(1.23) // true
 * isNumeric('Infinity') // true
 * isNumeric(NaN) // true
 * isNumeric('1.23') // true
 * isNumeric('hi') // false
 */
export const isNumeric = (n) =>
  isString(n) ? (((n === 'Infinity') || (n === '-Infinity') || (n === 'NaN')) || isFiniteNumeric(n)) : isNumber(n)

/**
 * Test if n is a finite number.
 *
 * Does not include infinities, NaN, or strings that look like numbers.
 * @type {(n: any) => boolean}
 * @param {any} n - value to test
 * @return {boolean} - true if is a finite number, false otherwise
 * @example
 * isFiniteNumber(1.23) // true
 * isFiniteNumber(Infinity) // false
 * isFiniteNumber(NaN) // false
 * isFiniteNumber('1.23') // false
 */
export const isFiniteNumber = (n) => Number.isFinite(n)

/**
 * Test if n is a finite number, or string that parses to a finite number.
 *
 * Does not include infinities, NaN
 * @type {(n: any) => boolean}
 * @param {any} n - value to test
 * @returns {boolean} - true if is a finite number, false otherwise
 * @example
 * isFiniteNumeric(1.23) // true
 * isFiniteNumeric('Infinity') // false
 * isFiniteNumeric(NaN) // false
 * isFiniteNumeric('1.23') // true
 * isFiniteNumeric('hi') // false
 */
export const isFiniteNumeric = (n) => !Number.isNaN(parseFloat(n)) && isFinite(n)
