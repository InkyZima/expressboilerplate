exports.postrestaurant =  (req, res, next) => {
	res.cookie("testcookie","testcookie value");
	res.render("restaurants_list");
};
