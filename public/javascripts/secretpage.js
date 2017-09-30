/*
client loads singlepageapp
	this loads also the subpages, but without data
	client clicks on  subpage link in the menu -> click gets kindof delegated to subpage script
	subpage script is in charge of:
		ajax call to get the data for the subpage
		ajax call returns error if auth is needed but user is not authed
*/

$(function() {
	var wasinitalreadycalled = false;
	var secretpage_vue = new Vue({
		el: "#secretpage_content",
		data : {
			greetuser : "You are not logged in.",
			ajaxdata : ""
		},
		methods : null
	}); // Vue
	
	v.pages.secretpage.init = function () {
		// condition: logged in
		if (!v.loggedin) {return ;}
		if (wasinitalreadycalled) { return ;}
		$.ajax({
			url: "/secretpage",
			method:"GET",
			error: (res) => {c(res.status + ": " + res.responseText)},
			success: (res,status,xhr) => {
				secretpage_vue.greetuser = res.user;
				secretpage_vue.ajaxdata = res.data;
				wasinitalreadycalled = true; // if everything went well, then no need to run all this a second time (until next page reload)
			}
		});
	}
	
	// reverting what init does on success. called on logout (in case the page requires to be logged in)
	v.pages.secretpage.reset = function () {
		secretpage_vue.greetuser = "You are not logged in.";
		secretpage_vue.ajaxdata = "";		
		wasinitalreadycalled = false;
	}

	
	/*
	new Vue({
	el : "#firstform",
	data : {
		submitted : false,
		uiverbosity : v.uiverbosity
	},
	methods : {
		formsend : function (e) {this.submitted = true;
			this.$validator.validateAll().then((res) => { 
				if (res){
					c(e.target);
					$(e.target).ajaxSubmit({
						url:"/formdata",
						method:"POST",
						error : (err) => c(err.status + " : " + err.statusText),
						success:  (response) =>  c(response)
					});
				}
			})
		} // formsend
	}
}); // vue object
		*/
}); // jquery init

