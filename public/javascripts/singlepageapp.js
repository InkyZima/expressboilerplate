/*
menu and subpages: singelpageapp.jade file defines the subpages (i.e. which jades get imported in the #main block)
menu builds itself from the children of #main (cf. v.pages)
global v object keeps track of active subpage, of loggedin state

TODO certain menu points to be only visible when logged in, or depending on user (loggedin) role
*/
const c = console.log;
const ct = console.trace;

// load form validation plugin
Vue.use(VeeValidate ,{
	locale:'de',
	dictionary: {
		de : {messages: locale_messages_de}
	}
	});

// global vue obj
var v = {};

// init schemas colletion object
var schemas = {};
// init ajax server communication constructors
var InputFormVueObject;

$(function () {
	
	// #menu positioning
	
	positionmenu();
	$("#hamburger").css("z-index","auto");
	$("#hamburger").on("click", () => {
		$("#menu").toggle(); 
		if(window.innerWidth > 1465) positionmenu();
		else {
			positionmenu(true);
			$("#hamburger").toggleClass("change");
		}
	});
	$(window).resize(() => {
		if (window.innerWidth > 1465) positionmenu();
	});
		
	
	// get validation schemas
	// unused for now
	/*
	$.ajax({
		url : "/schemas",
		method : "GET",
		dataType:"json",
		error : (err) => {
			let errtext = "schemas: " + err.status + " (" + err.statusText + "): " + err.responseText;
			c(errtext);
			alert(errtext);
		},
		success:  (data) => {
			schemas = data;
		}
	});
	*/
	
	// global vue object
	v = new Vue({
		data : {
			
			// UI verbosity
			uiverbosity : 0,
			// menu init
			// pages = {subpage1 : {menuid , title, active},...}
			pages : (() => { var temp = {};
				$("#main").children().each(function() {
					temp[$(this).attr("id")] = { 
						menuid: $(this).attr("id") + "_menu", 
						title: $(this).attr("title"), 
						active:false,
						init : function () {},
						reset : function () {}

					};
				
				});
				return temp;
				})(),
			test : false,
			currentlyactivesub : $("#main").children(".visible")[0].id,
			loggedin : false,
			loggedin_as : null,
			basket : {}
		}
	}); // v.main


	new Vue({
		el:'#menu',
		data : {
			// menu init
			pages : v.pages
		},
		computed : {
			loggedin : () => {return v.loggedin},
			loggedin_as : () => {return v.loggedin_as}

		},
		methods: {
			// click on menu link
			toggle: (el) => {
				var getid = el.target.id.substr(0,el.target.id.indexOf("_menu"));
				$("#"+v.currentlyactivesub).toggle();
				v.currentlyactivesub = getid;
				$("#"+v.currentlyactivesub).toggle();
				// tell the subpage its time for action
				v.pages[getid].init();
				
			},
			loginsubmit : function (e) {
				this.submitted = true;
				let ajaxposturl = "/login";
				this.$validator.validateAll().then((res) => { 
					if (res){
						c(e.target);
						$(e.target).ajaxSubmit({
							url:ajaxposturl,
							method:"POST",
							error : (err) => {
								let errtext = ajaxposturl + ": " + err.status + " (" + err.statusText + "): " + err.responseText;
								c(errtext);
								alert(errtext);
							},
							success: (data, status, xhr) => {
									v.loggedin = true;
									v.loggedin_as = data.user;
									c(data.user);
									// need to reload pages which have loggedin as condition
									// for pages that dont: they wont do anything (internally) so its ok
									v.pages[v.currentlyactivesub].init();
								}
						})
					} // if
				})
			}, // loginsubmit
			logoutsubmit: function (e) {
				this.submitted = true;
				$.ajax({
					url:"/logout",
					method:"GET",
					error : (err) => {
						let errtext = err.status + ": " + err.responseText;
						alert(errtext);
					},
					success: (data, status, xhr) => {
							v.loggedin = false;
							v.loggedin_as = null;
							// need to reload pages which have loggedin as condition
							// for pages that dont: they wont do anything (internally) so its ok
							v.pages[v.currentlyactivesub].reset();
						}
				}) // ajax
			} // logoutsubmit
		} // methods
		
	}); // vue object
	
	new Vue({
		el: "#footer",
		data: {
			restaurants : [ 
			"first restaurant",
			"second restaurant"
			]
		}, // data
		methods: {
			restaurants_create_ajax : (e) => {
				// TODO validation of data before sending via ajax
				var ajaxdataobj = "test data";
				$.ajax({
					method:"POST",
					url:"/restaurants/create",
					data: ajaxdataobj	
				}).done( (msg) => {$("body").append(msg)}).fail(() => {}).always(() => {});
			}, // sendsuggestion
			restaurants_list_ajax : (e) => {
				c("asdf")
			}
		} // methods
	}); // vue object
	
	/** ajax server communication constructors **/
	// constructor for form-handling vue objects with validation
	InputFormVueObject = function (vueel, ajaxposturl, successfunct) {
	var newvueobj = new Vue({
		el : vueel,
		data : {
			submitted : false,
			uiverbosity : v.uiverbosity
		},
		methods : {
			formsubmit : function (e) {this.submitted = true;
				this.$validator.validateAll().then((res) => { 
					if (res){
						c(e.target);
						$(e.target).ajaxSubmit({
							url:ajaxposturl,
							method:"POST",
							error : (err) => {
								let errtext = ajaxposturl + ": " + err.status + " (" + err.statusText + "): " + err.responseText;
								c(errtext);
								alert(errtext);
							},
							success:  successfunct
						});
					}
				})
			} // formsubmit
		}
	}); // vue object
	return newvueobj;
	} // function
	
	// check if logged in 
	function checklogin () {
		$.ajax({
			url : "/checklogin",
			method: "GET",
			error  : (err) => c(err.status + " :" + err.responseText),
			success : (data, status, xhr) => {
				v.loggedin = true;
				v.loggedin_as = data.user;
				c("logged in ")
			}
		});
	}
	checklogin();
	
	/** helper functions**/
	
	function positionmenu(hiddenform) {
		$("#menu").position({
			of:"#stickynav",
			at: hiddenform ? "left bottom" : "left-135px bottom",
			my:hiddenform ? "left top" : "top"
		});
	}
}); // jquery init