const val = require("validator");

module.exports = {
	
	formdata : {restaurantname: val.isEmail, doesdelivery: val.isBoolean}

};