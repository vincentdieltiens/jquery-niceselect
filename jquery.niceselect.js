(function($){

	$.fn.niceselect = function(opts)
	{
		var options = $.extend({}, $.fn.niceselect.defaults, opts);
		
		return this.each(function(){
			
			if( !$(this).is('select') ) {
				throw new Exception("the jQuery niceselect plugin must be applied on select elements");
			}
			
			var $select = $(this);
			
			var $itemSelected = $select.children(':selected').html();
			
			
			
			var $label_div = $('<button />').addClass(options.labelClass).html('<span>'+$itemSelected+'</span>');
			
			$select.before($label_div);
			
			var $choices_ul = $('<ul />').addClass(options.optionsClass);
			$select.children().each(function(){
				var $option = $(this);
				var $li = $('<li />').attr('rel', $option.attr('value')).html($option.html());
				
				if( $option.attr('selected') ) {
					$li.addClass('selected');
				}
				
				$choices_ul.append($li);
			});
			$label_div.append($choices_ul);
			$choices_ul.hide();
			$select.css({
				position: 'absolute',
				left: '-2000px'
			});
			
			$label_div.click(function(){
				$label_div.children('ul').toggle();
				return false;
			});
			
			$select.bind('change', function(){
				
				$choices_ul.children('.selected').removeClass('selected');
				
				var $selectedItem = $(this).children(':selected');
				
				$choices_ul.children('[rel='+$selectedItem.attr('value')+']').addClass('selected');
				
				$label_div.children('span').html($selectedItem.html());
			});
			
			$choices_ul.children('li').click(function(){
				var val = $(this).attr('rel');
				$select.children('[value='+val+']').attr('selected', true);
				$select.trigger('change');
				
				$choices_ul.children('.selected').removeClass('selected');
				
				$(this).addClass('selected');
				$label_div.children('span').html($(this).html());
				$(this).parent('ul').hide();
				return false;
			});
			
			$(window).bind('click', function(){
				$label_div.children('ul').hide();
			});
		});
	};
	
	$.fn.niceselect.defaults = {
		labelClass: 'niceselect_label',
		optionsClass: 'niceselect_options'
	};

})(jQuery);