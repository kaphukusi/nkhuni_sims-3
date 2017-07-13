var model = require('./models/db_model');
var knex = require('./config/bookshelf').knex;

var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

Users = model.Users;

		var password = 'test';
    var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        new Users({
              full_name: 'Administrator',
              user_name: 'admin', 
              password: password,
              user_type_id: 001
            }).save().then(function(){
            	console.log('Default user successfully set');
            	process.exit(code=0);
            });