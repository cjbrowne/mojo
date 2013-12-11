define("Panel",["Element"],function(Element) {
	var Panel = function() {};
	Panel.prototype = new Element();
	Panel.prototype.layout = null;
	return Panel;
});