window.onload = function(){ 
    var canvas = document.createElement("canvas"); // création de l'objet canvas
    var affichage = document.createElement("div"); // création d'une div
    affichage.style.border = "2px solid orange";  // création de la bordure de la div affichage
    affichage.height = 80;
    affichage.id = "affichage";
    canvas.width = 1000; // creation hauteur et largeur du canvas
    canvas.height = 600;
    canvas.style.backgroundColor = "black"
    canvas.style.border = "2px solid orange";  // création d'une bordure sur le canvas
    document.body.appendChild(affichage); //on ratache notre canvas à notre body
    document.body.appendChild(canvas); //on ratache notre canvas à notre body
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    
  



//On va créer le serpent sur le canvas

var ctx = canvas.getContext("2d");  //on appelle le contexte du canvas et on le définit en 2d
var collision = false;
var score = 0;
var vie = 3;
var niveau = 0;
var codeTouche = 0;

// pour déplacer le serpent, on déclarer des évènements avec touche de direction du clavier haut bas gauche droite
document.addEventListener("keydown", interaction);




//on créer les propirétés du serpent
 var colorSerp = "#E5F00F";   //var qui contient la couleur de notre serpent
 var tailleSerp = 30;      // taille du serpent qui est en fonction du nombre de ase de notre canvas
 var nombreBolckParWidth = canvasWidth/tailleSerp;
 var nombreBolckParHeight = canvasHeight/tailleSerp;
 var xSerp = Math.trunc(Math.random()*nombreBolckParWidth)*tailleSerp;          //on choisi une position qui sera aléatoire tout au long du jeu
 var ySerp = Math.trunc(Math.random()*nombreBolckParHeight)*tailleSerp;
 var deplX = 0;  // variable de déplacement x valeur par défaut 0
 var deplY = 0;
 var tailleBody = 2; // taille du corps du serpent
// on créé un tableau qui va représenter les coordonnées de la taille du corp du serpent
var bodySerp = [];  //corps du serpent avec les coordonnées

//propriété de la pomme
var colorPomme = "green";
var xPomme =Math.trunc(Math.random()*nombreBolckParWidth)*tailleSerp;          //on choisi une position qui sera aléatoire tout au long du jeu
var yPomme = Math.trunc(Math.random()*nombreBolckParHeight)*tailleSerp;
var rayonPomme = tailleSerp/2;
var tempsPomme = 0;
var tempsMaxPomme = 80;

// propriété Bonus vie
var colorBonus = "red";
var xBonus =  Math.trunc(Math.random()*nombreBolckParWidth)*tailleSerp;
var yBonus =  Math.trunc(Math.random()*nombreBolckParHeight)*tailleSerp;
var tempsBonus = 0;
var afficheBonus = false;

  var intervalID = setInterval(game, 500);     // pour que notre fonction game plus vitesse serpent = 500
  // s'appelle plusieurs fois , prend 2 parametre (dessiner serpent et le temps)
 //dessinerSerpent(); //on appelle notre fonction dessiner serpent


 // fonction qui lance le jeu
 function game(){
    dessinerSerpent();
    dessinerPomme();
    detectionCollision();
    verifMangerPomme();
    afficheScore();
    gestionVieSerpent();
    //dessinerBonus();
    gestionAffichageBonus();
   
    
   
    
 }




//gestion de la position du serpent 
function gestionPositionSerpent(){
    xSerp = xSerp + deplX*tailleSerp;  // quand on se déplace sur x
    ySerp = ySerp + deplY*tailleSerp;   // quand on se déplace sur y 
    bodySerp.push({x:xSerp,y:ySerp});   // on va pusher nos nlles coordonnées du serpent qui de déplacent
    while(bodySerp.length> tailleBody){
        bodySerp.shift(); //on enlève le premier élément entré dans le tableau
    }
}





// dessin de notre canvas, on le met dans une fonction qui dessine le serpent

function dessinerSerpent(){
    ctx.clearRect(0,0, canvasWidth, canvasHeight);                       // pour effacer la queue du serpent à chaque déplacement
   
    gestionPositionSerpent();
    ctx.fillStyle = colorSerp;  //couleur du serpent 
    for(var i = 0; i< bodySerp.length; i++){
        ctx.fillRect(bodySerp[i].x, bodySerp[i].y, tailleSerp-1, tailleSerp-1);
    }; 
}

// fonction qui dessine la pomme 
function dessinerPomme(){
    ctx.beginPath(); //créer un flux
    ctx.arc(xPomme+rayonPomme ,yPomme+rayonPomme, rayonPomme, 0, 2*Math.PI);  //creer un arc avec les coordonnées du canvas
    ctx.fillStyle = colorPomme;
    ctx.fill(); //on rattache notre pomme à notre canvas
    ctx.font = '15px Arial';
    ctx.fillStyle = "green";
    ctx.fillText("V", xPomme+3, yPomme+3)
    ctx.closePath;  //on ferme notre flux 
}

// Fonction qui dessine le bonus vie
function dessinerBonus(){
    ctx.font = "30px Arial"
    ctx.fillStyle = colorBonus;
    ctx.fillText("❤️", xBonus-4, yBonus+27);


}
 
//fonction qui initialise la position de la pomme

function initPositionPomme(){
     xPomme =Math.trunc(Math.random()*nombreBolckParWidth)*tailleSerp;          //on choisi une position qui sera aléatoire tout au long du jeu
     yPomme = Math.trunc(Math.random()*nombreBolckParHeight)*tailleSerp;
}

// function qui initialise la position du serpent 
function initPositionSerpent(){
     xSerp = Math.trunc(Math.random()*nombreBolckParWidth)*tailleSerp;
     ySerp = Math.trunc(Math.random()*nombreBolckParWidth)*tailleSerp;
}

function initPositionBonus(){
    xBonus = Math.trunc(Math.random()*nombreBolckParWidth)*tailleSerp;
    yBonus = Math.trunc(Math.random()*nombreBolckParWidth)*tailleSerp;
}
// création de la fonction de la détection de la collision

function detectionCollision(){
    //cas 1 serpent se rentre en collision avec lui même ça veut dire que coordonées tête = coordonnée corps
    if(bodySerp.length > 5){
        for(var i = 0; i < bodySerp.length-1; i++){
            if(bodySerp[i].x === bodySerp[bodySerp.length-1].x && bodySerp[i].y === bodySerp[bodySerp.length-1].y){
                    collision = true;
                break;
                }
             }
        
    }
 // cas2 serpent sort du canvas, rentre en collision avec les bords du jeu

 if(xSerp <0 || ySerp <0 || xSerp + tailleSerp > canvasWidth || ySerp + tailleSerp > canvasHeight){
     collision = true;

 }
};


// fonction qui vérifie si le serpent a mangé la pomme ou non

function verifMangerPomme(){
    if(xPomme === xSerp && yPomme === ySerp){
        score = score + 10 + 3*bodySerp.length;
        niveau = Math.trunc(score/300);
        tailleBody = tailleBody +2;
        afficheScore();
        initPositionPomme();
    }else if(tempsPomme++ > tempsMaxPomme){
        initPositionPomme();
        tempsPomme=0;
    }
}

//fonction qui affiche le score

function afficheScore(){
    var message = "score : " +score + "<br>vie : " + vie +"<br>niveau :" + niveau;
    document.getElementById("affichage").innerHTML = message;
}

//fonction qui gère la vie du serpent 

function gestionVieSerpent(){
    if(collision == true){
        vie--;
        collision = false;
        tailleBody = 2;
        initPositionPomme();
        initPositionSerpent();
        //afficheScore();
        bodySerp = [bodySerp[bodySerp.length-1]];
        if(vie === 0) {
            ctx.fillStyle = "red";
            ctx.font = "75";
            ctx.fillText("Game Over", canvasWidth/2, canvasHeight/2); 
            clearTimeout(intervalID);
        }
    }
}

//fonction qui sert à afficher l'affichage du bonus

function gestionAffichageBonus(){
    if(tempsBonus++ > 30){
        tempsBonus = 0;
        //on peut afficher la vie gagnée
        if(Math.random() > 0.4){
            //on va afficher le bonus
            initPositionBonus();
            afficheBonus = true;
        }else{
            //sinon on affiche pas le bonus
            xBonus = 1200;
            yBonus = 1200;
            afficheBonus = false;
            
        }
    }

    if(afficheBonus === true){
        dessinerBonus();
    }
    // tester si serpent a mangé la vie
    if(xSerp == xBonus && ySerp == yBonus){
        vie = vie+1;
        xBonus = 1200;
        yBonus = 1200;
        afficheBonus = false;
    }
}

// pour déplacer le serpent, on déclarer des évènements avec touche de direction du clavier haut bas gauche droite
//  on fait la fonction qui dirige le serpent

function interaction(event) { 
    console.log(event.keyCode); // code touche claver Js : -> = 39 <- = 38 haut = 38 bas = 40
    switch (event.keyCode){    // on utilise switch pour tester les codes du clavier
        case 37: 
        if(codeTouche === 37){
            break
        }
        //touche déplacer gauche
            deplX = -1;  // pour se déplacer à gauche, notre x change et recule d'une case = 1
            deplY = 0;
            codeTouche = event.keyCode;
        break;
        
        

        case 38: 
        //touche déplacer haut
        if(codeTouche === 38){
            break
        }
        deplX = 0;  // pour se déplacer en haut, notre y change et recule d'une case = -1
        deplY = -1;
        codeTouche = event.keyCode;
        break;
    
        
        
        case 39: 
        //touche déplacer droite
        if(codeTouche === 39){
            break
        }
        deplX = +1;  // pour se déplacer à droite, notre x change et avance d'une case = +1
        deplY = 0;
        codeTouche = event.keyCode;
        break;
    
       

        case 40: 
        //touche déplacer bas
        if(codeTouche === 40){
            break
        }
        deplX = 0;  // pour se déplacer en bas, notre y change et avance d'une case = +1
        deplY = +1;
        codeTouche = event.keyCode;
        break;

        case 32: 
        //touche espace = pause  
        deplX = 0; //rien ne change car on reste sur place
        deplY = 0
        codeTouche = event.keyCode;
        break;
    
        default:

    }
}




}



