
function onReady(app) {
	var TWEEN = qtk.TWEEN;
	var vp = app.getViewPort();
	var win = qtk.WindowNormal.create();
	win.init(app, 0, 0, vp.width, vp.height, true);
	win.childrenLayouter = qtk.SimpleLayouter.create();

	var button = qtk.Button.create();
	button.name = "button1";
	button.layoutParam = qtk.SimpleLayouterParam.create("25%", "10px", "50%", "60px");
	win.addChild(button);
	button.on(qtk.Events.CLICK, function(evt){
		console.log("click:" + button.name);
		image.moveTo(0, 0, 1000).onComplete(function() {
			console.log("done");			
		}).easing(TWEEN.Easing.Quadratic.In);;
	});


	var button = qtk.Button.create();
	button.styleType = "button-blue";
	button.name = "button2";
	button.layoutParam = qtk.SimpleLayouterParam.create("-240px", "90px", "200px", "60px");
	button.text = "OK";
	win.addChild(button);
	
	var image = qtk.Image.create();
	image.name = "image1";
	image.layoutParam = qtk.SimpleLayouterParam.create("25%", "25%", "50%", "50%");
	image.value = "/www/test.jpg";
	image.drawType = qtk.ImageDrawType.DEFAULT; 
	win.addChild(image);
	
	button.on(qtk.Events.POINTER_DOWN, function(evt){
		console.log("pointer down:" + button.name);
	});
	button.on(qtk.Events.POINTER_UP, function(evt) {
		console.log("pointer up:" + button.name);
	});
	
	button.on(qtk.Events.CLICK, function(evt) {
		evt.stopPropagation();
		console.log("click:" + button.name);
		image.moveTo(400, 400, 1000).onComplete(function() {
			console.log("done");			
		}).easing(TWEEN.Easing.Quadratic.Out);;
	});

	win.on(qtk.Events.POINTER_UP, function(evt) {
		console.log("pointer up:" + win.name);
	});
	win.on(qtk.Events.POINTER_UP, function(evt) {
		console.log("pointer up capture:" + win.name);
	}, true);


	app.mainLoop.requestRedraw();


	//image.scaleTo(2, 2, 2000).repeat(5).yoyo(true).onComplete(function() {
	//	console.log("done");			
	//});
	//image.pivotX = 0.5;
	//image.pivotY = 0.5;
	image.rotateTo(Math.PI, 2000).repeat(2).yoyo(true).easing(TWEEN.Easing.Quadratic.In);
}

