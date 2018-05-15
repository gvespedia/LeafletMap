sap.ui.jsview("wander-in.manage-map", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf wander-in.manage-map
	*/ 
	getControllerName : function() {
		return "wander-in.manage-map";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf wander-in.manage-map
	*/ 
	createContent : function(oController) {
		map = new sap.ui.core.HTML('map', {
			content : "<div id=\"map\"; style=\"height: 400px; width: 600px\"></div>"
		});
		map_layout_col = new sap.m.VBox('Map',{
			alignItems : sap.m.FlexAlignItems.Center,
			direction: sap.m.FlexDirection.Column,
			//backgroundDesign : sap.m.BackgroundDesign.Translucent
		});
		map_layout_col.addItem(map);
		
		poi_layout_col = new sap.m.VBox('PoiCol',{
			alignItems : sap.m.FlexAlignItems.Center,
			direction: sap.m.FlexDirection.Column,
			//backgroundDesign : sap.m.BackgroundDesign.Translucent
		});
		
		
		/*oModificaPoi = new sap.m.Button('ModificaPoi',{
			text : "Modifica",
			press : oController.onModificaPoi
		});*/
		oCancellaPoi = new sap.m.Button('NuovoPoi',{
			text : "Nuovo POI",
			press : oController.aggiungiRigaPoi
		});
		
		
		poi_layout_row = new sap.m.VBox('PoiRow',{
			alignItems : sap.m.FlexAlignItems.Center,
			direction: sap.m.FlexDirection.Row,
			//backgroundDesign : sap.m.BackgroundDesign.Translucent
		});
		
		//poi_layout_row.addItem(oSalvaPoi);
		//poi_layout_row.addItem(oModificaPoi);
		poi_layout_row.addItem(oCancellaPoi);
		
		pon_layout_col = new sap.m.VBox('PonCol',{
			alignItems : sap.m.FlexAlignItems.Center,
			direction: sap.m.FlexDirection.Column,
			//backgroundDesign : sap.m.BackgroundDesign.Translucent
		});
		
		pon_layout_row = new sap.m.VBox('PonRow',{
			alignItems : sap.m.FlexAlignItems.Center,
			direction: sap.m.FlexDirection.Row,
			//backgroundDesign : sap.m.BackgroundDesign.Translucent
		});
		
		oNuovoPon = new sap.m.Button('NuovoPon',{
			text : "Nuovo PON",
			press : oController.aggiungiRigaPon
		});

		
		pon_layout_row.addItem(oNuovoPon);
	
		
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
		                    text: "Latitudine"
		                  })
		                }),
		                new sap.m.Column({
		                  header: new sap.m.Label({
		                    text: "Longitudine"
		                  })
		                }),
		                new sap.m.Column({
			                  header: new sap.m.Label({
			                    text: "Tipo Informazioni"
			                  })
			                }),
		                new sap.m.Column({
			                  header: new sap.m.Label({
			                    text: "Informazioni"
			                  })
			                }),
		                new sap.m.Column({
	                        header : new sap.m.Text({
	                            text : "Cancella"
	                        })
	                    }),
	                    new sap.m.Column({
	                        header : new sap.m.Text({
	                            text : "Modifica"
	                        })
	                    })
		              ];
		
		var aColumn2 = [
		                new sap.m.Column({
			                  header: new sap.m.Label({
			                    text: "Id"
			                  })
			                }),
		                new sap.m.Column({
		                  header: new sap.m.Label({
		                    text: "Latitudine"
		                  })
		                }),
		                new sap.m.Column({
		                  header: new sap.m.Label({
		                    text: "Longitudine"
		                  })
		                }),
		                new sap.m.Column({
	                        header : new sap.m.Text({
	                            text : "Cancella"
	                        })
	                    }),
	                    new sap.m.Column({
	                        header : new sap.m.Text({
	                            text : "Modifica"
	                        })
	                    })
		              ];
		
		var aColumn3 = [
		                new sap.m.Column({
			                  header: new sap.m.Label({
			                    text: "From"
			                  })
			                }),
		                new sap.m.Column({
		                  header: new sap.m.Label({
		                    text: "To"
		                  })
		                }),
		                new sap.m.Column({
		                  header: new sap.m.Label({
		                    text: "Distanza"
		                  })
		                }),
		                new sap.m.Column({
			                  header: new sap.m.Label({
			                    text: "Cancella"
			                  })
			                })
		              ];
		
		var oTemplate1 = new sap.m.ColumnListItem({
		      cells: [
		        new sap.m.Text({
		          text: "{POIModel>ID_POI}"
		        }),      
		        new sap.m.Text({
		          text: "{POIModel>NOME}"
		        }),
		        new sap.m.Text({
		          text: "{POIModel>LAT}"
		        }),
		        new sap.m.Text({
		          text: "{POIModel>LON}"
		        }),
		        new sap.m.Text({
			          text: "{POIModel>DATA_TYPE}"
			        }),
		        new sap.m.Text({
			          text: "{POIModel>DATA}"
			        }),
		        new sap.m.Button({
                    icon : "sap-icon://sys-cancel",
                    press : [oController.onCancellaPoi, oController] 
                }),
                new sap.m.Button({
                    icon : "sap-icon://edit",
                    press : [oController.onModificaPoi, oController] 
                })
		      ]
		    });
		
		var oTemplate2 = new sap.m.ColumnListItem({
		      cells: [
		              new sap.m.Text({
		            	  text: "{PONModel>ID_PON}"
		              }),
		        new sap.m.Text({
		          text: "{PONModel>LAT}"
		        }),
		        new sap.m.Text({
		          text: "{PONModel>LON}"
		        }),
		        new sap.m.Button({
                    icon : "sap-icon://sys-cancel",
                    press : [oController.onCancellaPon, oController] 
                }),
                new sap.m.Button({
                    icon : "sap-icon://edit",
                    press : [oController.onModificaPon, oController] 
                })
		      ]
		    });
		
		var oTemplate3 = new sap.m.ColumnListItem({
		      cells: [
		              new sap.m.Text({
		            	  text: "{GraphModel>FROM}"
		              }),
		        new sap.m.Text({
		          text: "{GraphModel>TO}"
		        }),
		        new sap.m.Text({
		          text: "{GraphModel>DISTANCE}"
		        }),
		        new sap.m.Button({
                    icon : "sap-icon://sys-cancel",
                    press : [oController.onCancellaArco, oController] 
                })
		      ]
		    });
		
		oPoi = new sap.m.VBox('POI',{
			alignItems : sap.m.FlexAlignItems.Center,
			direction: sap.m.FlexDirection.Column,
			//backgroundDesign : sap.m.BackgroundDesign.Translucent
		});
		
		oPon = new sap.m.VBox('PON',{
			alignItems : sap.m.FlexAlignItems.Center,
			direction: sap.m.FlexDirection.Column,
			//backgroundDesign : sap.m.BackgroundDesign.Translucent
		});
		
		oTextPoi = new sap.m.Text('TextPoi',{
			text : "Inserire il nome del Point Of Interest. Per le coordinate cliccare sulla mappa."
		});
		
		oNomePoiNew = new sap.m.Input('nomePOINew',{
			description : "Nome Point Of Interest"
		});
		oLatPoiNew = new sap.m.Input('LatPoiNew',{
			description : "Latitudine (metri)"
		});
		sap.ui.getCore().byId("LatPoiNew").setEditable(false);
		oLonPoiNew = new sap.m.Input('LonPoiNew',{
			description : "Longituidne (metri)"
		});
		sap.ui.getCore().byId("LonPoiNew").setEditable(false);
		oDataType = new sap.m.Select("DataType",{
			description : "Tipo di informazione",
			items : [
			         new sap.ui.core.Item("MESSAGE",{
			        	 text : "MESSAGE",
			         }),
			         new sap.ui.core.Item("URL",{
			 			text : "URL",
			 		})
			         ]
		});
		oTextNew = new sap.m.TextArea('TextNew',{
			description : "Informazioni sul POI"
		});
		//sap.ui.getCore().byId("TextNew").setEditable(false);
		oSalvaPoi = new sap.m.Button('SalvaPoi',{
			text : "Salva",
			press : oController.onSalvaPoi
		});
		
		oPoi.addItem(oTextPoi);
		oPoi.addItem(oNomePoiNew);
		oPoi.addItem(oLatPoiNew);
		oPoi.addItem(oLonPoiNew);
		oPoi.addItem(oDataType);
		oPoi.addItem(oTextNew);
		oPoi.addItem(oSalvaPoi);
		sap.ui.getCore().byId("POI").setVisible(false);
		
		oTextPoiEdit = new sap.m.Text('TextPoiEdit',{
			text : "Modifica il nome del Point Of Interest. Per modificare le coordinate cliccare sulla mappa."
		});
		
		oNomePoi = new sap.m.Input('nomePOI',{
			description : "Nome Point Of Interest"
		});
		oLatPoi = new sap.m.Input('LatPoi',{
			description : "Latitudine (metri)"
		});
		sap.ui.getCore().byId("LatPoi").setEditable(false);
		oLonPoi = new sap.m.Input('LonPoi',{
			description : "Longituidne (metri)"
		});
		sap.ui.getCore().byId("LonPoi").setEditable(false);
		oDataTypeEdit = new sap.m.Select("DataTypeEdit",{
			description : "Tipo di informazione",
			items : [
			         new sap.ui.core.Item("MESSAGEEdit",{
			        	 text : "MESSAGE",
			         }),
			         new sap.ui.core.Item("URLEdit",{
			 			text : "URL",
			 		})
			         ]
		});
		oTextEdit = new sap.m.TextArea('TextEdit',{
			description : "Il testo inserito verrà visualizzato sul POI"
		});
		oSalvaPoiEdit = new sap.m.Button('SalvaPoiEdit',{
			text : "Salva",
			press : oController.onSalvaPoiEdit
		});
		
		oPoiEdit = new sap.m.VBox('POIEdit',{
			alignItems : sap.m.FlexAlignItems.Center,
			direction: sap.m.FlexDirection.Column,
			//backgroundDesign : sap.m.BackgroundDesign.Translucent
		});
		oPoiEdit.addItem(oTextPoiEdit);
		oPoiEdit.addItem(oNomePoi);
		oPoiEdit.addItem(oLatPoi);
		oPoiEdit.addItem(oLonPoi);
		oPoiEdit.addItem(oDataTypeEdit);
		oPoiEdit.addItem(oTextEdit);
		oPoiEdit.addItem(oSalvaPoiEdit);
		sap.ui.getCore().byId("POIEdit").setVisible(false);
		
		oSalvaPonEdit = new sap.m.Button('SalvaPonEdit',{
			text : "Salva",
			press : oController.onSalvaPonEdit
		});
		oPonEdit = new sap.m.VBox('PONEdit',{
			alignItems : sap.m.FlexAlignItems.Center,
			direction: sap.m.FlexDirection.Column,
			//backgroundDesign : sap.m.BackgroundDesign.Translucent
		});
		oLatPon = new sap.m.Input('LatPon',{
			description : "Latitudine (metri)"
		});
		sap.ui.getCore().byId("LatPon").setEditable(false);
		oLonPon = new sap.m.Input('LonPon',{
			description : "Longituidne (metri)"
		});
		sap.ui.getCore().byId("LonPon").setEditable(false);
		//oPonEdit.addItem(oTextPonEdit);
		oPonEdit.addItem(oLatPon);
		oPonEdit.addItem(oLonPon);
		oPonEdit.addItem(oSalvaPonEdit);
		sap.ui.getCore().byId("PONEdit").setVisible(false);
		oSalvaPon = new sap.m.Button('SalvaPon',{
			text : "Salva",
			press : oController.onSalvaPon
		});
		oLatPonNew = new sap.m.Input('LatPonNew',{
			description : "Latitudine (metri)"
		});
		sap.ui.getCore().byId("LatPonNew").setEditable(false);
		oLonPonNew = new sap.m.Input('LonPonNew',{
			description : "Longituidne (metri)"
		});
		sap.ui.getCore().byId("LonPonNew").setEditable(false);
		
		oPon.addItem(oLatPonNew);
		oPon.addItem(oLonPonNew);
		oPon.addItem(oSalvaPon);
		sap.ui.getCore().byId("PON").setVisible(false);
		
		oTable = new sap.m.Table({
			id : "tablePOI",
			columns : aColumn1,
			alternateRowColors : true
		});
		
		oTable2 = new sap.m.Table({
			id : "tablePON",
			columns : aColumn2,
			alternateRowColors : true
		});
		
		oTable3 = new sap.m.Table({
			id : "tableGraph",
			columns : aColumn3,
			alternateRowColors : true
		});
		
		/*var filter = [new sap.ui.model.Filter("ID_LOCATION", sap.ui.model.FilterOperator.EQ, oController.getLocation())];
		
		oTable.bindItems({
			path : "POIModel>/POI",
			template : oTemplate1,
			//filters : filter
		});
		
		oTable2.bindItems({
			path : "PONModel>/PON",
			template : oTemplate2,
			//filters : filter
		});
		
		oTable3.bindItems({
			path : "GraphModel>/GRAPH",
			template : oTemplate3,
			//filters : filter
		});*/
		
		poi_layout_col.addItem(poi_layout_row);
		poi_layout_col.addItem(oTable);
		
		pon_layout_col.addItem(pon_layout_row);
		pon_layout_col.addItem(oTable2);
		
		
		oTabPOI = new sap.m.TabContainerItem('TCIpoi',{
			name : "Point Of Interest",
			content : [poi_layout_col]
		});
		oTabPON = new sap.m.TabContainerItem('TCIpon',{
			name : "Point Of Navigation",
			content : [pon_layout_col]
		});
		oTabGraph = new sap.m.TabContainerItem('TabGraph',{
			name : "Grafo di navigazione",
			content : oTable3
		});
		
		oTab = new sap.m.TabContainer('TC',{
			items : [oTabPOI, oTabPON, oTabGraph],
			itemSelect : oController.onItemSelect
		});
		
		oTab.addEventDelegate({
			onAfterRendering: function() {
	              var oTabStrip = this.getAggregation("_tabStrip");
	              var oItems = oTabStrip.getItems();
	              for (var i = 0; i < oItems.length; i++) {
	                var oCloseButton = oItems[i].getAggregation("_closeButton");
	                oCloseButton.setVisible(false);
	              }
	            }
	          }, oTab);
		
	
 		return new sap.m.Page({
			title: "Gestione Edificio",
			content: [oPoi,oPon,oPoiEdit,oPonEdit, map_layout_col,oTab
			
			]
		});
	}

});