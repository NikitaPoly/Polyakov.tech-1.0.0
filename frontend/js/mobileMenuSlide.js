const mobileMenuImg = document.getElementById("mobileMenu");
const nav = document.getElementsByTagName("nav")[0];

const mobileMenu = document.createElement("div"); 
const listOfAllLinks = document.getElementsByTagName("a");//get all links on page
for(let i = 0; i < 4; i++){//only append the links in the nav
    const tempClone = listOfAllLinks[i].cloneNode(true);
    mobileMenu.appendChild(tempClone);
}
document.getElementsByTagName("body")[0].appendChild(mobileMenu);//put the mobile nav on the page
mobileMenu.id = "MobileNavDiv";//give the mobile nav an id so that we can work with it


const toggleMobileMenu = ()=>{//function for togeling the mobile nav
   if(mobileMenu.style.visibility == "hidden"){//if the mobile nav is not visible
       mobileMenu.style.visibility = "visible";//make it visaible
       nav.style.position = "fixed";//make the actual nav not scrollabel
       nav.style.width = "100vw";// change the size of it, idk why it keeps becoming small
   }else{//else if the nav is visible
       mobileMenu.style.visibility = "hidden";//make it invisible
       nav.style.position = "static";//make the real nav scroll woth page again
   }
}

mobileMenuImg.addEventListener("click",toggleMobileMenu);//event listener for clicking the hamberger button