import test from 'node:test'
import assert from 'node:assert/strict'
import { isNumeric, isFiniteNumeric, isNumber, isFiniteNumber } from '../src/isnumber.js'

/*
Tests and functions to test copied from http://run.plnkr.co/plunks/93FPpacuIcXqqKMecLdk/
Original only tested isFiniteNumeric functionality, so refactored to test other notions
of 'number like' and to use ES modules, etc.

These are refactored isFiniteNumeric implementations from the above link.
Apparently all these implementations are broken in some way.
They are here in case you want to test any of them.

var functionsToTest = [
  (n) => !isNaN(n) && !isNaN(parseFloat(n)),
  (n) => !isNaN((n)),
  (n) => !isNaN(parseFloat(n)),
  (n) => typeof (n) !== 'boolean' && !isNaN(n),
  (n) => parseFloat(n) === Number(n),
  (n) => parseInt(n) === Number(n),
  (n) => !isNaN(Number(String(n))),
  (n) => !isNaN(+('' + n)),
  (n) => (+n) == n, // eslint-disable-line
  (n) => n && /^-?\d+(\.\d+)?$/.test(n + ''),
  (n) => isFinite(Number(String(n))),
  (n) => isFinite(String(n)),
  (n) => !isNaN(n) && !isNaN(parseFloat(n)) && isFinite(n),
  (n) => parseFloat(n) == n, // eslint-disable-line
  (n) => (n - 0) == n && n.length > 0, // eslint-disable-line
  (n) => typeof n === 'number' && isFinite(n)
]
*/

/**
 * All the is* functions that we're testing have this signature.
 * Don't use a union of them so that we test the d.ts mapping
 * @typedef {(n: any) => boolean} NumberCheck
 */

/**
 * A grouping of test cases where NumberCheck should return the expected value
 * @typedef {(fn: NumberCheck, expected: boolean) => void} TestFunction
 */

/**
 * Test that all varieties of numeric literal pass.
 * @param {NumberCheck} fn - function under test
 */
const numberLiterals = (fn) => {
  test(`${fn.name} integer literals`, () => {
    assert.ok(fn(-16), 'Negative integer number')
    assert.ok(fn(0), 'Zero integer number')
    assert.ok(fn(-0), 'Negative zero integer number')
    assert.ok(fn(32), 'Positive integer number')
    assert.ok(fn(0o0144), 'Octal integer literal')
    assert.ok(fn(0xFFF), 'Hexadecimal integer literal')
    assert.ok(fn(0b1010), 'Binary integer literal')
    assert.ok(fn(1_000), 'Numeric separator integer literal')
  })

  test(`${fn.name} floating point literals`, () => {
    assert.ok(fn(-2.6), 'Negative floating point number')
    assert.ok(fn(3.1415), 'Positive floating point number')
    assert.ok(fn(8e5), 'Exponential notation')
    assert.ok(fn(123e-2), 'Negative exponential notation')
    assert.ok(fn(0.5), 'Leading decimal point number')
    assert.ok(fn(-0.5), 'Negative leading decimal point number')
    assert.ok(fn(5.0), 'Trailing decimal point number')
  })

  test(`${fn.name} Number constants and boxed numbers`, () => {
    assert.ok(fn(Number.MAX_VALUE), 'Number.MAX_VALUE')
    assert.ok(fn(Number.MIN_VALUE), 'Number.MIN_VALUE')
    assert.ok(fn(Number.MAX_SAFE_INTEGER), 'Number.MAX_SAFE_INTEGER')
    assert.ok(fn(Number.MIN_SAFE_INTEGER), 'Number.MIN_SAFE_INTEGER')
    assert.ok(fn(Number.EPSILON), 'Number.EPSILON')
    assert.ok(fn(new Number(-16)), 'Boxed negative integer')
    assert.ok(fn(new Number(0)), 'Boxed zero')
    assert.ok(fn(new Number(3.1415)), 'Boxed floating point number')
  })
}

/**
 * Test that strings that look like numbers are handled as expected.
 *
 * @type {TestFunction}
 * @param {NumberCheck} fn - function under test
 * @param {boolean} expected - true if fn considers number-like strings to be numbers
 * @returns {void}
 */
const numberLikeStrings = (fn, expected) => {
  test(`${fn.name} integer strings`, () => {
    assert.equal(fn('-10'), expected, 'Negative integer string')
    assert.equal(fn('+10'), expected, 'Explicit positive integer string')
    assert.equal(fn('0'), expected, 'Zero string')
    assert.equal(fn('-0'), expected, 'Negative zero string')
    assert.equal(fn('+0'), expected, 'Positive zero string')
    assert.equal(fn('5'), expected, 'Positive integer string')
    assert.equal(fn('040'), expected, 'Legacy octal / zero-padded integer string')
    assert.equal(fn('0o144'), expected, 'Octal integer literal string')
    assert.equal(fn('0O144'), expected, 'Uppercase octal integer literal string')
    assert.equal(fn('0xFF'), expected, 'Hexadecimal integer literal string')
    assert.equal(fn('0Xff'), expected, 'Uppercase hexadecimal integer literal string')
    assert.equal(fn('0b1010'), expected, 'Binary integer literal string')
    assert.equal(fn('0B1010'), expected, 'Uppercase binary integer literal string')
    assert.equal(fn('05'), expected, 'Zero padded integer string')
  })

  test(`${fn.name} floating point strings`, () => {
    assert.equal(fn('-1.6'), expected, 'Negative floating point string')
    assert.equal(fn('+1.6'), expected, 'Explicit positive floating point string')
    assert.equal(fn('4.536'), expected, 'Positive floating point string')
    assert.equal(fn('123e-2'), expected, 'Exponential notation string')
    assert.equal(fn('123e+2'), expected, 'Explicit positive exponential notation string')
    assert.equal(fn('123E2'), expected, 'Uppercase exponential notation string')
    assert.equal(fn('04.345'), expected, 'Zero padded positive floating point string')
    assert.equal(fn('.5'), expected, 'Leading decimal point string')
    assert.equal(fn('-.5'), expected, 'Negative leading decimal point string')
    assert.equal(fn('+.5'), expected, 'Positive leading decimal point string')
    assert.equal(fn('5.'), expected, 'Trailing decimal point string')
  })

  test(`${fn.name} whitespace-padded and boxed number strings`, () => {
    assert.equal(fn(' 42 '), expected, 'Space-padded integer string')
    assert.equal(fn('\t-3.14\n'), expected, 'Tab and newline padded float string')
    assert.equal(fn(' 0xFF '), expected, 'Space-padded hex string')
    assert.equal(fn(new String('-10')), expected, 'Boxed negative integer string')
    assert.equal(fn(new String('4.536')), expected, 'Boxed floating point string')
    assert.equal(fn(new String('0xFF')), expected, 'Boxed hex string')
    assert.equal(fn(new String(' 42 ')), expected, 'Boxed space-padded string')
  })
}

/**
 * Test that non-finite values are handled as expected.
 * @type {TestFunction}
 * @param {NumberCheck} fn - function under test
 * @param {boolean} expected  - true if fn considers non-finite values to be numbers
 */
const nonFinite = (fn, expected) => {
  test(`${fn.name} non finite values`, () => {
    assert.equal(fn(NaN), expected, 'NaN value')
    assert.equal(fn(Number.NaN), expected, 'Number.NaN value')
    assert.equal(fn(Infinity), expected, 'Positive Infinity primitive')
    assert.equal(fn(-Infinity), expected, 'Negative Infinity primitive')
    assert.equal(fn(Number.POSITIVE_INFINITY), expected, 'Positive Infinity')
    assert.equal(fn(Number.NEGATIVE_INFINITY), expected, 'Negative Infinity')
    assert.equal(fn(new Number(NaN)), expected, 'Boxed NaN')
    assert.equal(fn(new Number(Infinity)), expected, 'Boxed Positive Infinity')
    assert.equal(fn(new Number(-Infinity)), expected, 'Boxed Negative Infinity')
  })
}

/**
 * Test that strings that look like non-finite values are handled as expected.
 * @type {TestFunction}
 * @param {NumberCheck} fn - function under test
 * @param {boolean} expected  - true if fn considers non-finite string values to be numbers
 */
const nonFiniteStrings = (fn, expected) => {
  test(`${fn.name} non-finite strings`, () => {
    assert.equal(fn('NaN'), expected, 'NaN string')
    assert.equal(fn('Infinity'), expected, 'Positive Infinity string')
    assert.equal(fn('-Infinity'), expected, 'Negative Infinity string')
    assert.equal(fn('+Infinity'), expected, 'Explicit positive Infinity string')
    assert.equal(fn(' NaN '), expected, 'Whitespace-padded NaN string')
    assert.equal(fn(' Infinity '), expected, 'Whitespace-padded Positive Infinity string')
    assert.equal(fn('\t-Infinity\n'), expected, 'Whitespace-padded Negative Infinity string')
    assert.equal(fn(' +Infinity '), expected, 'Whitespace-padded explicit positive Infinity string')
    assert.equal(fn(new String('NaN')), expected, 'Boxed NaN string')
    assert.equal(fn(new String('Infinity')), expected, 'Boxed Positive Infinity string')
    assert.equal(fn(new String('-Infinity')), expected, 'Boxed Negative Infinity string')
    assert.equal(fn(new String('+Infinity')), expected, 'Boxed explicit positive Infinity string')
    assert.equal(fn(new String(' Infinity ')), expected, 'Boxed whitespace-padded Infinity string')
  })
}

/**
 * Test that non-numeric values are not considered numbers.
 * @param {NumberCheck} fn - function under test
 */
const nonNumeric = (fn) => {
  test(`${fn.name} non-numeric strings`, () => {
    assert.equal(fn(''), false, 'Empty string')
    assert.equal(fn('        '), false, 'Whitespace characters string')
    assert.equal(fn('\t\t'), false, 'Tab characters string')
    assert.equal(fn('\n\r'), false, 'Newline characters string')
    assert.equal(fn(new String('')), false, 'Boxed empty string')
    assert.equal(fn(new String('   ')), false, 'Boxed whitespace string')
    assert.equal(fn(new String('abc')), false, 'Boxed non-numeric string')
    assert.equal(fn('abcdefghijklm1234567890'), false, 'Alphanumeric character string')
    assert.equal(fn('xabcdefx'), false, 'Non-numeric character string')
    assert.equal(fn('bcfed5.2'), false, 'Number with preceding non-numeric characters')
    assert.equal(fn('7.2acdgs'), false, 'Number with trailing non-numeric characters')
    assert.equal(fn('.'), false, 'Lone decimal point')
    assert.equal(fn('+'), false, 'Lone plus sign')
    assert.equal(fn('-'), false, 'Lone minus sign')
    assert.equal(fn('+-'), false, 'Plus and minus signs')
    assert.equal(fn('--5'), false, 'Double negative sign')
    assert.equal(fn('++5'), false, 'Double positive sign')
    assert.equal(fn('1.2.3'), false, 'Multiple decimal points')
    assert.equal(fn('1e'), false, 'Incomplete exponent')
    assert.equal(fn('e5'), false, 'Missing mantissa')
    assert.equal(fn('1_000'), false, 'Numeric separator in string')
    assert.equal(fn('-0xFF'), false, 'Signed hexadecimal string')
    assert.equal(fn('+0xFF'), false, 'Positive signed hexadecimal string')
    assert.equal(fn('0xGG'), false, 'Invalid hexadecimal digits')
    assert.equal(fn('0b102'), false, 'Invalid binary digits')
    assert.equal(fn('0o18'), false, 'Invalid octal digits')
    assert.equal(fn('1e309'), false, 'Positive overflow string')
    assert.equal(fn('-1e309'), false, 'Negative overflow string')
    assert.equal(fn(new String('1e309')), false, 'Boxed overflow string')
    assert.equal(fn('infinity'), false, 'Lowercase infinity string')
    assert.equal(fn('INFINITY'), false, 'Uppercase INFINITY string')
    assert.equal(fn('nan'), false, 'Lowercase nan string')
    assert.equal(fn('true'), false, 'Boolean true string')
    assert.equal(fn('false'), false, 'Boolean false string')
    assert.equal(fn('null'), false, 'null string')
    assert.equal(fn('undefined'), false, 'undefined string')
  })

  test(`${fn.name} non-numeric non-string values`, () => {
    assert.equal(fn(true), false, 'Boolean true literal')
    assert.equal(fn(false), false, 'Boolean false literal')
    assert.equal(fn(new Boolean(true)), false, 'Boxed boolean true')
    assert.equal(fn(new Boolean(false)), false, 'Boxed boolean false')
    assert.equal(fn(undefined), false, 'Undefined value')
    assert.equal(fn(null), false, 'Null value')
    assert.equal(fn(0n), false, 'Zero BigInt')
    assert.equal(fn(42n), false, 'Positive BigInt')
    assert.equal(fn(-10n), false, 'Negative BigInt')
    assert.equal(fn(BigInt(123)), false, 'BigInt(123)')
    assert.equal(fn(Symbol()), false, 'Empty Symbol')
    assert.equal(fn(Symbol('123')), false, 'Symbol with numeric description')
    assert.equal(fn([]), false, 'Empty array')
    assert.equal(fn([0]), false, 'Single-element zero array')
    assert.equal(fn([1]), false, 'Single-element integer array')
    assert.equal(fn([-16]), false, 'Single-element negative integer array')
    assert.equal(fn(['5']), false, 'Single-element numeric string array')
    assert.equal(fn(['1.23']), false, 'Single-element float string array')
    assert.equal(fn([1, 2]), false, 'Multi-element number array')
    assert.equal(fn([[]]), false, 'Nested empty array')
    assert.equal(fn(new Int32Array([1])), false, 'TypedArray with single element')
    assert.equal(fn(new Date(2009, 1, 1)), false, 'Date object')
    assert.equal(fn(/123/), false, 'RegExp object')
    assert.equal(fn({}), false, 'Empty object')
    assert.equal(fn(Object.create(null)), false, 'Null-prototype object')
    assert.equal(fn({ valueOf: () => 42 }), false, 'Object with numeric valueOf')
    assert.equal(fn({ toString: () => '42' }), false, 'Object with numeric toString')
    assert.equal(fn({ [Symbol.toPrimitive]: () => 42 }), false, 'Object with numeric Symbol.toPrimitive')
    assert.equal(fn(function () {}), false, 'Instance of a function')
    assert.equal(fn(() => 42), false, 'Arrow function returning number')
  })
}

/**
 * @typedef {[TestFunction, boolean]} TestCase
 */
/**
 * @typedef {[NumberCheck, TestCase[]]} NumberCheckTest
 */
/**
 * Test specifications for each function.
 * @type {NumberCheckTest[]}
 */
const tests = [
  [isNumber, [[nonFinite, true], [nonFiniteStrings, false], [numberLikeStrings, false]]],
  [isNumeric, [[nonFinite, true], [nonFiniteStrings, true], [numberLikeStrings, true]]],
  [isFiniteNumber, [[nonFinite, false], [nonFiniteStrings, false], [numberLikeStrings, false]]],
  [isFiniteNumeric, [[nonFinite, false], [nonFiniteStrings, false], [numberLikeStrings, true]]]
]

/**
 * Run the tests specified just above.
 */
tests.forEach(testData => {
  const [fn, testCases] = testData // function under test
  numberLiterals(fn)
  nonNumeric(fn)
  testCases.forEach(test => {
    const [testFunction, expected] = test
    testFunction(fn, expected)
  })
})
