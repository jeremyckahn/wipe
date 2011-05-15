fwSelect = {};


$.fn.fadeWipe = function(){
	fwSelect.element = this.selector;	
	
	var global = {
		degreeOfFade	: 12,
		animDuration	: 2000,
		isTransitioning : false,
		easing			: 'swing',
		startCollapsed	: false,
		fadeSizeMultiplier : 2
	};
	
	// Fudged the math here to make it look right
	global.trailOffDur = (1000 / ($(select.listContainer).height() / (global.fadeSizeMultiplier * 2)))
	
	// Add all of the layers of the element to fade
	for (this.i = 0; this.i < global.degreeOfFade; this.i++){
		$(select.listContainer).parent().append($(select.listContainer + ':first').clone())
	}
	
	// Fade every element on the stack except for the topmost item
	$(select.listContainer + ':gt(0)').each(function(index){
		$(this).fadeTo(0, ($(select.listContainer).length - index - 1) / global.degreeOfFade)	
	});
	
	// Set some necessary styles
	$(select.listContainer)
		.css({position : 'absolute'})
		.attr('collapsed', global.startCollapsed.toString())
		.parent()
			.css({height : $(select.listContainer).height()})
			.css({width : $(select.listContainer).width()})
			.css({position : 'relative'});
			
	// Would have set this in the above block, but it's reading the parent height before setting
	// it that way... so I did it here.
	$(select.listContainer).height((global.startCollapsed ? 0 : $(select.listContainer).parent().height()))
	
	// The bubbleUp and bubbleDown events handle the trailing "tail" once the element is nearly done transitioning
	this.live('bubbleUp', function(){
		
		prevHeight = $(this).prev().height();
		
		if ($(this).height() != 0){
			$(this).height(prevHeight + global.fadeSizeMultiplier);
			
			if (prevHeight == 0){
				$(this).animate(
					{
						height : '0'
					}, 	
					{
						duration : global.trailOffDur, 
						easing : global.easing,
						complete : function(){
							$(this).next().trigger('bubbleUp');
							$(this).attr('collapsed', 'true');
							
							if ($(this).nextAll().length == 0){
								global.isTransitioning = false
							}
						}
					}
				);	
			} 			
			$(this).next().trigger('bubbleUp');
		}
		
	})
	.live('bubbleDown', function(){
		
		nextHeight = $(this).next().height();
		
		if ($(this).height() < $(this).parent().height()){
			$(this).height(nextHeight - global.fadeSizeMultiplier);
			
			if (nextHeight >= $(this).parent().height()){
				$(this).animate(
					{
						height : $(this).parent().height()
					}, 	
					{
						duration : global.trailOffDur, 
						easing : global.easing,
						complete : function(){
							$(this).prev().trigger('bubbleDown');
							$(this).attr('collapsed', 'false');
							
							if ($(this).prevAll().length == 0){
								global.isTransitioning = false;
							}
						}
					}
				);	
			} 			
			$(this).prev().trigger('bubbleDown');
		}
	});
	
	this.transition = function(){
		
		if (global.isTransitioning)
			return;
		
		global.isTransitioning = true;
		
		if (!($(this).first().attr('collapsed') == 'true')){
			
			this.first().animate(
				{
					height : '0'
				}, 	
				{
					duration : global.animDuration, 
					easing : global.easing,
					step: function(){
						bubbleUp();
					},
					complete : function(){
						$(this).attr('collapsed', 'true');
						bubbleUp();
					}
				}
			);
		}
		else{
			
			$(this).last().animate(
				{
					height : $(this).parent().height()
				}, 	
				{
					duration : global.animDuration,
	 				easing : global.easing,
					step: function(){
						bubbleDown();
					},
					complete : function(){
						$(this).attr('collapsed', 'false');
						bubbleDown();
					}
				}
			);
		}	
	};
	
	return this;
}

function bubbleUp(selector){
	$(fwSelect.element).eq(1).trigger('bubbleUp');
}

function bubbleDown(selector){
	$(fwSelect.element).last().prev().trigger('bubbleDown');
}