(function($){

  $.fn.niceselect = function(opts)
  {
    var options = $.extend({}, $.fn.niceselect.defaults, opts);
    
    return this.each(function(){
      
      if( !$(this).is('select') ) {
        throw new Exception("the jQuery niceselect plugin must be applied on select elements");
      }
      
      var $select = $(this);
      new Select($select, options);
      
      /*var $itemSelected = $select.children(':selected').html();
      
      
      
      var $label_div = $('<div />').addClass(options.labelClass).html('<span>'+$itemSelected+'</span>');
      
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
        $(this).children('ul').toggle();
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
      });*/
    });
  };
  
  function Select($select, options) {
    this.$select = $select;
    this.options = options;
    this.$fakeSelect = $('<div />');
    this.$fakeSelectOptions = $('<ul />');
    
    this.init();
  }
  
  Select.prototype = {
    init: function() {
      var self = this;
      
      // Get the selected item in the real select
      var $selectedItem = this.selectedItem();
      
      // Get the id of the select or create one 
      var realSelectId = this.$select.attr('id');
      if( realSelectId == undefined || realSelectId == '' ) {
        realSelectId = 'select_'+time();
        this.$select.attr('id', realSelectId);
      }
      
      // Create the fake Select using a div containing the label as a "<span>" and
      // the options as a "<ul>" and </li>
      this.$fakeSelect
        .html('<span>'+$selectedItem.html()+'</span>')
        .addClass(this.options.labelClass)
        .attr('id', realSelectId+'_fakeselect');
      
      
      // Sets the options of the list
      this.$fakeSelectOptions.addClass(this.options.optionsClass);
      this.$fakeSelectOptions.attr('id', realSelectId+'_fakeselect_options');
      this.$select.find('option').each(function(){
        var $option = $(this);
        var $li = $('<li />').attr('rel', $option.attr('value')).html($option.html());
        
        if( $option.attr('selected') ) {
          $li.addClass('selected');
        }
        
        self.$fakeSelectOptions.append($li);
      });
      
      // Hide the options
      this.hideOptions();
      
      // Add the fake select in the page
      this.$select.after(this.$fakeSelect);
      this.$fakeSelect.after(this.$fakeSelectOptions);
      
      // Ensure size
      this.$fakeSelect.css({
        'min-width': this.$select.width(),
        'min-height': this.$select.height(),
      });
      
      this.$select.width(this.$fakeSelect.width());
      
      // Update the position and size of the list of options
      this.$fakeSelect.css({
        'position': 'absolute',
        'left': this.$select.position().left,
        'top': this.$select.position().top,
      });
      
      this.$fakeSelectOptions.css({
        'position': 'absolute',
        'top': this.$fakeSelect.position().top + this.$fakeSelect.height()/2,
        'left': this.$fakeSelect.position().left
      });
      
      // Change the tabindex attributes so that is the fake list is at the
      // same index of the real select
      this.$fakeSelect.attr('tabindex', this.$select.attr('tabindex'));
      this.$select.attr('tabindex', -1);
      
      // Handler to display the list of options when clicking on the list
      this.$fakeSelect.click(function(){
        
        $('#'+$(this).attr('id')+'_options').show();
        
        // Close the list of options when escape is down
        $(window).keydown(function(e){
          if( e.keyCode == 27 ) { // ESC
            $('#'+self.$fakeSelect.attr('id')+'_options').hide();
          }
        });
        
        $(window).bind('mousedown', self.hideOptions);
        
        return false;
      });
      
      // Handler to update the fake select when the real is updated
      this.$select.change(function() {
        var val = $(this).val();
        var label = $(this).children(':selected').html();
        self.$fakeSelect.children('span').html(label);
        
        self.$fakeSelectOptions.find('.selected').removeClass('selected');
        self.$fakeSelectOptions.find('[rel='+val+']').addClass('selected');
      });
      
      // Handler to update the real select when the user choose an item
      // in the list of options
      this.$fakeSelectOptions.children('li').click(function(){
        
        $(this).parent('ul').hide();
        
        self.$select.val($(this).attr('rel'));
        self.$select.trigger('change');
      });
      
      this.$fakeSelect.keydown(function(e){
        
        if( e.keyCode == 32 ) { // space bar
          $('#'+$(this).attr('id')+'_options').show();
        }
      });
      
      
    },
    select: function() {
      
    },
    selectedItem: function() {
      return this.$select.children(':selected');
    },
    val: function() {
      return this.selectedItem().val();
    },
    label: function() {
      return this.selectedItem().html();
    },
    hideOptions: function() {
      $(window).unbind('mousedown', this.hideOptions);

      this.$fakeSelectOptions.hide();
    },
    showOptions: function() {
      this.$fakeSelectOptions.show();
    }
  };
  
  $.fn.niceselect.defaults = {
    labelClass: 'niceselect_label',
    optionsClass: 'niceselect_options'
  };

})(jQuery);