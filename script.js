// DOM Elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const previewImage = document.getElementById('preview-image');
const analyzeBtn = document.getElementById('analyze-btn');
const loader = document.getElementById('loader');
const resultsSection = document.getElementById('results');
const resultImage = document.getElementById('result-image');
const diagnosisText = document.getElementById('diagnosis-text');
const confidenceLevel = document.getElementById('confidence-level');
const confidenceText = document.getElementById('confidence-text');
const recommendationText = document.getElementById('recommendation-text');
const newScanBtn = document.getElementById('new-scan-btn');
const browseBtn = document.querySelector('.browse-btn');

// DR Classification results (sample data to simulate backend response)
const drClassifications = [
  'Proliferative DR',
  'Severe Non-Proliferative DR',
  'No Diabetic Retinopathy',
  'Severe Non-Proliferative DR',
  'Proliferative DR',
  'No Diabetic Retinopathy',
  'Mild Non-Proliferative DR',
  'No Diabetic Retinopathy',
  'Mild Non-Proliferative DR',
  'Moderate Non-Proliferative DR',
  'Moderate Non-Proliferative DR',
  'Moderate Non-Proliferative DR',
  'Mild Non-Proliferative DR',
  'Severe Non-Proliferative DR',
  'Proliferative DR'
];

// Navigation - smooth scrolling
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    window.scrollTo({
      top: targetSection.offsetTop - 80,
      behavior: 'smooth'
    });
    
    // Update active link
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    this.classList.add('active');
  });
});

// Set active nav link based on scroll position
window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
});

// File Upload Event Handlers
browseBtn.addEventListener('click', () => {
  fileInput.click();
});

dropArea.addEventListener('click', () => {
  fileInput.click();
});

// Prevent default behavior for drag events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight drop area when file is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  dropArea.classList.add('active');
}

function unhighlight() {
  dropArea.classList.remove('active');
}

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  
  if (files.length) {
    handleFiles(files);
  }
}

// Handle file selection
fileInput.addEventListener('change', function() {
  handleFiles(this.files);
});

function handleFiles(files) {
  if (files.length > 0) {
    const file = files[0];
    
    if (!file.type.match('image.*')) {
      alert('Please upload an image file (JPG, PNG, etc.)');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      previewImage.src = e.target.result;
      analyzeBtn.disabled = false;
      
      // Add animation to preview
      previewImage.style.animation = 'fadeIn 0.5s ease';
      
      // Reset animation after it completes
      setTimeout(() => {
        previewImage.style.animation = '';
      }, 500);
    };
    
    reader.readAsDataURL(file);
  }
}

// Analyze button click handler
analyzeBtn.addEventListener('click', analyzeImage);

function analyzeImage() {
  // Show loader and disable button
  loader.style.display = 'block';
  analyzeBtn.disabled = true;
  
  // Simulate API call delay
  setTimeout(() => {
    // Hide loader
    loader.style.display = 'none';
    
    // Display results
    showResults();
  }, 2000);
}

function showResults() {
  // Copy the preview image to result image
  resultImage.src = previewImage.src;
  
  // Get a random classification from our array
  const randomIndex = Math.floor(Math.random() * drClassifications.length);
  const diagnosis = drClassifications[randomIndex];
  
  // Generate random confidence score
  const confidence = Math.floor(Math.random() * 30) + 70; // Between 70% and 99%
  
  // Set diagnosis text and style based on severity
  diagnosisText.textContent = diagnosis;
  setDiagnosisStyle(diagnosis);
  
  // Set confidence level
  confidenceLevel.style.width = `${confidence}%`;
  confidenceText.textContent = `${confidence}%`;
  
  // Set recommendation based on diagnosis
  setRecommendation(diagnosis);
  
  // Show results section with animation
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function setDiagnosisStyle(diagnosis) {
  // Reset classes
  diagnosisText.className = 'diagnosis-value';
  
  // Add specific class based on diagnosis
  if (diagnosis.includes('No Diabetic')) {
    diagnosisText.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
    diagnosisText.style.color = '#27ae60';
  } else if (diagnosis.includes('Mild')) {
    diagnosisText.style.backgroundColor = 'rgba(243, 156, 18, 0.1)';
    diagnosisText.style.color = '#f39c12';
  } else if (diagnosis.includes('Moderate')) {
    diagnosisText.style.backgroundColor = 'rgba(230, 126, 34, 0.1)';
    diagnosisText.style.color = '#e67e22';
  } else if (diagnosis.includes('Severe')) {
    diagnosisText.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
    diagnosisText.style.color = '#e74c3c';
  } else if (diagnosis.includes('Proliferative')) {
    diagnosisText.style.backgroundColor = 'rgba(192, 57, 43, 0.1)';
    diagnosisText.style.color = '#c0392b';
  }
}

function setRecommendation(diagnosis) {
  let recommendation = '';
  
  if (diagnosis.includes('No Diabetic')) {
    recommendation = 'No diabetic retinopathy detected. Continue with regular annual eye exams as recommended by your healthcare provider.';
  } else if (diagnosis.includes('Mild')) {
    recommendation = 'Mild diabetic retinopathy detected. Follow-up with your ophthalmologist within 6-12 months is recommended. Continue to manage your blood sugar levels.';
  } else if (diagnosis.includes('Moderate')) {
    recommendation = 'Moderate diabetic retinopathy detected. Please schedule an appointment with your ophthalmologist within 3-6 months for further evaluation and possible treatment.';
  } else if (diagnosis.includes('Severe')) {
    recommendation = 'Severe diabetic retinopathy detected. Please consult with an ophthalmologist within 1 month for comprehensive evaluation and treatment plan.';
  } else if (diagnosis.includes('Proliferative')) {
    recommendation = 'Proliferative diabetic retinopathy detected. This is a serious condition that requires immediate attention. Please consult with an ophthalmologist as soon as possible.';
  }
  
  recommendationText.textContent = recommendation;
}

// Reset for new scan
newScanBtn.addEventListener('click', function() {
  // Reset form elements
  fileInput.value = '';
  previewImage.src = '';
  analyzeBtn.disabled = true;
  
  // Hide results
  resultsSection.classList.add('hidden');
  
  // Scroll to upload section
  document.getElementById('upload').scrollIntoView({ behavior: 'smooth' });
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields');
      return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      alert('Thank you for your message. We will get back to you soon!');
      
      // Reset form
      contactForm.reset();
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

// Add animation on scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.about-content, .upload-container, .contact-container');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementPosition < windowHeight - 100) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
};

// Initial styles for animation
document.querySelectorAll('.about-content, .upload-container, .contact-container').forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Listen for scroll to trigger animations
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Initialize the page
window.addEventListener('DOMContentLoaded', () => {
  // Set first nav item as active by default
  document.querySelector('nav a').classList.add('active');
  
  // Animate hero section elements
  const heroElements = document.querySelectorAll('.hero-content h1, .hero-content p, .hero-content .btn, .hero-image');
  heroElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 200);
  });
});