

module.exports = (parent,data)=>{

	const main = engine.make.div({
		parent:parent,
		class:"alert-master",
	});

		const alert_master_card = engine.make.div({
			parent:main,
			class:"alert-master-card",
		});

			let body_class = 'alert-master-card-body';
			if(!data.buttons){
				body_class = 'alert-master-card-body alert-master-card-body_short';
			}

			const body = engine.make.div({
				parent:alert_master_card,
				class:body_class,
				text:data.message
			});

			let buttons;
			if(data.buttons){
			 buttons = engine.make.div({
					parent:alert_master_card,
					class:"alert-master-card-buttons",
				});
					for(let item of data.buttons){
						engine.make.div({
							parent:buttons,
							text:item["value"],
							class:"alert-master-card-buttons-button",
							function:()=>{
								if(item.function){
									item.function(controller);
								}
							}
						});
					}
			}

			const controller = {main:main,body:body,buttons:buttons,close:()=>{
				engine.view.remove(main);
			}}

			return controller;

};
