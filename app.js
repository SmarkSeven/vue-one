var path = require('path')
var express = require('express')
var url = require('url');
var http = require('http');
var xmlreader = require('xmlreader');
var bodyParser = require('body-parser')
var proxyMiddleware = require('http-proxy-middleware')

var app = express();
app.use('/', express.static('./public'))

var postProxyArr = [
  '/praise/add',
  '/movie/praisestory',
  '/comment/praise',
  '/comment/unpraise',
  '/collection/add',
  '/collection/del',
  '/user/follow',
  '/user/follow_cancel',
  '/comment/add'
]

var urlencodedParser = bodyParser.urlencoded({ extended: false })
postProxyArr.forEach(function (context) {
  var  options = { target: 'http://v3.wufazhuce.com:8000/api' }
  app.use(proxyMiddleware(options.filter || context, options))
  app.post(context, urlencodedParser, function (req, res) {});
})

var getProxyArr = [
  '/channel/reading/more/*',
  '/onelist/idlist',
  '/onelist/*/0',
  '/channel/reading/more/*',
  '/channel/music/more/*',
  '/channel/movie/more/*',
  '/author/works',
  '/user/follow_list/',
  '/collection/more/*/0',
  '/comment/praiseandtime/essay/*/*',
  '/comment/praiseandtime/*/*/*',
  '/essay/*',
  '/related/essay/*',
  '/essay/update/*/*',
  '/movie/*/story/1/0',
  '/movie/detail/*',
  '/comment/praiseandtime/movie/*/0',
  '/related/movie/*',
  '/movie/update/*/*',
  '/xiami/*',
  '/music/detail/*',
  '/comment/praiseandtime/music/*/0',
  '/related/music/*',
  '/music/update/*/*',
  '/user/follow_list',
  '/question/*',
  '/comment/praiseandtime/question/*/0',
  '/related/question/*',
  '/search/*/*',
]
getProxyArr.forEach(function (context) {
  var  options = { target: 'http://v3.wufazhuce.com:8000/api' }
  app.use(proxyMiddleware(options.filter || context, options))
})

app.get('/xia_mi/song',urlencodedParser, function(req, res) {
  const songId = req.query.id;
  var options = url.parse('http://www.xiami.com/song/playlist/id/'+ songId +'/object_name/default/object_id/0');
  var xiamiRealSong = {};
  http.get(options, function(resp) {
    resp.setEncoding('utf8');
    var xml = '';
    resp.on('data', function(data) {
      xml += data;
    });
    resp.on('end', function() {
      xmlreader.read(xml, function(errors, responsive){
        if(null !== errors ){
          res.json({
            'res': 1,
            'message': '服务内部错误。'+errors,
           });
           return;
          }
        if (!responsive.playlist) {
          res.json({
            'res': 1,
            'message': '没找到相关信息，该歌曲很可能已经从虾米下架。'
          });
          return;
         }
         xiamiRealSong.title = toTxt(responsive.playlist.trackList.track.title.text());
         xiamiRealSong.artist = parseArtist(responsive.playlist.trackList.track);
         xiamiRealSong.album = toTxt(responsive.playlist.trackList.track.album_name.text());
         xiamiRealSong.url = getMp3Location(responsive.playlist.trackList.track.location.text());

         if (typeof responsive.playlist.trackList.track.lyric_url.text !== 'undefined') {
           xiamiRealSong.lyricUrl = toTxt(responsive.playlist.trackList.track.lyric_url.text());
         } else {
            xiamiRealSong.lyricUrl = null;
         }
         res.json({
           res: 0,
           data: xiamiRealSong,
          });
         })
       });
    });
});
app.get('/*', function(req, res) {
  res.sendfile('./public/index.html');
});

function toTxt(str){
    var RexStr = /(&lt;|&gt;|&quot;|&#39;|&#039;|&amp;)/g;
    str = str.replace(RexStr,
        function(MatchStr){
            switch(MatchStr){
                case "&lt;":
                    return "<";
                    break;
                case "&gt;":
                    return ">";
                    break;
                case "&quot;":
                    return '\"';
                    break;
                case "&#39;":
                    return "'";
                    break;
                case "&#039;":
                    return "'";
                    break;
                case "&amp;":
                    return "&";
                    break;
                default :
                    break;
            }
        }
    )
    return str;
}

function getMp3Location(str) {
    try {
        var a1 = parseInt(str.charAt(0)),
            a2 = str.substring(1),
            a3 = Math.floor(a2.length / a1),
            a4 = a2.length % a1,
            a5 = [],
            a6 = 0,
            a7 = '',
            a8 = '';
        for (; a6 < a4; ++a6) {
            a5[a6] = a2.substr((a3 + 1) * a6, (a3 + 1));
        }
        for (; a6 < a1; ++a6) {
            a5[a6] = a2.substr(a3 * (a6 - a4) + (a3 + 1) * a4, a3);
        }
        for (var i = 0,a5_0_length = a5[0].length; i < a5_0_length; ++i) {
            for (var j = 0,a5_length = a5.length; j < a5_length; ++j) {
                a7 += a5[j].charAt(i);
            }
        }
        a7 = decodeURIComponent(a7);
        for (var i = 0,a7_length = a7.length; i < a7_length; ++i) {
            a8 += a7.charAt(i) === '^' ? '0': a7.charAt(i);
        }
        return a8;
    } catch(e) {
        return false;
    }
}

function parseArtist(track) {
    if (track.artist.hasOwnProperty('text')) {
        return toTxt(track.artist.text())
    } else if (track.artist_name.hasOwnProperty('text')) {
        return toTxt(track.artist_name.text())
    } else {
        return '未知艺术家';
    }
}


var server = app.listen(process.env.PORT || 8081, function (err) {
 if (err) {
    console.log(err)
    return
  }
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listen at http://%s:%s', host, port);
})
