// if no data object is provided integration is the default method to access loader comp

//this will show a round float button with given type
engine.ui.getComp("commonUi","floatsComp").init(pageId,{
  buttons:[
    {type:'settings',function:()=>{}},
  ]
});

//this will show a round float button with given icon
engine.ui.getComp("commonUi","floatsComp").init(pageId,{
  buttons:[
    {icon:'assets/images/home.png',function:()=>{}},
  ]
});

//if tag is used a round float button will be created
engine.ui.getComp("commonUi","floatsComp").init(pageId,{
  buttons:[
    {type:'settings',tag:'settings',function:()=>{}},
  ]
});

// if multiple arguments is provided floats will use a options box and a round menu float button will be created
engine.ui.getComp("commonUi","floatsComp").init(pageId,{
  buttons:[
    {icon:'assets/images/home.png',tag:'home',function:()=>{}},
    {type:'menu',tag:'menu',function:()=>{engine.global.function.menu().toggle()}},
    {type:'new',tag:'new-d',function:()=>{}},
    {type:'settings',tag:'set-d',function:()=>{}},
    {type:'edit',tag:'edit-d',function:()=>{}},
    {type:'delete',tag:'del-d',function:()=>{}},
  ]
});
