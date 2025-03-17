/**=====================================
 * BLOG CREATION PAGE FUNCTIONALITY
 =====================================*/
document.addEventListener('DOMContentLoaded', function () {
    // Initialize components
    initPreloader();
    initTabNavigation();
    initCategoriesInput();
    initImageUpload();
    initRichTextEditor();
    initFormSubmission();
});

/**====================
 * PRELOADER ANIMATION
 ====================*/
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const preloaderBar = document.querySelector('.preloader__bar');

    if (!preloader || !preloaderBar) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10 + 5;

        if (progress > 100) {
            progress = 100;
            clearInterval(interval);

            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        }

        preloaderBar.style.width = `${progress}%`;
    }, 150);
}

/**======================
 * TAB NAVIGATION SYSTEM
 ======================*/
function initTabNavigation() {
    const tabs = document.querySelectorAll('.blog-create__tab');
    const tabContents = document.querySelectorAll('.blog-create__tab-content');
    const nextButtons = document.querySelectorAll('.next-tab-btn');
    const prevButtons = document.querySelectorAll('.prev-tab-btn');

    // Tab click handlers
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            // First validate the current tab if moving forward
            const currentTab = document.querySelector('.blog-create__tab.active');
            const currentTabId = currentTab.dataset.tab;
            const targetTabIndex = Array.from(tabs).findIndex(t => t.dataset.tab === target);
            const currentTabIndex = Array.from(tabs).findIndex(t => t.dataset.tab === currentTabId);

            if (targetTabIndex > currentTabIndex && !validateTab(currentTabId)) return;

            switchToTab(target);

            // Generate preview if going to preview tab
            if (target === 'preview') {
                generatePreview();
            }
        });
    });

    // Next button handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const nextTab = button.dataset.next;
            if (validateTab(getActiveTabId())) {
                switchToTab(nextTab);

                // Generate preview if going to preview tab
                if (nextTab === 'preview') {
                    generatePreview();
                }
            }
        });
    });

    // Previous button handlers
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const prevTab = button.dataset.prev;
            switchToTab(prevTab);
        });
    });

    // Helper functions
    function switchToTab(tabId) {
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });

        // Scroll to top of form
        document.querySelector('.blog-create__container').scrollIntoView({ behavior: 'smooth' });
    }

    function getActiveTabId() {
        const activeTab = document.querySelector('.blog-create__tab.active');
        return activeTab ? activeTab.dataset.tab : null;
    }

    function validateTab(tabId) {
        switch (tabId) {
            case 'basic-info':
                return validateBasicInfo();
            case 'content':
                return validateContent();
            case 'seo-settings':
                return validateSeoSettings();
            default:
                return true;
        }
    }

    function validateBasicInfo() {
        const title = document.getElementById('blog-title').value.trim();
        const excerpt = document.getElementById('blog-excerpt').value.trim();
        const authorName = document.getElementById('author-name').value.trim();

        if (!title) {
            alert('Please enter a blog title');
            document.getElementById('blog-title').focus();
            return false;
        }

        if (!excerpt) {
            alert('Please enter a blog excerpt');
            document.getElementById('blog-excerpt').focus();
            return false;
        }

        if (!authorName) {
            alert('Please enter an author name');
            document.getElementById('author-name').focus();
            return false;
        }

        return true;
    }

    function validateContent() {
        // Get content from the rich text editor
        const content = quill.root.innerHTML.trim();
        document.getElementById('blog-content-hidden').value = content;

        if (content === '<p><br></p>' || content === '') {
            alert('Please add some content to your blog post');
            quill.focus();
            return false;
        }

        return true;
    }

    function validateSeoSettings() {
        // SEO settings are optional, so we always return true
        return true;
    }
}

/**========================
 * CATEGORIES INPUT SYSTEM
 ========================*/
function initCategoriesInput() {
    const categoriesInput = document.getElementById('blog-categories');
    const categoriesChips = document.querySelector('.blog-category__chips');
    const categoriesHidden = document.getElementById('categories-hidden');

    if (!categoriesInput || !categoriesChips || !categoriesHidden) return;

    let categories = [];

    categoriesInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const category = categoriesInput.value.trim();

            if (category && !categories.includes(category)) {
                categories.push(category);
                renderCategories();
                categoriesInput.value = '';
            }
        }
    });

    function renderCategories() {
        categoriesChips.innerHTML = '';
        categoriesHidden.value = JSON.stringify(categories);

        categories.forEach(category => {
            const chip = document.createElement('div');
            chip.className = 'blog-category__chip';
            chip.innerHTML = `
        ${category}
        <button type="button" class="blog-category__chip-remove" data-category="${category}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;

            categoriesChips.appendChild(chip);
        });

        // Add removal event listeners
        document.querySelectorAll('.blog-category__chip-remove').forEach(button => {
            button.addEventListener('click', () => {
                const categoryToRemove = button.dataset.category;
                categories = categories.filter(c => c !== categoryToRemove);
                renderCategories();
            });
        });
    }
}

/**=======================
 * IMAGE UPLOAD PREVIEW
 =======================*/
function initImageUpload() {
    const imageInput = document.getElementById('featured-image');
    const imagePreview = document.getElementById('image-preview');
    const placeholder = document.querySelector('.image-upload__placeholder');
    const removeButton = document.querySelector('.image-upload__remove');

    if (!imageInput || !imagePreview || !placeholder || !removeButton) return;

    imageInput.addEventListener('change', function () {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                placeholder.style.display = 'none';
                removeButton.style.display = 'block';
            };

            reader.readAsDataURL(file);
        }
    });

    removeButton.addEventListener('click', function () {
        imageInput.value = '';
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
        placeholder.style.display = 'flex';
        removeButton.style.display = 'none';
    });
}

/**========================
 * RICH TEXT EDITOR SETUP
 ========================*/
let quill;
function initRichTextEditor() {
    // Initialize Quill editor with custom toolbar options
    quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Write your blog post content here...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean']
            ]
        }
    });

    // Update hidden input with content when editor changes
    quill.on('text-change', function () {
        document.getElementById('blog-content-hidden').value = quill.root.innerHTML;
    });
}

/**=====================
 * PREVIEW GENERATION
 =====================*/
function generatePreview() {
    const previewContainer = document.querySelector('.blog-preview__content');
    const loader = document.querySelector('.blog-preview__loader');

    if (!previewContainer || !loader) return;

    // Show loader
    loader.style.display = 'flex';
    previewContainer.innerHTML = '';
    previewContainer.appendChild(loader);

    // Get form data
    const title = document.getElementById('blog-title').value;
    const excerpt = document.getElementById('blog-excerpt').value;
    const authorName = document.getElementById('author-name').value;
    const authorRole = document.getElementById('author-role').value;
    const content = document.getElementById('blog-content-hidden').value;
    const categoriesString = document.getElementById('categories-hidden').value;
    const categories = categoriesString ? JSON.parse(categoriesString) : [];
    const publishDate = document.getElementById('publish-date').value;
    const readTime = document.getElementById('read-time').value;
    const featuredImage = document.getElementById('image-preview');

    // Format the publish date
    const formattedDate = publishDate ? new Date(publishDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }) : new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    // Simulate loading time
    setTimeout(() => {
        // Generate preview HTML
        const previewHTML = `
      <div class="blog-post__header-preview">
        <div class="blog-post__categories-preview">
          ${categories.map(category => `<span class="blog-post__category">${category}</span>`).join('')}
        </div>
        <h1 class="blog-post__title-preview">${title}</h1>
        <div class="blog-post__info-preview">
          <div class="blog-post__author-preview">
            <div class="blog-post__author-img-preview">
              <!-- Placeholder avatar, will be replaced with actual author image in production -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="blog-post__author-details-preview">
              <span class="blog-post__author-name-preview">${authorName}</span>
              <span class="blog-post__author-role-preview">${authorRole}</span>
            </div>
          </div>
          <div class="blog-post__details-preview">
            <div class="blog-post__date-preview">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${formattedDate}</span>
            </div>
            <div class="blog-post__read-time-preview">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${readTime || '5'} min read</span>
            </div>
          </div>
        </div>
      </div>
      
      ${featuredImage.style.display !== 'none' ? `
        <div class="blog-post__featured-image-preview">
          <img src="${featuredImage.src}" alt="${title}">
        </div>
      ` : ''}
      
      <div class="blog-post__excerpt-preview">
        <p>${excerpt}</p>
      </div>
      
      <div class="blog-post__content-preview">
        ${content}
      </div>
    `;

        // Add styling for preview elements
        const previewStyle = document.createElement('style');
        previewStyle.textContent = `
      .blog-post__header-preview {
        margin-bottom: 2rem;
      }
      
      .blog-post__categories-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .blog-post__category {
        color: white;
        padding: 0.35rem 0.75rem;
        font-size: 0.875rem;
        border-radius: 50px;
        background: rgba(0, 85, 255, 0.2);
        border: 1px solid rgba(0, 85, 255, 0.3);
      }
      
      .blog-post__title-preview {
        color: white;
        font-weight: 700;
        line-height: 1.3;
        margin-bottom: 1.5rem;
        font-size: 2rem;
      }
      
      .blog-post__info-preview {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      
      .blog-post__author-preview {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .blog-post__author-img-preview {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      
      .blog-post__author-img-preview svg {
        width: 30px;
        height: 30px;
        color: var(--text-secondary);
      }
      
      .blog-post__author-details-preview {
        display: flex;
        flex-direction: column;
      }
      
      .blog-post__author-name-preview {
        color: white;
        font-weight: 600;
      }
      
      .blog-post__author-role-preview {
        color: var(--text-secondary);
        font-size: 0.875rem;
      }
      
      .blog-post__details-preview {
        display: flex;
        gap: 1.5rem;
        align-items: center;
      }
      
      .blog-post__date-preview,
      .blog-post__read-time-preview {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
      }
      
      .blog-post__date-preview svg,
      .blog-post__read-time-preview svg {
        width: 18px;
        height: 18px;
        color: var(--primary-color);
      }
      
      .blog-post__featured-image-preview {
        margin-bottom: 2rem;
        border-radius: var(--radius-md);
        overflow: hidden;
        max-height: 300px;
      }
      
      .blog-post__featured-image-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .blog-post__excerpt-preview {
        padding: 1.5rem;
        margin-bottom: 2rem;
        border-left: 3px solid var(--primary-color);
        background: rgba(0, 85, 255, 0.1);
      }
      
      .blog-post__excerpt-preview p {
        color: white;
        font-style: italic;
        margin: 0;
      }
      
      .blog-post__content-preview {
        color: var(--text-secondary);
        line-height: 1.8;
      }
      
      .blog-post__content-preview h1,
      .blog-post__content-preview h2,
      .blog-post__content-preview h3,
      .blog-post__content-preview h4,
      .blog-post__content-preview h5,
      .blog-post__content-preview h6 {
        color: white;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
      }
      
      .blog-post__content-preview p {
        margin-bottom: 1rem;
      }
      
      .blog-post__content-preview blockquote {
        padding: 1rem 1.5rem;
        margin: 1.5rem 0;
        border-left: 3px solid var(--primary-color);
        background: rgba(0, 85, 255, 0.1);
        color: white;
        font-style: italic;
      }
      
      .blog-post__content-preview ul,
      .blog-post__content-preview ol {
        margin-left: 1.5rem;
        margin-bottom: 1.5rem;
      }
      
      .blog-post__content-preview li {
        margin-bottom: 0.5rem;
      }
      
      .blog-post__content-preview a {
        color: var(--primary-color);
        text-decoration: underline;
      }
    `;

        // Hide loader and show preview
        previewContainer.innerHTML = '';
        previewContainer.appendChild(previewStyle);

        const previewContent = document.createElement('div');
        previewContent.innerHTML = previewHTML;
        previewContainer.appendChild(previewContent);
    }, 1000);
}

/**===================
 * FORM SUBMISSION
 ===================*/
function initFormSubmission() {
    const form = document.getElementById('blog-create-form');
    const publishBtn = document.querySelector('.publish-btn');
    const saveDraftBtn = document.querySelector('.save-draft-btn');
    const successModal = document.getElementById('success-modal');
    const modalCloseBtn = document.querySelector('.modal-close');

    if (!form || !publishBtn || !saveDraftBtn || !successModal || !modalCloseBtn) return;

    // Save draft button handler
    saveDraftBtn.addEventListener('click', () => {
        // Save content to localStorage as a draft
        saveAsDraft();
        alert('Your blog post has been saved as a draft');
    });

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all tabs before submission
        if (!validateAllTabs()) return;

        // Prepare form data for submission
        const formData = new FormData(form);

        // Add Quill editor content to form data
        formData.append('blog-content', quill.root.innerHTML);

        try {
            // Simulate submission (in production, this would be an actual API call to HubSpot)
            await simulateHubSpotSubmission(formData);

            // Show success modal
            successModal.classList.add('active');
        } catch (error) {
            alert('There was an error publishing your blog post. Please try again.');
            console.error('Submission error:', error);
        }
    });

    // Close modal button handler
    modalCloseBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        resetForm();
    });

    // Helper functions
    function validateAllTabs() {
        // Validate basic info
        const title = document.getElementById('blog-title').value.trim();
        const excerpt = document.getElementById('blog-excerpt').value.trim();
        const authorName = document.getElementById('author-name').value.trim();

        if (!title || !excerpt || !authorName) {
            alert('Please fill in all required fields in the Basic Info tab');
            document.querySelector('[data-tab="basic-info"]').click();
            return false;
        }

        // Validate content
        const content = quill.root.innerHTML.trim();
        if (content === '<p><br></p>' || content === '') {
            alert('Please add some content to your blog post');
            document.querySelector('[data-tab="content"]').click();
            return false;
        }

        return true;
    }

    function saveAsDraft() {
        // Get form data
        const title = document.getElementById('blog-title').value;
        const excerpt = document.getElementById('blog-excerpt').value;
        const content = quill.root.innerHTML;
        const categoriesString = document.getElementById('categories-hidden').value;
        const authorName = document.getElementById('author-name').value;
        const authorRole = document.getElementById('author-role').value;

        // Create draft object
        const draft = {
            title,
            excerpt,
            content,
            categories: categoriesString,
            authorName,
            authorRole,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        const drafts = JSON.parse(localStorage.getItem('blogDrafts') || '[]');
        drafts.push(draft);
        localStorage.setItem('blogDrafts', JSON.stringify(drafts));
    }

    function resetForm() {
        // Reset form fields
        form.reset();

        // Reset Quill editor
        quill.root.innerHTML = '';

        // Reset categories
        document.querySelector('.blog-category__chips').innerHTML = '';
        document.getElementById('categories-hidden').value = '';

        // Reset image preview
        document.getElementById('image-preview').style.display = 'none';
        document.querySelector('.image-upload__placeholder').style.display = 'flex';
        document.querySelector('.image-upload__remove').style.display = 'none';

        // Go back to first tab
        document.querySelector('[data-tab="basic-info"]').click();
    }

    async function simulateHubSpotSubmission(formData) {
        // This is where you would normally make an API call to HubSpot
        // For this demo, we'll simulate a successful submission
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data that would be sent to HubSpot:', Object.fromEntries(formData));
                resolve({ success: true });
            }, 2000);
        });
    }
}

/**==================================
 * HUBSPOT INTEGRATION INSTRUCTIONS
 ==================================*/
function hubspotIntegration() {
    /*
     * In a production environment, you would need to:
     * 
     * 1. Create a HubSpot form in your HubSpot account for blog submissions
     * 2. Get the form ID and portal ID from HubSpot
     * 3. Use the HubSpot Forms API to submit the form data
     * 
     * Sample code for HubSpot integration:
     * 
     * const portalId = 'YOUR_PORTAL_ID';
     * const formId = 'YOUR_FORM_ID';
     * 
     * function submitToHubSpot(formData) {
     *   const data = {
     *     fields: [
     *       { name: 'blog_title', value: formData.get('blog-title') },
     *       { name: 'blog_content', value: formData.get('blog-content') },
     *       { name: 'blog_excerpt', value: formData.get('blog-excerpt') },
     *       { name: 'author_name', value: formData.get('author-name') },
     *       { name: 'author_role', value: formData.get('author-role') },
     *       { name: 'categories', value: formData.get('categories') },
     *       // Add other fields as needed
     *     ],
     *     context: {
     *       pageUri: window.location.href,
     *       pageName: document.title
     *     }
     *   };
     * 
     *   return fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
     *     method: 'POST',
     *     headers: {
     *       'Content-Type': 'application/json'
     *     },
     *     body: JSON.stringify(data)
     *   })
     *   .then(response => {
     *     if (!response.ok) throw new Error('Network response was not ok');
     *     return response.json();
     *   });
     * }
     * 
     * You would also need to handle file uploads separately, as the HubSpot Forms API
     * doesn't directly support file uploads through this endpoint. You might need to:
     * 
     * 1. Upload files to your own server or a service like AWS S3
     * 2. Get the URL of the uploaded file
     * 3. Include the URL in the form submission to HubSpot
     * 
     * For a complete blog management system, you might also need to:
     * 
     * 1. Create a custom module in HubSpot for displaying blog posts
     * 2. Use the HubSpot CMS API to create and manage blog posts
     * 3. Implement a workflow to trigger blog publication
     */
}