var context;
var oData;

sap.ui.controller("wander-in.choose_location", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wander-in.choose_location
*/
	onInit: function() {
		//oModelLocation = new sap.ui.model.odata.v2.ODataModel("https://wanderinp1941441869trial.hanatrial.ondemand.com/Odata/ZLOCATION.xsodata/",{
		oModelLocation = new sap.ui.model.odata.v2.ODataModel("/LOdata/Odata/ZLOCATION.xsodata/",{
			disableHeadRequestForToken : true,
			tokenHandling : true
		});
		
		sap.ui.getCore().setModel(oModelLocation, "LocationModel");
	},
	
	aggiungiLocation: function(e){
		
		sap.ui.getCore().byId("Location").setVisible(true);
	},
	
	onSalvaLocation: function(e){
    	if (sap.ui.getCore().byId("IdLocation").getValue() == ''){
    		alert("Inserire l'id della location presa da estimote");
    	}else{
    			var oModel = context.getView().getModel("LocationModel");
    			var oEntry = {};
    			oEntry.ID_LOCATION = sap.ui.getCore().byId("IdLocation").getValue();
    			oEntry.NOME = sap.ui.getCore().byId("NomeLocation").getValue();
    			oEntry.MAX_WIDTH = sap.ui.getCore().byId("LunghezzaLocation").getValue();
    			oEntry.MAX_HEIGHT = sap.ui.getCore().byId("AltezzaLocation").getValue();
    			oEntry.MAX_WIDTH_PIX = sap.ui.getCore().byId("LungPixel").getValue();
    			oEntry.MAX_HEIGTH_PIX = sap.ui.getCore().byId("AltezzaPixel").getValue();
    			oEntry.MAP_IMAGE = sap.ui.getCore().byId("MapImage").getValue();;
    			
    			oModel.create("/LOCATION", oEntry, {
    				method: "POST",
    			    success: function(data) {
    			     alert("Location inserita correttamente");
    			     //window.location.reload(true);
    			    },
    			    error: function(e) {
    			     alert("Location non inserita");
    			    }
    			});
    			
    		sap.ui.getCore().byId("IdLocation").setValue("");
    		sap.ui.getCore().byId("NomeLocation").setValue("");
    		sap.ui.getCore().byId("LunghezzaLocation").setValue("");
    		sap.ui.getCore().byId("AltezzaLocation").setValue("");
    		sap.ui.getCore().byId("LungPixel").setValue("");
    		sap.ui.getCore().byId("AltezzaPixel").setValue(""); 
    		sap.ui.getCore().byId("MapImage").setValue(""); 
	}
    },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wander-in.choose_location
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wander-in.choose_location
*/
	onAfterRendering: function() {
		context = this;
	},
	
	onApri: function(e){
		
		row = e.getSource().getParent().getId();
		row = row.substr(row.lastIndexOf("-") + 1);
		var oTable = sap.ui.getCore().byId("tableLocation");
        var aItems = oTable.getItems();
		
		app = sap.ui.getCore().byId("wander-in");
		app.to("idmanage-map1");
		var eventBus = sap.ui.getCore().getEventBus();
		eventBus.publish("MainDetailChannel", "onNavigateEvent", { location : aItems[row].getCells()[0].getText(),
																	altezzaLocation: parseFloat(aItems[row].getCells()[2].getText()),
																	larghezzaLocation: parseFloat(aItems[row].getCells()[3].getText()),
																	altezzaPixel: parseFloat(aItems[row].getCells()[4].getText()),
																	larghezzaPixel: parseFloat(aItems[row].getCells()[5].getText()),
																	mapImage: aItems[row].getCells()[6].getText()});
	},
	
	onCancella: function(e){
		row = e.getSource().getParent().getId();
		row = row.substr(row.lastIndexOf("-") + 1);
		var oTable = sap.ui.getCore().byId("tableLocation");
        var aItems = oTable.getItems();
        location = aItems[row].getCells()[0].getText();
        var oModel = this.getView().getModel("LocationModel");
        oModel.remove("/LOCATION(ID_LOCATION='"+location+"')",{
        	method: "DELETE",
            success: function(data) {
             alert("Location cancellata");
            },
            error: function(e) {
             alert("Location non cancellata");
            }
        });
	}
	
/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wander-in.choose_location
*/
//	onExit: function() {
//
//	}

});