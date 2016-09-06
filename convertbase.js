// Copyright (c) 2014 Chris Clark

// digits are stored in reverse order
function removeLeadingZeros(digits) {
  while(digits[digits.length - 1] === 0)
    digits.pop();
  return digits;
}

function BigInt(value, radix) {
  this._radix = radix || 10;
  if (value && value.constructor === Array) {
    this._digits = value.slice(0).reverse();
  } else if (typeof value === 'string' || value instanceof String) {
    this._digits = value.split('').reverse();
  } else if (!isNaN(value)) {
    this._digits = [];
    for(var i = 0; value > 0; i++) {
      this._digits.push(value % this._radix);
      value = Math.floor(value / this._radix);
    }
  } else {
    throw new Error('Unrecognized value type: ' + (typeof value));
  }
  removeLeadingZeros(this._digits);
}

BigInt.prototype.getRadix = function() {
  return this._radix;
};

BigInt.prototype.getDigits = function() {
  return this._digits.slice(0).reverse();
};

BigInt.prototype.numberOfDigits = function() {
  return this._digits.length;
};

BigInt.prototype.getDigit = function(i) {
  return i < this.numberOfDigits() ? Number(this._digits[i]) : 0;
};

BigInt.prototype.add = function(n) {
  var result = [];
  var carry = 0;
  if (n.getRadix() !== this._radix) {
    n = n.toBase(this._radix);
  }
  var size = Math.max(this.numberOfDigits(), n.numberOfDigits()) + 1;
  for(var i = 0; i < size; i++) {
    var sum = this.getDigit(i) + n.getDigit(i) + carry;
    result.push(sum % this._radix);
    carry = sum >= this._radix ? 1 : 0;
  }
  return new BigInt(result.reverse(), this._radix);
};

BigInt.prototype.shift = function(shift) {
  if (shift === 0) {
    return this;
  }
  var result = [];
  for(var i = 0; i < shift; i++)
    result.push(0);
  return new BigInt(result.concat(this._digits).reverse(), this._radix);
};

BigInt.prototype.multiply = function(n) {
  function multiplyDigit(bigint, digit) {
    var carry = 0;
    var radix = bigint.getRadix();
    var result = [];
    for(var i = 0; i < bigint.numberOfDigits(); i++) {
      var x = (bigint.getDigit(i) * digit) + carry;
      result.push(x % radix);
      carry = Math.floor(x / radix);
    }
    result.push(carry);
    return new BigInt(result.reverse(), radix);
  }
  if (n.getRadix() !== this._radix) {
    n = n.toBase(this._radix);
  }
  var result = new BigInt(0, this._radix);
  for(var i = 0; i < n.numberOfDigits(); i++) {
    result = result.add(multiplyDigit(this, n.getDigit(i)).shift(i));
  }
  return result;
};

BigInt.prototype.toBase = function(newRadix) {
  var result = new BigInt(0, newRadix);
  var factor = new BigInt(this._radix, newRadix);
  for(var i = 0; i < this.numberOfDigits(); i++) {
    result = result.multiply(factor);
    var digit = this._digits[this.numberOfDigits() - i - 1];
    result = result.add(new BigInt(digit, newRadix));
  }
  return result;
};

function toBigInt(value, radix) {
  if (radix === parseInt(radix) && radix >= 2) {
    return new BigInt(value, radix);
  } else if (typeof radix === 'string') {
    var alphabet = radix;
    var digits = value.split('').map(function(c) {
      return alphabet.indexOf(c);
    });
    return new BigInt(digits, alphabet.length);
  } else {
    throw new Error('Invalid type for "radix"');
  }
}

function fromBigInt(bigint, radix) {
  if (radix === parseInt(radix) && radix >= 2) {
    return bigint.toBase(radix).getDigits();
  } else if (typeof radix === 'string') {
    var alphabet = radix;
    return bigint.toBase(alphabet.length).getDigits().map(function(i) {
      return alphabet.charAt(i);
    }).join('');
  } else {
    throw new Error('Invalid type for "radix"');
  }
}

function convertBase(value, fromBase, toBase) {
    return fromBigInt(toBigInt(value, fromBase), toBase);
}

module.exports = convertBase;
