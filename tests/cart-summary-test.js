var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var CartSummary = require('./../src/cart-summary');
var tax = require('./../src/tax');

describe('CartSummary', function() {
	var cartSummary;
	beforeEach(function() {
		sinon.stub(tax, 'stateTax', function(subtotal, state, done) {
			setTimeout(function() {
				done({
					amount: subtotal * 0.1
				});
			}, 0);
		});
		cartSummary = new CartSummary([
			{
				id: 1,
				quantity: 4,
				price: 50
			},
			{
				id: 2,
				quantity: 2,
				price: 30
			},
			{
				id: 3,
				quantity: 1,
				price: 40
			}
		],
		'food');
	});

	afterEach(function() {
		tax.stateTax.restore();
	});

	describe('getSubtotal()', function() {
		it('should return 0 if no items are passed in', function() {
			var cartSummary = new CartSummary([]);
			expect(cartSummary.getSubtotal()).to.equal(0);
		});
	
		it('should return the sum of the price * quantity for all items', function() {
			expect(cartSummary.getSubtotal()).to.equal(300);
		});
	});
	describe('getTax()', function() {
		it('should execute the callback function with the tax amount', function(done) {
			cartSummary.getTax('NY', function(taxAmount) {
				expect(taxAmount).to.equal(30);
				expect(tax.stateTax.getCall(0).args[0]).to.equal(300);
				expect(tax.stateTax.getCall(0).args[1]).to.equal('NY');
				done();
			});
		});
	});
	describe('getGrandtotal()', function() {
		it('should return 0 if no items are passed in', function(done) {
			var cartSummary = new CartSummary([]);
			cartSummary.getGrandtotal('NY', function(totalAmount) {
				expect(totalAmount).to.equal(0);
				done();
			});
		});
	
		it('should return the sum of the price * quantity + tax for all items', function(done) {
			cartSummary.getGrandtotal('NY', function(totalAmount) {
				expect(totalAmount).to.equal(330);
				done();
			});
		});
	
		it('should also take into account tobacco tax of 21%', function() {
			cartSummary = new CartSummary([
				{
					id: 1,
					quantity: 4,
					price: 50
				},
				{
					id: 2,
					quantity: 2,
					price: 30
				},
				{
					id: 3,
					quantity: 1,
					price: 40
				}
			],
			'tobacco');
			cartSummary.getGrandtotal('NY', function(totalAmount) {
				expect(totalAmount).to.equal(363);
				done();
			});
		});
	});
});
