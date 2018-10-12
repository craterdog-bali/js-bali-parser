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
 * This collection class implements a digital notary seal for a document.
 */
var types = require('../abstractions/Types');
var Composite = require('../abstractions/Composite').Composite;


// PUBLIC METHODS

function Seal(certificateCitation, digitalSignature) {
    Composite.call(this, types.SEAL);
    this.certificateCitation = certificateCitation;
    this.digitalSignature = digitalSignature;
    this.length += certificateCitation.length + digitalSignature.length;
    this.length += 1;  // account for the ' ' separator
    return this;
}
Seal.prototype = Object.create(Composite.prototype);
Seal.prototype.constructor = Seal;
exports.Seal = Seal;


/**
 * This method accepts a visitor as part of the visitor pattern.
 * 
 * @param {Visitor} visitor The visitor that wants to visit this seal.
 */
Seal.prototype.accept = function(visitor) {
    visitor.visitSeal(this);
};


/**
 * This method returns the number of attributes that make up an seal.
 * 
 * @returns {Number} The number of attributes that make up an seal.
 */
Seal.prototype.getSize = function() {
    return 2;
};


/**
 * This method returns an array containing the attributes of this notary seal.
 * 
 * @returns {Array} An array containing the attributes of this notary seal.
 */
Seal.prototype.toArray = function() {
    var array = [];
    array.push(this.certificateCitation);
    array.push(this.digitalSignature);
    return array;
};
