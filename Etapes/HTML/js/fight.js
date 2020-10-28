let ring = document.getElementById("ring");
let monitor = document.getElementById("monitor");
let running = true;
let audio = document.getElementsByTagName("audio");
/*Characters*/
class Character{
    constructor(name,hp,hpMax, atk, def, atkSpe, defSpe, vit, image){
        this.name = name;
        this.hp = hp;
        this.hpMax = hpMax;
        this.atk = atk;
        this.def = def;
        this.atkSpe = atkSpe;
        this.defSpe = defSpe;
        this.vit = vit;
        this.image = image;
    }
}

let bulbizarre = new Character("Bulbizarre",45,45,49,49,65,65,43, "img/bulbizarre.png");
let carapuce = new Character("Carapuce",44,44,48,65,50,64,43, "img/carapuce.png");
let salameche = new Character("Salamèche",39,39,52,43,60,50,65, "img/salameche.png");

let characters = [bulbizarre,carapuce,salameche];
let player;
let enemy;
let hero;
let guardStatus = 0;
let guard = false;
/*Pokemon Display*/
for (let i=0; i<characters.length;i++){
    document.getElementById('characterSelect').innerHTML +=
        `
        <figure>
            <h3>`+ characters[i].name +`</h3>
            <img src="`+ characters[i].image +`" alt="`+ characters[i].name+`"/>
            <figcaption>
                <table>
                    <tr>
                        <th>HP</th>
                        <th>Attaque</th>
                        <th>Défense</th>
                        <th>Attaque Spéciale</th>
                        <th>Défense Spéciale</th>
                        <th>Vitesse</th>
                    </tr>
                    <tr>
                        <td>`+ characters[i].hp +`</td>
                        <td>`+ characters[i].atk +`</td>
                        <td>`+ characters[i].def +`</td>
                        <td>`+ characters[i].atkSpe +`</td>
                        <td>`+ characters[i].defSpe +`</td>
                        <td>`+ characters[i].vit +`</td>
                    </tr>
                </table>
            </figcaption>
        </figure>
        `;
}

/*Character Selection*/
for (let i=0; i<characters.length;i++){
    document.getElementsByTagName("figure")[i].addEventListener("click", function(){selectCharacter(i);});
}
function selectCharacter(id){
    let enemyPkmn;
    player = id;
    /*Blue choisit toujours le pokemon qui a l'avantage du type :*/
    if (id===0){enemyPkmn = 2};
    if (id===1){enemyPkmn = 0};
    if (id===2){enemyPkmn = 1};
    //Variables pour simplifier l'ecriture:
    hero = characters[player];
    enemy = characters[enemyPkmn];
    
    //On affiche les fiches personnages et on lance la musique
    
    displayCharacters(true);
    
    document.getElementsByTagName("figure")[id].style.border = "10px solid seagreen";
    document.getElementsByTagName("figure")[enemyPkmn].style.border = "5px solid red";
    monitor.innerHTML = "Dresseur BLUE veut se battre!<br> Rival BLUE envoie " + enemy.name + "<br> A toi! " + hero.name;
    document.getElementById("controls").style.display = 'grid';
}

/*Battle screen display */
function displayCharacters(s){
    if (s){
        audio[0].src = "snd/battle.mp3";
    }
    document.getElementById("ring").innerHTML = 
    `
    <img src="img/red.png" />
    <article id="hero">
        <h3>`+hero.name+`</h3>
        <aside>
            <div>`+hero.hp+`</div>
        </aside>
        <img id='heroPic' src="`+hero.image+`" alt="`+hero.name+`">
    </article>
    <article id="enemy">
        <h3>`+enemy.name+`</h3>
        <aside>
            <div>`+enemy.hp+`</div>
        </aside>
        <img src="`+enemy.image+`">
    </article>
    <img src="img/blue.png" />
    `;
    document.getElementsByTagName("aside")[3].style.width = 100/hero.hpMax*hero.hp + "%";
    document.getElementsByTagName("aside")[4].style.width = 100/enemy.hpMax*enemy.hp + "%";
    if (hero.hp <= 0){
        winner(enemy);
    } else if (enemy.hp <= 0){
        winner(hero);
    }
}
document.getElementsByTagName("button")[0].addEventListener("click", function(){game("attack");});
document.getElementsByTagName("button")[1].addEventListener("click", function(){game("pokemon");});
document.getElementsByTagName("button")[2].addEventListener("click", function(){game("item");});
document.getElementsByTagName("button")[3].addEventListener("click", function(){game("flee");});

function game(action){
    if (guard){ 
        hero.def += guardStatus;
    } else {
        hero.def -= guardStatus;
    }
    
    guardStatus = 0;
    guard = false;
    switch(action){
        case "attack":
            let dmg = hero.atk - enemy.def;
            enemy.hp-= dmg;
            monitor.innerHTML += "<p>" + hero.name + " attaque !! <br>";
            monitor.innerHTML += enemy.name + " perd " + dmg + "HP !!</p>";
        break;
        case "pokemon":
            monitor.innerHTML += "Red change de pokemon !!<br>";
            monitor.innerHTML += "Il envoie "+ hero.name +"!!";
            guardStatus = 50/100*hero.def;
            guard = true;
        break;
        case "item":
            monitor.innerHTML += hero.name + " Utilise une Super-Potion !!";
            hero.hp = hero.hpMax;
        break;
        case "flee":
                monitor.innerHTML += hero.name + " fuit !!";
            hero.hp = 0;
        break;
    }
    displayCharacters();
    if (running){    
        setTimeout(ennemiTurn,1000);
    };
    function ennemiTurn(){
        let dmg = enemy.atk - hero.def;
        hero.hp-= dmg;
        monitor.innerHTML += "<p>" + enemy.name + " attaque !! <br>";
        monitor.innerHTML += hero.name + " perd " + dmg + "HP !!";
        displayCharacters();
        clearInterval();
    }
}


function winner(e){
    running = false;
    ring.innerHTML = e.name + " à remporté le combat! !!";
    monitor.innerHTML += e === hero ? "<p>BLUE : QUOI???</p><p>Incroyable! J'ai pas pris le bon POKéMON!</p><p>RED gagne 150$</p>" : "<p>BLUE : Ouaiiis! J'suis trop bon, ou bien?</p>";
    ring.innerHTML += "<img src='http://pokeapi.co/media/sprites/pokemon/female/12.png' />"
    ring.innerHTML += "<button onclick='window.location.reload()'>Rejouer?</button>";
    ring.classList.add("endGame");
    if (e === enemy) {
        ring.style.color = "orangered";
    }
}

/*
function makeHttpObject() {
    try {return new XMLHttpRequest();}
    catch (erreur) {}
    try {return new ActiveXObject("Msxml2.XMLHTTP");}
    catch (erreur) {}
    try {return new ActiveXObject("Microsoft.XMLHTTP");}
    catch (erreur) {}
  
    throw new Error("La création de l’objet pour les requêtes HTTP n’a pas pu avoir lieu.");
  }
  

  var requete = makeHttpObject();
requete.open("GET", "http://pokeapi.co/media/sprites/pokemon/12.png", false);
requete.send(null);
print(requete.responseText);

show(typeof(makeHttpObject()));
*/