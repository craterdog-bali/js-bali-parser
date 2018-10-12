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

/**
 * This collection class defines a range of numbers.
 */
var types = require('../abstractions/Types');
var Composite = require('../abstractions/Composite').Composite;
var Complex = require('../elements/Complex').Complex;


exports.fromEndPoints = function(first, last, parameters) {
    var range = new Range(first, last, parameters);
    return range;
};


exports.fromLastPoint = function(last, parameters) {
    var range = new Range(1, last, parameters);
    return range;
};


/**
 * The constructor for the range class takes a first and last number.
 * 
 * @param {Number} first The first number in the range.
 * @param {Number} last The last number in the range.
 * @param {Collection} parameters Optional parameters used to parameterize this component. 
 * @returns {Range} The new range.
 */
function Range(first, last, parameters) {
    Composite.call(this, types.RANGE, parameters);
    if (first.constructor.name !== 'Number' || last.constructor.name !== 'Number') {
        throw new Error('RANGE: The endpoints for a range must be integers.');
    }
    this.firstNumber = first;
    this.lastNumber = last;
    this.first = new Complex(first.toString());
    this.last = new Complex(last.toString());
    this.length += 2;  // account for the '[]' delimiters
    this.length += this.first.length + this.last.length + 2;  // account for the '..' separator
    return this;
}
Range.prototype = Object.create(Composite.prototype);
Range.prototype.constructor = Range;


// PUBLIC METHODS

/**
 * This method accepts a visitor as part of the visitor pattern.
 * 
 * @param {Visitor} visitor The visitor that wants to visit this collection.
 */
Range.prototype.accept = function(visitor) {
    visitor.visitRange(this);
};


/**
 * This method returns the number of numbers that are in this range.
 * 
 * @returns {Number} The number of numbers that fall in this range.
 */
Range.prototype.getSize = function() {
    var size = this.lastNumber - this.firstNumber + 1;
    return size;
};


/**
 * This method returns an array containing the integers in this range.
 * 
 * @returns {Array} An array containing the integers in this range.
 */
Range.prototype.toArray = function() {
    var array = [];
    var index = this.firstNumber;
    while (index <= this.lastNumber) array.push(index++);
    return array;
};


/**
 * This method creates an iterator that can be used to iterate over this range.
 * 
 * @returns {Iterator} An iterator that can be used to iterator over this range.
 */
Range.prototype.iterator = function() {
    var iterator = new RangeIterator(this);
    return iterator;
};


// PRIVATE CLASSES

function RangeIterator(range) {
    this.slot = 0;  // the slot before the first number
    this.size = range.getSize();  // static so we can cache it here
    this.range = range;
    return this;
}
RangeIterator.prototype.constructor = RangeIterator;


RangeIterator.prototype.toStart = function() {
    this.slot = 0;  // the slot before the first number
};


RangeIterator.prototype.toSlot = function(slot) {
    this.slot = slot;
};


RangeIterator.prototype.toEnd = function() {
    this.slot = this.size;  // the slot after the last number
};


RangeIterator.prototype.hasPrevious = function() {
    return this.slot > 0;
};


RangeIterator.prototype.hasNext = function() {
    return this.slot < this.size;
};


RangeIterator.prototype.getPrevious = function() {
    if (!this.hasPrevious()) throw new Error('ITERATOR: The iterator is at the beginning of the range.');
    this.slot--;
    var number = this.range.firstNumber + this.slot;
    return number;
};


RangeIterator.prototype.getNext = function() {
    if (!this.hasNext()) throw new Error('ITERATOR: The iterator is at the end of the range.');
    var number = this.range.firstNumber + this.slot;
    this.slot++;
    return number;
};
