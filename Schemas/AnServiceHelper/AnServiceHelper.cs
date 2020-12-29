namespace Terrasoft.Configuration
{
	using System;
	using System.IO;
	using System.Net;
	using System.Web;
	using Terrasoft.Core;
	using Terrasoft.Core.DB;
	using Terrasoft.Core.Entities;
	using Terrasoft.Core.ImageAPI;
    // Лучше AnPokemonHelper или AnPokemonServerUtils
	public class AnServiceHelper
	{
		private UserConnection userConnection;
		private string leftExpressionColumnPath, rightExpressionParameterValue;
		private string sourceSchemaName;
		#region constructors
		public AnServiceHelper()
		{
		}
		/// <summary>
		/// detailed constructor
		/// </summary>
		/// <param name="sourceSchemaName">name of the schema that will be used in methods</param>	
		/// <param name="leftExpressionColumnPath">name of the column of schema</param>	
		/// <param name="rightExpressionParameterValue">value of columnn</param>	
		public AnServiceHelper(UserConnection userConnection, string sourceSchemaName, string leftExpressionColumnPath, string rightExpressionParameterValue) 
		{
			this.userConnection = userConnection;
			this.sourceSchemaName = sourceSchemaName;
			this.leftExpressionColumnPath = leftExpressionColumnPath;
			this.rightExpressionParameterValue = rightExpressionParameterValue;
		}
		public AnServiceHelper(UserConnection userConnection, string sourceSchemaName)
		{
			this.userConnection = userConnection;
			this.sourceSchemaName = sourceSchemaName;
		}
		#endregion
        
		#region public methods
        //Имена public методов должны начинаться с большой буквы
        //Имена методов должны быть понятны, непонятно, какой Id получает метод getId или что и куда вставляет метод insert
        //Между методами должна быть пустая строка, так легче читать код
		public string getId()
		{
			EntitySchemaQuery esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, sourceSchemaName);
			var colId = esq.AddColumn("Id");
			var esqfilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, leftExpressionColumnPath, rightExpressionParameterValue);
			esq.Filters.Add(esqfilter);
			EntityCollection collection = esq.GetEntityCollection(userConnection);
			return collection[0].GetColumnValue(colId.Name).ToString();
		}
		public bool isAdded()
		{
			EntitySchemaQuery esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, sourceSchemaName);
			var colId = esq.AddColumn("Id");
			var esqfilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, leftExpressionColumnPath, rightExpressionParameterValue);
			esq.Filters.Add(esqfilter);
			EntityCollection collection = esq.GetEntityCollection(userConnection);
			if (collection.Count == 0)
			{
				return false;
			}
			return true;
		}
		public void insert()
		{
            /* правильнее вот так
             bool isAdded = isAdded();
             if(isAdded){
                return; 
            }
             */
			if (isAdded()) return;
            /*Правильнее вот так
                 Insert insertMove = new Insert(userConnection)
                    .Into(sourceSchemaName)
                    .Set("Name", Column.Parameter(rightExpressionParameterValue));
             */
            var insertMove = new Insert(userConnection).Into(sourceSchemaName).Set("Name", Column.Parameter(rightExpressionParameterValue));
			insertMove.Execute();
            // непонятно, зачем тут Sselect, если результат нигде не используется
            var selectMove = new Select(userConnection)
				.Column("Id")
				.From(sourceSchemaName)
				.Where("Name").IsEqual(Column.Parameter(rightExpressionParameterValue)) as Select;
            selectMove.ExecuteScalar<Guid>().ToString();

		}
        /// <summary>
        /// method to insert data to detail (many-to-many)
        /// </summary>
        /// <param name="sourceSchemaName">name of the deail object</param>	
        /// <param name="sourceColumnAlias1">name of the 1st column</param>	
        /// <param name="sourceExpression1">value to insert in 1st column</param>	
        /// <param name="sourceColumnAlias2">name of the 2nd column</param>	
        /// <param name="sourceExpression2">value to insert in 2nd column</param>	
        //Непонятны названия переменных, если sourceExpression1 и sourceExpression2 - это Id, то тип данных должен быть Guid
        public void insert(string sourceSchemaName, string sourceColumnAlias1, string sourceExpression1, string sourceColumnAlias2, string sourceExpression2)
		{
			var insertPM = new Insert(userConnection).Into(sourceSchemaName)
				.Set(sourceColumnAlias1, Column.Parameter(sourceExpression1))
				.Set(sourceColumnAlias2, Column.Parameter(sourceExpression2));
			insertPM.Execute();
		}
		/// <summary>
		/// method to insert new pokemon to DB using properties of AnPokemonProxy object
		/// </summary>
		/// <param name="pokemon">object which needs to be inserted</param>	
        // Логичнее было бы назвать метод CreatePokemon или InsertPokemon, не вижу смысла использовать перегрузку
		public void insert(AnPokemonProxy pokemon)
		{
			var insertPok = new Insert(userConnection).Into(sourceSchemaName)
				.Set("AnName", Column.Parameter(pokemon.Name))
				.Set("AnHeight", Column.Parameter(pokemon.Height))
				.Set("AnWeight", Column.Parameter(pokemon.Weight))
				.Set("AnWeightAndHeight", Column.Parameter(pokemon.Weight + pokemon.Height))
				.Set("AnLookup_PokemonTypeId", Column.Parameter(pokemon.TypeId))
				.Set("AnImageLinkId", Column.Parameter(pokemon.ImageId));
			insertPok.Execute();
		}
        /// <summary>
        /// method to insert image from url to DB and set the relevant property of pokemon object
        /// </summary>
        /// <param name="pokemon">object which property needs to be set</param>	
        // Правильнее
        // public Guid InsertImage
        public void setImageId(AnPokemonProxy pokemon)
		{
			var imageApi = new ImageAPI(userConnection);
			WebRequest imageRequest = WebRequest.Create(pokemon.ImageURL);
			MemoryStream Image = new MemoryStream();
			imageRequest.GetResponse().GetResponseStream().CopyTo(Image);
            //.ToString() - неправильно, т.к., если метод возвращает Guid, то работать надо с Guid, а не string
            //"image/png" - неправильно, т.к. изображение может быть в другом формате, правильнее было бы получить Mime type из расширения
            pokemon.ImageId = imageApi.Save(Image, "image/png", $"An{pokemon.Name}Image").ToString();
            // Правильнее 
            // Guid result = imageApi.Save(Image, "image/png", $"An{pokemon.Name}Image");
            // reurn result;
        }
        #endregion
    }
}