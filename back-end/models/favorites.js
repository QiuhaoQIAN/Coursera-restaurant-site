var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var favoritesSchema = new Schema({
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	dishes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Dish'	
		}
	]
},
	{
		timestamps : true
	}
);



module.exports = mongoose.model('Favorites', favoritesSchema);