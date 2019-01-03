	Array.prototype.pick = function() { return this[Math.floor(Math.random()*this.length)]; }
	Array.prototype.shuffle = function() {
		var currentIndex = this.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = this[currentIndex];
			this[currentIndex] = this[randomIndex];
			this[randomIndex] = temporaryValue;
		}
		return this;
	}

	var DEFAULT_COPY = "just\r\nstart\r\ntyping\r\n(enter & backspace work)";
	var copy = "";
	var copyColor = "#A53D18";
	var bgColor = "#ffe064";
	var bgColor2 = bgColor;
	var copyColors = new Array(copyColor); // to match the default load state
	$(window).keypress(function(e){
		if (e.which == 13) {
			copy += "\r\n";
			// add a new copy color
			copyColors.push(copyColor);
		}
		else if ((e.which >= 32 && e.which <=126))
		    	copy += String.fromCharCode(e.which).toUpperCase();
	    renderBun(copy);
		document.getElementById('mobileKeyboardKludge').value = "TAP HERE TO TYPE";
		if (e.which == 32) e.preventDefault();
	});		

	$(window).keydown(function(e) {
		if (e.which == 8) e.preventDefault();
	});

	$(window).keyup(function(e){
		if (e.which == 8 && copy.length > 0) {
			// remove a copy color if necessary
			if (copy.endsWith("\r\n"))
				copyColors.pop();		
			copy = copy.slice(0, -1);
			renderBun(copy);
		}
		document.getElementById('mobileKeyboardKludge').value = "TAP HERE TO TYPE";
	});		
	
	function renderBun(s) {
		var bunTopHTML = '<div id="bun-top" class="flow"><img src="images/bun-top.png" style="width:100%"></div>';
		var bunBottomHTML = '<div id="bun-bottom"><img src="images/bun-bottom.png" style="width:100%"></div>';
	    var lines = s.split("\r\n")
	    var copyHTML = ""
	    copyHTML += bunTopHTML;
	    copyHTML += "<div style='position:relative;top:-0.2em;'>";
	    for (var i=0; i<lines.length; i++) {
	    	var col = copyColors[i];
			copyHTML += '<span class="hsjs" style="color:' + col + '">'; 
			copyHTML += lines[i];
			copyHTML += '</span>';
	    }
	    copyHTML += "</div>";
	    copyHTML += bunBottomHTML;
	    $('#main').html(copyHTML);
	    $().hatchShow();
	    
	}

	var win;
	function renderImage() {
		html2canvas(document.getElementById("bun"),{backgroundColor:bgColor,allowTaint:true}).then(function(canvas) {
				//Canvas2Image.saveAsPNG(canvas, canvas.width, canvas.height);
				if (window.chrome) {
				    //win = window.open();
    					win.document.write('<iframe src="' + canvas.toDataURL('image/png')  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
				}
				else {
					location.href = canvas.toDataURL('image/png');
				}
		});
	}

	function keyboardFocus() {
		var $htmlOrBody = $('html, body');
		$htmlOrBody.scrollTop(0);
	}

	function randomizeColors() {
		var variation = ['default','pastel','soft','light','hard','pale'].pick();
		var hue = Math.floor(Math.random() * 361);
		var scheme = new ColorScheme;
  		scheme.from_hue(hue)        
        	.scheme('contrast')
		.distance(0.1)
	 	.variation(variation);

	  	var colors = scheme.colors();

		if (advMode) {
			if (Math.random() > 0.5) colors.shuffle();
			var bg1 = colors.pop();
			var bg2 = bg1;
			if (Math.random() > 0.5) bg2 = colors.pop();

			// Kludge for default copy
			if (copy.length <= 0) {
				copy = DEFAULT_COPY;
				copyColors = new Array(copyColor,copyColor,copyColor,copyColor);
			}

			var textCol = colors.pop(); 		
			for (var i=0;i<copyColors.length;i++) {
				copyColors[i] = textCol;
				if (Math.random() > 0.6 && colors.length>0) textCol = colors.pop();
			}
		
			updateBGColor('#'+bg1);
			updateBGColor2('#'+bg2);
			//updateTextColor('#'+textCol);
			//updateTextColor2('#'+textCol);

			document.getElementById('bgColorPicker').jscolor.fromString('#'+bg1);
			document.getElementById('bgColorPicker').jscolor.fromString('#'+bg2);
			document.getElementById('textColorPicker').jscolor.fromString('#'+textCol);
			document.getElementById('textColorPicker2').jscolor.fromString('#'+textCol);
			
			renderBun(copy);
			// Reset for the default 
			if (copy == DEFAULT_COPY) {
				copy = "";
				copyColors = new Array(textCol);
			}
			copyColor = textCol;
		}
		else {
			colors.shuffle();
			var bg = colors.pop();
			var tx = colors.pop();
			document.getElementById('bgColorPicker').jscolor.fromString('#'+bg);
			document.getElementById('textColorPicker').jscolor.fromString('#'+tx);
			updateBGColor('#'+bg);
			updateTextColor('#'+tx);
		
			/*
			var offset1 = Math.floor(Math.random() * 4);
			var offset2 = Math.floor(Math.random() * 4);
			var offset3 = Math.floor(Math.random() * 3);
			var start1 = 0;
			var start2 = 4;
			if (Math.random() > 0.5) {
				start1 = 4;
				start2 = 0;
			}
			document.getElementById('bgColorPicker').jscolor.fromString('#'+colors[start1+offset1]);
			document.getElementById('textColorPicker').jscolor.fromString('#'+colors[start2+offset1]);
			updateBGColor('#'+colors[start1+offset1]);
			updateTextColor('#'+colors[start2+offset1]);
			*/
		}
	}
	
	function updateBGColor(color) {
		bgColor = color;
		$('mobileKeyboardKludge').css('color',color);
		document.getElementById('bun').style.removeProperty('background-color');
		document.getElementById('bun').style.removeProperty('background');
		$('body').css('background-color', color);
		$('bun').css('background',color);
		$('bun').css('background-color', color);
		document.getElementById('containerTop').style.background = color; 
		document.getElementById('bgColorPicker2').jscolor.fromString('#'+color);
		document.getElementById('bgColorPicker2').innerHTML="ADD BACKGROUND GRADIENT";
		document.getElementById('bgColorPicker').innerHTML="CHOOSE BACKGROUND COLOR";
	}

	function updateBGColor2(color) {
		if (bgColor != color) 
			document.getElementById('bgColorPicker2').innerHTML="CHOOSE BACKGROUND GRADIENT";
		document.getElementById('bgColorPicker').innerHTML="RESET BACKGROUND COLOR";
		bgColor2 = color;
		var cssText = "";
		//cssText += '-linear-gradient(to-bottom, ' + bgColor + ' 0%, ' + bgColor2 + ' 100%);'; 
		cssText += '-webkit-linear-gradient(top, ' + bgColor + ' 0%, ' + bgColor2 + ' 100%)'; 
		//cssText += '-moz-linear-gradient(top, ' + bgColor + ' 0%, ' + bgColor2 + ' 100%);'; 
		document.getElementById('bun').style.background = cssText; 
		document.getElementById('containerTop').style.background = cssText; 
		document.getElementById('bun').style.filter = 'progid:DXImageTransform.Microsoft.gradient( startColorstr="'+bgColor+'", endColorstr="'+bgColor2+'",GradientType=0'; 
		document.getElementById('containerTop').style.filter = 'progid:DXImageTransform.Microsoft.gradient( startColorstr="'+bgColor+'", endColorstr="'+bgColor2+'",GradientType=0'; 
		document.body.style.backgroundColor = bgColor2; 
	}

	function updateTextColor(color) {
		copyColor = color;
		for (i=0;i<copyColors.length;i++)
			copyColors[i] = color;
		$('.hsjs').css("color",color);
		document.getElementById('textColorPicker2').jscolor.fromString('#'+color);
	}
	
	function updateTextColor2(color) {
		copyColor = color;
		copyColors[copyColors.length-1] = color;
		if (copy.length > 0) renderBun(copy);
	}
	
	var advMode = false;
	function changeMode() {
		if (!advMode) {
			$('.advanced').show();
			document.getElementById('modeButton').innerHTML="<span class='emoji'>&#x1F308</span> BASIC MODE";
			document.getElementById('textColorPicker').innerHTML="RESET TEXT COLOR";
		}
		else {
			$('.advanced').hide();
			document.getElementById('modeButton').innerHTML="<span class='emoji'>&#x1F525</span> EXTRA TOPPINGS";
			document.getElementById('bgColorPicker').innerHTML="CHOOSE BACKGROUND COLOR";
			document.getElementById('textColorPicker').innerHTML="CHOOSE TEXT COLOR";
		}
		advMode = !advMode;
	}
	
	$(window).load(function(){
		if (/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)){$('.mobileShow').css('display','block');}
	  	$().hatchShow();
	});		
	$(window).resize(function(){
	  	$().hatchShow();
	});
	jQuery.fn.hatchShow = function(){
	  $('.hsjs').css('display','inner-block').css('white-space','pre').each(function(){
		var t = $(this);
		var l = t.html().length;
		if (l > 0)
		{
			var lineHeight = 0.8;
			if (l > 8)
				lineHeight = 0.9;
			t.wrap("<span class='hatchshow_temp' style='display:block;line-height:" + lineHeight + "'>");
			var pw = t.parent().width();
			var lastF = 0;
			while( t.width() < pw ){lastF = t.fontSize();t.css('font-size', (t.fontSize()+1)+"px"),
			  	function(){while( t.width() > pw ){t.css('font-size', (t.fontSize()-.1)+"px")}};
				if (lastF == t.fontSize()) {t.html("error: bunification failed.");break;}
			};
			while( t.width() > pw ){t.css('font-size', (t.fontSize()-1)+"px"),
			  function(){while( t.width() > pw ){t.css('font-size', (t.fontSize()+.1)+"px")}};
			};
		}
	  }).css('visibility','visible');
	};
	jQuery.fn.fontSize = function(){return parseInt($(this).css('font-size').replace('px',''));};