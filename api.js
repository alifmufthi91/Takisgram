var express = require('express');
var app = express();
var ig = require('instagram-node').instagram();

var accessToken = '';
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

console.log('8080 is the magic port');



var redirectUri = 'http://localhost:8080/handleAuth';
var forwarder='/';
app.listen(8080);



app.get('/authorize', function(req, res){
	ig.use({
	    client_id: 'CLIENT_ID',
	    client_secret: 'CLIENT_SECRET'
	});
	console.log("auth");
    res.redirect(ig.get_authorization_url(redirectUri, { scope: ['likes'], state: 'a state' }));
});

app.get('/handleAuth', function(req, res){
	console.log("Handle");
    ig.authorize_user(req.query.code,redirectUri, function(err, result) {
        accessToken = result.access_token;
        res.redirect(forwarder);
    });
})

var USER_ID,RESULT;
app.get('/', function(req, res){
    if(accessToken == ''){
        forwarder='/';
        res.redirect('/login');
    }else{
        ig.use({
            access_token : accessToken
        });
        var user_id = accessToken.split('.')[0];
        USER_ID = user_id;
        RESULT = res;
        renderByDate(user_id,res);
    };
});

app.get('/sort=price', function(req, res){
  if(accessToken == ''){
      forwarder='/sort=price'
      res.redirect('/login');
  }else{
      ig.use({
          access_token : accessToken
      });
      var user_id = accessToken.split('.')[0];
      USER_ID = user_id;
      RESULT = res;
      renderByPrice(USER_ID,res);
  };
});

app.get('/sort=comments', function(req, res){
  if(accessToken == ''){
      forwarder='/sort=comments'
      res.redirect('/login');
  }else{
      ig.use({
          access_token : accessToken
      });
      var user_id = accessToken.split('.')[0];
      USER_ID = user_id;
      RESULT = res;
      renderByComments(USER_ID,res);
  };
});

app.get('/sort=likes', function(req, res){
  if(accessToken == ''){
      forwarder='/sort=likes'
      res.redirect('/login');
  }else{
      ig.use({
          access_token : accessToken
      });
      var user_id = accessToken.split('.')[0];
      USER_ID = user_id;
      RESULT = res;
      renderByLikes(USER_ID,res);
  };
});

var ProdName, Desc, Price;

function split(input){
  let first = input.indexOf('ce', 0) + 2 , last = input.indexOf('k', first);
  ProdName = input.slice(first, last);
}

function renderByLikes(user_id,res){
  ig.user(user_id, function(err, result, remaining, limit) {
      if(err) res.json(err);
      var igpics;
      var instagram = result;
      ig.user_media_recent(user_id, function(err, result, pagination, remaining, limit) {
        if(err) res.json(err);
        igpics = result;
        igpics.forEach(function(a){
					ig.comments(a.id, function(err, result, remaining, limit) {
						a['mycomment']=result;
						console.log(a);
					});
          if(a.caption!=null){
            if(a.caption.text.toLowerCase().includes('[product name]')){
              var prodName = a.caption.text;
              prodName = prodName.substring(
                  prodName.lastIndexOf("me] ") + 4,
                  prodName.lastIndexOf("[Des")
              );
              a['prodname']=prodName;
              var stra = a.caption.text;

              stra = stra.substring(
                  stra.lastIndexOf(" ") + 1,
                  stra.lastIndexOf("k")
              );
              stra = parseInt(stra)
              // console.log("a"+stra+"a");
              a["price"] = stra;
            }
          }else{
            a["price"] = null;
          }
        })
        igpics.sort(function( a, b){return b.likes.count-a.likes.count});
        console.log(instagram);
        console.log(igpics);
        res.render('pages/index', {
            instagram : instagram,
            pics : igpics
        });
      });
  });
}

function renderByDate(user_id,res){
  ig.user(user_id, function(err, result, remaining, limit) {
      if(err) res.json(err);
      var igpics;
      var instagram = result;
      ig.user_media_recent(user_id, function(err, result, pagination, remaining, limit) {
        if(err) res.json(err);
        igpics = result;
        igpics.forEach(function(a){
					ig.comments(a.id, function(err, result, remaining, limit) {
						a['mycomment']=result;
						console.log(a);
					});
          if(a.caption!=null){
            if(a.caption.text.toLowerCase().includes('[product name]')){
              var prodName = a.caption.text;
              prodName = prodName.substring(
                  prodName.lastIndexOf("me] ") + 4,
                  prodName.lastIndexOf("[Des")
              );
              a['prodname']=prodName;
              var stra = a.caption.text;
              stra = stra.substring(
                  stra.lastIndexOf(" ") + 1,
                  stra.lastIndexOf("k")
              );
              // stra = parseInt(stra)
              console.log("a"+stra+"a");
              a["price"] = stra;
            }
          }else{
            a["price"] = null;
          }
        })
        res.render('pages/index', {
            instagram : instagram,
            pics : igpics
        });
      });
  });
}

function renderByComments(user_id,res){
  ig.user(user_id, function(err, result, remaining, limit) {
      if(err) res.json(err);
      var igpics;
      var instagram = result;
      ig.user_media_recent(user_id, function(err, result, pagination, remaining, limit) {
        if(err) res.json(err);
        igpics = result;
        igpics.forEach(function(a){
					ig.comments(a.id, function(err, result, remaining, limit) {
						a['mycomment']=result;
						console.log(a);
					});
          if(a.caption!=null){
            if(a.caption.text.toLowerCase().includes('[product name]')){
              var prodName = a.caption.text;
              prodName = prodName.substring(
                  prodName.lastIndexOf("me] ") + 4,
                  prodName.lastIndexOf("[Des")
              );
              a['prodname']=prodName;
              var stra = a.caption.text;
              stra = stra.substring(
                  stra.lastIndexOf(" ") + 1,
                  stra.lastIndexOf("k")
              );
              stra = parseInt(stra)
              console.log("a"+stra+"a");
              a["price"] = stra;
            }
          }else{
            a["price"] = null;
          }
        })
        igpics.sort(function( a, b){return b.comments.count-a.comments.count});
        console.log(instagram);
        console.log(igpics);
        res.render('pages/index', {
            instagram : instagram,
            pics : igpics
        });
      });
  });
}

function renderByPrice(user_id,res){
  ig.user(user_id, function(err, result, remaining, limit) {
      if(err) res.json(err);
      var igpics;
      var instagram = result;
      ig.user_media_recent(user_id, function(err, result, pagination, remaining, limit) {
        if(err) res.json(err);
        igpics = result;
        igpics.forEach(function(a){
					ig.comments(a.id, function(err, result, remaining, limit) {
						a['mycomment']=result;
						console.log(a);
					});
          if(a.caption!=null){
            if(a.caption.text.toLowerCase().includes('[product name]')){
              var prodName = a.caption.text;
              prodName = prodName.substring(
                  prodName.lastIndexOf("me] ") + 4,
                  prodName.lastIndexOf("[Des")
              );
              a['prodname']=prodName;
              var stra = a.caption.text;
              stra = stra.substring(
                  stra.lastIndexOf(" ") + 1,
                  stra.lastIndexOf("k")
              );
              stra = parseInt(stra)
              console.log("a"+stra+"a");
              a["price"] = stra;
            }
          }else{
            a["price"] = null;
          }
        })
        igpics.sort(function( a, b){
          if(a.caption!=null&&b.caption!=null){
            var stra = a.caption.text;

            stra = stra.substring(
                stra.lastIndexOf(" ") + 1,
                stra.lastIndexOf("k")
            );
            stra = parseInt(stra)
            console.log(a.caption.text);
            var strb = b.caption.text;
            strb = strb.substring(
                strb.lastIndexOf(" ") + 1,
                strb.lastIndexOf("k")
            );
            strb = parseInt(strb)
            console.log(stra+"-"+strb);
          }

          return strb-stra
        });
        res.render('pages/index', {
            instagram : instagram,
            pics : igpics
        });
      });
  });
}

app.get('/logout', function(req, res){
  accessToken = '';
  res.redirect('/');
});

app.get('/login', function(req, res){
  accessToken = '';
  res.render('pages/login');
});
