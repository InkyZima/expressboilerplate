/* all ajax calls for communication to server */
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
// init ajax server communication constructors
var InputFormVueObject;

$(function () {
	
	
	// global vue object
	v = new Vue({
		data : {
			
			// UI verbosity
			uiverbosity : 0,
			// menu init
			pages : (() => { var temp = {};
				$("#main").children().each(function() {
					temp[$(this).attr("id")] = { 
						menuid: $(this).attr("id") + "_menu", 
						title: $(this).attr("title"), 
						active:false
					};
				
				});
				return temp;
				})(),
			test : false,
			currentlyactivesub : "init"
		}
	}); // v.main


	new Vue({
		el:'#menu',
		data : {
			// menu init
			pages : v.pages
		},
		methods: {
			toggle: (el) => {
				var getid = el.target.id.substr(0,el.target.id.indexOf("_menu"));
				$("#"+v.currentlyactivesub).toggle();
				v.currentlyactivesub = getid;
				$("#"+v.currentlyactivesub).toggle();
				
				}
		}
		
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
	// constructor for form-handling vue objects
	InputFormVueObject = function (vueel, ajaxposturl, successfunct) {
	newvueobj = new Vue({
		el : vueel,
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
							url:ajaxposturl,
							method:"POST",
							error : (err) => c(err.status + " : " + err.statusText),
							success:  successfunct
						});
					}
				})
			} // formsend
		}
	}); // vue object
	return newvueobj;
	} // function

}); // jquery init

