define("AnFavoritePokemonOfContactDetail", ["LookupMultiAddMixin"], function() {
	return {
		entitySchemaName: "AnFavoritePokemonOfContact",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/,
		mixins: {
			LookupMultiAddMixin: "Terrasoft.LookupMultiAddMixin"
		},
		messages: {
			"Get": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
			},
			"Set": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.PUBLISH
			}
		},
		methods: {
			init: function() {
				this.callParent(arguments);
				this.mixins.LookupMultiAddMixin.init.call(this);
				/*this.sandbox.subscribe("Get", 
					function(arg){
						this.sandbox.publish("Set", { vaue: "value" }, [arg.sandboxId]);
					}, this, [this.getPokemonPageSandboxId()]);*/
				var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {rootSchemaName: "AnFavoritePokemonOfContact"});
				esq.addAggregationSchemaColumn("Id", Terrasoft.AggregationType.COUNT, "IdCOUNT");
				esq.filters.add("filterRoot", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "AnPokemon", this.getMasterRecordId()));
				esq.getEntityCollection(result => {
						this.sandbox.subscribe("Get", 
					function(arg){
					this.sandbox.publish("Set", { value: result.collection.collection.items[0].$IdCOUNT }, [this.getPokemonPageSandboxId()]);
					}, this, [this.getPokemonPageSandboxId()]);
				},this);
			},
			getPokemonPageSandboxId: function() {
				var index = this.sandbox.id.indexOf("_detail");
				return this.sandbox.id.substring(0, index);
			},
			getAddRecordButtonVisible: function() {
				var cardPageName = this.get("CardPageName");
				if (cardPageName!=="AnPokemons1Page"){return this.getToolsVisible();}
			},
			onCardSaved: function() {
				this.openLookupWithMultiSelect(true);
			},
			addRecord: function() {
				this.openLookupWithMultiSelect(true);
			},
			getMultiSelectLookupConfig: function() {
				return {
					rootEntitySchemaName:"Contact",
					rootColumnName: "AnContact",
					relatedEntitySchemaName:"AnPokemons",
					relatedColumnName: "AnPokemon"
				};
			}
		}
	};
});