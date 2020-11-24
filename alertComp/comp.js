//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-alertComp';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid,data) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  return build(data);                      //start build you can also start fetch here.

}

function build(data){

  if(!data){data = {message:'please pass some message'};}
  if(!data.message){data.message = 'please pass some message';}
  if(!data.buttons){
    data.buttons = [
      {value:'ok',function:(e)=>{e.close();}},
    ];
  }

  return require("./views/alertView/alertView.js")(compId,data);

}

module.exports = {init:init,ref:compRef,type:type}
