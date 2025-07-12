// Animation for Counters on Enroll Page
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const animate = () => {
      const target = +counter.getAttribute('data-count');
      const count = +counter.innerText;
      const increment = Math.ceil(target / 100);

      if (count < target) {
        counter.innerText = count + increment;
        setTimeout(animate, 30);
      } else {
        counter.innerText = target;
      }
    };
    if (counter.offsetParent !== null) animate();
  });

  // Contact Form Handling
  const contactForms = document.querySelectorAll('form[action="/api/contact"]');
  contactForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
      submitBtn.disabled = true;
      
      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Show success message
          showNotification('Success! ' + result.message, 'success');
          form.reset();
        } else {
          // Show error message
          showNotification('Error: ' + (result.message || 'Something went wrong'), 'error');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
      } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  });

  // Notification function
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 translate-x-full`;
    
    // Set colors based on type
    if (type === 'success') {
      notification.className += ' bg-green-500 text-white';
    } else if (type === 'error') {
      notification.className += ' bg-red-500 text-white';
    } else {
      notification.className += ' bg-blue-500 text-white';
    }
    
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }

  // Gallery Carousel (only on gallery.html)
  const carouselImage = document.getElementById('carousel-image');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  const dotsContainer = document.getElementById('carousel-dots');

  if (carouselImage && prevButton && nextButton) {
    const images = [
      "images/classroom1.jpg",
      "images/classroom2.jpg",
      "images/students-success.jpg",
      "images/online-session.jpg",
      "images/workshop.jpg"
    ];
    let current = 0;

    function showImage(index) {
      carouselImage.src = images[index];
      updateDots(index);
    }

    function updateDots(index) {
      dotsContainer.innerHTML = '';
      images.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === index) dot.classList.add('active');
        dot.addEventListener('click', () => {
          current = i;
          showImage(current);
        });
        dotsContainer.appendChild(dot);
      });
    }

    prevButton.addEventListener('click', () => {
      current = (current - 1 + images.length) % images.length;
      showImage(current);
    });

    nextButton.addEventListener('click', () => {
      current = (current + 1) % images.length;
      showImage(current);
    });

    showImage(current);
    setInterval(() => {
      current = (current + 1) % images.length;
      showImage(current);
    }, 4000);
  }
});