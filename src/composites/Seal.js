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
 * This composite class implements a digital notary seal. It is used by the document class.
 */
var types = require('../abstractions/Types');
var Composite = require('../abstractions/Composite').Composite;
var Binary = require('../elements/Binary').Binary;
var Reference = require('../elements/Reference').Reference;


// PUBLIC FUNCTIONS

/**
 * This constructor creates a new digital notary seal.
 * 
 * @param {String|Reference} certificateCitation A citation to the certificate that can be
 * used to verify the associated digital signature.
 * @param {String|Binary} digitalSignature A base 32 encoded binary string containing the
 * digital signature generated using the notary key associated with the notary certificate
 * referenced by the certificate citation.
 * @returns {Association} A new digital notary seal.
 */
function Seal(certificateCitation, digitalSignature) {
    Composite.call(this, types.SEAL);
    if (certificateCitation && certificateCitation.constructor.name === 'String') {
        certificateCitation = new Reference(certificateCitation);
    }
    if (digitalSignature && digitalSignature.constructor.name === 'String') {
        digitalSignature = new Binary(digitalSignature);
    }
    this.certificateCitation = certificateCitation;
    this.digitalSignature = digitalSignature;
    this.complexity += certificateCitation.complexity + digitalSignature.complexity;
    this.complexity += 1;  // account for the ' ' separator
    return this;
}
Seal.prototype = Object.create(Composite.prototype);
Seal.prototype.constructor = Seal;
exports.Seal = Seal;


// PUBLIC METHODS

/**
 * This method accepts a visitor as part of the visitor pattern.
 * 
 * @param {Visitor} visitor The visitor that wants to visit this notary seal.
 */
Seal.prototype.accept = function(visitor) {
    visitor.visitSeal(this);
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