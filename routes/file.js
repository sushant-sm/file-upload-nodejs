const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const File = require("../models/file");
const middleware = require("../middleware");


router.get("/view", middleware.isLoggedIn, (req, res) => {
    File.find({}, (err, allfiles) => {
        if (err) {
          console.log("Error in find");
          console.log(err);
        } else {
          res.render("fileview", {
            files: allfiles.reverse(),
            currentUser: req.user,
          });
        }
      });

    // res.render('fileview');
});

router.get("/add", middleware.isLoggedIn, (req, res) => {
        res.render('fileupform');
});

router.post("/add", middleware.isLoggedIn, (req, res) => {
    if(req.files)
    {
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name;
        console.log(filename);

        file.mv('./public/uploads/'+filename, function(err)
        {
            if(err) {
                res.send(err)
            }
            else {
                console.log("File Uploaded");
            }
        })
        var name = req.body.name;
        var author = {
            id: req.user._id,
            username: req.user.username,
        };

        var newFile = {
            name: name,
            file: filename,
            author: author,
        };

        File.create(newFile, (err, newlyCreated) => {
            if(err)
            {
                console.log("Error inserting to DB");
            }
            else
            {
                res.redirect("/files/view");
            }
        })
    }
});

router.get("/:name", middleware.isLoggedIn, (req, res) => {
    //   Get all posts from DB
    File.find({ "author.username": req.params.name }, (err, allfiles) => {
      if (err) {
        console.log("Error in find");
        console.log(err);
      } else {
        console.log(allfiles);
        res.render("userview", {
          files: allfiles.reverse(),
          currentUser: req.user,
        });
      }
    });
  });


module.exports = router;