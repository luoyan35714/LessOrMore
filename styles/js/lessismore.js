/*!
 * Adapted from Bootstrap docs JavaScript
 */


!function ($) {

  $(function () {
      $('#navigation .sidenav').html($("#markdown-toc").html());
      $("#markdown-toc").remove();
  })

}(jQuery)
