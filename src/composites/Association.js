/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

/**
 * This collection class implements an association between a key and a value. It is used by the
 * catalog class.
 */
var types = require('../abstractions/Types');
var Composite = require('../abstractions/Composite').Composite;


// PUBLIC METHODS

function Association(key, value) {
    Composite.call(this, types.ASSOCIATION);
    this.key = Composite.asComponent(key);
    this.value = Composite.asComponent(value);
    this.length += key.length + value.length;
    this.length += 2;  // account for the ': ' separator
    return this;
}
Association.prototype = Object.create(Composite.prototype);
Association.prototype.constructor = Association;
exports.Association = Association;


/**
 * This method accepts a visitor as part of the visitor pattern.
 * 
 * @param {Visitor} visitor The visitor that wants to visit this association.
 */
Association.prototype.accept = function(visitor) {
    visitor.visitAssociation(this);
};


/**
 * This method returns the number of attributes that make up an association.
 * 
 * @returns {Number} The number of attributes that make up an association.
 */
Association.prototype.getSize = function() {
    return 2;
};


/**
 * This method returns an array containing the attributes of this association.
 * 
 * @returns {Array} An array containing the attributes of this association.
 */
Association.prototype.toArray = function() {
    var array = [];
    array.push(this.key);
    array.push(this.value);
    return array;
};


/**
 * This method sets a new value for the association.
 * 
 * @param {Component} value The value of the association.
 */
Association.prototype.setValue = function(value) {
    this.length -= this.value.length;
    this.value = value;
    this.length += value.length;
};
