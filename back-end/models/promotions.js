var mongoose = require('mongoose')
var Schema = mongoose.Schema;

//Will add currency to mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var promoSchema = new Schema({
	name:{
		type: String,
		required: true,
		unique: true
	},
	image:{
		type: String,
		required: true
	},
	label: {
		type: String,
		default: ""
	},
	price: {
		type: Currency,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	featured:{
		type: Boolean,
		required: true
	}
},{
	timestamps: true
});

var Promotions = mongoose.model('Promotion', promoSchema);

module.exports = Promotions;