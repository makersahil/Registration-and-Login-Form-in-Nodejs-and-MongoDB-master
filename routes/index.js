var express = require('express');
var router = express.Router();
var User = require('../models/user');
var nodemailer = require('nodemailer');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});




router.post('/', function (req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, function (err, data) {
				if (!data) {
					var c;
					User.findOne({}, function (err, data) {

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						var newPerson = new User({
							unique_id: c,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function (err, Person) {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, data) {
		if (data) {

			if (data.password == req.body.password) {
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({ "Success": "Success!" });

			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

// 404 page
// router.use((req, res, next) => {
// 	res.status(404).render('404.ejs');
//   });

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/');
		} else {
			//console.log("found");
			return res.render('data.ejs', { "name": data.username, "email": data.email });
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, data) {
		console.log(data);
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
			// res.send({"Success":"Success!"});
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save(function (err, Person) {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});

// router.get('/dashboard', function (req, res, next) {
// 	return res.render("dashboard.ejs");
// });

router.get('/dashboard', function (req, res, next) {
	console.log("dashboard");
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/');
		} else {
			//console.log("found");
			return res.render('dashboard.ejs', { "name": data.username, "email": data.email });
		}
	});
});

router.post('/review', function (req, res, next) {
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/');
		} else {
			// console.log("found");
			const { paymentType, studentID, semester, year, amount, remarks} = req.body;
			console.log(`Received form data: year=${semester}, year=${year}, ${e=data.username}, ${studentID}`);
			// var transporter = nodemailer.createTransport({
			// 	service: 'gmail',
			// 	auth: {
			// 	  user: 'sahilkguptaprivate@gmail.com',
			// 	  pass: 'Sahil##123'
			// 	}
			//   });
			//   var mailOptions = {
			// 	from: 'sahilkguptaprivate@gmail.com',
			// 	to: data.email,
			// 	subject: 'Your amazing reciept!',
			// 	html: '<h1>Reciept<h1><br><br><p> Here is your payment details: Test Payment service! <p>'
			//   };
			//   transporter.sendMail(mailOptions, function(error, info){
			// 	if (error) {
			// 	  console.log(error);
			// 	} else {
			// 	  console.log('Email sent: ' + info.response);
			// 	}
			//   });
			return res.render(`review.ejs`, { "name": data.username, "email": data.email, "paymentType": paymentType, "studentID": studentID, "semester": semester, "year": year, "amount": amount, "remarks": remarks });
		}
	});


});


router.get('/review', function (req, res, next) {
	console.log("review");
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/');
		} else {
			//console.log("found");
			return res.render('review.ejs', { "name": data.username, "email": data.email });
		}
	});
});

router.get('/success', function (req, res, next) {
	// console.log("review");
	// User.findOne({ unique_id: req.session.userId }, function (err, data) {
	// 	console.log("data");
	// 	console.log(data);
	// 	res.render('success.ejs');
	// });
	res.render('success.ejs')
})

module.exports = router;