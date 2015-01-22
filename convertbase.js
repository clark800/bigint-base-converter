// Copyright (c) 2014 Chris Clark

function normalize(digits) {
  while(digits[digits.length - 1] === 0) {
    digits.pop();         // normalize to have no leading zeros
  }
  return digits;
}

function parseValue(value, radix) {
  var digits = [];
  radix = radix || 10;
  if (value && value.constructor === Array) {
    digits = value;
  } else if (!isNaN(value)) {
    for(var i = 0; value > 0; i++) {
      digits.push(value % radix);
      value = Math.floor(value / radix);
    }
  } else {
    throw new Error('Unrecognized value type: ' + (typeof value));
  }
  return normalize(digits);
}

function add(leftDigits, rightDigits, radix) {
  var result = [];
  var carry = 0;
  var size = Math.max(leftDigits.length, rightDigits.length) + 1;
  for(var i = 0; i < size; i++) {
    var sum = (leftDigits[i] || 0) + (rightDigits[i] || 0) + carry;
    result.push(sum % radix);
    carry = sum >= radix ? 1 : 0;
  }
  return normalize(result);
}

function shift(digits, size) {
  var result = [];
  for(var i = 0; i < size; i++) {
    result.push(0);
  }
  return normalize(result.concat(digits));
}

function multiplyDigit(digits, digit, radix) {
  var carry = 0;
  var result = [];
  for(var i = 0; i < digits.length; i++) {
    var x = (digits[i] * digit) + carry;
    result.push(x % radix);
    carry = Math.floor(x / radix);
  }
  result.push(carry);
  return normalize(result);
}

function multiply(leftDigits, rightDigits, radix) {
  var result = [];
  for(var i = 0; i < rightDigits.length; i++) {
    var x = multiplyDigit(leftDigits, rightDigits[i], radix);
    result = add(result, shift(x, i), radix);
  }
  return normalize(result);
}

function toBase(digits, oldRadix, newRadix) {
  if (oldRadix === newRadix) {
    return digits;
  }
  var result = [];
  var factor = parseValue(oldRadix, newRadix);
  for(var i = 0; i < digits.length; i++) {
    result = multiply(result, factor, newRadix);
    var digit = digits[digits.length - i - 1];
    result = add(result, parseValue(digit, newRadix), newRadix);
  }
  return normalize(result);
}

function toDigits(value, radix) {
  if (radix === parseInt(radix) && radix >= 2) {
    return parseValue(value.reverse(), radix).reverse();
  } else if (typeof radix === 'string') {
    var alphabet = radix;
    var digits = value.split('').map(function(c) {
      return alphabet.indexOf(c);
    });
    return parseValue(digits.reverse(), alphabet.length).reverse();
  } else {
    throw new Error('Invalid type for "radix"');
  }
}

function fromDigits(digits, oldRadix, newRadix) {
  if (newRadix === parseInt(newRadix) && newRadix >= 2) {
    return toBase(digits.reverse(), oldRadix, newRadix).reverse();
  } else if (typeof newRadix === 'string') {
    var alphabet = newRadix;
    return toBase(digits.reverse(), oldRadix, alphabet.length).map(function(i) {
      return alphabet.charAt(i);
    }).reverse().join('');
  } else {
    throw new Error('Invalid type for "radix"');
  }
}

function convertBase(value, fromBase, toBase) {
    var fromRadix = typeof fromBase === 'string' ? fromBase.length : fromBase;
    return fromDigits(toDigits(value, fromBase), fromRadix, toBase);
}

module.exports = convertBase;
