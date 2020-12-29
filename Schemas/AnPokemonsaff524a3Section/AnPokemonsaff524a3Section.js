define("AnPokemonsaff524a3Section", ["RightUtilities","ServiceHelper"], function(RightUtilities, ServiceHelper) {
	return {
		entitySchemaName: "AnPokemons",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		attributes: {
			"IsEnabled": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN
			}
		},
		diff: /**SCHEMA_DIFF*/[
			/*{
				"operation": "insert",
				"name": "AddPokemonButton",
				"parentName": "ActionButtonsContainer",
				"propertyName": "items",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"caption":	{
						"bindTo": "Resources.Strings.AddPokemonButtonCaption"
					},
					"click": {
						"bindTo": "onAddPokemonButtonClick"
					},
					"style": "green",
					"enabled": {
						"bindTo": "IsEnabled"
					}
				},
				"index": 3
			},*/
			{
				"operation": "insert",
				"name": "LikesButton",
				"parentName": "ActionButtonsContainer",
				"propertyName": "items",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"caption": {
						"bindTo": "Resources.Strings.LikesButtonCaption"
					},
					"click": {
						"bindTo": "onLikesButtonClick"
					},
					"style": "red"
				},
				"index": 4
			}
		]/**SCHEMA_DIFF*/,
		methods: {
			init: function(){
				//Лучше вынести в отдельный метод
				RightUtilities.checkCanExecuteOperations(["AnCanAddPokemon"],function(result) {
					this.set("IsEnabled", result.AnCanAddPokemon);
				},this);
				this.callParent(arguments);
			},
			addRecord: function(){
				//Не соблюдена табуляция
			var controlConfig = {
					text: {
						//Не соблюдена табуляция
					dataValueType: Terrasoft.DataValueType.TEXT,
					caption:this.get("Resources.Strings.DialogTitle")
					}
				};
				Terrasoft.utils.inputBox(this.get("Resources.Strings.inputBoxCaption"), function(buttonCode, controlData) {
					if (buttonCode === "ok") {
						ServiceHelper.callService(
						"AnPokemonService", "AddPokemon", function(response) {
							switch(response.AddPokemonResult){
								case "ok":
									this.showInformationDialog(this.get("Resources.Strings.ResultOk"));
									break;
								case "error":
									this.showInformationDialog(this.get("Resources.Strings.NotExist"));
									break;
								case "yes":
									this.showInformationDialog(this.get("Resources.Strings.AlreadyAdded"));
									break;
								default:
									this.showInformationDialog(response.AddPokemonResult);
									break;
							}
						}, {name:controlData.text.value}, this);
					}
				},["ok", "cancel"], this, controlConfig, {defaultButton: 0} );
			},
			onLikesButtonClick: function(){
				var id = this.get("ActiveRow");
				if (id==null){ 
					this.showInformationDialog(this.get("Resources.Strings.NotSelected") ); 
					return;
				}
				var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {rootSchemaName: "AnFavoritePokemonOfContact"});
				esq.addAggregationSchemaColumn("Id", Terrasoft.AggregationType.COUNT, "IdCOUNT");
				esq.filters.add("filterRoot", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "AnPokemon", id));
				esq.getEntityCollection(result => {
					this.showInformationDialog(this.get("Resources.Strings.HowManyLikes") + result.collection.collection.items[0].$IdCOUNT); 
				},this);
			}
		}
	};
});
