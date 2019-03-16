var request = new XMLHttpRequest();
var base = "https://images-api.nasa.gov/search?";
var test_url = "https://images-api.nasa.gov/search?q=apollo%2011&description=moon%20landing&media_type=image";
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
        url = base + "q=" + q; 
        
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
        request.open("GET", url, true);
        request.send();
    }
});

// receive the request back
request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
        var jsonObj = JSON.parse(request.responseText);
        var length = jsonObj.collection.items.length;

        // appending the images
        for (var i = 0; i < length; ++i) {
            var img_src = jsonObj.collection.items[i].links[0].href;
            var item = $("<span></span>");
            var tag = '<img class="item" id = "image_' + i + '">';
            var image = $(tag);
            image.attr('src', img_src);
            image.width(25 + '%');
            image.height(25 + '%');
            image.appendTo(item);
            item.appendTo("#container");
            
            // when image is clicked, reveal metadata
            $(image).on('click', function(){
                var my_id = $(this).attr("id");
                console.log("item click on ", my_id);

                // REVEAL METADATA
            })    
        }
    }
};