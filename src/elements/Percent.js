/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/*
 * This element class captures the state and methods associated with a
 * percent element.
 */
var types = require('../abstractions/Types');
var Element = require('../abstractions/Element').Element;


/**
 * This constructor creates a new percent element.
 * 
 * @param {Number|String} value The value of the percent.
 * @param {Parameters} parameters Optional parameters used to parameterize this element. 
 * @returns {Percent} The new percent element.
 */
function Percent(value, parameters) {
    Element.call(this, types.PERCENT, parameters);
    var type = typeof value;
    switch (type) {
        case 'undefined':
            value = 0;
            break;
        case 'number':
            // leave it
            break;
        case 'string':
            value = Number(value.replace(/%/g, ''));  // strip off the %
            break;
        default:
            throw new Error('PERCENT: An invalid value type was passed into the constructor: ' + type);
    }
    this.value = value;
    var source = value.toString() + '%';  // append the %
    // must replace the 'e' in the JS exponent with 'E' for the Bali exponent
    source = source.replace(/e\+?/g, 'E');
    this.setSource(source);
    return this;
}
Percent.prototype = Object.create(Element.prototype);
Percent.prototype.constructor = Percent;
exports.Percent = Percent;


/**
 * This method compares two percents for ordering.
 * 
 * @param {Percent} that The other percent to be compared with. 
 * @returns {Number} 1 if greater, 0 if equal, and -1 if less.
 */
Percent.prototype.comparedWith = function(that) {
    if (this.value < that.value) return -1;
    if (this.value > that.value) return 1;
    return 0;
};


/**
 * This method returns the numeric value of the percent element, e.g. 25% => 0.25
 * 
 * @returns {number} The numeric value of the percent element.
 */
Percent.prototype.toNumber = function () {
    return this.value / 100;
};
