// if no data object is provided integration is the default method to access loader comp

//for integrated
engine.ui.getComp("commonUi","loaderComp").init(pageId,{
  globalFunctionName:'loader',      //default global function name is loader
  text:'this is a loader',          //dafault text is "loading ..."
  integrate:true,                    //this will integrate loader functions into a vegana global function default is false
  show:false, //alternative hide:true
});


//see what they do below
engine.global.function.loader().show();
engine.global.function.loader().say("yellow");
engine.global.function.loader().hide();

//non integrated approch
const loader = engine.ui.getComp("commonUi","loaderComp").init(pageId,{
  text:'1 min left',
});

//same as global loader controller functions
loader.show("nothing");   //show can take text as input and changed loader text to it, if no input is provided default is "Loading ..."
loader.say("something");  //say will change the loader text for current loader session
loader.hide();            //as it saya it just hides the loader
loader.remove();          //this removes the loader main div loader will not be functioning after you call tihs function
