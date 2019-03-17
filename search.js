var search_request = new XMLHttpRequest();
var metadata_request = new XMLHttpRequest();
var base_search = "https://images-api.nasa.gov/search?";
var base_metadata = " https://images-api.nasa.gov/metadata/";
var url = "";
var media_type = "&media_type=image"; // restrict results to images only
var q, desc, loc, year_start, year_end = undefined; // search fields

// formats strings by removing trailing whitespace and replacing internal whitespace
// with "%20"
function format(str) {
    if (str == undefined || str == "") {
        return str;
    }
    var result = str.trim();
    result = result.replace(/ /g,"%20");
    return result;
}

// when search button is "clicked"
$("#search_btn").click(function() {
    // reset the container and the request url
    $("#container").empty();
    url = "";

    // retrieve the user input
    q = $("#search_q").val();
    desc = $("description").val();
    loc = $("location").val();
    year_start = $("#year_start").val();
    year_end = $("#year_end").val();

    // format user input
    q = format(q);
    desc = format(desc);
    loc = format(loc);
    year_start = format(year_start);
    year_end = format(year_end);

    // build url
    if (q != '' && q != undefined) {
        url = base_search + "q=" + q; 
        
        if (desc != '' && desc != undefined) {
            url = url + "&description=" + desc;
        }
        if (loc != '' && loc != undefined) {
            url = url + "&location=" + loc;
        }
        if (year_start != '' && year_start != undefined) {
            url = url + "&year_start=" + year_start;
        }
        if (year_end != '' && year_end != undefined) {
            url = url + "&year_end=" + year_end;
        }
    }

    // send url request
    if (url != '') {
        url = url + media_type;
        search_request.open("GET", url, true);
        search_request.send();
    }
});

// receive the search request back
search_request.onreadystatechange = function() {
    if (search_request.readyState == 4 && search_request.status == 200) {
        var jsonObj = JSON.parse(search_request.responseText);
        var length = jsonObj.collection.items.length;

        // appending the images
        for (var i = 0; i < length; ++i) {
            var img_src = jsonObj.collection.items[i].links[0].href;
            var img_id = jsonObj.collection.items[i].data[0].nasa_id;
            var item = $("<span></span>");
            var tag = '<img class="item" id = "' + img_id + '">';
            var image = $(tag);
            image.attr('src', img_src);
            image.width(25 + '%');
            image.height(25 + '%');
            image.appendTo(item);
            item.appendTo("#container");
            
            // when image is clicked, reveal metadata
            $(image).on('click', function(){
                var id = $(this).attr("id");
                
                var url = base_metadata + id;
                metadata_request.open("GET", url, true);
                metadata_request.send();
            });    

            // when image is hovered
            $(image).hover(function(){
                $(this).addClass('borders');
                $(this).addClass('hover_item');
            }, function(){
                $(this).removeClass('borders');
                $(this).removeClass('hover_item');
            }); 
        }
    }
};

// receive the metadata request back
metadata_request.onreadystatechange = function() {
    if (metadata_request.readyState == 4 && metadata_request.status == 200) {
        var jsonObj = JSON.parse(metadata_request.responseText);
        var location = jsonObj.location;
        var id = getID(location);
        // var text = JSON.parse(location);
        // console.log("text = ", text);

        var image = $("#" + id);
        var par = $(image).parent();
        var item = $("<p>Hello World</p>");
        $(par).append(item);
        console.log("appended to", image);
    }
};

// get an ID given a metadata response in the form:
// "https://images-assets.nasa.gov/image/[THE ID]/metadata.json
function getID(str) {
    var tmp = str.substr(37);
    var result = tmp.substr(0, tmp.indexOf("/"));
    return result;
}