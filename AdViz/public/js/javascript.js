
var id = 1;
function contact(firstname, lastname, street, zip, city, state, country, isprivate, owner, coordinates) { // Konstruktor
    this.id = id;
    id++;
    this.firstname = firstname;
    this.lastname = lastname;
    this.street = street;
    this.zip = zip;
    this.city = city;
    this.state = state;
    this.country = country;
    this.isPrivate = isprivate;
    this.owner = owner;
    this.lat = coordinates[0];
    this.lng = coordinates[1];
}


var contacts = [new contact("Anne", "Schmidt", "Friedrichstraße 10", "10969", "Berlin", "", "", true, "Normalo", [52.501211, 13.3916005]),
new contact("Max", "Mustermann", "Berliner Straße 25", "13507", "Berlin", "", "", false, "Normalo", [52.5838851, 13.2884379]),
new contact("Lukas", "Müller", "Berliner Straße 60", "13467", "Berlin", "", "", true, "Admina", [52.6262092, 13.3120483]),
new contact("Lisa", "Baum", "Jägerstraße 54", "10117", "Berlin", "", "", false, "Admina", [52.5142659, 13.3941128])];

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


//login user -> request(username, password) an server returned falls currentUser
function checkLogin(checkuser){
    //window.alert("2dfnoäöa");
    //var temp = JSON.parse(user);
    var username = checkuser.username;//getusers
    var password = checkuser.password;
    for (var i = 0; i < 2; i++) {//Server
        if (username == user[i].name && password == user[i].password) {
            return user[i];
        }
    }
    return undefined;
}

function addContact(contact){
    contact.id = id;
    id++;
    contacts[contacts.length] = contact;
    return contact.id;
}

function getContacs(id){
    var temp = [];
    for(var i = 0; i < contacts.length; i++){
        if(id=="Admina"||id==contacts[i].owner||!contacts[i].isPrivate){
            temp[temp.length] = contacts[i];
        }
    }
    return temp;
}

function updateContact(id, contact){
    for(var i = 0; i < contacts.length; i++){
        if(id==contacts[i].id){
            contacts[i] = contact;
            contacts[i].id = id;
            return;
        }
    }
}

function deleteContact(id){
    for(var i = 0; i < contacts.length; i++){
        if(contacts[i].id == id){
            contacts.splice(i, 1);
        }
    }
}


//module.exports = login;
module.exports = {checkLogin: checkLogin, addContact: addContact, getContacs: getContacs, updateContact: updateContact, deleteContact: deleteContact};
//module.exports = {};