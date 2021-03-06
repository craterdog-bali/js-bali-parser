/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

const debug = 0;
const mocha = require('mocha');
const expect = require('chai').expect;
const bali = require('../').api(debug);


describe('Bali Nebula™ Component Framework - Moment', function() {

    describe('Test moment in time constructors', function() {

        it('should construct moments in time using literals', function() {
            expect(bali.component('<2017-12-30T17:38:35.726>').toString()).to.equal('<2017-12-30T17:38:35.726>');
            expect(bali.component('<-10000>').toString()).to.equal('<-10000>');
            // TODO: add tests for parameterized locations
        });

        it('should construct current moments in time', function() {
            const time = bali.moment();
            const string = time.toString();
            expect(string.length).to.equal(25);
        });

        it('should construct a moment and format the same', function() {
            tests.forEach(function(expected) {
                const time = bali.component(expected);
                const string = time.toString();
                expect(string).to.equal(expected);
            });
        });

    });

    describe('Test moment methods', function() {

        it('should compare two moments correctly', function() {
            const first = bali.component('<2017-12-30T17:38:35>');
            const second = bali.component('<2017-12-30T17:38:39>');
            expect(first.comparedTo(second)).to.equal(-1);
            expect(first.isEqualTo(first)).to.equal(true);
            expect(second.comparedTo(first)).to.equal(1);
        });

        it('should retrieve millisecond correctly', function() {
            const moment = bali.component('<2020-12-11T10:09:08.076>');
            expect(moment.getMillisecond()).to.equal(76);
        });

        it('should retrieve second correctly', function() {
            const moment = bali.component('<2020-12-11T10:09:08.076>');
            expect(moment.getSecond()).to.equal(8);
        });

        it('should retrieve minute correctly', function() {
            const moment = bali.component('<2020-12-11T10:09:08.076>');
            expect(moment.getMinute()).to.equal(9);
        });

        it('should retrieve hour correctly', function() {
            const moment = bali.component('<2020-12-11T10:09:08.076>');
            expect(moment.getHour()).to.equal(10);
        });

        it('should retrieve day correctly', function() {
            const moment = bali.component('<2020-12-11T10:09:08.076>');
            expect(moment.getDay()).to.equal(11);
        });

        it('should retrieve month correctly', function() {
            const moment = bali.component('<2020-12-11T10:09:08.076>');
            expect(moment.getMonth()).to.equal(12);
        });

        it('should retrieve year correctly', function() {
            const moment = bali.component('<2020-12-11T10:09:08.076>');
            expect(moment.getYear()).to.equal(2020);
        });

    });

    describe('Test moment functions', function() {

        it('should calculate durations correctly', function() {
            const first = bali.component('<2017-12-30T17:38:35>');
            const second = bali.component('<2017-12-30T17:38:39>');
            const duration = bali.moment.duration(first, second);
            const later = bali.moment.later(first, duration);
            const earlier = bali.moment.earlier(later, duration);
            expect(earlier.isEqualTo(first)).to.equal(true);
            expect(later.isEqualTo(second)).to.equal(true);
        });

    });

});

const tests = [
    '<2017-12-30T17:38:35.726>',
    '<2017-12-30T17:38:35>',
    '<2017-12-30T17:38>',
    '<2017-12-30T17>',
    '<2017-12-30>',
    '<2017-12>',
    '<2017>',
    '<-10000>'
];

