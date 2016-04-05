/*
  Brave Front-end Framework
  https://github.com/brave/brave-website
*/

var Brave = Brave || window.Brave || { app: {} };

/*
  Home View
*/

(function() {

  Brave.app.home = new Brave.View({

    name: 'home',

    events: [
      [window, 'scroll', 'handleScroll'],
      ['#brave-video, #brave-overlay', 'click', 'handleVideoButton'],
      ['#brave-download', 'click', 'handleDownloadButtonClick']
    ],

    state: {
      downloadURL: 'https://github.com/brave/browser-laptop/releases'
    },

    properties: {

      platforms: [
        { name: 'Linux x64, Ubuntu', userAgent: 'Linux|Ubuntu', url: 'https://laptop-updates.brave.com/latest/linux64' },
        { name: 'Mac OS 10.9', userAgent: 'Macintosh', url: 'https://laptop-updates.brave.com/latest/osx' },
        { name: 'Windows 7', userAgent: 'Windows', url: 'https://laptop-updates.brave.com/latest/winx64' },
        { name: 'iOS 8', userAgent: 'iPhone|iPod|iPad', url: 'https://itunes.apple.com/us/app/brave-web-browser/id1052879175' },
        { name: 'Android 4.1', userAgent: 'Android', url: 'https://play.google.com/store/apps/details?id=com.linkbubble.playstore' }
      ],

      bootstrap: {

        offsetHeight: 116,

        carousel: { interval: 15000 },

        tooltips: [
          { selector: '.tooltips', className: '' },
          { selector: '.tooltips-show', className: 'show' },
          { selector: '.tooltips-hide', className: 'hide' },
          { selector: '.tooltips-toggle', className: 'toggle' },
          { selector: '.tooltips-destroy', className: 'destroy' }
        ],

        popovers: [
          { selector: '.popovers', className: '' },
          { selector: '.popovers-show', className: 'show' },
          { selector: '.popovers-hide', className: 'hide' },
          { selector: '.popovers-toggle', className: 'toggle' },
          { selector: '.popovers-destroy', className: 'destroy' }
        ]

      }

    },

    unInvertHeader: function() {
      $('#brave-logo').removeClass('invert');
      $('.navbar-nav.brave-nav, .navbar-toggle').removeClass('home');
    },

    invertHeader: function() {
      $('#brave-logo').addClass('invert');
      $('.navbar-nav.brave-nav, .navbar-toggle').addClass('home');
    },

    toggleVideoButton: function() {
      if(this.isOverlayShown()) {
        return this.hideOverlay();
      }
      return this.showOverlay();
    },

    handleVideoButton: function(event) {
      if(this.isTargetElement(event, 'brave-overlay') || this.isTargetElement(event, 'brave-video') || this.isTargetElement(event, 'close')) {
        return this.toggleVideoButton();
      }
      return false;
    },

    handleScroll: function(event) {
      if(this.isNearPageTop()) {
        this.unCollapseHeader();
        if(this.isHomePage()) {
          requestAnimationFrame(this.invertHeader.bind(this));
        }
      }
      else {
        this.collapseHeader();
        if(this.isHomePage()) {
          requestAnimationFrame(this.unInvertHeader.bind(this));
        }
      }
    },

    handleDownloadButtonClick: function(event) {
      window.location.href = this.state.downloadURL;
    },

    configureDownloadButton: function(platform, index) {
      if(this.isPlatform(platform.userAgent)) {
        $('.control-group').find('.label').not('a').html('For ' + platform.name + ' or later.');
        this.state.downloadURL = platform.url;
      }
    },

    reactToUserAgent: function(platforms) {
      var buttons = $('.brave-hero').find('.btn').remove();
      platforms.forEach(this.configureDownloadButton.bind(this), buttons);
    },

    isNearPageTop: function() {
      return ($(document.body).scrollTop() < this.properties.bootstrap.offsetHeight);
    },

    initBootstrapUI: function() {
      if(this.properties.bootstrap.carousel.interval > 0) {
        jQuery('.carousel').carousel({
          interval: this.properties.bootstrap.carousel.interval,
          pause: 'hover'
        });
      }
      this.properties.bootstrap.tooltips.forEach(function(t, i) {
        jQuery(t.selector).tooltip(t.className.length > 1 ? t.className : null);
      });
      this.properties.bootstrap.popovers.forEach(function(p, i) {
        jQuery(p.selector).popover(p.className.length > 1 ? p.className : null);
      });
    },

    initCounter: function() {
      jQuery('.counter').counterUp({
        delay: 10,
        time: 1000
      });
    },

    init: function() {
      if(this.isHomePage() && this.isNearPageTop()) {
        this.invertHeader();
      }
      else {
        this.unInvertHeader();
      }
      this.initBootstrapUI();
      this.reactToUserAgent(this.properties.platforms);
      $('body').scrollspy({ offset: this.properties.bootstrap.offsetHeight + 1 });
    }

  });

}());