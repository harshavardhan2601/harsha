var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');


function randomString(length) {
  chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/main');
});

router.get('/login', function(req, res, next) {
  res.render('admin/login');
});

router.get('/signup', function (req, res, next) {
  res.render('admin/signup');
});

router.get('/forgot', function (req, res, next) {
  res.render('admin/forgot');
});

router.get('/newpassword', function (req, res, next) {
  res.render('admin/newpassword');
});

router.get('/reset', function (req, res, next) {
  res.render('admin/login');
});

//file uploading  in uploading folder 
router.post('/uploadfiles', function(req, res) {
  //console.log(req.body);
  var data = req.body.data;
  var filedata = data.filedata;
  try {
      fileId = randomString(10);
      // ImageToPdf(fileId, filedata.filetype);
      //
      if (filedata.filetype == 'image/jpeg') fileId = '/uploads/' + fileId + ".jpeg";
      if (filedata.filetype == 'image/jpg') fileId = '/uploads/' + fileId + ".jpg";
      if (filedata.filetype == 'image/png') fileId = '/uploads/' + fileId + ".png";
      if (filedata.filetype == 'application/pdf') fileId = '/uploads/' + fileId + ".pdf";
      if (filedata.filetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') fileId = '/uploads/' + fileId + ".docx";
      if (filedata.filetype == 'application/msword') fileId = '/uploads/' + fileId + ".doc";
      fs.writeFile('public/' + fileId, new Buffer(filedata.base64, "base64"), function(err) {
          if (err) {
              // console.log(err);
              var res_data = { status: 0, message: 'error while uploading' };
              // res.send(commonData.oecy(res_data));

          } else {
              var res_data = { status: 1, message: 'Uploaded Successfully', savedpath: fileId };
              res.send(res_data);
          }
      });
  } catch (e) {
      console.log("Error ==" + e);
  }

});


router.post('/unlinkFile', function (req, res, next) {
  // console.log(req.body.filename); 
  const path = req.body.filename
  //console.log(path);
  //console.log(path);
  fs.unlink('public/' + path, (err) => {
    if (err) {
      console.error(err)
      return
    } else {
      console.log('File Deleted');
    }
    //file removed
  })
});

//login session//
router.post('/page', function (req, res, next) {
  var reqs = req.body;
  console.log(reqs);
  mongoose.model('signup').find({ email: reqs.email, password: reqs.password })
    .then((newSignupObj) => {
      console.log(newSignupObj);
      if (newSignupObj.length > 0) {

        req.session.user_id = newSignupObj[0]._id;
        req.session.email_id = newSignupObj[0].email;
        console.log('_id======' + req.session.user_id);
        console.log('_id======' + req.session.email_id);
        console.log({ status: 1, massage: 'Success' });
        res.render('admin/page');
      } else {
        res.json({ status: 2, massage: 'Failure' });
      }

    })
});

router.get('/logout', function (req, res) {
  console.log(req.session);
  req.session.destroy();
  console.log(req.session);
  res.clearCookie('x_access_token');
  res.cookie('auth', false);
  res.redirect('/')
});



router.get('/History', function (req, res, next) {
  res.render('admin/History');
});

router.get('/phonenumber', function (req, res, next) {
  res.render('admin/phonenumber');
});


// profile page//
router.get('/Profile', function (req, res, next) {
  var s = req.session.user_id
  console.log(s);
  mongoose.model('signup').find({ _id:s })
    .then((newSignupObj) => {
      console.log(newSignupObj);
      if (newSignupObj.length > 0) {
        res.render('admin/Profile',{newSignupObj:newSignupObj});

      }
    })
  });


// Edit page//
router.get('/Edit', function (req, res, next) {
  var s = req.session.user_id
  console.log(s);
  mongoose.model('signup').find({ _id:s })
    .then((newSignupObj) => {
      console.log(newSignupObj);
      if (newSignupObj.length > 0) {
        res.render('admin/Edit',{newSignupObj:newSignupObj});

      }
    })
  });

router.get('/Change', function (req, res, next) {
  res.render('admin/Change');
});

router.get('/contact', function (req, res, next) {
  res.render('admin/contact');
});

router.get('/main', function (req, res, next) {
  res.render('admin/main');
});

router.get('/about', function (req, res, next) {
   res.render('admin/about');
});

router.get('/gallery', function (req, res, next) {
  res.render('admin/gallery');
});



module.exports = router;
