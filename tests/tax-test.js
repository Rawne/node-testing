var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var tax = require('./../src/tax');

describe('Taxes', function() {
	it('exciseTax() should return 0 when type is food', function() {
		expect(tax.exciseTax(100, 'food')).to.equal(0);
	});
	
	it('exciseTax() should return 15% extra tax when type is booze', function() {
		expect(tax.exciseTax(100, 'booze')).to.equal(15);
	});
	
	it('exciseTax() should return 21% extra tax when type is tobacco', function() {
		expect(tax.exciseTax(200, 'tobacco')).to.equal(42);
	});
});