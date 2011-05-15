select = {
	btnTrans 		: '#btnTranstion',
	listContainer	: '.list-container'
}

function fadeWipe(){
	var global = {
		degreeOfFade	: 16,
		animDuration	: 1000,
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
		$(this).fadeTo(0, ($(select.listContainer).length - index - 2) / global.degreeOfFade)
			.css({zIndex : index})
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
	$(select.listContainer).live('bubbleUp', function(){
		//console.log($(this).prevAll().length);
		prevHeight = $(this).prev().height();
		
		if ($(this).height() != 0){
			$(this).height(Math.floor(prevHeight + global.fadeSizeMultiplier));
			
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
		//console.log($(this).nextAll().length);
		nextHeight = $(this).next().height();
		
		if ($(this).height() < $(this).parent().height()){
			$(this).height(Math.floor(nextHeight - global.fadeSizeMultiplier));
			
			//console.log($(this).next().height() - $(this).height())
			
			
			if (nextHeight >= $(this).parent().height() - 1){ // The "-1" is an ie fix.
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
	
	
	$(select.btnTrans).click(function(){
		if (global.isTransitioning)
			return;
		
		global.isTransitioning = true;
		
		if (!($(select.listContainer + ':first').attr('collapsed') == 'true')){
			
			$(select.listContainer).first().animate(
				{
					height : '0'
				}, 	
				{
					duration : global.animDuration, 
					easing : global.easing,
					step: function(){
						//console.log($(this).next().height() - $(this).height())
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
			
			$(select.listContainer).last().animate(
				{
					height : $(select.listContainer).parent().height()
				}, 	
				{
					duration : global.animDuration,
	 				easing : global.easing,
					step: function(){
						//console.log($(this).height() - $(this).prev().height())
						bubbleDown();
					},
					complete : function(){
						$(this).attr('collapsed', 'false');
						bubbleDown();
					}
				}
			);
		}	
	});
	
	function bubbleUp(){
		$(select.listContainer + ':eq(1)').trigger('bubbleUp');
	}
	
	function bubbleDown(){
		$(select.listContainer + ':last').prev().trigger('bubbleDown');
	}
}