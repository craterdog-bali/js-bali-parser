/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

const mocha = require('mocha');
const expect = require('chai').expect;
const elements = require('../src/elements');


describe('Bali Component Framework™', function() {

    describe('Test duration constructors', function() {

        it('should construct using literals', function() {
            expect(elements.Duration.fromLiteral('~P0D').toNumber()).to.equal(0);
            expect(elements.Duration.fromLiteral('~P5W').toLiteral()).to.equal('~P35D');
        });

        it('should construct a default duration of zero', function() {
            const duration = new elements.Duration();
            const string = duration.toLiteral();
            expect(string).to.equal('~' + tests[0]);
        });

        it('should construct a duration of days from weeks', function() {
            const duration = new elements.Duration('P5W');
            const string = duration.toLiteral();
            expect(string).to.equal('~P35D');
        });

        it('should construct a duration and format it the same', function() {
            tests.forEach(function(expected) {
                const duration = new elements.Duration(expected);
                const string = duration.toLiteral();
                expect(string).to.equal('~' + expected);
            });
        });

    });

    describe('Test duration methods', function() {

        it('should return the correct type', function() {
            const type = new elements.Duration('P0D').getType();
            expect(type).to.equal('<bali:[$protocol:v1,$tag:#Y6572KBG2SBYSCBHR88KB1GR616LFK8N,$version:v1,$digest:none]>');
        });

    });

    describe('Test duration functions', function() {

        it('should perform the inverse function correctly', function() {
            expect(elements.Duration.inverse(new elements.Duration('P3D')).isEqualTo(new elements.Duration('-P3D'))).to.equal(true);
            expect(elements.Duration.inverse(new elements.Duration('-P2Y3M6D')).isEqualTo(new elements.Duration('P2Y3M6D'))).to.equal(true);
        });

        it('should perform the sum function correctly', function() {
            expect(elements.Duration.sum(new elements.Duration('P2Y3M6D'), new elements.Duration('P2M4D')).isEqualTo(new elements.Duration('P2Y5M10D'))).to.equal(true);
        });

        it('should perform the difference function correctly', function() {
            expect(elements.Duration.difference(new elements.Duration('P2Y3M6D'), new elements.Duration('P2M4D')).isEqualTo(new elements.Duration('P2Y1M2D'))).to.equal(true);
        });

        it('should perform the scaled function correctly', function() {
            expect(elements.Duration.scaled(new elements.Duration('6D'), 3).isEqualTo(new elements.Duration('18D'))).to.equal(true);
        });

    });

});

const tests = [
    'P0D',
    'P12345Y',
    'P2Y3M7D',
    'P2Y3M7DT8H',
    'P2Y3M7DT8H29M',
    'P2Y3M7DT8H29M54S',
    'P3M7DT8H29M54.321S',
    'P7DT8H29M54.321S',
    'PT8H29M54.321S',
    'PT29M54.321S',
    'PT54.321S',
    'PT54S'
];

