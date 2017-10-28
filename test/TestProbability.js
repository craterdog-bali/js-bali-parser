'use strict';

var Probability = require('../src/elements/Probability').Probability;
var testCase = require('nodeunit').testCase;

module.exports = testCase({
    'Test Constructor': function(test) {
        test.expect(10);

        var empty = new Probability();
        var number = empty.toNumber();
        test.equal(number, 0, 'The probability should have been number 0.');
        var string = empty.toString();
        test.equal(string, '0', "The probability should have been string '0'.");

        var zero = new Probability(0);
        number = zero.toNumber();
        test.equal(number, 0, 'The probability should have been number 0.');
        string = zero.toString();
        test.equal(string, '0', "The probability should have been string '0'.");

        var half = new Probability(0.5);
        number = half.toNumber();
        test.equal(number, 0.5, 'The probability should have been number 0.5');
        string = half.toString();
        test.equal(string, '0.5', "The probability should have been string '0.5'.");

        var one = new Probability(1);
        number = one.toNumber();
        test.equal(number, 1, 'The probability should have been number 1.');
        string = one.toString();
        test.equal(string, '1', "The probability should have been string '1'.");

        test.throws(
            function() {
                var negative = new Probability(-1);
            }
        );

        test.throws(
            function() {
                var two = new Probability(2);
            }
        );
        test.done();
    }
});