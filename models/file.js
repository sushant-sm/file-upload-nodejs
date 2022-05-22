const mongoose = require("mongoose");

var fileSchema = mongoose.Schema({
  name: String,
  file: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});

module.exports = mongoose.model("File", fileSchema);
