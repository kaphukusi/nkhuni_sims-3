var model = require('./models/db_model');
var knex = require('./config/bookshelf').knex;

var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

Users = model.Users;

		var password = 'test';
        var hash = bcrypt.hashSync(password);

        new Users({
              full_name: 'Administrator',
              user_name: 'admin', 
              password: hash,
              position: 'System Administrator',
              user_type_id: 001
            }).save().then(function(){
            	console.log('Default user successfully set');
            	process.exit(code=0);
            });
