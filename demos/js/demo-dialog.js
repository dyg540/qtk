
function createDialog(app, x, y, w, h) {
	var dialog = qtk.Dialog.create();
	dialog.init(app, x, y, w, h, true);
	dialog.set({z:200, scaleX:0, scaleY:0}); 
	dialog.scaleTo(1, 1, 300);
	dialog.childrenLayouter = qtk.SimpleLayouter.create();
	
	var button = qtk.Button.create();
	button.text = "Close";
	button.layoutParam = qtk.SimpleLayouterParam.create("center", "middle", "200", "60");
	dialog.addChild(button);
	
	button.on(qtk.Events.CLICK, function(evt) {
		dialog.scaleTo(0, 0, 300).onComplete(function() {
			dialog.close();
		});
	});
	
	dialog.grab();
	return dialog;
}

function onReady(app) {
	var TWEEN = qtk.TWEEN;
	var vp = app.getViewPort();
	var win = qtk.WindowNormal.create();
	win.init(app, 0, 0, vp.width, vp.height, true);
	win.childrenLayouter = qtk.SimpleLayouter.create();
	win.z = 100;

	var button = qtk.Button.create();
	button.text = "Open Dialog";
	button.layoutParam = qtk.SimpleLayouterParam.create("25%", "25%", "50%", "50%");
	button.on(qtk.Events.CLICK, function(evt) {
		createDialog(app, 10, 10, 300, 300);
	});
	win.addChild(button);
}