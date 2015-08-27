var globalnaviXml = {};
var globalnavi = {};
var jsFiles = [];

jQuery(function($){
	//searchform place holder
	(function(){
		var placeholder = {
			init: function(formId, attrs){
				if(attrs.length > 0 && attrs!=undefined && $('#'+formId).is('form')){
					placeholder.addValues(formId, attrs);
					placeholder.focus(formId, attrs);
					placeholder.blur(formId, attrs);
					placeholder.submit(formId, attrs);
				}
			},
			addValues: function(formId, attrs){
				$('#'+formId).addClass('no-submitform');
				for(var x=0; x<attrs.length; x++ ){
					var input = $('#'+formId+' '+'#'+attrs[x].id);
					input.attr('value',attrs[x].value);
					input.addClass('placeholder');
					input.addClass('no-submit');
				}
			},
			focus: function(formId, attrs){
				$('#'+formId+' '+'.'+'placeholder').focus(function(){
					var target = $(this);
					for(var x=0; x<attrs.length; x++ ){
						if(target.attr('id')==attrs[x].id && target.val()==attrs[x].value){
							target.val('');
							target.removeClass('no-submit');
							target.parent().removeClass('no-submitform');
							break;
						}else if(target.attr('id')==attrs[x].id && target.val()!=attrs[x].value &&  target.val()!=''){
							target.removeClass('no-submit');
							target.parent().removeClass('no-submitform');
							break;
						}
					}
				});
			},
			blur: function(formId, attrs){
				$('#'+formId+' '+'.'+'placeholder').blur(function(){
					var target = $(this);
					for(var x=0; x<attrs.length; x++ ){
						if(target.attr('id')==attrs[x].id && target.val()===""){
							//target.attr('value', attrs[x].value);
							target.addClass('no-submit');
							target.parent().addClass('no-submitform');
							target.val(attrs[x].value);
							break;
						} else {
							target.removeClass('no-submit');
							target.parent().removeClass('no-submitform');
						}
					} 
				});
			},
			submit: function(formId, attrs){
				var form, valid;
				form = $('#'+formId);
				form.submit(function(){
					var target = $(this).find('.placeholder');
					if(form.children().hasClass('no-submit') || target.val()==""){
						return false;
					}
					return true;
				});
			}
		}
		var blurTxt = $('#searchformhead label').text();
		placeholder.init('searchformhead',
			[{
				id:'s',
				value: blurTxt
			}]
		);
		var searchFormPlaceholderValue = $('#searchPageForm #sp').val();
		placeholder.init('searchPageForm',
			[{
				id:'sp',
				value:searchFormPlaceholderValue
			}]
		);
	})();
});
