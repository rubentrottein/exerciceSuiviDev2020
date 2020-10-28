document.getElementById("hamburger").addEventListener("click",getHamburger);
let deploy=false;
function getHamburger(){
    if (!deploy){
    document.getElementsByTagName("nav")[0].innerHTML =    
    `
    <ul>
        <a href='../index.html'<li>Accueil mini-sites</li></a>
        <a href='index.html'<li>Accueil des jeux</li></a>
        <a href='potionShop.html'<li>Boutique de potions</li></a>
        <a href='fight.html'<li>Fight</li></a>
    </ul>
    `;
    deploy = true;
    } else {
        document.getElementsByTagName("nav")[0].innerHTML = "";
        deploy = false;
    }
}