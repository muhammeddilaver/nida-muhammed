// path: js/guestbook.js
// Initialize Supabase client
const supabaseClient = supabase.createClient(
    'https://eyneqrajzyjfqzmxneqz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmVxcmFqenlqZnF6bXhuZXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMjI4OTQsImV4cCI6MjA1NTY5ODg5NH0.eKAhMbPjCRGOubCET44wxz1hKXgtuGUU7wjSx17oeXI'
  );
  
  // Function to submit a new guestbook entry
  async function submitGuestbookEntry(event) {
    event.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Form validation
    if (!firstName || !lastName || !message) {
      showNotification('Please fill in all fields', 'is-danger');
      return;
    }
    
    try {
      // Show loading state
      document.getElementById('submit-btn').classList.add('is-loading');
      
      // Insert new entry into Supabase
      const { data, error } = await supabaseClient
        .from('guestbook')
        .insert([
          { first_name: firstName, last_name: lastName, message: message }
        ]);
        
      if (error) throw error;
      
      // Clear form
      document.getElementById('guestbook-form').reset();
      
      // Show success message
      showNotification('Thank you for your message!', 'is-success');
      
      // Refresh messages
      loadGuestbookEntries();
      
    } catch (error) {
      console.error('Error submitting entry:', error);
      showNotification('Something went wrong. Please try again.', 'is-danger');
    } finally {
      document.getElementById('submit-btn').classList.remove('is-loading');
    }
  }
  
  // Function to load and display guestbook entries
  async function loadGuestbookEntries() {
    try {
      document.getElementById('entries-loader').classList.remove('is-hidden');
      
      // Get entries from Supabase, sorted by newest first
      const { data, error } = await supabaseClient
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const entriesContainer = document.getElementById('guestbook-entries');
      entriesContainer.innerHTML = '';
      
      if (data.length === 0) {
        entriesContainer.innerHTML = `
          <div class="notification is-light">
            Be the first to leave a message for the bride and groom!
          </div>
        `;
        return;
      }
      
      // Format and display each entry
      data.forEach(entry => {
        const date = new Date(entry.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        const entryElement = document.createElement('div');
        entryElement.className = 'box guestbook-entry';
        entryElement.innerHTML = `
          <article class="media">
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>${entry.first_name} ${entry.last_name}</strong>
                  <small class="is-pulled-right">${date}</small>
                  <br>
                  ${entry.message}
                </p>
              </div>
            </div>
          </article>
        `;
        
        entriesContainer.appendChild(entryElement);
      });
      
    } catch (error) {
      console.error('Error loading entries:', error);
      document.getElementById('guestbook-entries').innerHTML = `
        <div class="notification is-danger">
          Unable to load guestbook entries. Please refresh the page.
        </div>
      `;
    } finally {
      document.getElementById('entries-loader').classList.add('is-hidden');
    }
  }
  
  // Function to show notification messages
  function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type} guestbook-notification`;
    notification.innerHTML = `
      <button class="delete"></button>
      ${message}
    `;
    
    // Add close button functionality
    notification.querySelector('.delete').addEventListener('click', () => {
      notification.remove();
    });
    
    // Add to DOM
    document.getElementById('notifications').appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }
  
  // Initialize guestbook
  document.addEventListener('DOMContentLoaded', () => {
    // Load entries when page is ready
    loadGuestbookEntries();
    
    // Set up form submission handler
    const form = document.getElementById('guestbook-form');
    if (form) {
      form.addEventListener('submit', submitGuestbookEntry);
    }
    
    // Set up notification close buttons
    document.querySelectorAll('.notification .delete').forEach(button => {
      button.addEventListener('click', () => {
        button.parentNode.remove();
      });
    });
  });