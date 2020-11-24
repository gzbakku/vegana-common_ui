//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-tabsComp';             //dont worry about this
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

  if(!data){data = {};}
  if(!data.tab_id){data.tab_id = 'uiCommonComptabs_tab_' + engine.uniqid();}

  const nav = make_navigator(data);
  const route = make_router(nav,data);

  function move_element(element,startPosition,endPosition){
    if(startPosition && true){
      let transform = "translateX(" + startPosition + ")";
      element.style.transform = transform;
    }
    setTimeout(function () {
      element.style.transition = 'transform 400ms';
      setTimeout(function () {
        element.style.transition = 'none';
      }, 450);
      let transform = "translateX(" + endPosition + ")";
      element.style.transform = transform;
    }, 10);
  }

  const controller = {
    id:data.tab_id,
    router:route,
    navigation:nav,
    to:(tabname)=>{
      if(!route[tabname]){return false;}
      let controller = engine.global.object[data.tab_id];
      let currentTabName = controller.navigation.active.tabname;
      if(tabname === currentTabName){return false;}
      let nextTabName = tabname;
      let next_position;
      for(let tab of data.tabs){
        if(tabname === currentTabName){next_position = 'a';break;}
        if(tabname === nextTabName){next_position = 'b';break;}
      }
      engine.make.removeClass({id:controller.navigation.active.div,class:'ui-common-comp-tabs-navigator-button-active'});
      engine.make.addClass({id:controller.navigation.all[tabname],class:'ui-common-comp-tabs-navigator-button-active'});
      let router = controller.router;
      let current_router_div = router[currentTabName];
      let next_router_div = router[nextTabName];
      if(next_position === "a"){
        move_element(engine.get.element(current_router_div),"0vw","-100vw");
        move_element(engine.get.element(next_router_div),"100vw","-0vw");
      } else {
        move_element(engine.get.element(current_router_div),"0vw","100vw");
        move_element(engine.get.element(next_router_div),"-100vw","0vw");
      }
      controller.navigation.active.tabname = nextTabName;
      controller.navigation.active.div = controller.navigation.all[tabname];
      engine.add.object(controller.id,controller);
    }
  };

  engine.add.object(data.tab_id,controller);

  return controller;

}

function make_router(nav,data){

  const main = engine.make.div({
    parent:data.router,
    class:"ui-common-comp-tabs-router",
    touch:data.touch_controls === true ? slide : null
  });

  const mainBoundry = engine.get.element(main).getBoundingClientRect();
  const mainBoundryHeight = Math.round(engine.get.element(main).getBoundingClientRect().height);
  const mainBoundryTop = Math.round(engine.get.element(main).getBoundingClientRect().y);
  const mainBoundryBottom = Math.round(engine.get.element(main).getBoundingClientRect().bottom);

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  function reset_current_element(){
    move_element(current.element,0,false,true);
    move_element(next.element,vw,false,true);
    move_element(previous.element,vw,true,true);
  }

  function get_scroll_dist(d,perc){
    let scrollLength,scrollDone = current.element.scrollTop || 0;
    let drag_length = Math.ceil(current.element.scrollHeight * perc/100);
    if(d === "u"){scrollLength = scrollDone + drag_length;} else {
      scrollLength = scrollDone - drag_length;
    }
    return scrollLength;
  }

  function scroll_element_old(element,px,n,slow){
    let transform = "translateY(";
    if(n){transform += "-";}
    transform += px + "px)";
    if(slow){
      element.style.transition = 'transform 600ms';
      setTimeout(function () {
        element.style.transition = 'none';
      }, 650);
    }
    element.style.transform = transform;
  }

  let scrollType;
  let baseX,baseY,last_scroll_length,scrollTime,currentBoundry,currentTopOffset = 0;
  function slide(id,move){

    if(move.type === "end"){

      if(scrollType === "v" && true){

        let boundry = current.element.getBoundingClientRect();
        let scroll_top,v_direction,diffY;
        let timeDiff = (new Date().getTime() - scrollTime) / 1000;

        if(baseY > move.posY){
          v_direction = 'u';
          diffY = baseY - move.posY;
          currentTopOffset += diffY;
        } else {
          v_direction = 'd';
          diffY = move.posY - baseY;
          currentTopOffset -= diffY;
        }

        let speedPerSec = (diffY/timeDiff)/1000;
        if(speedPerSec <= 0.2){scroll_top = null;} else
        if(speedPerSec <= 0.75){scroll_top = 3;} else
        if(speedPerSec <= 1.0){scroll_top = 5;} else
        if(speedPerSec <= 1.25){scroll_top = 6;} else
        if(speedPerSec <= 1.5){scroll_top = 10;} else
        if(speedPerSec <= 1.75){scroll_top = 15;}
        else {scroll_top = 20;}

        if(scroll_top){
          let scrollBy = Math.round(boundry.height * (scroll_top/100));
          if(v_direction === "u"){
              if(boundry.bottom-scrollBy-diffY < mainBoundryBottom){
                let top_offset = boundry.height - mainBoundryHeight;
                scroll_element(current.element,top_offset,true,true);
                currentTopOffset = top_offset;
              } else {
                // let top_offset = Math.round(Math.abs(boundry.top) + scrollBy + diffY);
                currentTopOffset += scrollBy;
                scroll_element(current.element,currentTopOffset,true,true);
              }
          } else {//down actions
            let top_offset = Math.round(currentTopOffset - scrollBy - diffY);
            if(top_offset < mainBoundryTop){
              scroll_element(current.element,0,true,true);
              currentTopOffset = 0;
            } else {
              currentTopOffset -= scrollBy;
              scroll_element(current.element,currentTopOffset,true,true);
            }
          }
        }
      }//this is vertical ender

      if(scrollType === "h"){
        if(move.posX > baseX){
          //previus element
          let diff = move.posX - baseX;
          let diff_perc = Math.round((diff/vw) * 100);
          if(diff_perc < 20){reset_current_element();} else {
            // animate(previous.element.id,current.element.id);
            move_element(previous.element,0,false,true);
            move_element(current.element,vw,false,true);
            update_navigator(previous.tabname);
          }
        } else if(move.posX === baseX){
          //current element
          reset_current_element();
        } else if(move.posX < baseX){
          //next element
          let diff = baseX - move.posX;
          let diff_perc = Math.round((diff/vw) * 100);
          if(diff_perc < 20){reset_current_element();} else {
            move_element(next.element,0,false,true);
            move_element(current.element,vw,true,true);
            update_navigator(next.tabname);
          }
        }
      }

      // console.log('end : ' + scrollType);
      scrollType = false;
      baseX = null,baseY = null,last_scroll_length = null,currentBoundry = null;
      return;
    }

    if(!scrollType){
      if(!baseX || !baseY || !scrollTime){
        baseX = move.posX;
        baseY = move.posY;
        scrollTime = new Date().getTime();
        return;
      } else {
        let diffX,diffY;
        if(baseX > move.posX){diffX = baseX - move.posX;} else {diffX = move.posX - baseX;}
        if(baseY > move.posY){diffY = baseY - move.posY;} else {diffY = move.posY - baseY;}
        if(diffX === diffY){return;} else {
          let zdiff;
          if(diffX > diffY){zdiff = diffX - diffY;} else {zdiff = diffY - diffX}
          if(zdiff > 3){
            if(diffX > diffY){
              // console.log({dx:diffX,dy:diffY,bx:baseX,by:baseY,x:move.posX,y:move.posY});
              scrollType = 'h';
              fetch_sliders();
              return;
            }
            if(diffY > diffX){
              fetch_sliders();
              scrollType = 'v';
              currentBoundry = current.element.getBoundingClientRect();
              // currentTopOffset = 0;
              // console.log(currentBoundry);
              // console.log(currentBoundry);
              last_scroll_length = current.element.scrollTop || 0;
              return;
            }
          } else {return;}
        }
      }
    }

    if(scrollType === "h"){
      let direction;
      if(move.posX > baseX){direction = 'right';}
      else if(move.posX < baseX) {direction = 'left';}
      else if(move.posX === baseX){direction = 'center';}
      if(!current|| !next || !previous){return;}
      if(direction === "left"){
        //move next into view
        let diff = baseX - move.posX;
        let next_left_pos = vw - diff;
        move_element(next.element,next_left_pos,false);
        move_element(current.element,diff,true);
      } else if(direction === "right"){
        //move previous into view
        let diff = move.posX - baseX;
        let previous_left_pos = vw - diff;
        let current_left_pos = vw - previous_left_pos;
        move_element(previous.element,previous_left_pos,true);
        move_element(current.element,current_left_pos,false);
      }
    }

    if(scrollType === "v" && false){
      let diffY,moveY;
      if(move.posY > baseY){diffY = move.posY - baseY;} else {diffY = baseY - move.posY;}
      if(move.posY < baseY){//up
        moveY = last_scroll_length + diffY;
      } else {//down
        moveY = last_scroll_length - diffY;
      }
      current.element.scrollTo({top:moveY,left:0});
    }

    if(scrollType === "v"){
      let diffY;
      if(move.posY > baseY){//down
        if(currentTopOffset > 0){
          diffY = Math.ceil(Math.abs(currentTopOffset) - (move.posY - baseY));
          if(diffY >= 0){
            scroll_element(current.element,diffY,true);
          } else {
            scroll_element(current.element,0,false);
          }
        }
      } else {//up
        diffY = Math.round(Math.abs(currentTopOffset) + (baseY - move.posY));
        // if(Math.round(currentBoundry.top) === mainBoundryTop){diffY -= mainBoundryTop;}
        // console.log("simple : " + currentTopOffset + " : " + diffY);
        if((currentBoundry.height - diffY) < mainBoundryHeight){
          let top_offset = currentBoundry.height - mainBoundryHeight;
          scroll_element(current.element,top_offset,true);
        } else {
          scroll_element(current.element,diffY,true);
        }

      }
    }

  }//slide ends here

  function scroll_element(element,px,n,slow){
    let transform = px + "px";
    if(n){transform = "-" + transform;}
    if(slow){
      element.style.transition = 'top 600ms';
    } else {
      element.style.transition = 'none';
    }
    element.style.top = transform;
  }

  function move_element(element,px,n,slow){
    let transform = "translateX(";
    if(n){transform += "-";}
    transform += px + "px)";
    if(slow){
      element.style.transition = 'transform 200ms';
    } else {
      element.style.transition = 'none';
    }
    element.style.transform = transform;
  }

  function update_navigator(tabName){
    let controller = engine.global.object[data.tab_id];
    if(!controller){return false;}
    let nav = controller.navigation;
    let next_tab_div = nav.all[tabName];
    engine.make.removeClass({id:nav.active.div,class:'ui-common-comp-tabs-navigator-button-active'});
    engine.make.addClass({id:next_tab_div,class:'ui-common-comp-tabs-navigator-button-active'});
    controller.navigation.active.tabname = tabName;
    controller.navigation.active.div = next_tab_div;
    engine.add.object(controller.id,controller);
  }

  let current,next,previous;
  function fetch_sliders(){

    current = null,next = null,previous = null;
    const controller = engine.global.object[data.tab_id];
    if(!controller){return;}

    let
    nav = controller.navigation,
    currentName = nav.active.tabname,
    last_tab_name = data.tabs[data.tabs.length - 1].tabname,
    first_tab_name = data.tabs[0].tabname;

    current = {tabname:currentName,element:engine.get.element(controller.router[currentName])};

    //---------------------------
    //load next
    if(currentName === last_tab_name){
      let next_tab_name = data.tabs[0].tabname;
      next = {tabname:next_tab_name,element:engine.get.element(controller.router[next_tab_name])}
    } else {
      let next_index = 0;
      for(let tab of data.tabs){
        if(tab.tabname === currentName){
          break;
        }
        next_index++;
      }
      let next_tab_name = data.tabs[next_index+1].tabname;
      next = {tabname:next_tab_name,element:engine.get.element(controller.router[next_tab_name])}
    }

    //---------------------------
    //load previous
    if(currentName === first_tab_name){
      let previous_tab_name = data.tabs[data.tabs.length - 1].tabname;
      previous = {tabname:previous_tab_name,element:engine.get.element(controller.router[previous_tab_name])};
    } else {
      let previous_index = 0;
      for(let tab of data.tabs){
        if(tab.tabname === currentName){
          break;
        }
        previous_index++;
      }
      let previous_tab_name = data.tabs[previous_index-1].tabname;
      previous = {tabname:previous_tab_name,element:engine.get.element(controller.router[previous_tab_name])};
    }

  }//fetch sliders ends here

  let tabs = {};

  for(let tab of data.tabs){

    let tab_class = 'ui-common-comp-tabs-router-tab';
    if(tab.tabname !== nav.active.tabname){
      tab_class += ' ui-common-comp-tabs-router-tab-hidden';
    }

    const div = engine.make.div({
      parent:main,
      class:tab_class,
    });

    tabs[tab.tabname] = div;

  }

  return tabs;

}

function make_navigator(data){

  const main = engine.make.div({
    parent:data.navigator,
    class:"ui-common-comp-tabs-navigator"
  });

  let button_class = "ui-common-comp-tabs-navigator-button";
  if(data.tabs.length === 1){
    button_class += " ui-common-comp-tabs-navigator-button_one";
  } else
  if(data.tabs.length === 2){
    button_class += " ui-common-comp-tabs-navigator-button_two";
  } else
  if(data.tabs.length === 3){
    button_class += " ui-common-comp-tabs-navigator-button_three";
  } else
  if(data.tabs.length === 4){
    button_class += " ui-common-comp-tabs-navigator-button_four";
  } else
  if(data.tabs.length > 4){
    button_class += " ui-common-comp-tabs-navigator-button_more";
  }

  let index = 0,buttons = {
    active:'',
    all:{}
  };

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

  function move_element(element,startPosition,endPosition){
    if(startPosition && true){
      let transform = "translateX(" + startPosition + ")";
      element.style.transform = transform;
    }
    setTimeout(function () {
      element.style.transition = 'transform 400ms';
      setTimeout(function () {
        element.style.transition = 'none';
      }, 450);
      let transform = "translateX(" + endPosition + ")";
      element.style.transform = transform;
    }, 10);
  }

  for(let tab of data.tabs){

    let is_active = false;

    let local_button_class = button_class;
    if(!data.active_tab){
      if(index === 0){
        local_button_class += ' ui-common-comp-tabs-navigator-button-active';
        is_active = true;
      }
    } else {
      if(tab.tabname === data.active_tab){
        local_button_class += ' ui-common-comp-tabs-navigator-button-active';
        is_active = true;
      }
    }
    index++;

    const button = engine.make.div({
      parent:main,
      class:local_button_class,
      function:(id)=>{
        if(tab.tabname === buttons.active.tabname){
          return;
        } else {
          let controller = engine.global.object[data.tab_id];
          let currentTabName = controller.navigation.active.tabname;
          let nextTabName = tab.tabname;
          let next_position;
          for(let tab of data.tabs){
            if(tab.tabname === currentTabName){next_position = 'a';break;}
            if(tab.tabname === nextTabName){next_position = 'b';break;}
          }
          // console.log(next_position);
          // return;
          // if(data.tabs[0].tabname === currentTabName && data.tabs[data.tabs.length - 1].tabname === nextTabName){next_position = 'b';}
          engine.make.removeClass({id:controller.navigation.active.div,class:'ui-common-comp-tabs-navigator-button-active'});
          engine.make.addClass({id:id,class:'ui-common-comp-tabs-navigator-button-active'});
          let router = controller.router;
          let current_router_div = router[currentTabName];
          let next_router_div = router[nextTabName];
          if(next_position === "a"){
            move_element(engine.get.element(current_router_div),"0vw","-100vw");
            move_element(engine.get.element(next_router_div),"100vw","-0vw");
          } else {
            move_element(engine.get.element(current_router_div),"0vw","100vw");
            move_element(engine.get.element(next_router_div),"-100vw","0vw");
          }
          controller.navigation.active.tabname = nextTabName;
          controller.navigation.active.div = id;
          engine.add.object(controller.id,controller);
          // buttons.active = {tabname:tab.tabname,div:id};
        }
      }
    });

    if(is_active){
      buttons.active = {tabname:tab.tabname,div:button};
    }
    buttons.all[tab.tabname] = button;

    if(tab.icon){
      let icon_class = "ui-common-comp-tabs-navigator-button-icon";
      if(!tab.tag){
        icon_class += " ui-common-comp-tabs-navigator-button-icon_only";
      } else {
        icon_class += " ui-common-comp-tabs-navigator-button-icon_with_tag";
      }
      const icon = engine.make.div({
        parent:button,
        class:icon_class
      });
        engine.make.image({
          parent:icon,
          class:"ui-common-comp-tabs-navigator-button-icon-img",
          type:'local',
          location:tab.icon
        });
    }

    if(tab.tag){
      let tag_class = "ui-common-comp-tabs-navigator-button-tag";
      if(!tab.icon){
        tag_class += " ui-common-comp-tabs-navigator-button-tag_only";
      }
      engine.make.div({
        parent:button,
        class:tag_class,
        text:tab.tag
      });
    }

  }//for loop ends here

  return buttons;

}

module.exports = {init:init,ref:compRef,type:type}
