const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsoption');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

//custom middleware logger
app.use(logger);

//cross origin resourse sharing middleware
app.use(cors(corsOptions));

//built-in middliware for form data
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());


//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/employees', require('./routes/api/employees'));

//i tied this but the client side preferred the json to the user friendly 404 page
// app.use((req, res) => {
//     res.status(404);
//     if (req.accepts('html')) {
//         res.sendFile(path.join(__dirname, 'views', '404.html'));
//     }
//     if (req.accepts('json')) {
//         res.json({ error: "404 Not Found" });
//     } else {
//         res.type('txt').send("404 Not Found");
//     }
// });

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

//well, i tried but it didn't work
// app.all('*', (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});