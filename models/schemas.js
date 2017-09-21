const val = require("validator");

module.exports = {
	
	formdata : {restaurantname: val.isEmail, doesdelivery: val.isBoolean},
	
	named : {
		formdata : {restaurantname: val.isEmail.name, doesdelivery: val.isBoolean.name}
	}

};