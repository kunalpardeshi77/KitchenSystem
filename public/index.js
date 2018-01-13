var socket = io();

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  window[message.key](message.data);
});

function orderProcessedCallback(data){
	$("#quantity_" + data._id).text(data.quantity);
	$("#predicted_" + data._id).text(data.predicted);
	$("#createdTillNow_" + data._id).text(data.createdTillNow);
}

function orderProcessed(product){
	console.log(product);
	var quantity = $("#quantity_" + product.productId).text();

	product.quantity = quantity;
	$.ajax({
	  	type: "POST",
	 	dataType : "json",
	  	url: "/orderProcessed",
	  	data: product,
	  	success: orderProcessedCallback,/* function(data){
			$("#quantity_" + data._id).text(data.quantity);
			$("#predicted_" + data._id).text(data.predicted);
			$("#createdTillNow_" + data._id).text(data.createdTillNow);
		},*/
		error: function(error){
		    console.log();
		}
	});
}

function placeOrderCallback(data){
  	//if(eleId === "quantityBtn"){
		$("#quantity_" + data._id).text(data.quantity);
	//}else if(eleId === "predictedBtn"){
		$("#predicted_" + data._id).text(data.predicted);
	//}
 }

function sendData(ele){
	var eleId = ele.id;
	var params = {};
	var tempObj = {"quantityBtn" : "quantity", "predictedBtn" : "predicted"}
	if(eleId === "quantityBtn"){
		params.quantity = $("#quantity").val();
		params.productId = $("#quantityProdId").val();

	}else if(eleId === "predictedBtn"){
		params.predicted = $("#predicted").val();
		params.productId = $("#predictedProdId").val();
	}

	$.ajax({
		beforeSend: function(xhr, opts) { 
			if (!/^\d+$/.test($('#' + tempObj[eleId]).val())) {
    			alert("Please enter numbers only");
    			xhr.abort();
			}
		},
	  	type: "POST",
	 	dataType : "json",
	  	url: "/placeOrder",
	  	data: params,
	  	success: placeOrderCallback,/*function(data){
	  	if(eleId === "quantityBtn"){
			$("#quantity_" + data._id).text(data.quantity);
		}else if(eleId === "predictedBtn"){
			$("#predicted_" + data._id).text(data.predicted);
		}
	  },*/
	  error: function(error){
	     console.log();
	  }
	});
}