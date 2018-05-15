jQuery.sap.registerModulePath("LL", "https://unpkg.com/leaflet@1.3.1/dist");
jQuery.sap.require("LL.leaflet");
var _L = L;

var x_max_pixel; // = 804;
var x_max_meters; // = 12.1;
var y_max_pixel; // = 1066;
var y_max_meters; // = 16.1;
var url_image;
var id_location;

var oModelPOI;
var oModelPON;
var oModelGraph;
var context;
var guid;
var map;
var markersLayerPOI = new _L.LayerGroup();
var markersLayerPON = new _L.LayerGroup();
var markersLayerGraph = new _L.LayerGroup();
var markersLayerPOI1 = new _L.LayerGroup();
var from, to, previousRow;

sap.ui.controller("wander-in.manage-map", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf wander-in.manage-map
	 */
	onInit: function() {

		var eventBus = sap.ui.getCore().getEventBus();

		eventBus.subscribe("MainDetailChannel", "onNavigateEvent", this.onDataReceived, this);

		//oModelPOI = new sap.ui.model.odata.v2.ODataModel("https://wanderinp1941441869trial.hanatrial.ondemand.com/Odata/ZPOI.xsodata/",{
		oModelPOI = new sap.ui.model.odata.v2.ODataModel("/LOdata/Odata/ZPOI.xsodata/", {
			disableHeadRequestForToken: true,
			tokenHandling: true
		});

		sap.ui.getCore().setModel(oModelPOI, "POIModel");
		//oModelPON = new sap.ui.model.odata.v2.ODataModel("https://wanderinp1941441869trial.hanatrial.ondemand.com/Odata/ZPON.xsodata/", {
		oModelPON = new sap.ui.model.odata.v2.ODataModel("/LOdata/Odata/ZPON.xsodata/", {
			disableHeadRequestForToken: true,
			tokenHandling: true
		});
		sap.ui.getCore().setModel(oModelPON, "PONModel");
		//oModelGraph = new sap.ui.model.odata.v2.ODataModel("https://wanderinp1941441869trial.hanatrial.ondemand.com/Odata/ZGRAPH.xsodata/", {
		oModelGraph = new sap.ui.model.odata.v2.ODataModel("/LOdata/Odata/ZGRAPH.xsodata/", {
			disableHeadRequestForToken: true,
			tokenHandling: true
		});
		sap.ui.getCore().setModel(oModelGraph, "GraphModel");
	},

	onDataReceived: function(channel, event, data) {
		// do something with the data (bind to model)
		id_location = data.location;
		x_max_pixel = data.larghezzaPixel;
		y_max_pixel = data.altezzaPixel;
		x_max_meters = data.larghezzaLocation;
		y_max_meters = data.altezzaLocation;
		url_image = "Image/SapChallenge.jpg";//data.mapImage;
		console.log(JSON.stringify(data));

		var bounds = [
			[0, 0],
			[x_max_pixel, y_max_pixel]
		];
		var image = _L.imageOverlay(url_image, bounds).addTo(map);
		map.fitBounds(bounds);
		var filter = [new sap.ui.model.Filter("ID_LOCATION", sap.ui.model.FilterOperator.EQ, id_location)];

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
					icon: "sap-icon://sys-cancel",
					press: [context.onCancellaPoi, context]
				}),
				new sap.m.Button({
					icon: "sap-icon://edit",
					press: [context.onModificaPoi, context]
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
					icon: "sap-icon://sys-cancel",
					press: [context.onCancellaPon, context]
				}),
				new sap.m.Button({
					icon: "sap-icon://edit",
					press: [context.onModificaPon, context]
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
					icon: "sap-icon://sys-cancel",
					press: [context.onCancellaArco, context]
				})
			]
		});

		var oTable1 = sap.ui.getCore().byId("tablePOI");
		var oTable2 = sap.ui.getCore().byId("tablePON");
		var oTable3 = sap.ui.getCore().byId("tableGraph");

		oTable1.bindItems({
			path: "POIModel>/POI",
			template: oTemplate1,
			filters: filter
		});

		oTable2.bindItems({
			path: "PONModel>/PON",
			template: oTemplate2,
			filters: filter
		});

		oTable3.bindItems({
			path: "GraphModel>/GRAPH",
			template: oTemplate3,
			filters: filter
		});

	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf wander-in.manage-map
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	getLocation: function() {
		return id_location;
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf wander-in.manage-map
	 */
	onAfterRendering: function() {
		context = this;
		map = _L.map('map', {
			crs: _L.CRS.Simple,
			minZoom: -1
		});

		/*var bounds = [[0,0], [y_max_pixel,x_max_pixel]];
		var image = L.imageOverlay("https://lh3.googleusercontent.com/Rs6SXaNXWNyhAFNAfxt4q85X2gnF7md2CuITqwJEd7Jo233PebRAEJDiVNjLzFc_O3VCwXF4xQGmHDp5I5cS=w1920-h917-rw", bounds).addTo(map);
		map.fitBounds(bounds);*/

		map.on('click', function(e) {
			context.onMapClick(e);
		});

		markersLayerPOI.addTo(map);

		map.setView([533, 402], -1);

		var myFeatureGroup = _L.featureGroup().addTo(map).on("click", context.groupClick);

		var myFeatureGroupPoint = _L.featureGroup().addTo(map).on("click", context.PointClick);

		//var myFeatureGroupArch = L.featureGroup().addTo(map).on("click", context.ArchClick);

		var oTable = sap.ui.getCore().byId("tablePOI");
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var aItems = oTable.getItems();
				markersLayerPOI.clearLayers();
				//alert(aItems);
				aItems.forEach(function(element) {
					var point = _L.latLng([context.fromMetersToPixelY(parseFloat(element.getCells()[3].getText())), context.fromMetersToPixelX(
						parseFloat(element.getCells()[2].getText()))]);
					//alert(parseFloat(element.getCells()[2].getText())+"|"+parseFloat(element.getCells()[3].getText()));
					var marker = _L.marker(point).addTo(myFeatureGroupPoint); //.addTo(map);
					marker.ROW = element;
					//markersLayerPOI.addLayer(marker);
					marker.addTo(markersLayerPOI);
					//marker.addTo(map);
				});
				//markersLayerPOI.addTo(map);
			}
		}, this);
		var myIcon = _L.icon({
			iconUrl: 'Image/point.png',
			iconSize: [38, 38],
			iconAnchor: [19, 19]
		});

		var oTablePON = sap.ui.getCore().byId("tablePON");
		oTablePON.addEventDelegate({
			onAfterRendering: function() {
				var aItems = oTablePON.getItems();
				markersLayerPOI.clearLayers();
				//alert(aItems);
				aItems.forEach(function(element) {
					var point = _L.latLng([context.fromMetersToPixelY(parseFloat(element.getCells()[2].getText())), context.fromMetersToPixelX(
						parseFloat(element.getCells()[1].getText()))]);
					//alert(parseFloat(element.getCells()[2].getText())+"|"+parseFloat(element.getCells()[3].getText()));
					var marker = _L.marker(point, {
						icon: myIcon
					}).addTo(myFeatureGroupPoint); //.addTo(map);
					marker.ROW = element;
					//markersLayerPOI.addLayer(marker);
					marker.addTo(markersLayerPOI);
					//marker.addTo(map);
				});
				//markersLayerPOI.addTo(map);
			}
		}, this);

		var oTableGraph = sap.ui.getCore().byId("tableGraph");
		oTableGraph.addEventDelegate({
			onAfterRendering: function() {
				var POIItems = oTable.getItems();
				markersLayerPOI.clearLayers();
				POIItems.forEach(function(element) {
					var POIpoint = _L.latLng([context.fromMetersToPixelY(parseFloat(element.getCells()[3].getText())), context.fromMetersToPixelX(
						parseFloat(element.getCells()[2].getText()))]);
					var marker = _L.marker(POIpoint).addTo(myFeatureGroup);
					marker.ID_POI = element.getCells()[0].getText();
					marker.LAT = parseFloat(element.getCells()[3].getText());
					marker.LON = parseFloat(element.getCells()[2].getText());
					//markersLayerPOI.addLayer(marker);
					marker.addTo(markersLayerPOI);
					//marker.addTo(map);
				});
				//markersLayerPOI.addTo(map);
				var PONItems = oTablePON.getItems();
				//markersLayerPOI.clearLayers();
				PONItems.forEach(function(element) {
					var PONpoint = _L.latLng([context.fromMetersToPixelY(parseFloat(element.getCells()[2].getText())), context.fromMetersToPixelX(
						parseFloat(element.getCells()[1].getText()))]);
					var markerPON = _L.marker(PONpoint, {
						icon: myIcon
					}).addTo(myFeatureGroup);
					markerPON.ID_PON = element.getCells()[0].getText();
					markerPON.LAT = parseFloat(element.getCells()[2].getText());
					markerPON.LON = parseFloat(element.getCells()[1].getText());
					//markersLayerPOI.addLayer(markerPON);
					markerPON.addTo(markersLayerPOI);
					//markerPON.addTo(map);
				});

				var GraphItems = oTableGraph.getItems();

				/*var polyline = new L.polyline([],{
        			color: 'blue',
        	               weight: 5,
        	               smoothFactor: 100.0
        		});*/ //.addTo(myFeatureGroupPoint);
				var cont = [];

				GraphItems.forEach(function(row) {
					//search from;
					//polyline.setLatLngs([]);
					var from;
					var to;
					if (from == null) {
						POIItems.forEach(function(element) {
							if (row.getCells()[0].getText() === element.getCells()[0].getText()) {
								//polyline.addLatLng(new L.LatLng(context.fromMetersToPixelY(parseFloat(element.getCells()[3].getText())),context.fromMetersToPixelX(parseFloat(element.getCells()[2].getText()))))
								from = new _L.LatLng(context.fromMetersToPixelY(parseFloat(element.getCells()[3].getText())), context.fromMetersToPixelX(
									parseFloat(element.getCells()[2].getText())));
							}
						});
					}
					if (from == null) {
						PONItems.forEach(function(element) {
							if (row.getCells()[0].getText() === element.getCells()[0].getText()) {
								//polyline.addLatLng(new L.LatLng(context.fromMetersToPixelY(parseFloat(element.getCells()[2].getText())),context.fromMetersToPixelX(parseFloat(element.getCells()[1].getText()))))
								from = new _L.LatLng(context.fromMetersToPixelY(parseFloat(element.getCells()[2].getText())), context.fromMetersToPixelX(
									parseFloat(element.getCells()[1].getText())));
							}
						});
					}
					//search to
					if (to == null) {
						PONItems.forEach(function(element) {
							if (row.getCells()[1].getText() === element.getCells()[0].getText()) {
								//polyline.addLatLng(new L.LatLng(context.fromMetersToPixelY(parseFloat(element.getCells()[2].getText())),context.fromMetersToPixelX(parseFloat(element.getCells()[1].getText()))))
								to = new _L.LatLng(context.fromMetersToPixelY(parseFloat(element.getCells()[2].getText())), context.fromMetersToPixelX(
									parseFloat(element.getCells()[1].getText())));
							}
						});
					}
					if (to == null) {
						POIItems.forEach(function(element) {
							if (row.getCells()[1].getText() === element.getCells()[0].getText()) {
								//polyline.addLatLng(new L.LatLng(context.fromMetersToPixelY(parseFloat(element.getCells()[3].getText())),context.fromMetersToPixelX(parseFloat(element.getCells()[2].getText()))))
								to = new _L.LatLng(context.fromMetersToPixelY(parseFloat(element.getCells()[3].getText())), context.fromMetersToPixelX(
									parseFloat(element.getCells()[2].getText())));
							}
						});
					}
					var segm = [from, to];
					cont.push(segm);
					//polyline.ROW = row;
				});

				//polyline.setLatLngs(cont); //.addTo(map);
				//polyline.redraw();
				//markersLayerPOI.addLayer(polyline);
				//alert(polyline.getLatLngs());

				var polyline = _L.polyline(cont, {
					color: 'blue',
					weight: 5,
					smoothFactor: 100.0
				}).addTo(markersLayerPOI);

				//markersLayerPOI.addTo(map);
			}
		}, this);

		/*var x = this.fromMetersToPixelY(1);
		var y = this.fromMetersToPixelX(0.6);
		var sol = L.latLng([ x, y ]);
		L.marker(sol).addTo(map);*/
		//map.setView( [this.fromMetersToPixelY(2.48), this.fromMetersToPixelX(4.4)], -0.8);
	},

	PointClick: function(event) {
		if (previousRow != null) {
			previousRow.removeStyleClass("highlightStyle");
		}
		previousRow = event.layer.ROW;
		previousRow.addStyleClass("highlightStyle");
	},

	groupClick: function(event) {
		if (from == null) {
			if (event.layer.ID_POI != null) {
				from = event.layer.ID_POI;
				lat_from = event.layer.LAT;
				lon_from = event.layer.LON;
			} else {
				if (event.layer.ID_PON != null) {
					from = event.layer.ID_PON;
					lat_from = event.layer.LAT;
					lon_from = event.layer.LON;
				}
			}
			alert("Punto di partenza registrato. Clicca ora un punto di arrivo");
		} else {
			if (to == null) {
				if (event.layer.ID_POI != null) {
					to = event.layer.ID_POI;
					lat_to = event.layer.LAT;
					lon_to = event.layer.LON;
				} else {
					if (event.layer.ID_PON != null) {
						to = event.layer.ID_PON;
						lat_to = event.layer.LAT;
						lon_to = event.layer.LON;
					}
				}
				if (from != null && to != null) {
					context.creaArchi(from, to, lat_from, lon_from, lat_to, lon_to);
					from = null;
					to = null;
				}
			}
		}
		//console.log("Clicked on marker " + event.layer.ID_POI);
	},

	creaArchi: function(from, to, lat_from, lon_from, lat_to, lon_to) {
		var a = lat_from - lat_to;
		var b = lon_from - lon_to;
		var distance = Math.round((Math.sqrt(a * a + b * b)) * 100) / 100;
		var oModel = context.getView().getModel("GraphModel");
		var oEntry = {};
		oEntry.ID_LOCATION = id_location;
		oEntry.FROM = from;
		oEntry.TO = to;
		oEntry.DISTANCE = distance.toString();

		//alert(distance);

		oModel.create("/GRAPH", oEntry, {
			method: "POST",
			success: function(data) {
				//alert(" inserito correttamente");
				//window.location.reload(true);
				oEntry.ID_LOCATION = id_location;
				oEntry.FROM = to;
				oEntry.TO = from;
				oModel.create("/GRAPH", oEntry, {
					method: "POST",
					success: function(data) {
						alert(" Archi inseriti correttamente");
						//window.location.reload(true);
					},
					error: function(e) {
						alert("Arco ritorno non inserito");
					}
				});
			},
			error: function(e) {
				alert("Arco andata non inserito");
			}
		});

	},

	onCancellaArco: function(evt) {
		if (evt.getSource().getParent().getParent().getItems().length > 0) {
			row = evt.getSource().getParent().getId().slice(-1);
			var oModel = this.getView().getModel("GraphModel");
			var oTable = sap.ui.getCore().byId("tableGraph");
			var aItems = oTable.getItems();
			oModel.remove("/GRAPH(ID_LOCATION='" + id_location + "',FROM='" + aItems[row].getCells()[0].getText() + "',TO='" + aItems[row].getCells()[
				1].getText() + "')", {
				method: "DELETE",
				success: function(data) {
					alert("Arco cancellato");
				},
				error: function(e) {
					alert("Arco non cancellato");
				}
			});

		}
	},

	updateMap: function(oTable, table) {
		//var oTable = sap.ui.getCore().byId(table);
		alert(table);
		if (table === "tablePOI") {
			var aItems = oTable.getItems();
			markersLayerPOI.clearLayers();
			//alert(aItems);
			aItems.forEach(function(element) {
				var point = _L.latLng([context.fromMetersToPixelY(parseFloat(element.getCells()[2].getText())), context.fromMetersToPixelX(
					parseFloat(element.getCells()[3].getText()))]);
				//alert(parseFloat(element.getCells()[2].getText())+"|"+parseFloat(element.getCells()[3].getText()));
				var marker = _L.marker(point); //.addTo(map);
				markersLayerPOI.addLayer(marker);
			});
			markersLayerPOI.addTo(map);
		} else {
			if (table == 'tablePON') {

			}
		}
	},

	fromMetersToPixelX: function(x) {
		//var x_max_pixel = 1418;

		//var x_max_meters = 8.8;

		return (x_max_pixel * x) / x_max_meters;
	},

	fromMetersToPixelY: function(y) {
		//var y_max_pixel = 808;
		//var y_max_meters = 4.96;
		return (y_max_pixel * y) / y_max_meters;
	},

	fromPixelToMetersX: function(x) {
		return (x_max_meters * x) / x_max_pixel;
	},

	fromPixelToMetersY: function(y) {
		return (y_max_meters * y) / y_max_pixel;
	},

	onMapClick: function(e) {
		lat = Math.round(this.fromPixelToMetersX(e.latlng.lng) * 100) / 100;
		lon = Math.round(this.fromPixelToMetersY(e.latlng.lat) * 100) / 100;

		switch (sap.ui.getCore().byId('TC').getSelectedItem()) {
			case 'TCIpoi':
				if (sap.ui.getCore().byId('POIEdit').getVisible()) {
					sap.ui.getCore().byId('LatPoi').setValue(lat.toString());
					sap.ui.getCore().byId('LonPoi').setValue(lon.toString());
				}
				if (sap.ui.getCore().byId('POI').getVisible()) {
					sap.ui.getCore().byId('LatPoiNew').setValue(lat.toString());
					sap.ui.getCore().byId('LonPoiNew').setValue(lon.toString());
				}
				//sap.ui.getCore().byId('Ponx').setValue('');
				//sap.ui.getCore().byId('Pony').setValue('');
				break;
			case 'TCIpon':
				if (sap.ui.getCore().byId('PONEdit').getVisible()) {
					sap.ui.getCore().byId('LatPon').setValue(lat.toString());
					sap.ui.getCore().byId('LonPon').setValue(lon.toString());
				}
				if (sap.ui.getCore().byId('PON').getVisible()) {
					sap.ui.getCore().byId('LatPonNew').setValue(lat.toString());
					sap.ui.getCore().byId('LonPonNew').setValue(lon.toString());
				}
				break;
		}

		//alert(sap.ui.getCore().byId('TC').getSelectedItem()); //lat+"|"+lon);
	},

	onItemSelect: function(e) {
		switch (e.getParameters().item.getName()) {
			case 'Point Of Interest':
				sap.ui.getCore().byId("POIEdit").setVisible(false);
				sap.ui.getCore().byId("PONEdit").setVisible(false);
				sap.ui.getCore().byId("PON").setVisible(false);
				sap.ui.getCore().byId("POI").setVisible(false);
				break;
			case 'Point Of Navigation':
				sap.ui.getCore().byId("POIEdit").setVisible(false);
				sap.ui.getCore().byId("PONEdit").setVisible(false);
				sap.ui.getCore().byId("PON").setVisible(false);
				sap.ui.getCore().byId("POI").setVisible(false);
				break;
		};
	},

	aggiungiRigaPoi: function(e) {
		sap.ui.getCore().byId("POIEdit").setVisible(false);
		sap.ui.getCore().byId("PONEdit").setVisible(false);
		sap.ui.getCore().byId("PON").setVisible(false);
		sap.ui.getCore().byId("POI").setVisible(true);
	},

	generateGUID: function() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	},

	onSalvaPoi: function(e) {
		if (sap.ui.getCore().byId("nomePOINew").getValue() == '') {
			alert("Inserire Il nome del Point Of Interest");
		} else {
			if (sap.ui.getCore().byId("LatPoiNew").getValue() == '') {
				alert("Inserire le coordinate cliccando sulla mappa");
			} else {
				var oModel = context.getView().getModel("POIModel");
				var oEntry = {};
				oEntry.ID_LOCATION = id_location;
				oEntry.ID_POI = context.generateGUID() + context.generateGUID() + context.generateGUID() + context.generateGUID();
				oEntry.NOME = sap.ui.getCore().byId("nomePOINew").getValue();
				oEntry.LAT = sap.ui.getCore().byId("LatPoiNew").getValue();
				oEntry.LON = sap.ui.getCore().byId("LonPoiNew").getValue();
				oEntry.DATA_TYPE = sap.ui.getCore().byId("DataType").getSelectedItem().getText();
				oEntry.DATA = sap.ui.getCore().byId("TextNew").getValue();

				oModel.create("/POI", oEntry, {
					method: "POST",
					success: function(data) {
						alert("POI inserito correttamente");
						//window.location.reload(true);
					},
					error: function(e) {
						alert("POI non inserito");
					}
				});

			}
			sap.ui.getCore().byId("nomePOINew").setValue("");
			sap.ui.getCore().byId("LatPoiNew").setValue("");
			sap.ui.getCore().byId("LonPoiNew").setValue("");
			sap.ui.getCore().byId("DataType").setValue("");
			sap.ui.getCore().byId("TextNew").setValue("");
		}
	},

	onModificaPoi: function(evt) {
		sap.ui.getCore().byId("PON").setVisible(false);
		sap.ui.getCore().byId("POI").setVisible(false);
		sap.ui.getCore().byId("POIEdit").setVisible(true);
		if (evt.getSource().getParent().getParent().getItems().length > 0) {
			row = evt.getSource().getParent().getId(); //.slice(-1);
			row = row.substr(row.lastIndexOf("-") + 1);
			var oModel = this.getView().getModel("POIModel");
			var oTable = sap.ui.getCore().byId("tablePOI");
			var aItems = oTable.getItems();
			sap.ui.getCore().byId("nomePOI").setValue(aItems[row].getCells()[1].getText());
			sap.ui.getCore().byId("LatPoi").setValue(aItems[row].getCells()[2].getText());
			sap.ui.getCore().byId("LonPoi").setValue(aItems[row].getCells()[3].getText());
			sap.ui.getCore().byId("TextEdit").setValue(aItems[row].getCells()[5].getText());
			sap.ui.getCore().byId("DataTypeEdit").setValue(aItems[row].getCells()[4].getText());
			guid = aItems[row].getCells()[0].getText();
		}

	},

	onSalvaPoiEdit: function(e) {
		if (sap.ui.getCore().byId("nomePOI").getValue() == '') {
			alert("Inserire Il nome del Point Of Interest");
		} else {
			if (sap.ui.getCore().byId("LatPoi").getValue() == '') {
				alert("Inserire le coordinate cliccando sulla mappa");
			} else {
				var oModel = context.getView().getModel("POIModel");
				var oEntry = {};
				//oEntry.ID_POI = guid;
				oEntry.NOME = sap.ui.getCore().byId("nomePOI").getValue();
				oEntry.LAT = sap.ui.getCore().byId("LatPoi").getValue();
				oEntry.LON = sap.ui.getCore().byId("LonPoi").getValue();
				oEntry.DATA_TYPE = sap.ui.getCore().byId("DataTypeEdit").getSelectedItem().getText();
				oEntry.DATA = sap.ui.getCore().byId("TextEdit").getValue();

				oModel.update("/POI(ID_POI='" + guid + "',ID_LOCATION='" + id_location + "')", oEntry, {
					method: "PUT",
					success: function(data) {
						alert("POI modificato correttamente");
						//window.location.reload(true);
					},
					error: function(e) {
						alert("POI non modificato");
					}
				});

			}
		}
	},

	onCancellaPoi: function(evt) {

		if (evt.getSource().getParent().getParent().getItems().length > 0) {
			row = evt.getSource().getParent().getId().slice(-1);
			var oModel = this.getView().getModel("POIModel");
			var oTable = sap.ui.getCore().byId("tablePOI");
			var aItems = oTable.getItems();
			oModel.remove("/POI(ID_POI='" + aItems[row].getCells()[0].getText() + "',ID_LOCATION='" + id_location + "')", {
				method: "DELETE",
				success: function(data) {
					alert("POI cancellato");
				},
				error: function(e) {
					alert("POI non cancellato");
				}
			});

		}

		//alert(aItems[row].getCells()[0].getText());
	},

	onSalvaPonEdit: function(e) {
		if (sap.ui.getCore().byId("LatPon").getValue() == '') {
			alert("Inserire le coordinate cliccando sulla mappa");
		} else {
			var oModel = context.getView().getModel("PONModel");
			var oEntry = {};
			oEntry.LAT = sap.ui.getCore().byId("LatPon").getValue();
			oEntry.LON = sap.ui.getCore().byId("LonPon").getValue();

			oModel.update("/PON(ID_PON='" + guid + "', ID_LOCATION='" + id_location + "')", oEntry, {
				method: "PUT",
				success: function(data) {
					alert("PON modificato correttamente");
					//window.location.reload(true);
				},
				error: function(e) {
					alert("PON non modificato");
				}
			});

		}
	},

	aggiungiRigaPon: function(e) {
		sap.ui.getCore().byId("POIEdit").setVisible(false);
		sap.ui.getCore().byId("PONEdit").setVisible(false);
		sap.ui.getCore().byId("PON").setVisible(true);
		sap.ui.getCore().byId("POI").setVisible(false);
	},

	onSalvaPon: function(e) {
		if (sap.ui.getCore().byId("LatPonNew").getValue() == '') {
			alert("Inserire le coordinate cliccando sulla mappa");
		} else {
			var oModel = context.getView().getModel("PONModel");
			var oEntry = {};
			oEntry.ID_LOCATION = id_location;
			oEntry.ID_PON = context.generateGUID() + context.generateGUID() + context.generateGUID() + context.generateGUID();
			//oEntry.NOME = sap.ui.getCore().byId("nomePOINew").getValue();
			oEntry.LAT = sap.ui.getCore().byId("LatPonNew").getValue();
			oEntry.LON = sap.ui.getCore().byId("LonPonNew").getValue();

			oModel.create("/PON", oEntry, {
				method: "POST",
				success: function(data) {
					alert("PON inserito correttamente");
					//window.location.reload(true);
				},
				error: function(e) {
					alert("PON non inserito");
				}
			});

		}
		sap.ui.getCore().byId("nomePOINew").setValue("");
		sap.ui.getCore().byId("LatPoiNew").setValue("");
		sap.ui.getCore().byId("LonPoiNew").setValue("");
	},

	onModificaPon: function(evt) {
		sap.ui.getCore().byId("PON").setVisible(false);
		sap.ui.getCore().byId("POI").setVisible(false);
		sap.ui.getCore().byId("PONEdit").setVisible(true);
		if (evt.getSource().getParent().getParent().getItems().length > 0) {
			row = evt.getSource().getParent().getId().slice(-1);
			var oModel = this.getView().getModel("PONModel");
			var oTable = sap.ui.getCore().byId("tablePON");
			var aItems = oTable.getItems();
			sap.ui.getCore().byId("LatPon").setValue(aItems[row].getCells()[1].getText());
			sap.ui.getCore().byId("LonPon").setValue(aItems[row].getCells()[2].getText());
			guid = aItems[row].getCells()[0].getText();
		}
	},

	onCancellaPon: function(evt) {
		if (evt.getSource().getParent().getParent().getItems().length > 0) {
			row = evt.getSource().getParent().getId().slice(-1);
			var oModel = this.getView().getModel("PONModel");
			var oTable = sap.ui.getCore().byId("tablePON");
			var aItems = oTable.getItems();
			oModel.remove("/PON(ID_PON='" + aItems[row].getCells()[0].getText() + "',ID_LOCATION='" + id_location + "')", {
				method: "DELETE",
				success: function(data) {
					alert("PON cancellato");
				},
				error: function(e) {
					alert("PON non cancellato");
				}
			});

		}
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf wander-in.manage-map
	 */
	//	onExit: function() {
	//
	//	}

});