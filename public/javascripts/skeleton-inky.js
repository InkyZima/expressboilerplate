$(function() {
	return ;
	const c = console.log;
	$("#nav-menu").hover(() => {
		$("#nav-body").css("display","block");
	},() => {
		setTimeout(() => {
			if (!$("#nav-body").is(":hover")){
				$("#nav-body").css("display","block");
				$("#nav-body").removeAttr("display","block");				
			}
		},100);
		
	});
}); // init