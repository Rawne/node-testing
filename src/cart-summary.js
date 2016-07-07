var tax = require('./tax');

function CartSummary(items, productType) {
	this._items = items;
	this._productType = productType
}

CartSummary.prototype.getSubtotal = function() {
	if (this._items.length) {
		return this._items.reduce(function(subtotal, item) {
			return subtotal += (item.quantity * item.price);
		}, 0);
	}

	return 0;
};

CartSummary.prototype.getTax = function(state, done) {
	tax.calculate(this.getSubtotal(), this._productType, state, function(taxInfo) {
		done(taxInfo.amount);
	});
};

CartSummary.prototype.getGrandtotal = function(state, done) {
	if (this._items.length) {
		var subtotal = this.getSubtotal();
		this.getTax(state, function(taxAmount) {
			done(subtotal + taxAmount)
		});
	} else {
		done(0)	
	}
};

module.exports = CartSummary;
