// Copyright (c) 2014 Chris Clark

function BigNum(initRadix, initValue) {
    var radix = initRadix;
    var digits = [];   // least significant digits first

    this.size = function() {
        return digits.length;
    }

    this.digit = function(i) {
        return i < this.size() ? (digits[i] ? digits[i] : 0) : 0;
    }

    this.array = function() {
        return digits.slice(0).reverse();
    }

    this.load = function(array) {
        digits = [];
        var newDigits = array.slice(0).reverse();
        for(var i = 0; i < newDigits.length; i++) {
            digits[i] = newDigits[i];
        }
        return this;
    }

    this.init = function(value) {
        digits = [];
        for(var i = 0; value > 0; i++) {
            digits[i] = value % radix;
            value = Math.floor(value / radix);
        }
        return this;
    }

    this.resize = function() {
        while(digits[digits.length - 1] === 0)
            digits.pop();
        return this;
    }

    this.copy = function(n) {
        digits = [];
        for(var i = 0; i < n.size(); i++) {
            digits[i] = n.digit(i);
        }
        return this;
    }

    this.add = function(n) {
        var carry = 0;
        var size = Math.max(this.size(), n.size()) + 1;
        for(var i = 0; i < size; i++) {
            var sum = this.digit(i) + n.digit(i) + carry;
            digits[i] = sum % radix;
            carry = sum >= radix ? 1 : 0;
        }
        return this.resize();
    }

    this.multiplyDigit = function(digit) {
        var carry = 0;
        for(var i = 0; i < this.size(); i++) {
            var x = (digits[i] * digit) + carry;
            digits[i] = x % radix;
            carry = Math.floor(x / radix);
        }
        digits[this.size()] = carry;
        return this.resize();
    }

    this.shift = function(shift) {
        if(shift > 0) {
            for(var i = this.size() + shift - 1; i >= 0; i--) {
                digits[i] = i >= shift ? digits[i - shift] : 0;
            }
        }
        return this.resize();
    }

    this.multiply = function(n) {
        var result = new BigNum(radix);
        for(var i = 0; i < n.size(); i++) {
            var temp = (new BigNum(radix)).copy(this);
            result.add(temp.multiplyDigit(n.digit(i)).shift(i));
        }
        return this.copy(result).resize();
    }

    this.rebase = function(newRadix) {
        var result = new BigNum(newRadix);
        var factor = new BigNum(newRadix, radix);
        for(var i = 0; i < this.size(); i++) {
            result.multiply(factor);
            result.add(new BigNum(newRadix, this.digit(this.size() - i - 1)));
        }
        radix = newRadix;
        return this.copy(result).resize();
    }

    this.init(initValue);
}
