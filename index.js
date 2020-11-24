const comps = {
	"alertComp":require("./alertComp/comp.js"),
	"floatsComp":require("./floatsComp/comp.js"),
	"loaderComp":require("./loaderComp/comp.js"),
	"mobileMenuComp":require("./mobileMenuComp/comp.js"),
	"tabsComp":require("./tabsComp/comp.js"),
};

engine.ui.add("commonUi",comps);