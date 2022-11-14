const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('This is service of our project . Today is ' + new Date());
});




app.listen(port,()=>{
	console.log(`Server start listening port: ${port}`);
});
