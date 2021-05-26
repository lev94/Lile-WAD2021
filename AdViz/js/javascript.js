var markers;
var testMap = 0;

function init() {
    document.getElementById("add-contact").style.display = "none";
    document.getElementById("update-delete").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("logout").style.display = "none";



    map = new OpenLayers.Map("basicMap");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);

    var lonLat = new OpenLayers.LonLat(13.41, 52.52)
        .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
        );
    var zoom = 15;

    markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);

    map.setCenter(lonLat, zoom);

}

function contact(firstname, lastname, street, zip, city, state, country, isprivate, owner) { // Konstruktor
    this.firstname = firstname;
    this.lastname = lastname;
    this.street = street;
    this.zip = zip;
    this.city = city;
    this.state = state;
    this.country = country;
    this.isPrivate = isprivate;
    this.owner = owner;
}

var contacts = [new contact("Anne", "Schmidt", "Friedrichsstraße 10", "10969", "Berlin", "", "", true, "Normalo"),
new contact("Max", "Mustermann", "Berliner Straße 25", "13507", "Berlin", "", "", false, "Normalo"),
new contact("Lukas", "Müller", "Berliner Straße 60", "13467", "Berlin", "", "", true, "Admina"),
new contact("Lisa", "Baum", "Jägerstraße 54", "10117", "Berlin", "", "", false, "Admina")];

var user = [{ // Object
    name: "Normalo", // Property
    password: "123456",
    isAdmin: false,
},
{ // Object
    name: "Admina", // Property
    password: "654321",
    isAdmin: true,
}];


function addContactScreen() {
    if (currentUser.isAdmin) {
        document.getElementById("owner").style.display = "inline";
        document.getElementById("ownerLabel").style.display = "inline-block";

    }
    else {
        document.getElementById("owner").style.display = "none";
        document.getElementById("ownerLabel").style.display = "none";

    }

    document.getElementById("map").style.display = "none";
    document.getElementById("add-contact").style.display = "block";
}

function addContact() {

    var owner = document.getElementById("owner").value;
    if (owner == "self" || !currentUser.isAdmin) {
        owner = currentUser.name;
    }

    contacts[contacts.length] = new contact(document.getElementById("first-name").value, document.getElementById("last-name").value,
        document.getElementById("street-number").value, document.getElementById("zip").value, document.getElementById("city").value,
        document.getElementById("state").value, document.getElementById("country").value, document.getElementById("public").value,
        owner);

    waypoints(contacts[contacts.length - 1]);
    var millisecondsToWait = 500;
    setTimeout(function () {
        if (!bool) {
            contacts.pop();
            alert("Die Adresse konnte nicht aufgelöst werden!");
            testMap = 0;
            document.getElementById("add-contact").style.display = "none";
            document.getElementById("map").style.display = "block";
        }
        else {
            myContacts();
            document.getElementById("add-contact").style.display = "none";
            document.getElementById("map").style.display = "block";
        }
    }, millisecondsToWait);

}


function allContacts() {
    var text = "";
    markers.clearMarkers();

    for (var j = 0; j < contacts.length; j++) {
        if (currentUser.isAdmin || !contacts[j].isPrivate || contacts[j].owner == currentUser.name) {
            text += "<tr><td>" + contacts[j].firstname + "</td></tr>";
            waypoints(contacts[j]);
        }
    }
    document.getElementById("table").innerHTML = text;
    click();
}

function myContacts() {
    var text = "";
    markers.clearMarkers();

    for (var j = 0; j < contacts.length; j++) {
        if (contacts[j].owner == currentUser.name) {
            text += "<tr><td>" + contacts[j].firstname + "</td></tr>";
            waypoints(contacts[j]);
        }
    }
    document.getElementById("table").innerHTML = text;
    click();
}

function click() {
    var table = document.getElementById("table");
    if (table != null) {
        for (var i = 0; i < table.rows.length; i++) {
            for (var j = 0; j < table.rows[i].cells.length; j++)
                table.rows[i].cells[j].onclick = function () {
                    deleteUpdateScreen(this);
                };
        }
    }
}

var selectedContact;

function deleteUpdateScreen(firstname) {
    document.getElementById("update-delete").style.display = "block";
    document.getElementById("map").style.display = "none";

    if (currentUser.isAdmin) {
        document.getElementById("ownerU").style.display = "inline";
        document.getElementById("ownerLabelU").style.display = "inline-block";

    }
    else {
        document.getElementById("ownerU").style.display = "none";
        document.getElementById("ownerLabelU").style.display = "none";

    }

    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].firstname == firstname.innerHTML) {
            selectedContact = i;
            var owner = contacts[i].owner;

            if (contacts[i].owner == "Admina") {
                owner = "self";
            }

            document.getElementById("first-nameU").value = contacts[i].firstname;
            document.getElementById("last-nameU").value = contacts[i].lastname;
            document.getElementById("street-numberU").value = contacts[i].street;
            document.getElementById("zipU").value = contacts[i].zip;
            document.getElementById("cityU").value = contacts[i].city;
            document.getElementById("stateU").value = contacts[i].state;
            document.getElementById("countryU").value = contacts[i].country;
            document.getElementById("publicU").value = contacts[i].isPrivate;
            document.getElementById("ownerU").value = owner;
        }
    }
}

var temp;

function updateContact() {

    var owner = document.getElementById("owner").value;
    if (owner == "self" || !currentUser.isAdmin) {
        owner = currentUser.name;
    }


    temp = new contact(document.getElementById("first-nameU").value, document.getElementById("last-nameU").value,
        document.getElementById("street-numberU").value, document.getElementById("zipU").value, document.getElementById("cityU").value,
        document.getElementById("stateU").value, document.getElementById("countryU").value, document.getElementById("publicU").value,
        owner);


    waypoints(temp);
    var millisecondsToWait = 500;
    setTimeout(function () {
        if (!bool) {
            alert("Die Adresse konnte nicht aufgelöst werden!");
            document.getElementById("update-delete").style.display = "none";
            document.getElementById("map").style.display = "block";
        }
        else {
            contacts[selectedContact] = temp;
            myContacts();
            document.getElementById("update-delete").style.display = "none";
            document.getElementById("map").style.display = "block";
        }
    }, millisecondsToWait);
}

function deleteContact() {
    contacts.splice(selectedContact, 1);

    document.getElementById("add-contact").style.display = "none";
    document.getElementById("update-delete").style.display = "none";
    document.getElementById("map").style.display = "block";

    myContacts();
}



var currentUser;

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    for (var i = 0; i < 2; i++) {
        if (username == user[i].name && password == user[i].password) {
            currentUser = user[i];
            document.getElementById("login").style.display = "none";
            document.getElementById("begruessung").innerHTML = "Hallo, " + currentUser.name;
            document.getElementById("map").style.display = "block";
            document.getElementById("logout").style.display = "block";
            myContacts();
        }
    }

}

function logout() {
    document.getElementById("login").style.display = "block";
    document.getElementById("add-contact").style.display = "none";
    document.getElementById("update-delete").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("logout").style.display = "none";

}


var bool;

function waypoints(contact) {
    var xhr = new XMLHttpRequest();
    var url = "https://nominatim.openstreetmap.org/search/"
        + contact.street + "," + contact.city + "," + contact.zip + "," + contact.state + "," + contact.country
        + "?format=json&addressdetails=1&limit=1&polygon_svg=1";
    xhr.open("GET", url, true);
    xhr.onerror = function () {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
        alert("Connecting to server with " + url + " failed!\n");
    };
    xhr.onload = function (e) {// diese Funktion wird ausgefuehrt, wenn die Anfrage erfolgreich war
        var data = this.response;
        var obj = JSON.parse(data);

        if (this.status == 200) {
            if (obj.length != 0) {
                var lat = obj[0].lat;
                var lng = obj[0].lon;
                var lonLat = new OpenLayers.LonLat(lng, lat)
                    .transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        map.getProjectionObject());

                markers.addMarker(new OpenLayers.Marker(lonLat));
                bool = true;
            }
            else {
                bool = false;
            }
        } else { //Handhabung von nicht-200er
            alert("HTTP-status code was: " + obj.status);
        }
    };

    xhr.send();
}

