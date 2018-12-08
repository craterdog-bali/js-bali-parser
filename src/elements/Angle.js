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
/* global NaN, Infinity */

/*
 * This class captures the state, methods, and functions associated with an angle element.
 */
var types = require('../abstractions/Types');
var Element = require('../abstractions/Element').Element;


/**
 * This constructor creates an immutable instance of an angle in radians.
 * 
 * @constructor
 * @param {Number|String} value The value of the angle.
 * @param {Parameters} parameters Optional parameters used to parameterize this element. 
 * @returns {Angle} The new angle element.
 */
function Angle(value, parameters) {
    Element.call(this, types.ANGLE, parameters);

    // analyze the value
    if (value === undefined || value === null) value = 0;  // default value
    var type = value.constructor.name;
    switch (type) {
        case 'Number':
            if (!isFinite(value)) throw new Error('ANGLE: An angle must be a valid number: ' + value);
            break;
        case 'String':
            if (value === '~pi' || value === '~-pi') {
                value = Math.PI;
            } else {
                value = Number(value.replace(/~/g, ''));  // strip off the ~
            }
            break;
        default:
            throw new Error('ANGLE: An invalid value type was passed to the constructor: ' + type);
    }

    // lock onto zero if appropriate
    if (value > 0 && value <= 6.123233995736766e-16) value = 0;
    if (value < 0 && value >= -6.123233995736766e-16) value = 0;

    // lock onto pi if appropriate, the value will be normalized to the range (-pi..pi]
    if (value > 3.141592653589791 && value < 3.141592653589795) value = Math.PI;
    if (value < -3.141592653589791 && value > -3.141592653589795) value = Math.PI;

    // normalize the value to the range (-pi..pi]
    var twoPi = 2 * Math.PI;
    if (value <= -Math.PI || value > Math.PI) value %= twoPi;  // make in range (-2pi..2pi)
    if (value > Math.PI) value -= twoPi;  // make in the range (-pi..pi]
    if (value <= -Math.PI) value += twoPi;  // make in the range (-pi..pi]
    if (value === -0) value = 0;  // normalize to positive zero

    // return a constant if available
    if (value === 0 && Angle.ZERO) return Angle.ZERO;
    if (value === Math.PI && Angle.PI) return Angle.PI;

    // cache the canonically formatted source
    this.value = value;
    var source = '~' + Element.numberToSource(value);
    this.setSource(source);

    return this;
}
Angle.prototype = Object.create(Element.prototype);
Angle.prototype.constructor = Angle;
exports.Angle = Angle;


// PUBLIC METHODS

/**
 * This method returns the numeric value of the angle.
 * 
 * @returns {Number} The numeric value of the angle.
 */
Angle.prototype.toNumber = function() {
    return this.value;
};


// PUBLIC CONSTANTS

Angle.PI = new Angle(Math.PI);
Angle.ZERO = new Angle(0);


// PUBLIC FUNCTIONS

/**
 * This function returns the negative of an angle.
 * 
 * @param {Angle} angle The angle to be negated.
 * @returns {Angle} The negated angle.
 */
Angle.negative = function(angle) {
    return new Angle(-angle.value);
};


/**
 * This function returns the sum of two angles. The result will be normalized to be in
 * the range (-pi..pi].
 * 
 * @param {Angle} firstAngle The first angle to be summed.
 * @param {Angle} secondAngle The second angle to be summed.
 * @returns {Angle} The normalized sum of the two angles.
 */
Angle.sum = function(firstAngle, secondAngle) {
    return new Angle(firstAngle.value + secondAngle.value);
};


/**
 * This function returns the difference of two angles. The result will be normalized to be in
 * the range (-pi..pi].
 * 
 * @param {Angle} firstAngle The angle to be subtracted from.
 * @param {Angle} secondAngle The angle to subtract from the first angle.
 * @returns {Angle} The normalized difference of the two angles.
 */
Angle.difference = function(firstAngle, secondAngle) {
    return new Angle(firstAngle.value - secondAngle.value);
};


/**
 * This function returns the inverse of an angle.
 * 
 * @param {Angle} angle The angle to be inverted.
 * @returns {Angle} The inverted angle.
 */
Angle.inverse = function(angle) {
    return new Angle(angle.value - Math.PI);
};


/**
 * This function returns the sine (opposite/hypotenuse) of an angle.
 * 
 * @param {Angle} angle The angle to be analyzed.
 * @returns {Number} The ratio of the opposite to the hypotenuse for the angle.
 */
Angle.sine = function(angle) {
    return Math.sin(angle.value);
};


/**
 * This function returns the cosine (adjacent/hypotenuse) of an angle.
 * 
 * @param {Angle} angle The angle to be analyzed.
 * @returns {Number} The ratio of the adjacent to the hypotenuse for the angle.
 */
Angle.cosine = function(angle) {
    return Math.cos(angle.value);
};


/**
 * This function returns the tangent (opposite/adjacent) of an angle.
 * 
 * @param {Angle} angle The angle to be analyzed.
 * @returns {Number} The ratio of the opposite to the adjacent for the angle.
 */
Angle.tangent = function(angle) {
    var tangent = Math.tan(angle.value);

    // lock onto infinity if appropriate
    if (tangent > 0 && tangent >= 16331239353195370) tangent = Infinity;
    if (tangent < 0 && tangent <= -16331239353195370) tangent = Infinity;
};


/**
 * This function returns the angle for the ratio of the opposite to the hypotenuse for
 * a right triangle.
 * 
 * @param {Number} ratio The ratio of the opposite to the hypotenuse for the triangle. 
 * @returns {Angle} The angle of the triangle.
 */
Angle.arcsine = function(ratio) {
    return new Angle(Math.asin(ratio));
};


/**
 * This function returns the angle for the ratio of the adjacent to the hypotenuse for
 * a right triangle.
 * 
 * @param {Number} ratio The ratio of the adjacent to the hypotenuse for the triangle. 
 * @returns {Angle} The angle of the triangle.
 */
Angle.arccosine = function(ratio) {
    return new Angle(Math.acos(ratio));
};


/**
 * This function returns the angle for the ratio of the opposite to the adjacent for
 * a right triangle.
 * 
 * @param {Number} opposite The length of the side opposite the angle.
 * @param {Number} adjacent The length of the side adjacent to the angle.
 * @returns {Angle} The angle of the triangle.
 */
Angle.arctangent = function(opposite, adjacent) {
    return new Angle(Math.atan2(opposite, adjacent));
};
