(function() {
  // Siema
  var mySiema = new Siema();

  //Siema auto play
  setInterval(function() {
    mySiema.next();
  }, 5000);

  // Burger Menu
  var burgerMenu = document.querySelector('.burger-menu');
  var burgerMenuList = document.querySelector('.burger-menu__list');

  if (burgerMenu) {
    burgerMenu.addEventListener('click', function() {
      if (burgerMenuList.className === 'burger-menu__list burger-menu_hidden') {
        burgerMenuList.className = 'burger-menu__list';
      } else {
        burgerMenuList.className = 'burger-menu__list burger-menu_hidden';
      }
    });
  }
})();
