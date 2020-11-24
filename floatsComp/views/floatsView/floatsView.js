

const images = require("./images.js");

module.exports = (parent,data)=>{

	const valid_types = ['menu','delete','new','edit','settings'];

	if(!data || !data.buttons || data.buttons.length === 0){
		console.error("invalid data please read the instructions for more information.");
		return false;
	}

		for(let button of data.buttons){
			if(!button.icon && (!button.type || valid_types.indexOf(button.type) < 0) && (!button.tag && !button.type && !button.icon)){
				console.error("please provide a valid float type from => delete,menu,new,settings,edit or provide a tag");
				return false;
			}
			if((button.type && button.icon)){
				console.error("cannot define icon and type in one float button");
				return false;
			}
		}

		make_floating_button(parent,data);

};

function make_floating_button(parent,data){

	let button_class = 'floats-master-float';
	if(data.buttons[0].tag && (data.buttons[0].type || data.buttons[0].icon) && data.buttons.length === 1){
		button_class += " floats-master-float_tag";
	}

	const button = engine.make.div({
		parent:parent,
		class:button_class,
		function:()=>{
			if(data.buttons.length === 1 && data.buttons[0].function){
				data.buttons[0].function();
			} else {
				engine.view.hide(button);
				make_options(parent,data,()=>{
					engine.view.show(button);
				});
			}
		}
	});

	if(false && data.buttons.length > 1){
		engine.view.hide(button);
		make_options(parent,data,()=>{
			engine.view.show(button);
		});
	}

	if(data.buttons[0].type || data.buttons[0].icon){

		const icon = engine.make.div({
			parent:button,
			class:"floats-master-float-icon"
		});

			if(data.buttons[0].icon && data.buttons.length === 1){
				engine.make.image({
					parent:icon,
					class:"floats-master-float-icon-img floats-master-float-icon-img-no_svg",
					type:data.buttons[0].non_local_image ? 'url' : "local",
					location:data.buttons[0].icon
				});
			} else {
				let icon_img = images[data.buttons[0].type];
				if(data.buttons.length > 1){
					icon_img = images["menu"];
				} else {
					icon_img = images[data.buttons[0].type];
				}
				engine.make.image({
					parent:icon,
					class:"floats-master-float-icon-img",
					type:'url',
					location:'data:image/svg+xml;base64,' + icon_img
				});
			}

	}

	if(data.buttons[0].tag && data.buttons.length === 1){
		engine.make.div({
			parent:button,
			class:"floats-master-float-tag",
			text:data.buttons[0].tag
		});
	}

}

function make_options(parent,data,show){

	const main = engine.make.div({
		parent:parent,
	});

	engine.make.div({
		parent:main,
		class:"floats-options-background",
		function:()=>{
			engine.view.remove(main);
			show();
		}
	});

	const optionsBox = engine.make.div({
		parent:main,
		class:"floats-options-box",
	});

	// console.log(["one","two","three"].length);

	let collect = [],buttons = [];
	for(let button of data.buttons){
		if(collect.length === 3){
			buttons.push(collect);
			collect = [];
			collect.push(button);
		} else {
			collect.push(button);
		}
	}
	buttons.push(collect);
	collect = [];

	let rows_index = 0;
	for(let theseButtons of buttons){

		let row_class = 'floats-options-box-row';
		if(rows_index < buttons.length -1){
			row_class += ' floats-options-box-row-border';
		}

		const buttonsRow = engine.make.div({
			parent:optionsBox,
			class:row_class,
		});

		rows_index++;

		for(let button of theseButtons){

			const button_box = engine.make.div({
				parent:buttonsRow,
				class:"floats-options-box-button",
				function:()=>{
					engine.view.remove(main);
					show();
					if(button.function){
						button.function();
					}
				}
			});

			if(button.icon || button.type){

				const icon = engine.make.div({
					parent:button_box,
					class:"floats-options-box-button-icon",
				});
					if(button.icon){
						engine.make.image({
							parent:icon,
							class:"floats-options-box-button-icon-img",
							type:button.non_local_image ? 'url' : "local",
							location:button.icon
						});
					} else {
						if(button.type){
							engine.make.image({
								parent:icon,
								class:"floats-options-box-button-icon-img floats-options-box-button-icon-img-svg",
								type:'url',
								location:'data:image/svg+xml;base64,' + images[button.type]
							});
						}
					}
			}

			if(button.tag){
				engine.make.div({
					parent:button_box,
					class:"floats-options-box-button-tag",
					text:button.tag
				});
			}

		}
	}



}
