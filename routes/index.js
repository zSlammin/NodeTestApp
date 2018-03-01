var express = require('express');
var router = express.Router();
var Request = require('tedious').Request;

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('Reading rows from the Table...');
	rows = []
	request = new Request(
			"SELECT TOP 100 PERCENT * FROM Persons",
			function(err, rowCount, rows)
			{
				if (err){
					console.log(err)
				}
				console.log(rowCount + ' row(s) returned');
				
			}
		)
	request.on('row', function(columns) {
		row = {}
		columns.forEach(function(column){
			console.log(column)
			console.log("%s\t%s", column.metadata.colName, column.value);
			row[column.metadata.colName] = column.value
		});
		rows.push( row )
		
	});
	request.on('requestCompleted', function(){
		res.render('index', { title: 'Express', rows: rows });
	})
	request.on('error', function(err){
		res.send("There was an error loading the database: " + err)
	})
	req.db.execSql(request)
});

router.get('/newuser', function(req,res){
	res.render('newuser', {title: 'Add New User'});
})

router.post('/adduser', function(req,res){
 var db = req.db;
 var firstName = req.body.firstname;
 var lastName = req.body.lastname;

 request = new Request("INSERT INTO Persons (FirstName, LastName) VALUES ('"+firstName+"', '"+lastName+"');", function(err){
		console.log("added successfully")
		if (err){
					res.send("There was a problem adding the information to the database")
				}
				else{
					res.redirect("/")
				}
	})
	db.execSql(request)

})

module.exports = router;
