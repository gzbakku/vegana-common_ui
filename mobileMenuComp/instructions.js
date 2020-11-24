

engine.ui.getComp("commonUi","menuComp").init(pageId,{
  integrate:true, //default is false
  globalFunctionName:'menu',  //default is menu
  only_body:true,         //default is false,you draw menu yourself in a body div above buttons div in menu slider
  buttons:[               //buttons can also be used with body
    {
      icon:'assets/images/logo.png',
      tag:'home',
      function:(menuController)=>{console.log('home');}
    },
    {
      tag:'joker',
      function:()=>{console.log('joker');}
    },
    {
      tag:'akku',
      function:()=>{console.log('akku');}
    },
  ]
});

// this returns a object
//result

{
  main:main,      //div
  menu:menu,      //div
  buttons:buttons,//div
  body:body,      //div
  functions:{               //++++ this is the menu controller this is passed as a object in integrated mode via the global menu call
    open:open,      //function
    close:close,    //function
    remove:remove,  //function
    toggle:toggle,  //function
  }
}
