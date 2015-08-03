
// Uppstart
var current = {id:0, parent_id:0, title:"Alla"};
var view = "tree";
var latest_swipe;
var id;
//var appCache = window.applicationCache;

itemList.init("key");
if (itemList.itemArray==undefined) itemList.exampledata();
else if(itemList.itemArray==null) itemList.exampledata();
itemList.filtered("all","");
view_item(0);


// .subitem-left (visa edit-läge)
$(document).on('click', ".subitem-left", function() {
	
	id = $(this).parent().find(".item_id").text();
	edit_item = itemList.get_item(id);
 
	$(".menu-title").html("Edit: "+edit_item.title);
	
  	$("input.item-id").val(id);
  	$("input.item-title").val(edit_item.title);
  	$("textarea.item-notes").val(edit_item.notes);
	$(".item-prio").val(edit_item.prio);
  	$(".item-type").val(edit_item.type);
  	$(".item-size").val(edit_item.size);
	$(".finish_date").val(edit_item.finish_date);
	$(".start_date").val(edit_item.start_date);
	$(".icon").val(edit_item.icon);
  	$("input.item-parent-id").val(edit_item.parent_id);
	$("#postpone").val(edit_item.postpone);
		/*$("input.item-category").val(current.category);
     $("input.item-create-date").val(current.date_create);
     $("input.item-finish-date").val(current.date_finished);*/
			
	$(".page").hide();
	$("#edit").show();
	
	$('.more').hide();
	$('.more-button').show();
	
	window.scrollTo(0, 0);
 });
 

// .subitem-center (visa subitems)
$(document).on('click', ".subitem-center", function() {
	var current_id = $(this).parent().find(".item_id").text();
	view_item (current_id);
 });
 
 
 
// .new-button
$(document).on('click', ".new-button", function() {

	$(".menu-title").html("New: "+current.title);
   $("input.item-id").val(current.id);
   $("#new-item-title").val("");
   $("#new-item-prio").val("2");
   $("#new-item-type").val("6"); 
   $("#new-item-notes").val("");
   $("#new-item-size").val("6");
   $("#new-parent-id").val(current.id);
	
	$(".page").hide();
	$("#new").show();
	
	window.scrollTo(0, 0);
 });

// .add-button
$(document).on('click', ".add-button", function() {
     itemList.add_from_form("#new-item-form");
	view_item(current.id);
 });


// .save-button
$(document).on('click', ".save-button", function() {
   itemList.edit_from_form("#edit-item-form");
	if(view=="tree")	view_item(current.id);
	else view_filter();
	var scroll_offset = $(".item_id:contains('"+id+"')").parent().offset().top-100;
    window.scrollTo(0, scroll_offset);
 });


// .more-button
$(document).on('click', ".more-button", function() {
	$('.more').show();
	$('.more-button').hide();
 });

// .back-button
 $(document).on('click', ".back-button", function() {
	view_item(current.parent_id);
 });

//swipe back
$("#tree").on('swiperight',  function(){ 
	if(current.parent_id!=-1)
		view_item(current.parent_id);
});

//swipe to backend menu
$("#tree").on('swipeleft',  function(){ 
	if(Date.now()  - latest_swipe <1000){
		alert("2 left swipes -> Backdoor menu");
		$(".page").hide();
		$("#menu").show();
	}
	latest_swipe = Date.now();
});


// .cancel-button
$(document).on('click', ".cancel-button", function() {
  	if(view=="tree")	view_item(current.id);
	else view_filter();
	var scroll_offset = $(".item_id:contains('"+id+"')").parent().offset().top-100;
   window.scrollTo(0, scroll_offset);
 });

// .delete-button
$(document).on('click', ".delete-button", function() {
	id = $(".item-id").val();
	if (confirm('Delete "'+itemList.get_item(id).title+'"?')==true) {
   itemList.remove_item(id);
	if(view=="tree")	view_item(current.id);
	else view_filter();
	}
 });
 
 // .finish-button
$(document).on('click', ".finish-button", function() {
      id = $(".item-id").val();
      itemList.edit_from_form("#edit-item-form");
      itemList.finish_item(id);
		if(view=="tree")	view_item(current.id);
		else view_filter();
 });


// .menu-button
 $(document).on('click', ".menu-button", function() {
     	$(".page").hide();
		$("#menu").show();
 });


// .search-button
$(document).on('click', ".search-button", function() {
	view_filter();
 });

// .tree-button
$(document).on('click', ".tree-button", function() {
	view_item(current.id);
 });

function view_item (id) {
	view = "tree";
	current = itemList.get_item(id);
	
	itemList.refresh(id);
	$(".menu-title").html(current.title);
	if(current.id == 0) $("#tree>.submenu>.back-button").hide(); 
	else $("#tree>.submenu>.back-button").show();

	$(".page").hide();
	$("#tree").show();
}

//search
 function view_filter(){
     view = "filter";
     
     var query = $(".search").val();
     var type = $(".type-filter").val();
     
     itemList.filtered(type, query); 
     //$("#filtered>.subitem").show();
     //if(query!="") $("#filtered>.subitem>.subitem-center>.title:not(:contains('"+query+"'))").parent().parent().hide();
     //else $("#filtered>.subitem").show();
     
     $(".page").hide();
	  $("#search").show();
 }
    
