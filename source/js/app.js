'use strict';

// Меню-бургер
var navMain = $('.page-header__nav').addClass('page-header__nav--closed');
var navToggle = $('.button--toggle').addClass('button--nav-closed').on('click', function () {
  if (navMain.hasClass('page-header__nav--closed')) {
    navMain.removeClass('page-header__nav--closed').addClass('page-header__nav--opened');
    navToggle.removeClass('button--nav-closed').addClass('button--nav-opened');
  } else {
    navMain.addClass('page-header__nav--closed').removeClass('page-header__nav--opened');
    navToggle.addClass('button--nav-closed').removeClass('button--nav-opened');
  }
});
