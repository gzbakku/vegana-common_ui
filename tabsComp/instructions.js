

// dont use tabsComp touch on desktop just gives you performance penalty for very little beenfist
// dont use for long scolling objects like content wall only use for limited usage pages like settings or control panel where user wont spend much time
// dont use more then 10,000 items in tab div

const tabBuilder = engine.ui.getComp("commonUi","tabsComp").init(compId,{
  navigator:tabs,         //id of div where buttons will be made in
  router:router,          //router where tab body will be made in
  touch_controls:true,    //default is false  //should only be used on mobile platforms where touch is enabled
  tabs:[
    //tab button with both icon and tag
    {tabname:'one',tag:'one',icon:'assets/images/home.png'},
    {tabname:'two',tag:'two',icon:'assets/images/home.png'},
    {tabname:'three',tag:'three',icon:'assets/images/home.png'},
    {tabname:'four',tag:'four',icon:'assets/images/home.png'},
    {tabname:'five',tag:'five',icon:'assets/images/home.png'},
    //^^^^^^
    //tabname is unique div names for you to draw tab body in

    //only icon
    {tabname:'one',icon:'assets/images/home.png'},
    {tabname:'two',icon:'assets/images/home.png'},
    {tabname:'three',icon:'assets/images/home.png'},
    {tabname:'four',icon:'assets/images/home.png'},
    {tabname:'five',icon:'assets/images/home.png'},

    //only tag
    {tabname:'one',tag:'one'},
    {tabname:'two',tag:'two'},
    {tabname:'three',tag:'three'},
    {tabname:'four',tag:'four'},
    {tabname:'five',tag:'five'},

  ]
});

//sample - returns divs you can make tab bodies in
                 //.................
for(let tabname in tabBuilder.router){
  let tab = builder.router[tabname];
  testComp.init(tab,{name:tabname});
}

//----------------------------------
// this returns a onject
const result = {
  id:"someid",
  router:["div ids"],
  to:(tabname)=>{/*will route to tab*/}
};

result.to("one");
