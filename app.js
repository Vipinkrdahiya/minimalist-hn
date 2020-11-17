//fetch topstories and populate list
var listDiv = document.getElementById('story-list');
let loader = `<div class="d-flex justify-content-center"><div class="spinner-grow" role="status"><span class="sr-only">Loading...</span></div></div>`;
listDiv.innerHTML = loader; // place loader
var ol = document.createElement('ol');
fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(response => response.json())
    .then((topStoriesId) => {
        for (var i = 0; i < 30; ++i) {
            let itemUrl = 'https://hacker-news.firebaseio.com/v0/item/' + topStoriesId[i] + '.json'
            fetch(itemUrl)
                .then(itemResponse => itemResponse.json())
                .then((itemData) => {
                    var newItem = document.createElement("li");

                    var a = document.createElement("a");
                    a.classList.add("story-links");
                    a.textContent = itemData.title;
                    a.setAttribute('href', itemData.url);
                    a.setAttribute('target', "_blank");

                    newItem.appendChild(a);

                    if (getCookie(itemData.title) != "true") {
                        var badge = document.createElement("span");
                        badge.classList.add('badge', 'badge-pill', 'badge-success');
                        badge.textContent = "New";
                        a.appendChild(badge);
                    }
                    ol.appendChild(newItem);
                });
        }
    })
    .then(() => {
        listDiv.replaceChild(ol, listDiv.childNodes[0]); //remove loader
    })
    .catch((error) => {
        console.error('Error:', error);
    });

//set title with 2 day expiry in cookie
$(document).on('click', '.story-links', function () {
    var d = new Date();
    var title = this.childNodes[0].textContent;
    if (getCookie(title) != "true") {
        d.setTime(d.getTime() + (2 * 24 * 60 * 60 * 1000)); // 2 days
        var expires = "expires=" + d.toUTCString();
        document.cookie = title + "=true;" + expires + ";path=/";
        this.removeChild(this.childNodes[1]); //remove span tag
    }
});


//get cookie value from title
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}