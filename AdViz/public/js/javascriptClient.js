var currentUser = undefined;
var contacts;
var markers;

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
    waypoints(this);
}

function setCoordinates(contact, coordinates) {
    contact.coordinates = coordinates;
}

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

var lat;
var lng;

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
                lat = obj[0].lat;
                lng = obj[0].lon;
                setCoordinates(contact, [lat, lng]);
                /*
                var lonLat = new OpenLayers.LonLat(lng, lat)
                    .transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        map.getProjectionObject());

                markers.addMarker(new OpenLayers.Marker(lonLat));*/
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

function addContactMarker(lat, lng) {
    //alert(lat + lng);
    var lonLat = new OpenLayers.LonLat(lng, lat)
        .transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject());

    markers.addMarker(new OpenLayers.Marker(lonLat));
}

function addContact() {

    var owner = document.getElementById("owner").value;
    if (owner == "self" || !currentUser.isAdmin) {
        owner = currentUser.name;
    }
    var temp = new contact(document.getElementById("first-name").value, document.getElementById("last-name").value, document.getElementById("street-number").value,
        document.getElementById("zip").value, document.getElementById("city").value, document.getElementById("state").value, document.getElementById("country").value, document.getElementById("public").checked);


    //waypoints(temp);
    var millisecondsToWait = 500;
    setTimeout(function () {
        if (!bool) {
            alert("Die Adresse konnte nicht aufgelöst werden!");
            document.getElementById("add-contact").style.display = "none";
            document.getElementById("map").style.display = "block";

        }
        else {
            // myContacts();
            document.getElementById("add-contact").style.display = "none";
            document.getElementById("map").style.display = "block";

            var xhr = new XMLHttpRequest();
            var url = "http://localhost:3000/contacts";

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //alert(temp.coordinates);

            xhr.onerror = function () {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
                alert("Connecting to server with " + url + " failed!\n");
            };
            xhr.onload = function (e) {// diese Funktion wird ausgefuehrt, wenn die Anfrage erfolgreich war
                //alert("s");
                if (this.status == 201) {
                    var data = this.response;
                    getContacts();
                    //alert(data);
                    //alert(data);
                    //var obj = JSON.parse(data);

                    //currentUser = obj;

                    // myContacts();//getContacs
                } else { //Handhabung von nicht-200er
                    //alert("Falscher Login");
                }
            };



            xhr.send("lastname=" + temp.lastname + "&firstname=" + temp.firstname + "&street=" + temp.street + "&zip=" + temp.zip + "&state=" + temp.state + "&city=" + temp.city + "&public=" + temp.public + "&country=" + temp.country + "&owner=" + temp.owner + "&coordinates=" + temp.coordinates);

        }
    }, millisecondsToWait);

    /*contacts[contacts.length] = new contact(document.getElementById("first-name").value, document.getElementById("last-name").value,
        document.getElementById("street-number").value, document.getElementById("zip").value, document.getElementById("city").value,
        document.getElementById("state").value, document.getElementById("country").value, document.getElementById("public").checked,
        owner);*/

}

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;


    var xhr = new XMLHttpRequest();
    var url = "http://localhost:3000/users";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");



    xhr.onerror = function () {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
        alert("Connecting to server with " + url + " failed!\n");
    };
    xhr.onload = function (e) {// diese Funktion wird ausgefuehrt, wenn die Anfrage erfolgreich war
        if (this.status == 200) {
            var data = this.response;
            var obj = JSON.parse(data);

            currentUser = obj;
            document.getElementById("login").style.display = "none";
            document.getElementById("begruessung").innerHTML = "Hallo, " + currentUser.name;
            document.getElementById("map").style.display = "block";
            document.getElementById("logout").style.display = "block";
            getContacts();
        } else { //Handhabung von nicht-200er
            alert("Falscher Login");
        }
    };


    //alert(s);
    xhr.send("username=" + username + "&password=" + password);

}

function logout() {
    document.getElementById("login").style.display = "block";
    document.getElementById("add-contact").style.display = "none";
    document.getElementById("update-delete").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("logout").style.display = "none";

}

function allContacts() {
    var text = "";
    markers.clearMarkers();

    for (var j = 0; j < contacts.length; j++) {
        if (currentUser.isAdmin || !contacts[j].isPrivate || contacts[j].owner == currentUser.name) {
            text += "<tr><td>" + contacts[j].firstname + "</td></tr>";
            addContactMarker(contacts[j].coordinates[0], contacts[j].coordinates[1]);
            //waypoints(contacts[j]);
        }
    }
    document.getElementById("table").innerHTML = text;
    click();
}

function deleteContact() {
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:3000/contacts/" + selectedContact;

    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //alert(temp.coordinates);

    xhr.onerror = function () {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
        alert("Connecting to server with " + url + " failed!\n");
    };
    xhr.onload = function (e) {// diese Funktion wird ausgefuehrt, wenn die Anfrage erfolgreich war
        //alert("s");
        if (this.status == 204) {
            alert("de");
            getContacts();
            //var data = this.response;
            //alert(data);
            //alert(data);
            //var obj = JSON.parse(data);

            //currentUser = obj;

            // myContacts();//getContacs
        } else { //Handhabung von nicht-200er
            //alert("Falscher Login");
        }
    };
    xhr.send();






    document.getElementById("add-contact").style.display = "none";
    document.getElementById("update-delete").style.display = "none";
    document.getElementById("map").style.display = "block";

    //myContacts();
}

var selectedContact;

function deleteUpdateScreen(firstname) {
    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].firstname == firstname.innerHTML && (currentUser.isAdmin || contacts[i].owner == currentUser.name)) {
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

            selectedContact = contacts[i].id;
            //selectedContact = i;
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

function getContacts() {



    // myContacts();
    //document.getElementById("add-contact").style.display = "none";
    //document.getElementById("map").style.display = "block";
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:3000/contacts?id=" + currentUser.name;

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //alert(temp.coordinates);

    xhr.onerror = function () {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
        alert("Connecting to server with " + url + " failed!\n");
    };
    xhr.onload = function (e) {// diese Funktion wird ausgefuehrt, wenn die Anfrage erfolgreich war
        //alert("s");
        if (this.status == 200) {
            var data = this.response;
            //alert(data);
            var contacts = JSON.parse(data);
            setContacts(contacts);
            //this.contacts = conatcts;
            //alert(this.contacts);
            myContacts();
            // myContacts();//getContacs
        } else { //Handhabung von nicht-200er
            //alert("Falscher Login");
        }
    };



    xhr.send();


}
function setContacts(contacts) {
    this.contacts = contacts;
    myContacts();
}
/*contacts[contacts.length] = new contact(document.getElementById("first-name").value, document.getElementById("last-name").value,
    document.getElementById("street-number").value, document.getElementById("zip").value, document.getElementById("city").value,
    document.getElementById("state").value, document.getElementById("country").value, document.getElementById("public").checked,
    owner);*/


var temp;
var bool;
var currentUser;

function updateContact() {

    var owner = document.getElementById("owner").value;
    if (owner == "self" || !currentUser.isAdmin) {
        owner = currentUser.name;
    }

    temp = new contact(document.getElementById("first-nameU").value, document.getElementById("last-nameU").value,
        document.getElementById("street-numberU").value, document.getElementById("zipU").value, document.getElementById("cityU").value,
        document.getElementById("stateU").value, document.getElementById("countryU").value, document.getElementById("publicU").value,
        owner);


    //waypoints(temp);
    var millisecondsToWait = 500;
    setTimeout(function () {
        if (!bool) {
            alert("Die Adresse konnte nicht aufgelöst werden!");
            document.getElementById("update-delete").style.display = "none";
            document.getElementById("map").style.display = "block";
            document.getElementById("add-contact").style.display = "none";
            document.getElementById("map").style.display = "block";

        }
        else {
            //contacts[selectedContact] = temp;
            myContacts();
            document.getElementById("update-delete").style.display = "none";
            document.getElementById("map").style.display = "block";

            var xhr = new XMLHttpRequest();
            var url = "http://localhost:3000/contacts/" + selectedContact;

            xhr.open("PUT", url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //alert(temp.coordinates);

            xhr.onerror = function () {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
                alert("Connecting to server with " + url + " failed!\n");
            };
            xhr.onload = function (e) {// diese Funktion wird ausgefuehrt, wenn die Anfrage erfolgreich war
                //alert("s");
                if (this.status == 204) {
                    alert("up");
                    getContacts();
                    var data = this.response;
                    //alert(data);
                    //alert(data);
                    //var obj = JSON.parse(data);

                    //currentUser = obj;

                    // myContacts();//getContacs
                } else { //Handhabung von nicht-200er
                    //alert("Falscher Login");
                }
            };
            alert(temp.coordinates);
            xhr.send("lastname=" + temp.lastname + "&firstname=" + temp.firstname + "&street=" + temp.street + "&zip=" + temp.zip + "&state=" + temp.state + "&city=" + temp.city + "&public=" + temp.public + "&country=" + temp.country + "&owner=" + temp.owner + "&coordinates=" + temp.coordinates);

        }
    }, millisecondsToWait);
}


function myContacts() {
    var text = "";
    markers.clearMarkers();
    for (var j = 0; j < contacts.length; j++) {
        if (contacts[j].owner == currentUser.name) {
            text += "<tr><td>" + contacts[j].firstname + "</td></tr>";

            addContactMarker(contacts[j].coordinates[0], contacts[j].coordinates[1]);
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