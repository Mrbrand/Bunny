var itemList = {
	itemArray: [], //lagrar projektdata
	
	testdata : function() {   
		this.itemArray = [];
		
		this.add_item({id:0, parent_id:-1, title:"", prio:1, size:0, type:13});
		var parent_id = 1;
		var id = 1;
		var prio;
		var size;
		var type;
		for (n=0; n<5;n++){
			for (m=0; m<10;m++){
				for (l=0; l<10;l++){
			  		for (k=0; k<10;k++){
				 		for (i=0;i<10;i++){
							//itemArray.push({id:id++, parent_id: 10*l+k});
							prio = Math.floor((Math.random() * 5)+1);
							size = Math.floor((Math.random() * 6));
							type = Math.floor((Math.random() * 13)+1);
							this.itemArray.push({id:id++, parent_id: 1000*n+100*m+10*l+k, title:id, type:type, size:size, prio:prio});
		 				}
	  				}
				}
			}
		}
	},
	
	exampledata : function() {   
		this.itemArray = [];
		this.add_item({id:0, parent_id:-1, title:"", prio:1, size:0}); //root item
		this.add_item({id:1, parent_id:0, title:"Familj", prio:1, type:8, size:0});
		this.add_item({id:2, parent_id:0, title:"Jobbet", prio:1, type:8, size:0});			
		this.add_item({id:3, parent_id:0, title:"Nöje", prio:1, type:8, size:0});
		this.add_item({id:4, parent_id:3, title:"Leka med WiseGuy", prio:1, type:6, size:0});
	},
	
	cleardata : function() {   
		this.itemArray = [];
		localStorage.removeItem('key');
		this.add_item({id:0, parent_id:-1, title:"", prio:1, size:0});
	},
	
	
	init : function(key) {     
		var array_from_storage = JSON.parse(window.localStorage.getItem(key));
		this.itemArray = array_from_storage;
	},
	
	refresh : function(item_id) {   
		
		//rensa lista
		$("#open").empty();
		$("#finished").empty();
		
		//filtrera itemArray
		var open_items = this.get_open_subitems(item_id);
		var finished_items = this.get_finished_subitems(item_id);
		
		open_items .sort(
		 	firstBy(function (v1, v2) { return v1.prio - v2.prio; })
		 	.thenBy(function (v1, v2) { return v1.size - v2.size; })
		 	.thenBy(function (v1, v2) { return v1.type - v2.type; })
		);
		
		finished_items .sort(
		 	firstBy(function (v1, v2) { 
			 	var a = moment(v1.finish_date);
		 		var b = moment(v2.finish_date);
		 		return a>b ? -1 : a<b ? 1 : 0;
		 	})
		 //	.thenBy(function (v1, v2) { return v1.size - v2.size; })
		);
		
		
		//Fylla #open med 
		open_items.forEach(function(item) {
			item.subitems = itemList.get_prio1_subitems(item.id,1);
			item.subitems .sort(
			 	firstBy(function (v1, v2) { return v1.prio - v2.prio; })
			 	.thenBy(function (v1, v2) { return v1.size - v2.size; })
			 	.thenBy(function (v1, v2) { return v1.type - v2.type; })
			);
			var template = $('#open_items_template').html();
			var html = Mustache.to_html(template, item);
			$("#open").append(html);
		});
		
		
		finished_items.forEach(function(item) {
			item.subitems = itemList.get_open_subitems(item.id,1);
			item.subitems .sort(
			 	firstBy(function (v1, v2) { return v1.prio - v2.prio; })
			 	.thenBy(function (v1, v2) { return v1.size - v2.size; })
			 	.thenBy(function (v1, v2) { return v1.type - v2.type; })
			);
			var template = $('#finished_items_template').html();
			var html = Mustache.to_html(template, item);
			$("#finished").append(html);
		});
		
		//Om listan är tom
		if (finished_items.length == 0 & open_items.length==0) $("#open").append("<div class='empty'>No items here</div>");
		
	},
	
	
	filtered : function(type, query) {   
		//rensa lista
		$("#filtered").empty();

		//filtrera itemArray	
		var filtered_items = this.get_type_items(type, query);
		
		filtered_items .sort(
		 	firstBy(function (v1, v2) { return v1.prio - v2.prio; })
		 	.thenBy(function (v1, v2) { return v1.type - v2.type; })
		 	.thenBy(function (v1, v2) { return v1.size - v2.size; })
		);
		
		filtered_items.forEach(function(item) {
			var template = $('#filtered_items_template').html();
			var html = Mustache.to_html(template, item);
			$("#filtered").append(html);
		});
		
		
		//Om listan är tom
		if (filtered_items.length == 0)  $("#filtered").append("<div class='empty'>No items here</div>");
	},
	
	
	get_item : function(item_id){
		return this.itemArray.filter(function (item){
			return item.id == item_id;
		})[0];
	},

	
	get_last_id : function(){
		last_id = Math.max.apply(Math,this.itemArray.map(function(item){return item.id;}));
		if (last_id=="-Infinity") last_id=0; //om inget objekt är skapat ännu
		return last_id;
	},
	

	add_item : function(item){
		this.itemArray.push(item);
		window.localStorage.setItem("key", JSON.stringify(this.itemArray));
	},
	

	add_from_form : function(form_id){
		//skapa objekt av formdata
		var temp = $( form_id ).serializeArray();
		var item = {};
		for(var i = 0; i <temp.length;i++){
			temp2 = temp[i];
			item[temp2["name"]] = temp2["value"];
		}
		
		//lägga till startdate till objektet
		item["start_date"] = new Date().toLocaleString();
		
		//lägga till id till objektet
		item["id"] = itemList.get_last_id()+1;
		
		item["path"] = this.get_path(item["parent_id"]);

		//lägga till objekt i listan
		this.add_item(item);
	},
	
	
	edit_from_form : function(form_id){
		//skapa objekt av formdata
		var temp = $( form_id ).serializeArray();
		var item = {};
		for(var i = 0; i <temp.length;i++){
			temp2 = temp[i];
			item[temp2["name"]] = temp2["value"];
		}
		//ta bort finish date om datum inte är satt
		if (item['finish_date'] == "") delete item['finish_date'];
		item["path"] = this.get_path(item["parent_id"]);
		//byta ut objekt i listan
		this.remove_item(item.id);
		this.add_item(item);
	},
	
	
	remove_item : function(id){
		for(var i in this.itemArray){
			if(this.itemArray[i].id==id){
				this.itemArray.splice(i,1);
				break;
				}
		}
		window.localStorage.setItem("key", JSON.stringify(this.itemArray));
	},
	
	
	finish_item : function(id){
		for(var i in this.itemArray){
			if(this.itemArray[i].id==id){
				this.itemArray[i]['finish_date'] = moment().format('YYYY-MM-DD HH:mm:ss');
				break;
				}
		}
		window.localStorage.setItem("key", JSON.stringify(this.itemArray));
	},
	
	
	get_open_subitems : function(id){
		return this.itemArray.filter(function (item){
			return item.parent_id == id & item.finish_date === undefined;
		});
	},
	
	get_prio1_subitems : function(id){
		var subitems = this.itemArray.filter(function (item){
			return item.parent_id == id & item.finish_date === undefined & item.prio<=2;
		});
		return subitems;
	},
	
	get_finished_subitems : function(id){
		return this.itemArray.filter(function (item){
			return item.parent_id == id & item.finish_date !== undefined;
		});
	},
	
	get_type_items : function(type, query){
		query = query.toLowerCase();
		console.log(query);
		if (type!="all")
			return this.itemArray.filter(function (item){
			 	return item.type == type & item.title.toLowerCase().indexOf(query) !== -1 & item.finish_date === undefined;
			 	
			});
		
		else return this.itemArray.filter(function (item){
			 	return item.id !=0 & item.title.toLowerCase().indexOf(query) !== -1 & item.finish_date === undefined;
		});
	},
	
	
	
	query : function(field, operator, value){
		
		if (operator=="contains"){
			value = value.toLowerCase();
			return this.itemArray.filter(function (item){
			 	return item[field].toLowerCase().indexOf(value) !== -1; 	
			});
		}
		
		else if(operator == "is") {
			return this.itemArray.filter(function (item){
				 	return item[field] == value;
			});
		}
		
	},
	
	
	get_path : function(id){
			var path = "/";
			var item = this.get_item(id); 
			while(item!==undefined){
				//hämta parent om det finns
				path = "/" + item.title + path;
				item = this.get_item(item.parent_id);				
			}
			return path;
	},
	
	
}


/*** Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0 ***/
firstBy=(function(){function e(f){f.thenBy=t;return f}function t(y,x){x=this;return e(function(a,b){return x(a,b)||y(a,b)})}return e})();
