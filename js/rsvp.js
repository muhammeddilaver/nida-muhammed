// Initialize Supabase client
const supabaseRSVP = supabase.createClient(
  "https://eyneqrajzyjfqzmxneqz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmVxcmFqenlqZnF6bXhuZXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMjI4OTQsImV4cCI6MjA1NTY5ODg5NH0.eKAhMbPjCRGOubCET44wxz1hKXgtuGUU7wjSx17oeXI"
);

// Function to open the RSVP modal
function openRSVPModal() {
  document.getElementById("rsvp-modal").classList.add("is-active");
  document.body.classList.add("is-clipped"); // Prevents scrolling behind modal
}

// Function to close the RSVP modal
function closeRSVPModal() {
  document.getElementById("rsvp-modal").classList.remove("is-active");
  document.body.classList.remove("is-clipped");
}

// Function to submit RSVP
async function submitRSVP(event) {
  event.preventDefault();

  // Get form values
  const name = document.getElementById("attendee-name").value.trim();
  const guestCount = parseInt(
    document.getElementById("number-of-guests").value
  );

  // Form validation
  if (!name || isNaN(guestCount)) {
    showRSVPNotification("Please fill in all required fields", "is-danger");
    return;
  }

  try {
    // Show loading state
    document.getElementById("submit-rsvp-btn").classList.add("is-loading");

    // Insert new entry into Supabase
    const { data, error } = await supabaseRSVP.from("rsvp").insert([
      {
        name: name,
        guest_count: guestCount,
      },
    ]);

    if (error) throw error;

    // Clear form
    document.getElementById("rsvp-form").reset();

    // Show success message
    showRSVPNotification(
      "attending" === "attending"
        ? "Thank you for your RSVP! We look forward to celebrating with you."
        : "Thank you for letting us know. We will miss your presence!",
      "is-success"
    );

    // Close modal after successful submission
    setTimeout(() => {
      closeRSVPModal();
    }, 2000);
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    showRSVPNotification(
      "Something went wrong. Please try again.",
      "is-danger"
    );
  } finally {
    document.getElementById("submit-rsvp-btn").classList.remove("is-loading");
  }
}

// Function to show notification messages
function showRSVPNotification(message, type) {
  // Create notification element if it doesn't exist
  let notificationArea = document.getElementById("rsvp-notifications");
  if (!notificationArea) {
    notificationArea = document.createElement("div");
    notificationArea.id = "rsvp-notifications";
    notificationArea.style.position = "fixed";
    notificationArea.style.bottom = "20px";
    notificationArea.style.right = "20px";
    notificationArea.style.zIndex = "9999";
    document.body.appendChild(notificationArea);
  }

  // Create notification
  const notification = document.createElement("div");
  notification.className = `notification ${type} rsvp-notification`;
  notification.style.marginTop = "10px";
  notification.style.minWidth = "280px";
  notification.style.maxWidth = "320px";
  notification.style.animation = "slideIn 0.4s ease";
  notification.innerHTML = `
      <button class="delete"></button>
      ${message}
    `;

  // Add close button functionality
  notification.querySelector(".delete").addEventListener("click", () => {
    notification.remove();
  });

  // Add to DOM
  notificationArea.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// Initialize RSVP functionality
document.addEventListener("DOMContentLoaded", () => {
  // Add animation for notifications
  const style = document.createElement("style");
  style.textContent = `
      @keyframes slideIn {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .rsvp-notification {
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        border-radius: 6px;
      }
    `;
  document.head.appendChild(style);

  // Set up event listeners for the RSVP modal
  const rsvpButtons = document.querySelectorAll(".open-rsvp-modal");
  rsvpButtons.forEach((button) => {
    button.addEventListener("click", openRSVPModal);
  });

  document
    .getElementById("close-modal-btn")
    .addEventListener("click", closeRSVPModal);
  document
    .getElementById("close-modal-x")
    .addEventListener("click", closeRSVPModal);
  document
    .getElementById("submit-rsvp-btn")
    .addEventListener("click", submitRSVP);

  // Close modal if clicking outside
  document.getElementById("rsvp-modal").addEventListener("click", (event) => {
    if (event.target === document.getElementById("rsvp-modal")) {
      closeRSVPModal();
    }
  });
});
