'use strict';

// Меню-бургер
(function () {
  var openNavigation = function () {
    navMain.removeClass('page-header__nav--closed').addClass('page-header__nav--opened');
    navToggle.removeClass('button--nav-closed').addClass('button--nav-opened');
  };

  var closeNavigation = function () {
    navMain.addClass('page-header__nav--closed').removeClass('page-header__nav--opened');
    navToggle.addClass('button--nav-closed').removeClass('button--nav-opened');
  };

  var navMain = $('.page-header__nav').addClass('page-header__nav--closed');
  var navToggle = $('.button--toggle').addClass('button--nav-closed').on('click', function () {
    if (navMain.hasClass('page-header__nav--closed')) {
      openNavigation();
    } else {
      closeNavigation();
    }
  });
})();

// Попап с формой
// (попытался написать с синтаксисом jQuery, но в консоль постоянно сыпались ошибки)
(function () {
  var openPopup = function () {
    popup.removeClass('popup--closed').addClass('popup--opened');
    document.addEventListener('keydown', onPopupEscPress);
    userPhoneInput.focus();
    popupOverlay.addEventListener('click', closePopup);
  };

  var closePopup = function () {
    popup.removeClass('popup--opened').addClass('popup--closed');
    document.removeEventListener('keydown', onPopupEscPress);
    popupOverlay.removeEventListener('click', closePopup);
  };

  var onPopupEscPress = function (evt) {
    if (evt.key === 'Escape') {
      closePopup();
    }
  };

  var addClickListener = function (button) {
    button.addEventListener('click', function (evt) {
      evt.preventDefault();
      openPopup();
    });
  };

  var popup = $('.popup').addClass('popup--closed');
  var popupOverlay = document.querySelector('.popup__overlay');
  var userPhoneInput = $('#user-phone-popup');

  var fareButtons = document.querySelectorAll('.button--fare');
  fareButtons.forEach(function (fareButton) {
    addClickListener(fareButton);
  });

  var cardButtons = document.querySelectorAll('.button--card');
  cardButtons.forEach(function (fareButton) {
    addClickListener(fareButton);
  });

  var popupToggle = $('.button--popup-close').on('click', function () {
    closePopup();
  });
})();

// Попап с сообщением об успешной отправке формы
(function () {
  var popupSuccessOpen = function () {
    popupSuccess.removeClass('popup-success--closed').addClass('popup-success--opened');
    document.addEventListener('keydown', onPopupSuccessEscPress);
    popupSuccessOverlay.addEventListener('click', popupSuccessClose);
  };

  var popupSuccessClose = function () {
    popupSuccess.removeClass('popup-success--opened').addClass('popup-success--closed');
    document.removeEventListener('keydown', onPopupSuccessEscPress);
    popupSuccessOverlay.removeEventListener('click', popupSuccessClose);
  };

  var onPopupSuccessEscPress = function (evt) {
    if (evt.key === 'Escape') {
      popupSuccessClose();
    }
  };

  var closePopup = function () {
    popup.removeClass('popup--opened').addClass('popup--closed');
  };

  var popupSuccess = $('.popup-success').addClass('popup-success--closed');
  var popupSuccessOverlay = document.querySelector('.popup-success__overlay');
  var popup = $('.popup').addClass('popup--closed');

  var popupForm = $('.popup__form').on('submit', function (evt) {
    evt.preventDefault();
    closePopup();
    popupSuccessOpen();
  });

  var connectionForm = $('.connection__form').on('submit', function (evt) {
    evt.preventDefault();
    popupSuccessOpen();
  });

  var popupSuccessCloseButton = $('.button--popup-success-close').on('click', function () {
    popupSuccessClose();
  });
})();

// Валидация полей ввода
(function () {
  var showErrorMessage = function (element) {
    element.nextElementSibling.style.display = 'block';
  };

  var hideErrorMessage = function (element) {
    element.nextElementSibling.style.display = 'none';
  };

  var popupInputs = document.querySelectorAll('.popup__input');

  popupInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      localStorage.setItem(input.id, input.value);
      if (input.validity.typeMismatch || input.validity.patternMismatch) {
        showErrorMessage(input);
      } else if (input.validity.valid) {
        hideErrorMessage(input);
      }
    });
  });

  var connectionInputs = document.querySelectorAll('.connection__input');

  connectionInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      localStorage.setItem(input.id, input.value);
      if (input.validity.typeMismatch || input.validity.patternMismatch) {
        showErrorMessage(input);
      } else if (input.validity.valid) {
        hideErrorMessage(input);
      }
    });
  });
})();

// Табы
// (взял реализацию из спецификации wai-aria-practices 1.1)
(function () {
  var tablist = document.querySelectorAll('[role="tablist"]')[0];
  var tabs;
  var panels;

  generateArrays();

  function generateArrays() {
    tabs = document.querySelectorAll('[role="tab"]');
    panels = document.querySelectorAll('[role="tabpanel"]');
  }

  // For easy reference
  var keys = {
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    delete: 46,
    enter: 13,
    space: 32
  };

  // Add or subtract depending on key pressed
  var direction = {
    37: -1,
    38: -1,
    39: 1,
    40: 1
  };

  // Bind listeners
  for (var i = 0; i < tabs.length; ++i) {
    addListeners(i);
  }

  function addListeners(index) {
    tabs[index].addEventListener('click', clickEventListener);
    tabs[index].addEventListener('keydown', keydownEventListener);
    tabs[index].addEventListener('keyup', keyupEventListener);

    // Build an array with all tabs (<button>s) in it
    tabs[index].index = index;
  }

  // When a tab is clicked, activateTab is fired to activate it
  function clickEventListener(event) {
    var tab = event.target;
    activateTab(tab, false);
  }

  // Handle keydown on tabs
  function keydownEventListener(event) {
    var key = event.keyCode;

    switch (key) {
      case keys.end:
        event.preventDefault();
        // Activate last tab
        focusLastTab();
        break;
      case keys.home:
        event.preventDefault();
        // Activate first tab
        focusFirstTab();
        break;

      // Up and down are in keydown
      // because we need to prevent page scroll >:)
      case keys.up:
      case keys.down:
        determineOrientation(event);
        break;
    }
  }

  // Handle keyup on tabs
  function keyupEventListener(event) {
    var key = event.keyCode;

    switch (key) {
      case keys.left:
      case keys.right:
        determineOrientation(event);
        break;
      case keys.delete:
        determineDeletable(event);
        break;
      case keys.enter:
      case keys.space:
        activateTab(event.target);
        break;
    }
  }

  // When a tablistвЂ™s aria-orientation is set to vertical,
  // only up and down arrow should function.
  // In all other cases only left and right arrow function.
  function determineOrientation(event) {
    var key = event.keyCode;
    var vertical = tablist.getAttribute('aria-orientation') == 'vertical';
    var proceed = false;

    if (vertical) {
      if (key === keys.up || key === keys.down) {
        event.preventDefault();
        proceed = true;
      }
    } else {
      if (key === keys.left || key === keys.right) {
        proceed = true;
      }
    }

    if (proceed) {
      switchTabOnArrowPress(event);
    }
  }

  // Either focus the next, previous, first, or last tab
  // depending on key pressed
  function switchTabOnArrowPress(event) {
    var pressed = event.keyCode;

    if (direction[pressed]) {
      var target = event.target;
      if (target.index !== undefined) {
        if (tabs[target.index + direction[pressed]]) {
          tabs[target.index + direction[pressed]].focus();
        } else if (pressed === keys.left || pressed === keys.up) {
          focusLastTab();
        }
        else if (pressed === keys.right || pressed == keys.down) {
          focusFirstTab();
        }
      }
    }
  }

  // Activates any given tab panel
  function activateTab(tab, setFocus) {
    setFocus = setFocus || true;
    // Deactivate all other tabs
    deactivateTabs();

    // Remove tabindex attribute
    tab.removeAttribute('tabindex');

    // Set the tab as selected
    tab.setAttribute('aria-selected', 'true');

    // Get the value of aria-controls (which is an ID)
    var controls = tab.getAttribute('aria-controls');

    // Remove hidden attribute from tab panel to make it visible
    document.getElementById(controls).removeAttribute('hidden');

    // Set focus when required
    if (setFocus) {
      tab.focus();
    }
  }

  // Deactivate all tabs and tab panels
  function deactivateTabs() {
    for (var t = 0; t < tabs.length; t++) {
      tabs[t].setAttribute('tabindex', '-1');
      tabs[t].setAttribute('aria-selected', 'false');
    }

    for (var p = 0; p < panels.length; p++) {
      panels[p].setAttribute('hidden', 'hidden');
    }
  }

  // Make a guess
  function focusFirstTab() {
    tabs[0].focus();
  }

  // Make a guess
  function focusLastTab() {
    tabs[tabs.length - 1].focus();
  }

  // Detect if a tab is deletable
  function determineDeletable(event) {
    var target = event.target;

    if (target.getAttribute('data-deletable') !== null) {
      // Delete target tab
      deleteTab(event, target);

      // Update arrays related to tabs widget
      generateArrays();

      // Activate the closest tab to the one that was just deleted
      if (target.index - 1 < 0) {
        activateTab(tabs[0]);
      }
      else {
        activateTab(tabs[target.index - 1]);
      }
    }
  }

  // Deletes a tab and its panel
  function deleteTab(event) {
    var target = event.target;
    var panel = document.getElementById(target.getAttribute('aria-controls'));

    target.parentElement.removeChild(target);
    panel.parentElement.removeChild(panel);
  };

  // Determine whether there should be a delay
  // when user navigates with the arrow keys
  function determineDelay () {
    var hasDelay = tablist.hasAttribute('data-delay');
    var delay = 0;

    if (hasDelay) {
      var delayValue = tablist.getAttribute('data-delay');
      if (delayValue) {
        delay = delayValue;
      } else {
        // If no value is specified, default to 300ms
        delay = 300;
      }
    }

    return delay;
  }
}());

// Плавный скролл
(function () {
  var $page = $('html, body');
  $('a[href*="#"]').click(function () {
    $page.animate({
      scrollTop: $($.attr(this, 'href')).offset().top
    }, 800);
    return false;
  });
})();

// Свайп табов
// (использовал библиотеку Swiper.js)
var swiper = new Swiper('.swiper-container', {
  slidesPerView: 'auto',
  freeMode: true,
  slidesOffsetAfter: 100
});
