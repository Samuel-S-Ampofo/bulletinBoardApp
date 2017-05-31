// app set structure settup.

const express = require('express');
const app = express()
const pg = require('pg')
// var fs = require('fs');
var bodyParser = require("body-parser")
app.use('/', bodyParser());


app.set('views', 'views');
app.set('view engine', 'pug');


var connectionString = "bulletinboard://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard";


app.use('/', express.static('./public'));  // static file setup link tyhen on the pug


app.get('/', function (req, res){
  res.render('login')
}) // logon home html 

let isLoggedIn = false

app.post('/login', function (req, res){
	console.log('/login')
	pg.connect(connectionString, function (err, client, done) {
		client.query('select * from  bulletuser', function (err, result) {
			console.log('result.rows', result)
			for (var i = 0; i < result.rows.length; i++) {
				const user = result.rows[i]
				if(user.email === req.body.email && user.password === req.body.password){
					isLoggedIn = true
				}
			}
		})
		done()
		pg.end()
	})

  res.redirect('/home')
}); 




app.get('/home', function (req, res){
	console.log("test")
	pg.connect(connectionString, function (err, client, done) {
		client.query('select * from  bulletinmessage', function (err, result) {
			
			console.log('result.rows');
			console.log(result.rows)

			var messages = result.rows

			done();
			pg.end();// the client will idle for another 30 seconds, temporarily preventing the app from closing, unless this function is called
		

			res.render('home',{
		      messages: messages,
		      loggedInMessage: isLoggedIn?"user is logged in":" "
		    });
		});
	});
});



app.get('/messages', function (req, res){
  res.render('messages')
})

app.post('/messages', function (req, res){

	const messagetittle = req.body.messageTittle
	const message = req.body.messAge
	const messagedate = req.body.date

// how to connetc the user to message????//

	//connect to a database
pg.connect( connectionString, function(err, client, done){
  //add a new hat
  client.query("insert into bulletinmessage (title, message , date)  values ( '"+ messagetittle + "','" + message + "','" + messagedate + "')",
   function(err, result) {
   	if (err) {
   		throw err
   	}
    //call done and end, same as the read example
    done();
    pg.end();
  });
});

  res.redirect('/home')
})


app.get('/signup', function (req, res){

  res.render('signup')
})

app.post('/signup', function (req, res){


	const userfirstname = req.body.firstName
	const userlastname = req.body.lastName
	const useremail = req.body.email
	const userpassword = req.body.password

// how to connetc the user to message????//

	//connect to a database
pg.connect( connectionString, function(err, client, done){
  //add a new hat
  client.query("insert into bulletuser ( firstname , lastname , email, password )  values ( '"+ userfirstname + "','" + userlastname + "','" + useremail + "','" + userpassword +"')",
   function(err, result) {
   	if (err) {
   		throw err
   	}
    //call done and end, same as the read example
    done();
    pg.end();
  });
});

  res.redirect('/')
})

const listener = app.listen(3000, () => {
    console.log('server has started at ', listener.address().port)
})



// //set up basic structure 

// must reender only the 







// // Bulletin Board Application Create a website that allows people to post messages to a page. A message consists of a title and a body. The site should have two pages:

// // The first page shows people a form where they can add a new message.
// // The second page shows each of the messages people have posted. Make sure there's a way to navigate the site so users can access each page.
// // Messages must be stored in a postgres database. Create a "messages" table with three columns: column name / column data type:

// // id: serial primary key
// // title: text
// // body: text
// // Additional Grading Criteria

// // As before, your package.json must include the correct dependencies.

// // Additionally, you must configure postgres as follows: Name your database "bulletinboard". 
// //Your postgres username must be read from an environment variable named "POSTGRES_USER". Your postgres password (if present) must be read from an environment variable named "POSTGRES_PASSWORD"

// // Thus, your connection string in the code will appear as follows:

// // var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';
// // set an environment variable by opening either ~/.bash_profile for OSX or ~/.bashrc for Linux and adding the line:

// // export POSTGRES_USER=jon
// // export POSTGRES_PASSWORD=mypassword
// // After that, restart your terminal to propagate these changes to your shell.

// // This will allow your assignments to be graded without having to go into your code and change your connection string to his configuration.