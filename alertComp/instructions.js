// if no data object is provided integration is the default method to access loader comp

engine.ui.getComp("commonUi","alertComp").init(pageId,{
  message:'this is a test alert', //message is required
  buttons:[     //buttons are optional
    {value:'edit',function:(e)=>{console.log('edit');}},
    {value:'ok',function:(e)=>{e.close();}},
  ]
});
