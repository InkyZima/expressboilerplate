exports.getspa = (req, res, next) => {
	console.log("retriving name information from cookie: " + req.session.name);
	if (!req.session.user) res.render("spa/singlepageapp");
	else res.render("spa/singlepageapp", {user:req.session.user});
		// c(res.get("set-cookie"))
};

exports.postformdata = (req,res,next) => {
	// here should arrive only form submits. template should actually be drawn automatically.. from the jade view.
	// if the names of the input fields get changed, they have to be changed here too...
	validate(models.formdata,req.body)
	.catch(throwerr)
	.then(() => { // push to db
		return knex("formdata").insert(req.body);
	})
	.catch(throwerr)
	.then(() => { // send response
		res.send("success")})
	// finally pass any error to express error handler
	.catch((err) => next(err));
};

/** helper functions **/
// TODO maybe move this function to models.js ?
function validate(template, obj) {
	return new Promise ((res,rej) => {
		var tkeys = Object.getOwnPropertyNames(template);
		var okeys = Object.getOwnPropertyNames(obj);

		if (tkeys.length != okeys.length) rej("validated object has a different amount of properties than expected");

		for (var i = 0; i < tkeys.length; i++) {
			if (okeys.indexOf(tkeys[i]) < 0) rej("validated object has differently named properties than expected");
			if (!val[template[tkeys[i]]](obj[tkeys[i]])) rej("validated object failed type validation for property: " + tkeys[i]);
		}

		res("validate return value");		
	}); // promise
} // function
