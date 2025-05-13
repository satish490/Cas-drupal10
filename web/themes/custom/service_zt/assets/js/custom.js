

(function ($, Drupal) {
  Drupal.behaviors.sectionNavigation = {
    attach: function (context, settings) {
      // Function to show the section based on the hash.
      function showSectionFromHash() {
        const hash = window.location.hash;
        // Hide all sections initially.
        $(".tab-content").hide();
        // If a hash exists, show the related section.
        if (hash) {
          const section = $(hash);
          if (section.length) {
            section.show();
          }
        }
      }

      // Initial call to handle direct navigation with a hash.
      showSectionFromHash();

      // Event listener to handle navigation after clicking on links.
      $(window).on("hashchange", showSectionFromHash);
    }
  };
})(jQuery, Drupal);




// This is for active User Data show in modal.

(function ($, Drupal) {
  Drupal.behaviors.loadUserProfileData = {
    attach: function (context, settings) {

      $('#profileModal').on('shown.bs.modal', function () {
        // Activate the profile tab
        $('.nav-link[data-bs-toggle="tab"][href="#profile"]').tab('show');
      });
      
      // once('loadUserProfile', $('.profile-tab', context)).forEach(function (element) {
      //   const userId = $(element).attr('user-id');

      //   if (userId) {
      //     $.ajax({
      //       url: `./user/${userId}`,
      //       type: 'GET',
      //       success: function (response) {
      //         const $response = $(response);
      //         const $userProfileDiv = $response.find('article.profile');
      //         $('#profile').html($userProfileDiv);
      //       },
      //       error: function () {
      //         $('#profile').html('<p>Failed to load profile content.</p>');
      //       }
      //     });
      //   }
      // });
    }
  };
})(jQuery, Drupal);

(function ($, Drupal) {
  Drupal.behaviors.editUserProfile = {
    attach: function (context, settings) {
      // Retrieve CSRF token securely from Drupal settings
      const csrfToken = drupalSettings.csrf_token;

      // Ensure that the click event is attached only once to each `.edit-btn` element
      once('editUserProfile', $('.edit-btn', context)).forEach(function (element) {
        $(element).on('click', function () {
          const field = $(this).data('field');
          const inputField = $('#' + field);
          const editButton = $(this);

          // Enable editing and focus on the input field
          inputField.prop('readonly', false).focus();

          // Change button text to "Save" and set up the save functionality
          editButton.text('Save').removeClass('btn-outline-secondary').addClass('btn-primary');

          // Attach a one-time click handler for saving changes
          editButton.off('click').on('click', function () {
            const newValue = inputField.val();

            // Call AJAX function to save the new value
            saveUserProfileData(field, newValue, function(success) {
              if (success) {
                // Revert to read-only and reset button text if save is successful
                inputField.prop('readonly', true);
                editButton.text('Edit').removeClass('btn-primary').addClass('btn-outline-secondary');
                editButton.off('click'); // Remove save handler
                Drupal.attachBehaviors(context, settings); // Reattach the behavior to ensure consistency
              }
            });
          });
        });
      });
    }
  };

  function saveUserProfileData(field, value, callback) {
    $.ajax({
      url: window.location.origin + Drupal.url('profile/update'),
      type: 'POST',
      headers: {
        'X-CSRF-Token': drupalSettings.csrf_token
      },
      data: {
        field: field,
        value: value
      },
      success: function (response) {
        if (response.status === 'success') {
          alert(response.message);
          
          // Update the UI to reflect the new value
          $('#' + field).text(value);
          $('#' + field).prop('readonly', true); // Optional: set back to read-only
  
          // Reset button text to "Edit"
          $('.edit-btn[data-field="' + field + '"]').text('Edit').removeClass('btn-primary').addClass('btn-outline-secondary');
  
          if (callback) callback(true);
        }
      },
      error: function () {
        alert('Failed to update profile. Please try again.');
        if (callback) callback(false);
      }
    });
  }
})(jQuery, Drupal);


// Superfish expand 

// var windowWidth = $(window).width();
// if (windowWidth < 1024) {
//   $("ul#superfish-main-navigation-accordion li .menuparent").click(
//     function (event) {
//       var element = $(this);
//       var offsetX = event.offsetX;
//       var elementWidth = element.width();
//       var calculated_width = windowWidth - 50;
//       // if (clickPercentageX >= 75 && clickPercentageY >= 75) {
//       if (offsetX <= calculated_width) {
//         window.location.href = element.attr("href");
//       }
//     }
//   );
// }


//Message wrapper Js 


(function (Drupal) {
  Drupal.behaviors.messageFadeOut = {
    attach(context) {
      const wrapper = context.querySelector('.messages__wrapper');
      if (wrapper && !wrapper.classList.contains('fade-handled')) {
        wrapper.classList.add('fade-handled');

        // Create close button
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'message-close-btn';
        
        // Append it to the message div itself (not wrapper)
        const message = wrapper.querySelector('.messages');
        if (message) {
          message.appendChild(closeBtn);
        }

        // Click to dismiss
        closeBtn.addEventListener('click', function () {
          wrapper.style.transition = 'opacity 0.5s ease';
          wrapper.style.opacity = '0';
          setTimeout(() => wrapper.remove(), 500);
        });

        // Auto-dismiss after 30s
        setTimeout(() => {
          wrapper.style.transition = 'opacity 1s ease';
          wrapper.style.opacity = '0';
          setTimeout(() => wrapper.remove(), 1000);
        }, 30000);
      }
    }
  };
})(Drupal);

