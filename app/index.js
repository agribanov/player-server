const app = require('express')(),
    router = require('./router');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router(app);

app.listen(process.env.PORT || 3000);