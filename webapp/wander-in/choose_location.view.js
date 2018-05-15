sap.ui.jsview("wander-in.choose_location", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf wander-in.choose_location
	*/ 
	getControllerName : function() {
		return "wander-in.choose_location";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf wander-in.choose_location
	*/ 
	createContent : function(oController) {
		
		
		oNuovaLocation = new sap.m.Button('NuovoLoc',{
			text : "Nuova Location",
			press : oController.aggiungiLocation
		});
		
		oLocation = new sap.m.VBox('Location',{
			alignItems : sap.m.FlexAlignItems.Center,
			direction: sap.m.FlexDirection.Column,
			//backgroundDesign : sap.m.BackgroundDesign.Translucent
		});
		oIdLocation = new sap.m.Input('IdLocation',{
			description : "Location ID (preso da estimote)"
		});
		oNomeLocation = new sap.m.Input('NomeLocation',{
			description : "Nome Location"
		});
		oLunghezzaLocation = new sap.m.Input('LunghezzaLocation',{
			description : "Lunghezza Max Location"
		});
		oAltezzaLocation = new sap.m.Input('AltezzaLocation',{
			description : "Altezza Max Location"
		});
		oLungPixel = new sap.m.Input('LungPixel',{
			description : "Lunghezza Max in Pixel Immagine"
		});
		oAltezzaPixel = new sap.m.Input('AltezzaPixel',{
			description : "Altezza Max in Pixel Immagine"
		});
		oImage = new sap.m.Input('MapImage',{
			description : "Url Immagine Location"
		});
		oSalvaLocation = new sap.m.Button('SalvaLocation',{
			text : "Salva",
			press : oController.onSalvaLocation
		});
		oLocation.addItem(oIdLocation);
		oLocation.addItem(oNomeLocation);
		oLocation.addItem(oLunghezzaLocation);
		oLocation.addItem(oAltezzaLocation);
		oLocation.addItem(oLungPixel);
		oLocation.addItem(oAltezzaPixel);
		oLocation.addItem(oImage);
		oLocation.addItem(oSalvaLocation);
		sap.ui.getCore().byId("Location").setVisible(false);
		
		var aColumn1 = [
		                new sap.m.Column({
		                	header: new sap.m.Label({
		                		text: "Id"
		                	})
		                }),
		                new sap.m.Column({
		                  header: new sap.m.Label({
		                    text: "Nome"
		                  })
		                  }),
		                  new sap.m.Column({
			                  header: new sap.m.Label({
			                    text: "Largezza Location"
			                  })
			                  }),
			                  new sap.m.Column({
				                  header: new sap.m.Label({
				                    text: "Altezza Location"
				                  })
				                  }),
				                  new sap.m.Column({
					                  header: new sap.m.Label({
					                    text: "Larghezza Pixel"
					                  })
					                  }),
					                  new sap.m.Column({
						                  header: new sap.m.Label({
						                    text: "Altezza Pixel"
						                  })
						                  }),
						                  new sap.m.Column({
							                  header: new sap.m.Label({
							                    text: "Url Mappa Location"
							                  })
		                }),
		                new sap.m.Column({
			                  header: new sap.m.Label({
			                    text: "Apri Location"
			                  })
			                }),
		                new sap.m.Column({
			                  header: new sap.m.Label({
			                    text: "Cancella"
			                  })
			                }),
			                new sap.m.Column({
				                  header: new sap.m.Label({
				                    text: "Modifica"
				                  })
				                })
		                ];
		var oTemplate1 = new sap.m.ColumnListItem({
		      cells: [
		        new sap.m.Text({
		          text: "{LocationModel>ID_LOCATION}"
		        }),      
		        new sap.m.Text({
		          text: "{LocationModel>NOME}"
		        }),
		        new sap.m.Text({
			          text: "{LocationModel>MAX_WIDTH}"
			        }),
			        new sap.m.Text({
				          text: "{LocationModel>MAX_HEIGHT}"
				        }),
				        new sap.m.Text({
					          text: "{LocationModel>MAX_WIDTH_PIX}"
					        }),
					        new sap.m.Text({
						          text: "{LocationModel>MAX_HEIGTH_PIX}"
						        }),
						        new sap.m.Text({
							          text: "{LocationModel>MAP_IMAGE}"
							        }),
		        new sap.m.Button({
                    icon : "sap-icon://navigation-right-arrow",
                    press : [oController.onApri, oController] 
                }),
                new sap.m.Button({
                    icon : "sap-icon://sys-cancel",
                    press : [oController.onCancella, oController] 
                }),
                new sap.m.Button({
                    icon : "sap-icon://sys-edit",
                    press : [oController.onModifica, oController] 
                }),
		        ]
		});
		oTable = new sap.m.Table({
			id : "tableLocation",
			columns : aColumn1,
			alternateRowColors : true,
		});
		oTable.bindItems({
			path : "LocationModel>/LOCATION",
			template : oTemplate1				
		});
		
 		return new sap.m.Page({
			title: "Lista Location",
			content: [oLocation,oNuovaLocation,oTable
			
			]
		});
	}

});