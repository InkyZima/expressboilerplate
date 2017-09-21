
var vfirstform = {};
$(function() {
	vfirstform = InputFormVueObject("#firstform","/formdata", (response) => {c("server says everything's fine " + response)});
	
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

