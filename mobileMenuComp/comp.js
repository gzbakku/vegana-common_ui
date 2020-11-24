//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-testmenu';             //dont worry about this
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

async function build(data){

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const menu_right_limit = Math.abs(vw * (80/100));
  const menu_close_limit = Math.abs(vw * (25/100));

  const main = engine.make.div({
    parent:compId,
    class:'comp-menu-main'
  });

  let menu_object,main_object = engine.get.element(main);

  const slider = engine.make.div({
    parent:main,
    class:'comp-menu-main-slider',
    touch:(id,m)=>{
      slide(m);
    }
  });

  let opened = true,removed = false;
  function open(){
    if(removed){return false;}
    if(!opened){
      engine.view.show(main);
      engine.view.hide(opener);
      opened = true;
      move_menu(0);
      // console.log({onopen:opened});
    }
  }
  function close(){
    if(removed){return false;}
    if(opened){
      engine.view.hide(main);
      engine.view.show(opener);
      opened = false;
    }
    // console.log({onClose:opened});
  }

  const controller = {
    open:open,
    close:close,
    remove:()=>{
      if(removed){return false;}
      engine.view.remove(main);
      return true;
    },
    toggle:()=>{
      if(removed){return false;}
      if(opened){close();} else {open();}
    }
  };

  if(data.integrate){
    engine.add.function(data.globalFunctionName || "menu",()=>{
      return controller;
    });
  }

  const opener = engine.make.div({
    parent:compId,
    class:'comp-menu-opener',
    touch:(id,m)=>{
      open();
      slide(m);
    }
  });

  close();

  function move_menu(posX){
    if(posX === 0){
      menu_object.style.transform = menu_object.style["-webkit-transition"] = 'translateX(0px)';
    } else {
      menu_object.style.transform = menu_object.style["-webkit-transition"]  = 'translateX(-' + posX + 'px)';
    }
  }

  function slide(move){
    if(move.type === "end"){
      if (move.dirX === "left"){
        move_menu(menu_right_limit);
        close();
      } else {
        move_menu(0);
        open();
      }
      return;
    }
    let calc = menu_right_limit - Math.abs(move.posX);
    if (calc > 0){
      move_menu(calc);
    } else {
      move_menu(0);
    }
  }

  const menu = engine.make.div({
    parent:main,
    class:'comp-menu-main-menu'
  });

  menu_object = engine.get.element(menu);

  let body;
  if(data.only_body){
    body = engine.make.div({
      parent:menu,
      class:data.body_class || 'comp-menu-main-menu-body'
    });
  }

  let buttons;
  if(data.buttons){
    buttons = engine.make.div({
      parent:menu,
      class:'comp-menu-main-menu-buttons'
    });
    for(let button of data.buttons){
      make_button(buttons,button,close,controller);
    }
  }

  return {
    main:main,
    menu:menu,
    buttons:buttons,
    body:body,
    functions:controller
  };

}

function make_button(parent,data,close,controller){

  const button = engine.make.div({
    parent:parent,
    class:'comp-menu-main-menu-buttons-button',
    function:()=>{
      close();
      if(data.function){data.function(controller);}
    }
  });

    let tag_class = 'comp-menu-main-menu-buttons-button-tag';
    if(data.icon){
      tag_class += ' comp-menu-main-menu-buttons-button-tag_with_icon';
      const image_cont = engine.make.div({
        parent:button,
        class:'comp-menu-main-menu-buttons-button-icon'
      });
        engine.make.image({
          parent:image_cont,
          class:'comp-menu-main-menu-buttons-button-icon-img',
          type:'local',
          location:data.icon
        });
    }

    const tag = engine.make.div({
      parent:button,
      class:tag_class,
      text:data.tag
    });

}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
