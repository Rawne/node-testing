var request = require('request');

module.exports = {
  calculate: function(subtotal, productType, state, done){
    var self = this;
    self.stateTax(subtotal, state, function(result) {
      var excise = self.exciseTax(subtotal, productType);
      result.amount += excise;
      done(result);
    });
    
  },
  stateTax: function(subtotal, state, done) {
    if (state !== 'CA') {
      return done({ amount: 0 });
    }

    request.post({
      url: 'https://some-tax-service.com/request',
      method: 'POST',
      json: {
        subtotal: subtotal
      }
    }, function(error, response, body) {
      done(body);
    });
  },
  exciseTax: function(subtotal, type){
    if (type === "booze") {
      return subtotal * 0.15
    } else if (type === "tobacco") {
      return subtotal * 0.21
    } else {
      return 0;
    }
  }
};
