/*!
 * Adapted from Bootstrap docs JavaScript
 */


!function ($) {

  $(function () {
      $('#navigation .sidenav').html($("#markdown-toc").html());
      $('#navigation .sidenav ul').addClass("nav");
      $("#markdown-toc").remove();
  })

}(jQuery)
