function init() {
    document.getElementById("add-contact").style.display = "none";
    document.getElementById("update-delete").style.display = "none";
    //document.getElementById("map").style.display = "none";


    map = new OpenLayers.Map("basicMap");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);

    var lonLat = new OpenLayers.LonLat( 13.41,52.52 )
        .transform(
          new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
          new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
        );
        var zoom=15;
    
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);

    markers.addMarker(new OpenLayers.Marker(lonLat));
    map.setCenter(lonLat, zoom);
        
}

var user = [{ // Object
    name: "Normalo", // Property
    password: "123456",
    isAdmin: false,
    contact: [ // Array
            { "firstname": "Anne", "menge": 2 },
            { "firstname": "Alexandra","menge": 1 },

            ]
    }, 
    { // Object
        name: "Admina", // Property
        password: "654321",
        isAdmin: true,
        contact: [ // Array
            { "firstname": "Carl","menge": 1 },
            { "firstname": "Bob","menge": 1 }
            ]
    }];


    var currentUser;
    
    function login() {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        for (var i = 0; i < 2; i++) {
            if(username == user[i].name && password == user[i].password) {           
                currentUser = user[i];
                document.getElementById("login").style.display = "none";
                document.getElementById("begruessung").innerHTML = "Hallo, " + currentUser.name;
                document.getElementById("map").style.display = "block";

            }
        }
        
    }
