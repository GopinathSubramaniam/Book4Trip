define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/header.html',
	'text!templates/models/register.html',
	'text!templates/models/login.html',
	'../models/user'
    ], function($, _, Backbone, headerTemplate, RegisterTemplate, LoginTemplate, UserModel){
	'use strict';
	
	var HeaderView = Backbone.View.extend({
		
		template: _.template(headerTemplate+RegisterTemplate+LoginTemplate), // Creating template by adding Register and Login template with header 
		
		events: {
			'submit form#registerForm' : 'register',
			'submit form#loginForm' : 'login'
		},
		
		initialize: function () {
			this.model = new UserModel();
			this.render();
		},
		
		render: function () {
			console.log('Header = ', Backbone);
			this.$el.html(this.template());
			return this;
		},
		
		register: function(ev){
			ev.preventDefault();
			console.log('register called');
			var data = this.$el.find('#registerForm').serializeObject(ev.currentTarget);// Fetching form model
			this.model.set(data); //Setting form object to Backbone Model 
			if(this.model.isValid() && this.model.attributes.conformPassword === this.model.attributes.password){
				new UserModel().save(this.model.attributes, {
					success: function(model, respose, options){
						console.log('After Save Success :::: ', model, respose, options);
					},
					error: function(model, xhr, options){
						console.log('After Save Error:::: ', model, xhr, options);
					}
				});
				$('#registerModal').modal('hide');
			}else{
				console.log('FAILED');
			}
			
		},
		
		login: function(ev){
			ev.preventDefault();
			console.log('login called');
			var data = this.$el.find('#loginForm').serializeObject(ev.currentTarget);// Fetching form model
			var appConstant = new AppConstant();
			this.model.url = '/app/login';
			this.model.save(data, {
				success: function(model, respose, options){
					console.log('After Save Success :::: ', model, respose, options);
					window.sessionStorage.setItem('uname', respose.obj.name);
					window.sessionStorage.setItem('pass', respose.obj.password);
					window.location.href = '/';
				},
				error: function(model, xhr, options){
					console.log('After Save Error:::: ', model, xhr, options);
				}
			});
			if(appConstant.validate(data.email) && appConstant.validate(data.password)){
				console.log('SUCCESS');	
				
			}else{
				console.log('FAILED');
			}
		}
	      
	});
	return HeaderView;
});