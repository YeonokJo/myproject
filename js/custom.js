// #skipNavi
$('#skipNavi li a').on('focusin', function() {
  $(this).addClass('on');
});

$('#skipNavi li a').on('focusout', function() {
  $(this).removeClass('on');
});


// #gnb
var $header = $('#header');
var $gnb = $('#gnb');
var $gnb_li = $gnb.children('li');
var $gnb_li_ul = $gnb_li.children('ul');
var speed = 500;

$header.on('mouseleave', closeSub);

// $header.on('mouseenter', openSub);

$gnb_li.on('mouseenter focusin', function(){
  $(this).children('a').addClass('on');
  var target = $(this).children("a").attr("data-menu");
  callData(target);
  openSub();
});

$gnb_li.on('mouseleave focusout', function(){
  $(this).children('a').removeClass('on');
});

function openSub(){
  var ht = $header.outerHeight();
  // var posY = $header.outerHeight();
  $header.prepend(
    $('<div class="bgGnb">')
      .css({
        width: '100%',
        height: 320,
        backgroundColor: '#fafafa', 
        position: 'absolute',
        top: ht,
        left: 0,
        display: 'none',
        overflow: 'hidden',
        zIndex: 2
      })
      .append(
        $("<div class='deco'>")
            .css({
                width: 180,
                height: 165,
                position: "absolute",
                left: "50%",
                top: 20,
                marginLeft: -590,
                color: "#f8f9f9",
                // color: "#1f618d",
                color: "#ecf0f1",
                padding: "70px 0 0",
                boxSizing: "border-box",
                textAlign: "center",
                fontSize: "11px",
                font: "Lato",
                letterSpacing: "2px",
                background: "url(../img/img1.jpeg)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center"
            })
    )
  );

  $('.bgGnb').stop().slideDown(speed);
  $gnb_li_ul.stop().slideDown(speed); 
}

function callData(target){
  $.ajax({
      url: target
  })
  .success(function(data){
      $(".bgGnb .deco").html(data);
  })
  .error(function(err){
      console.error(err);
  })
}

function closeSub(){
  $('.bgGnb').stop().slideUp(speed, function(){
    $(this).remove();
  });
  $gnb_li_ul.stop().slideUp(speed); 
}
