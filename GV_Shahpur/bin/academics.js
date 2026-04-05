// Academics Modals - No protection, full PDF functionality
$(document).ready(function() {
  // Routine modals already handled by Bootstrap data-toggle
  // Syllabus downloads handled by <a download>
  
  // Optional: Modal size adjustment
  $('.academic-modal').on('shown.bs.modal', function () {
    $(this).find('iframe').css('height', '70vh');
  });
  
  $('.academic-modal').on('hidden.bs.modal', function () {
    $(this).find('iframe').attr('src', $(this).find('iframe').attr('src'));
  });
});