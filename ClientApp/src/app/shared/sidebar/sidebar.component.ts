import { Component, OnInit, Input } from '@angular/core';
//import * as $ from 'jquery';
import { from } from 'rxjs';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
  constructor() {
   
  }
  public ngOnInit() {
    // jquery for side navigation
    $(() => {
      $('.side-nav .side-nav-menu li a').on('click', function(e) {
        $(this).parent().hasClass('open') ? $(this).parent().children('.dropdown-menu').slideUp(200, function() {
          $(this).parent().removeClass('open'); }) : ($(this).parent()
          .parent().children('li.open').children('.dropdown-menu').
          slideUp(200), $(this).parent().parent().children('li.open').
          children('a').removeClass('open'), $(this).parent().parent().
          children('li.open').removeClass('open'), $(this).parent().children('.dropdown-menu').slideDown(200, function() {
          $(this).parent().addClass('open');
        }));
      }),
        $('.sidenav-fold-toggler').on('click', (e) => {
          $('.layout').toggleClass('side-nav-folded'), e.preventDefault();
        }),
        $('.sub-down li a').on('click', (e) => {
          $('.layout').removeClass('side-nav-folded'), e.preventDefault();
        }),
        $('.sidenav-fold-toggler-profile').on('click', (e) => {
          $('.layout').removeClass('side-nav-folded'), e.preventDefault();
        }),
        $('.nav-item .dropdown-toggle, .overlay').on('click', (e) => {
          $('.layout').removeClass('side-nav-folded'), e.preventDefault();
        });
    });


  }


}






