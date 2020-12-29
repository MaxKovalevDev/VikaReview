namespace Terrasoft.Configuration
{
	using Newtonsoft.Json;
	using Newtonsoft.Json.Linq;
	using System.Collections.Generic;
	public class AnPokemonProxy
	{
		#region constructor
		public AnPokemonProxy()
		{
		}
		#endregion
		#region properties
		/// <summary>
		/// name of pokemon got while deserialization
		/// </summary>
		[JsonProperty("name")]
		public string Name { get; set; }

		/// <summary>
		/// weight of pokemon got while deserialization
		/// </summary>
		[JsonProperty("weight")]
		public decimal Weight { get; set; }

		/// <summary>
		/// height of pokemon got while deserialization
		/// </summary>
		[JsonProperty("height")]
		public decimal Height { get; set; }

		/// <summary>
		/// this will be calculated field
		/// </summary>
		public decimal WeightAndHeight { get; set; }

		/// <summary>
		/// url of image got while parsing the util-collection
		/// </summary>
		public string ImageURL {
			get
			{
				return SpritesUtil["front_default"].ToString();
			}
		}

		/// <summary>
		/// type of pokemon got while parsing the util-collection
		/// </summary>
		public string Type
		{
			get
			{
				return TypesUtil[0]["type"]["name"].ToString();
			}
		}

		/// <summary>
		/// array of moves of pokemon got while parsing the util-collection
		/// </summary>
		public string[] Moves
		{
			get
			{
				int count = MovesUtil.Count;
				if (count > 10) count = 6;
				string[] moves = new string[count];
				for (int i = 0; i < count; i++)
				{
					moves[i] = MovesUtil[i]["move"]["name"].ToString();
				}
				return moves;
			}
		}

		/// <summary>
		/// id of pokemon in DB
		/// </summary>
		public string Id { get; set; }

		/// <summary>
		/// id of type of pokemon in DB
		/// </summary>
		public string TypeId { get; set; }

		/// <summary>
		/// id of image of pokemon in DB
		/// </summary>
		public string ImageId { get; set; }

		/// <summary>
		/// collection of json objects which are parsed in 'Type' getter
		/// </summary>
		[JsonProperty("types")]
		private List<JObject> TypesUtil { get; set; }

		/// <summary>
		/// collection of json objects which are parsed in 'ImageURL' to get the front image of pokemon
		/// </summary>
		[JsonProperty("sprites")]
		private JObject SpritesUtil { get; set; }

		/// <summary>
		/// collection of json objects which are parsed in 'Moves' to get the array of moves of pokemon
		/// </summary>
		[JsonProperty("moves")]
		private List<JObject> MovesUtil { get; set; }
		#endregion
	}
}
