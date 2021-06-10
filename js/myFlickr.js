(function($){
    $.defaults = {
        key : undefined,
        gallery : "#gallery",
        search : "#search",
        count : 50
    }

    $.fn.myFlickr = function(opt){
        opt = $.extend({}, $.defaults, opt);
        if(opt.key == undefined){
            console.error("key는 필수 입력 사항입니다")
        }
        new Flickr(this, opt);
        return this;
    }

    function Flickr(el, opt){
        this.init(el, opt);
        this.bindingEvent();
    }

    Flickr.prototype.init = function(el, opt){     
        this.url = "https://www.flickr.com/services/rest/?method=flickr.interestingness.getList";
        this.url_search = "https://www.flickr.com/services/rest/?method=flickr.photos.search";
        this.key = opt.key;
        this.count = opt.count;
        this.gallery = el.find(opt.gallery);
        this.search = el.find(opt.search);   
    }

    Flickr.prototype.bindingEvent = function(){
        this.getList(this.url, this.key, this.count);

        // "#search"
        var btn = $(this.search.selector).children("button");

        btn.on("click", function(e){
            e.preventDefault();
            this.searchTag();
        }.bind(this));

        $(window).on("keypress", function(e){
            if(e.keyCode == 13 ) this.searchTag();
        }.bind(this));

        $("body").on("click", "#gallery li a", function(e){
            e.preventDefault();

            var imgSrc = $(e.currentTarget).attr("href");
            this.createPop(imgSrc);
        }.bind(this));

        $("body").on("click", ".pop span", function(){
            $(".pop").fadeOut(500,function(){
                $(".pop").remove();
            })
        })
    }

    Flickr.prototype.getList = function(url, key, num, tags){
        $.ajax({
            url : url,
            dataType : "json",
            data : {
                api_key : key,
                per_page : num,
                format : "json",
                nojsoncallback : 1,
                tags : tags,
                tagmode : "any",
                privacy_filter : 5
            }
        })
        .success(function(data){   
            var item = data.photos.photo;               
            this.createList(item);
        }.bind(this))
        .error(function(err){
            console.error(err);
        })
    }

    Flickr.prototype.createList = function(data){    
        var $gallery = $(this.gallery.selector);      

        $gallery.empty();
        $gallery.append("<ul>");

        $(data).each(function(index, data){
            var text = data.title;    
            text = text.substr(0, 10) + "...";         
            if(!data.title) text = "No Description";

            $gallery.children("ul").append(
                $("<li>").append(
                    $("<div class='inner'>")
                    .append(
                        $("<a>").attr({
                            href : "https://live.staticflickr.com/"+data.server+"/"+data.id+"_"+data.secret+"_b.jpg"
                        }).append(
                            $("<img>").attr({
                                src : "https://live.staticflickr.com/"+data.server+"/"+data.id+"_"+data.secret+"_m.jpg",
                                onerror : "javascript:this.parentNode.parentNode.parentNode.style='display:none;'"
                            })
                        )
                    )
                    .append(
                        $("<p>").text(text)
                    )
                )
            )
        }.bind(this));       
        
        this.isoLayout();
    }

    Flickr.prototype.isoLayout = function(){  
        var $gallery = $(this.gallery.selector);       
        var frame = $gallery.find("ul").selector; 
        var list = $gallery.find("li");
        var list_name = list.selector;  
        var imgs = $gallery.find("img");     
        var imgNum = 0;  
        
        $(imgs).each(function(index, data){ 
            data.onload = function(){
                imgNum++;                                 
                
                if(imgNum === imgs.length) {                 
                    new Isotope( frame, {
                        itemSelector : list_name,
                        columnWidth : list_name,
                        transitionDuration: "0.8s"                        
                    });
                    $gallery.addClass("on");
                }
            }  
        }.bind(this));
    }

    Flickr.prototype.searchTag = function(){
        var inputs = $("#search").children("input").val();
        if(inputs == "") {
            alert("검색어를 입력해주세요.");
            return;
        }

        $("#gallery").removeClass("on");

        this.getList(this.url_search, this.key, this.count, inputs);
        $(this.search.selector).children("input").val("");
    }

    Flickr.prototype.createPop = function(imgSrc){
        $("body").append(
            $("<aside class='pop'>")
                .css({
                    width: "1180px", height: "100vh", position: "fixed", top: "50%", left: "50%", 
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                    boxSizing: "border-box", 
                    padding: "5vw", 
                    background: "#f8f3f2",
                    display: "none"
                })
                .append(
                    $("<img>").attr("src", imgSrc)
                        .css({
                            width: "100%", 
                            height:"100%", 
                            objectFit: "cover"
                        }),
                    $("<span>").text("close")
                        .css({
                             cursor:"pointer", 
                             color:"#174555", 
                             position: "absolute", 
                             top: 30, 
                             right: 80
                        })
                ).fadeIn()
        )
    }
})(jQuery);