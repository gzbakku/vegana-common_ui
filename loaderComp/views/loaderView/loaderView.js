

module.exports = (parent,data)=>{

	let main = engine.make.div({
		parent:parent,
		class:"loader-master",
	});

	let showing = true,removed = false;
	if(data.show === false || data.hide === true){
		showing = false;
		engine.view.hide(main);
	}

		const loader_master_card = engine.make.div({
			parent:main,
			class:"loader-master-card",
		});

			const loader_master_card_loader = engine.make.div({
				parent:loader_master_card,
				class:"loader-master-card-loader",
			});

				engine.make.div({
					parent:loader_master_card_loader,
					class:"loader-master-card-loader-spinner",
				});

			const message = engine.make.div({
				parent:loader_master_card,
				text:data.text || "loading ...",
				class:"loader-master-card-text",
			});

			function say(v){
				if(removed){return true;}
				engine.set.div.text(message,v);
			}

			const controller = {
				show:(v)=>{
					if(removed){return true;}
					if(showing){return true;}
					showing = true;
					engine.view.show(main);
					if(v){return say(v);} else {
						return say("Loading ...");
					}
					return true;
				},
				hide:()=>{
					if(removed){return true;}
					if(!showing){return true;}
					showing = false;
					engine.view.hide(main);
					return true;
				},
				remove:()=>{
					if(data.integrate){
						console.error("failed-remove-integrated-loader");
						return false;
					}
					showing:false;
					removed = true;
					engine.view.remove(main);
					main = null;
					return true;
				},
				say:say,
				text:say,
				main:()=>{
					return main;
				},
				status:()=>{return showing;}
			};

			return controller;

};
