define("AnPokemons1Page", [], function() {
	return {
		entitySchemaName: "AnPokemons",
		attributes: {
			"ButtonEnabled": {
			"dataValueType": Terrasoft.DataValueType.BOOLEAN,
			"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
			"value": true
			},
			"AnWeightAndHeight": {
				dataValueType: Terrasoft.DataValueType.FLOAT,
				dependencies: [
					{
					columns: ["AnWeight", "AnHeight"],
					methodName: "addWeightToHeight"
					}
				]
			},
			"AnLookup_PokemonType": {
				"dataValueType": Terrasoft.DataValueType.LOOKUP,
				"lookupListConfig": {
					"filters": [
						function() {
						var filterGroup = Ext.create("Terrasoft.FilterGroup");
						//лучше давать осмысленное название фильтру
						filterGroup.add("f",
						Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.NOT_START_WITH,"Name", "f"));
						return filterGroup;
						}
					]
				}
			}
		},
		//не должно быть закомменченных кусков кода
		/*messages: {
			"Get": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.PUBLISH
			},
			"Set": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
			}
		},*/
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "AnPokemonsFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "AnPokemons"
				}
			},
			"AnFavoritePokemonOfContactDetail10253d8b": {
				"schemaName": "AnFavoritePokemonOfContactDetail",
				"entitySchemaName": "AnFavoritePokemonOfContact",
				"filter": {
					"detailColumn": "AnPokemon",
					"masterColumn": "Id"
				}
			},
			"AnPokemonMoveDetailddd3892a": {
				"schemaName": "AnPokemonMoveDetail",
				"entitySchemaName": "AnPokemonMove",
				"filter": {
					"detailColumn": "AnPokemon",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		methods: {
			//между методами должна быть пустая строка - то облегчает чтение
			addWeightToHeight: function() {
				var weight = this.get("AnWeight");
				if (!weight) {
					weight = 0;
				}
				var height = this.get("AnHeight");
				if (!height) {
					height = 0;
				}
				var result = weight + height;
				this.set("AnWeightAndHeight", result);
			},
			beforePhotoFileSelected: function() {return true;},
			getPhotoSrcMethod: function() {
				var imageColumnValue = this.get("AnImageLink");
				if (imageColumnValue) {
					return this.getSchemaImageUrl(imageColumnValue);
				}
				return this.Terrasoft.ImageUrlBuilder.getUrl(this.get("Resources.Images.AnImagePokeEgg"));
			},
			onPhotoChange: function(photo) {
				if (!photo) {
					this.set("AnImageLink", null);
					return;
				}
				this.Terrasoft.ImageApi.upload({
					file: photo,
					onComplete: this.onPhotoUploaded,
					onError: this.Terrasoft.emptyFn,
					scope: this
				});
			},
			onPhotoUploaded: function(imageId) {
				var imageData = {
					value: imageId,
					displayValue: "Image"
				};
				this.set("AnImageLink", imageData);
			},
			weightValidator: function() {
				var invalidMessage = "";
				if (this.get("AnWeight") < 0) {
					invalidMessage = this.get("Resources.Strings.WeightLessThanZero");
				}
				return {invalidMessage: invalidMessage};
			},
			setValidationConfig: function() {
				this.callParent(arguments);
				this.addColumnValidator("AnWeight", this.weightValidator);
			},
			getAddRecordButtonVisible: function() {
				return this.getToolsVisible();
			},
			//не должно быть закомменченных кусков кода
			/*
			onAllPokemonsButtonClick: function() {
				const esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {rootSchemaName: "AnPokemons"});
				esq.addColumn("AnName");
				var res="";
				esq.getEntityCollection(function (result) {
					if (result.success && result.collection.getCount() > 0) {
						for (let i = 0; i < result.collection.getCount(); i++)
						{
							var item = result.collection.getByIndex(i);
							res += item.get("AnName")+"\n";
						}
						this.showConfirmationDialog(res, function(returnCode) {
							if (returnCode === this.Terrasoft.MessageBoxButtons.NO.returnCode) {
								return;
							}
							this.save({
								isSilent: true,
								callback: this.insertImagesAfterRecordSaved,
								scope: this
							});
						}, [this.Terrasoft.MessageBoxButtons.OK.returnCode, this.Terrasoft.MessageBoxButtons.CANCEL.returnCode]);
					}
				}, this);
			},
			onAddPokemonButtonClick: function() {
				var controlConfig = {
					text: {
					dataValueType: Terrasoft.DataValueType.TEXT,
					caption:"Введите имя" }
				};
				var Text = Ext.String.format(this.get("Resources.Strings.LikesButtonCaption"));
				Terrasoft.utils.inputBox(Text, function(buttonCode, controlData) {
					if (buttonCode === "ok") { this.showInformationDialog("Пок добавлен"); }
				},["ok", "cancel"], this, controlConfig, {defaultButton: 0} );
			},
			
			onLikesButtonClick: function(){
				this.sandbox.subscribe("Set", function(arg) {
					if(arg.value>0){
						this.showInformationDialog(this.get("Resources.Strings.HowManyLikes")+arg.value);
					}
				}, this, [this.sandbox.id]);
				this.sandbox.publish("Get", {sandboxId: [this.sandbox.id]}, [this.sandbox.id]);
				/*
				var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {rootSchemaName: "AnFavoritePokemonOfContact"});
				esq.addAggregationSchemaColumn("Id", Terrasoft.AggregationType.COUNT, "IdCOUNT");
				esq.filters.add("filterRoot", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "AnPokemon", this.$Id));
				esq.getEntityCollection(result => {
					this.showInformationDialog(Ext.String.format("Этот покемон нравится {0} юзерам",result.collection.collection.items[0].$IdCOUNT)); 
				},this);
			},*/
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			/*{
				"operation": "insert",
				"name": "LikesButton",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "Resources.Strings.LikesButtonCaption"
					},
					"click": {
						"bindTo": "onLikesButtonClick"
					},
					"style": "red"
				},
				"index": 0
			},*/
			{
				"operation": "insert",
				"name": "AnNamef603a3a0-d621-4e8b-bfe9-1774314ed98a",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 10,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "AnName"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "AnLookup_PokemonTypedae8aa78-1382-4dc0-a35c-1680f071c593",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 10,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "AnLookup_PokemonType"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "AnName44722a23-24ce-4c4b-8c86-f178a4ca6b6f",
				"values": {
					"layout": {
						"colSpan": 7,
						"rowSpan": 1,
						"column": 3,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "AnName"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "AnLookup_PokemonType23073408-b5f1-426a-819f-8b0eac21ca5e",
				"values": {
					"layout": {
						"colSpan": 7,
						"rowSpan": 1,
						"column": 3,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "AnLookup_PokemonType"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "PhotoContainer",
				"values": {
					"itemType": 7,
					"wrapClass": [
						"image-edit-container"
					],
					"layout": {
						"colSpan": 3,
						"rowSpan": 5,
						"column": 0,
						"row": 1
					},
					"items": []
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "AnImage",
				"values": {
					"getSrcMethod": "getPhotoSrcMethod",
					"onPhotoChange": "onPhotoChange",
					"beforeFileSelected": "beforePhotoFileSelected",
					"readonly": false,
					"generator": "ImageCustomGeneratorV2.generateCustomImageControl"
				},
				"parentName": "PhotoContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "AnWeighte48a2639-8cb2-45e8-a4c0-29dfd1f2b96a",
				"values": {
					"layout": {
						"colSpan": 7,
						"rowSpan": 1,
						"column": 3,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "AnWeight"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "AnHeighte83e68fc-a29c-4afd-8c2b-a346351b1fd6",
				"values": {
					"layout": {
						"colSpan": 7,
						"rowSpan": 1,
						"column": 3,
						"row": 3,
						"layoutName": "Header"
					},
					"bindTo": "AnHeight"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "AnWeightAndHeightd27e2e90-1557-4c82-bad2-a20d38163910",
				"values": {
					"layout": {
						"colSpan": 7,
						"rowSpan": 1,
						"column": 3,
						"row": 4,
						"layoutName": "Header"
					},
					"bindTo": "AnWeightAndHeight"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 0
				}
			},
			{
				"operation": "insert",
				"name": "AnFavoritePokemonOfContactDetail10253d8b",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "ESNTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "AnPokemonMoveDetailddd3892a",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "ESNTab",
				"propertyName": "items",
				"index": 2
			}
		]/**SCHEMA_DIFF*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"AnWeight": {
				"a1afc9c7-4329-49ea-8868-7335314cded6": {
					"uId": "a1afc9c7-4329-49ea-8868-7335314cded6",
					"enabled": true,
					"removed": true,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "AnLookup_PokemonType"
							}
						}
					]
				},
				"ee4ceac9-f5ab-47ed-90f6-cd2547e554a5": {
					"uId": "ee4ceac9-f5ab-47ed-90f6-cd2547e554a5",
					"enabled": false,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "AnLookup_PokemonType"
							}
						}
					]
				}
			},
			"AnHeight": {
				"3ffe88a9-f8a4-4ba3-b874-a556ce2cc5c7": {
					"uId": "3ffe88a9-f8a4-4ba3-b874-a556ce2cc5c7",
					"enabled": true,
					"removed": true,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "AnLookup_PokemonType"
							}
						}
					]
				},
				"7470fae2-d3df-43cb-b503-b627b309e9c1": {
					"uId": "7470fae2-d3df-43cb-b503-b627b309e9c1",
					"enabled": false,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "AnLookup_PokemonType"
							}
						}
					]
				}
			},
			"AnWeightAndHeight": {
				"a17f2775-1eea-44ed-acc3-bbbaa03eb14c": {
					"uId": "a17f2775-1eea-44ed-acc3-bbbaa03eb14c",
					"enabled": false,
					"removed": true,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "AnWeight"
							}
						},
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "AnHeight"
							}
						}
					]
				},
				"33718432-c83b-466c-9146-8882a2820bcc": {
					"uId": "33718432-c83b-466c-9146-8882a2820bcc",
					"enabled": false,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "AnLookup_PokemonType"
							}
						}
					]
				}
			},
			"ESNTabGroup6ba98151": {
				"5fd9d1b4-9662-48cf-9476-c79e420ba736": {
					"uId": "5fd9d1b4-9662-48cf-9476-c79e420ba736",
					"enabled": false,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "AnLookup_PokemonType"
							}
						}
					]
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
	};
});
