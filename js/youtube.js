function Youtube(){
  this.body = $("body")
  this.frame = $("#vidGallery");
  this.key = "AIzaSyAIBhRC6OmRSeaH9RYt8IhPKfh4AJElF2g"; 
  this.playList = "PL3FIzSDQ2zI5GmHuSOMiBIora1t8AflS2"; 
  this.count = 9;
  this.bindingEvent(); 
}

Youtube.prototype.bindingEvent = function(){
  this.callData(); 
}

Youtube.prototype.callData = function(){
  $.ajax({
    url: "https://www.googleapis.com/youtube/v3/playlistItems",
    dataType: "jsonp",
    data: {
      part: "snippet",
      key: this.key, 
      playlistId: this.playList, 
      maxResults: this.count 
    }
  })
  .success(function(data){
    var items = data.items;  
    this.createList(items); 
  }.bind(this)) 
  .error(function(err){
    console.error(err);
  })
}

//동적 리스트 생성함수
Youtube.prototype.createList = function(items){
  $(items).each(function(index, data){  
    // console.log(data);
    var tit = data.snippet.title;
    var txt = data.snippet.description.split("Follow")[0];
    var imgSrc = data.snippet.thumbnails.high.url;
    var vidId = data.snippet.resourceId.videoId;
    var tit = tit.toUpperCase()

    this.frame
      .append(
        $("<article>")
          .append(
            $("<a class='pic'>")
              .attr({ href: vidId })
              .css({ backgroundImage: "url("+imgSrc+")" }),
            $("<div class='con'>")
              .append(
                $("<h2>").text(tit),
                $("<p>").text(txt),
              )
          )
      )
  }.bind(this)) 
}


$("body").on("click", "article a", function(e){
  e.preventDefault();
  var vidId = $(this).attr('href');
  createPop({
    width: "1180px",
    height: "100vh",
    bg: "#f8f3f2",
    vidId: vidId
  });
  $("body").css({overflow: "hidden"})
});

$("body").on("click", ".pop .close", function(e){
  e.preventDefault();
  $(this).parent(".pop").remove();

  $("body").css({overflow: "auto"})
})

function createPop(opt){
  $("body")
    .append(
      $('<aside class="pop">')
        .css({
          width: opt.width,
          height: opt.height,
          backgroundColor: opt.bg,
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxSizing: "border-box",
          padding: "100px 200px",
          zIndex: 4
        })
        .append(
          $("<a href='#' class='close'>")
            .text("CLOSE")
            .css({
              position: "absolute",
              top: 50,
              right: 100,
              color: "#174555",
              fontSize: 18,
              fontWeight: "bold",
              cursor: "pointer"
            }),
          $("<img src='img/loading.gif'>")
            .css({
              width: 400,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }),
          $("<dic class='con'>")
            .css({
              width: "100%",
              height: "100%",
              position: "relative",
              display: "none"
            })
            .append(
              $("<iframe>")
                .attr({
                  src: "https://www.youtube.com/embed/" + opt.vidId,
                  frameborder: 0,
                  allowfullscreen: true,
                  width: "100%",
                  height: 600
                })
            )
        )
    )

    setTimeout(function(){
      $(".pop .con").fadeIn(500, function(){
        $(this).prev().remove();
      })
    }, 1000)
}