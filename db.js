const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/streamline",{useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection

module.exports=db