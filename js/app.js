// ============================================================
// app.js
// APPLICATION / PRESENTATION LAYER
// Personal Website - Integrative Programming Final Project
//
// Responsibilities:
// 1. Render team members
// 2. Render projects
// 3. Validate contact form
// 4. Handle mobile navigation
// 5. Handle active navigation
// 6. Initialize the website
// ============================================================

// ============================================================
// 1. GET HTML ELEMENTS
// ============================================================

const memberGrid = document.querySelector("#memberGrid");

const projectGrid = document.querySelector("#projectGrid");

const contactForm = document.querySelector("#contactForm");

const formStatus = document.querySelector("#formStatus");

const sendButton = document.querySelector("#sendButton");

const sendButtonText = document.querySelector("#sendButtonText");

const menuToggle = document.querySelector("#menuToggle");

const navLinks = document.querySelector("#navLinks");

// ============================================================
// 2. GET MEMBER INITIALS
// ============================================================

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

// ============================================================
// 3. RENDER TEAM MEMBERS
// ============================================================
//
// The members come from the PortfolioManager object
// created inside models.js.
//
// We use JavaScript to dynamically create the member cards.
// ============================================================

// ============================================================
// LOAD MEMBERS FROM MYSQL DATABASE
// ============================================================

let databaseMembers = [];

async function loadMembersFromDatabase() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/members"
        );

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status}`
            );
        }

        const data = await response.json();

        databaseMembers = data.map((member) => {

            return {
                id: member.id,
                name: member.name,
                email: member.email,
                course: member.course,
                yearLevel: member.year_level,
                role: member.role,

                skills: member.skills
                    ? member.skills
                        .split(",")
                        .map(skill => skill.trim())
                    : [],

                interests: member.interests
                    ? member.interests
                        .split(",")
                        .map(interest => interest.trim())
                    : [],

                photo: member.photo,

                // Social media links
                facebook: member.facebook,
                github: member.github,

                getRole() {
                    return this.role;
                }
            };

        });

        console.log(
            `Successfully loaded ${databaseMembers.length} members from MySQL.`
        );

        renderMembers();

    } catch (error) {

        console.error(
            "Unable to load members from MySQL:",
            error
        );

        databaseMembers = portfolio.members;

        console.log(
            "Using existing PortfolioManager member data as fallback."
        );

        renderMembers();
    }
    
};

// ============================================================
// LOAD PROJECTS FROM MYSQL DATABASE
// ============================================================

let databaseProjects = [];

async function loadProjectsFromDatabase() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/projects"
        );

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status}`
            );
        }

        const data = await response.json();

        databaseProjects = data.map((project) => {

            return {
                id: project.id,
                title: project.title,
                description: project.description,
                category: project.category,
                year: project.year,
                achievementBy: project.achievement_by,
                image: project.image,

                getTitle() {
                    return this.title;
                }
            };

        });

        console.log(
            `Successfully loaded ${databaseProjects.length} projects from MySQL.`
        );

        renderProjects();

    } catch (error) {

        console.error(
            "Unable to load projects from MySQL:",
            error
        );

        databaseProjects = portfolio.projects;

        console.log(
            "Using existing PortfolioManager project data as fallback."
        );

        renderProjects();
    }
};


// ============================================================
// LOAD INTRODUCTIONS FROM MYSQL DATABASE
// ============================================================

let databaseIntroductions = [];

async function loadIntroductionsFromDatabase() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/introductions"
        );

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status}`
            );
        }

        const data = await response.json();

        databaseIntroductions = data.map((introduction) => {

            return {
                id: introduction.id,
                memberId: introduction.member_id,
                name: introduction.name,
                role: introduction.role,
                introduction: introduction.introduction
            };

        });

        console.log(
            `Successfully loaded ${databaseIntroductions.length} introductions from MySQL.`
        );

        renderIntroductions();

    } catch (error) {

        console.error(
            "Unable to load introductions from MySQL:",
            error
        );

    }
}

// ============================================================
// RENDER PERSONAL INTRODUCTIONS
// ============================================================

function renderIntroductions() {

    const introductionGrid =
        document.querySelector(".introduction-grid");

    if (!introductionGrid) return;

    // Clear the existing hard-coded introduction cards
    introductionGrid.innerHTML = "";

    databaseIntroductions.forEach((member, index) => {

        // ========================================
        // CREATE INTRODUCTION CARD
        // ========================================

        const card = document.createElement("article");

        card.classList.add("introduction-card");


        // ========================================
        // INTRODUCTION NUMBER
        // ========================================

        const number = document.createElement("div");

        number.classList.add("introduction-number");

        number.textContent =
            String(index + 1).padStart(2, "0");


        // ========================================
        // MEMBER NAME
        // ========================================

        const name = document.createElement("h3");

        name.textContent = member.name;


        // ========================================
        // MEMBER ROLE
        // ========================================

        const role = document.createElement("p");

        role.classList.add("introduction-role");

        role.textContent = member.role;


        // ========================================
        // INTRODUCTION TEXT
        // ========================================

        const introduction = document.createElement("p");

        introduction.textContent =
            member.introduction;


        // ========================================
        // BUILD CARD
        // ========================================

        card.appendChild(number);

        card.appendChild(name);

        card.appendChild(role);

        card.appendChild(introduction);


        // ========================================
        // ADD CARD TO GRID
        // ========================================

        introductionGrid.appendChild(card);

    });

    console.log(
        `Successfully rendered ${databaseIntroductions.length} introductions.`
    );
}

// ========================================
// RENDER ALL TEAM MEMBERS
// ========================================
function renderMembers() {
    
  // Stop the function if the member grid
  // does not exist on the current page
  if (!memberGrid) return;

  // Clear existing member cards before rendering
  memberGrid.innerHTML = "";

  // Get all members from the MySQL database
  const members = databaseMembers;

  // Loop through every member
  members.forEach((member) => {
    // ========================================
    // CREATE MEMBER CARD
    // ========================================

    // Create the main article element
    // that will contain the member information
    const card = document.createElement("article");

    // Add the existing member-card CSS class
    card.classList.add("member-card");

    // ========================================
    // MEMBER AVATAR / PHOTO UPLOAD
    // ========================================

    // Create the avatar container
    const avatar = document.createElement("div");

    // Add the existing member-avatar CSS class
    avatar.classList.add("member-avatar");

    // Make the avatar accessible as a button
    avatar.setAttribute("role", "button");

    // Allow the avatar to receive keyboard focus
    avatar.setAttribute("tabindex", "0");

    // Display a tooltip when the user hovers
    // over the member's picture
    avatar.setAttribute("title", "Click to upload or change photo");

    // ========================================
    // UNIQUE PHOTO STORAGE KEY
    // ========================================

    // Create a unique localStorage key
    // for each member's photo.
    //
    // Example:
    // portfolio_member_photo_Roselle_Garcera
    //
    // This prevents one member's photo
    // from replacing another member's photo.
    

    // ========================================
    // HIDDEN FILE INPUT
    // ========================================

    // Create a file input dynamically
    const fileInput = document.createElement("input");

    // Set the input type to file
    fileInput.type = "file";

    // Only allow image files
    fileInput.accept = "image/*";

    // Hide the actual file input
    // because the avatar will open it instead
    fileInput.style.display = "none";

    // ========================================
    // UPLOAD OVERLAY
    // ========================================

    // Create text that appears when
    // the user hovers over the avatar
    const uploadOverlay = document.createElement("span");

    // Add the CSS class for the overlay
    uploadOverlay.classList.add("upload-overlay");

    // Text displayed on the overlay
    uploadOverlay.textContent = "Change Photo";

    // ========================================
    // DISPLAY MEMBER AVATAR
    // ========================================

    // Function responsible for displaying
    // either the uploaded photo or initials
    function displayAvatar(photoSrc) {
      // Clear the current avatar content
      avatar.innerHTML = "";

      // Check if the member already has a photo
      if (photoSrc) {
        // Create an image element
        const img = document.createElement("img");

        // Set the image source
        img.src = photoSrc;

        // Add accessible alternative text
        img.alt = `${member.name} profile photo`;

        // Add the CSS class for the member photo
        img.classList.add("member-photo");

        // Add the image to the avatar
        avatar.appendChild(img);
      } else {
        // If there is no uploaded photo,
        // display the member's initials instead
        avatar.textContent = getInitials(member.name);
      }

      // Add the "Change Photo" overlay
      avatar.appendChild(uploadOverlay);
    }

    // ========================================
    // LOAD PHOTO FROM MYSQL
    // ========================================

    displayAvatar(member.photo);

    // ========================================
    // OPEN FILE PICKER
    // ========================================

    // When the avatar is clicked,
    // open the hidden file input
    avatar.addEventListener("click", () => {
      fileInput.click();
    });

    // ========================================
    // KEYBOARD ACCESS
    // ========================================

    // Allow users to open the file picker
    // using Enter or Space
    avatar.addEventListener("keydown", (event) => {
      // Check if the pressed key is Enter or Space
      if (event.key === "Enter" || event.key === " ") {
        // Prevent the browser's default behavior
        event.preventDefault();

        // Open the file picker
        fileInput.click();
      }
    });

    // ========================================
    // HANDLE PHOTO SELECTION
    // ========================================

    // Detect when the user selects a file
    fileInput.addEventListener("change", (event) => {
      // Get the selected file
      const file = event.target.files[0];

      // Stop if no file was selected
      if (!file) return;

      // ========================================
      // CHECK FILE TYPE
      // ========================================

      // Make sure the selected file is an image
      if (!file.type.startsWith("image/")) {
        // Show an error message
        alert("Please select an image file.");

        // Reset the file input
        fileInput.value = "";

        return;
      }

      // ========================================
      // CHECK FILE SIZE
      // ========================================

      // Set the maximum allowed file size
      // to 5 MB
      const maxFileSize = 5 * 1024 * 1024;

      // Check if the selected file is too large
      if (file.size > maxFileSize) {
        // Tell the user to choose a smaller image
        alert("Please choose an image smaller than 5 MB.");

        // Reset the file input
        fileInput.value = "";

        return;
      }

      // ========================================
      // READ IMAGE FILE
      // ========================================

      // Create a FileReader to read the image
      const reader = new FileReader();

      // This function runs after
      // the image has been successfully read
      reader.onload = async function () {
        try {
          // ========================================
        // SAVE PHOTO TO MYSQL
        // ========================================

        const response = await fetch(
            `http://localhost:5000/api/members/${member.id}/photo`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    imageData: reader.result
                })
            }
        );
          
        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                errorData.error ||
                "Failed to save photo"
            );

        }


        const result =
            await response.json();
        
       // ========================================
        // UPDATE MEMBER PHOTO
        // ========================================
        member.photo = result.photo;
         
        // ========================================
        // DISPLAY NEW PHOTO
        // ========================================

        displayAvatar(member.photo);

        console.log(
            "Member photo saved to MySQL:",
            member.photo
        );


        } catch (error) {

        console.error(
            "Unable to save photo:",
            error
        );

        alert(
            "The photo could not be saved to the database."
        );

    }

};

      // Start reading the selected image
      reader.readAsDataURL(file);

      // Reset the file input so the user
      // can select the same image again later
      fileInput.value = "";
    });

    // ========================================
    // ADD FILE INPUT TO MEMBER CARD
    // ========================================

    // Add the hidden file input to the card
    card.appendChild(fileInput);

    // ========================================
    // MEMBER INFORMATION
    // ========================================

    // Create the member's name
    const name = document.createElement("h3");

    // Set the member's name
    name.textContent = member.name;

    // ========================================
    // MEMBER ROLE
    // ========================================

    // Create a paragraph for the role
    const role = document.createElement("p");

    // Add the existing CSS class
    role.classList.add("member-role");

    // Get the role from the Developer class
    role.textContent = member.getRole();

    // ========================================
    // EDUCATION INFORMATION
    // ========================================

    // Create an education paragraph
    const education = document.createElement("p");

    // Create the bold "Education:" label
    const educationLabel = document.createElement("strong");

    // Set the label text
    educationLabel.textContent = "Education:";

    // Add the bold label to the education paragraph
    education.appendChild(educationLabel);

    // Add a line break after "Education:"
    education.appendChild(document.createElement("br"));

    // Add the member's course
    education.appendChild(document.createTextNode(member.course));

    // Add a line break after the course
    education.appendChild(document.createElement("br"));

    // Add the member's year level
    education.appendChild(document.createTextNode(member.yearLevel));

    // ========================================
    // MEMBER SKILLS
    // ========================================

    // Create a container for skills
    const skillsContainer = document.createElement("div");

    // Add the existing tags CSS class
    skillsContainer.classList.add("tags");

    // Loop through the member's skills
    member.skills.forEach((skill) => {
      // Create a skill tag
      const tag = document.createElement("span");

      // Add the existing tag CSS class
      tag.classList.add("tag");

      // Display the skill
      tag.textContent = skill;

      // Add the skill tag to the container
      skillsContainer.appendChild(tag);
    });

    // ========================================
    // MEMBER INTERESTS
    // ========================================

    // Create the interests paragraph
    const interestsContainer = document.createElement("p");

    // Add the member-interests CSS class
    interestsContainer.classList.add("member-interests");

    // Create the bold "Interests:" label
    const interestsLabel = document.createElement("strong");

    // Set the label text
    interestsLabel.textContent = "Interests:";

    // Add the bold label
    interestsContainer.appendChild(interestsLabel);

    // Add a space after the label
    interestsContainer.appendChild(document.createTextNode(" "));

    // Convert all interests into one text string
    const interestsText = member.interests.join(", ");

    // Add the interests as normal text
    interestsContainer.appendChild(document.createTextNode(interestsText));

// ========================================
// SOCIAL MEDIA
// ========================================

const socialSection = document.createElement("div");

socialSection.classList.add("member-social-section");


const socialTitle = document.createElement("strong");

socialTitle.textContent = "Social Media";

socialTitle.classList.add("social-title");


const socialContainer = document.createElement("div");

socialContainer.classList.add("member-social");


socialSection.appendChild(socialTitle);

socialSection.appendChild(socialContainer);

// ========================================
// FACEBOOK
// ========================================

if (member.facebook) {

    const facebookLink = document.createElement("a");

    facebookLink.href = member.facebook;

    facebookLink.innerHTML = '<i class="fa-brands fa-facebook-f"></i> Facebook';

    facebookLink.target = "_blank";

    facebookLink.rel = "noopener noreferrer";

    facebookLink.classList.add("social-link");

    socialContainer.appendChild(facebookLink);
}


// ========================================
// GITHUB
// ========================================

if (member.github) {

    const githubLink = document.createElement("a");

    githubLink.href = member.github;

    githubLink.innerHTML = '<i class="fa-brands fa-github"></i> GitHub';

    githubLink.target = "_blank";

    githubLink.rel = "noopener noreferrer";

    githubLink.classList.add("social-link");

    socialContainer.appendChild(githubLink);
}

    // ========================================
    // BUILD MEMBER CARD
    // ========================================

    // Add the avatar/photo
    card.appendChild(avatar);

    // Add the member's name
    card.appendChild(name);

    // Add the member's role
    card.appendChild(role);

    // Add course and year level
    card.appendChild(education);

    // ========================================
    // ADD SKILLS IF AVAILABLE
    // ========================================

    // Only add the skills container
    // if the member has at least one skill
    if (member.skills.length > 0) {
      card.appendChild(skillsContainer);
    }

    // ========================================
    // ADD INTERESTS IF AVAILABLE
    // ========================================

    // Only add the interests container
    // if the member has at least one interest
    if (member.interests.length > 0) {
      card.appendChild(interestsContainer);
    }

   // ========================================
// ADD SOCIAL MEDIA IF AVAILABLE
// ========================================

if (socialContainer.children.length > 0) {
    card.appendChild(socialSection);
}

    // ========================================
    // ADD CARD TO MEMBER GRID
    // ========================================

    // Finally, add the completed member card
    // to the About Us member grid
    memberGrid.appendChild(card);

    // ============================================================
// LIKE BUTTON
// ============================================================

const likeContainer = document.createElement("div");
likeContainer.classList.add("member-like-container");

const likeButton = document.createElement("button");
likeButton.type = "button";
likeButton.classList.add("member-like-button");

// Create a unique key for each member
const likeKey = `memberLike_${member.id}`;

// Get saved like count
let likeCount = parseInt(
    localStorage.getItem(likeKey) || "0"
);

// Check if this member was already liked
const likedKey = `memberLiked_${member.id}`;
let isLiked =
    localStorage.getItem(likedKey) === "true";

// Function to update the button
function updateLikeButton() {

    likeButton.innerHTML = `
        <i class="${isLiked ? "fa-solid" : "fa-regular"} fa-heart"></i>
        <span>${isLiked ? "Liked" : "Like"}</span>
        <span class="like-count">${likeCount}</span>
    `;

    if (isLiked) {
        likeButton.classList.add("liked");
    } else {
        likeButton.classList.remove("liked");
    }
}

// Like button click
likeButton.addEventListener("click", () => {

    if (isLiked) {

        // Unlike
        likeCount--;

        isLiked = false;

    } else {

        // Like
        likeCount++;

        isLiked = true;
    }

    // Save like information
    localStorage.setItem(
        likeKey,
        likeCount
    );

    localStorage.setItem(
        likedKey,
        isLiked
    );

    updateLikeButton();
});

// Initial button display
updateLikeButton();

likeContainer.appendChild(likeButton);

card.appendChild(likeContainer);

  });

  console.log(`Successfully rendered ${members.length} members.`);
}


// ============================================================
// 4. RENDER PROJECTS
// ============================================================
//
// Projects are Project objects created in models.js.
// ============================================================

function renderProjects() {
  if (!projectGrid) return;

  projectGrid.innerHTML = "";

  const projects = databaseProjects;

  // ========================================
  // PROJECT ACHIEVEMENTS
  // ========================================

  const projectAchievements = {
    //BALALLO, KHOLOE
    "Personal Portfolio Website": "Balallo, Kholoe",

    "Cinema Ticket Booking System": "Balallo, Kholoe",

    "Expense Tracker": "Balallo, Kholoe",

    //GARCERA, ROSELLE
    "Senior High School Girls' Volleyball Championship": "Garcera, Roselle",

    "Computer Systems Servicing NC II Certification": "Garcera, Roselle",

    "CUBY — Best Mobile App Award — Champion": "Garcera, Roselle",

    //SANTOS, KAREL ALWINA
    SUB: "Santos, Karel Alwina",

    HealthBridge: "Santos, Karel Alwina",

    "Networking Laboratory": "Santos, Karel Alwina",

    //SAPNO, MA. ANGELA
    BSIT: "Sapno, Ma. Angela",

    BSIT: "Sapno, Ma. Angela",

    BSIT: "Sapno, Ma. Angela",

    //UMALI, ANNE CAMILLE
    Web: "Umali, Anne Camille",

    Web: "Umali, Anne Camille",

    Web: "Umali, Anne Camille",
  };

  // ========================================
  // CREATE PROJECT CARDS
  // ========================================

  projects.forEach((project, index) => {
    const card = document.createElement("article");

    card.classList.add("project-card");

    // ========================================
    // PROJECT IMAGE
    // ========================================

    const imageContainer = document.createElement("div");

    imageContainer.classList.add("project-image-container");

    const image = document.createElement("img");

    image.classList.add("project-image");

    image.src = project.image;

    image.alt = `${project.title} project image`;

    image.loading = "lazy";

    // ========================================
    // FULL-SCREEN IMAGE VIEWER
    // ========================================

    image.addEventListener("click", () => {
      // Create fullscreen overlay
      const overlay = document.createElement("div");

      overlay.classList.add("image-lightbox");

      // Create fullscreen image
      const fullImage = document.createElement("img");

      fullImage.src = image.src;

      fullImage.alt = image.alt;

      fullImage.classList.add("lightbox-image");

      // Create close button
      const closeButton = document.createElement("button");

      closeButton.classList.add("lightbox-close");

      closeButton.textContent = "×";

      closeButton.setAttribute("aria-label", "Close image");

      // Close the image viewer
      function closeLightbox() {
        overlay.remove();
        document.body.style.overflow = "";
      }

      // Close button
      closeButton.addEventListener("click", closeLightbox);

      // Close when clicking outside the image
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
          closeLightbox();
        }
      });

      // Close with ESC key
      document.addEventListener("keydown", function escapeHandler(event) {
        if (event.key === "Escape") {
          closeLightbox();

          document.removeEventListener("keydown", escapeHandler);
        }
      });

      // Add image and close button
      overlay.appendChild(fullImage);

      overlay.appendChild(closeButton);

      // Add overlay to page
      document.body.appendChild(overlay);

      // Prevent page scrolling
      document.body.style.overflow = "hidden";
    });

    // If the image doesn't exist,
    // hide the broken image
    image.addEventListener("error", () => {
      imageContainer.style.display = "none";
    });

    imageContainer.appendChild(image);

    card.appendChild(imageContainer);

    // ========================================
    // PROJECT NUMBER
    // ========================================

    const projectNumber = document.createElement("div");

    projectNumber.classList.add("project-number");

    projectNumber.textContent = `${String(index + 1).padStart(2, "0")} / ${project.category} / ${project.year}`;

    // ========================================
    // PROJECT TITLE
    // ========================================

    const title = document.createElement("h3");

    title.textContent = project.title;

    // ========================================
    // PROJECT ACHIEVEMENT
    // ========================================

    const achievement = document.createElement("p");

    achievement.classList.add("project-achievement");

    const achievementLabel = document.createElement("strong");

    achievementLabel.textContent = "Achievement by:";

    achievement.appendChild(achievementLabel);

    achievement.appendChild(document.createElement("br"));

    const achievementName = project.achievementBy || projectAchievements[project.title] || "SINGKO Team";

    achievement.appendChild(document.createTextNode(achievementName));

    // ========================================
    // PROJECT DESCRIPTION
    // ========================================

    const description = document.createElement("p");

    description.textContent = project.description;

    // ========================================
    // BUILD PROJECT CARD
    // ========================================

    card.appendChild(projectNumber);

    card.appendChild(title);

    card.appendChild(achievement);

    card.appendChild(description);

    projectGrid.appendChild(card);
  });

  console.log(`Successfully rendered ${projects.length} projects.`);
}

// ============================================================
// 5. CONTACT FORM VALIDATION
// ============================================================
//
// This fulfills the requirement for JavaScript
// contact-form validation.
//
// The database is NOT connected yet.
//
// Current:
//
// Contact Form
//      ↓
// JavaScript Validation
//
// Future:
//
// Contact Form
//      ↓
// JavaScript
//      ↓
// Backend API
//      ↓
// Database
// ============================================================

function validateContactForm() {
  // ========================================================
  // GET INPUTS
  // ========================================================

  const nameInput = document.querySelector("#name");

  const emailInput = document.querySelector("#email");

  const messageInput = document.querySelector("#message");

  // ========================================================
  // GET ERROR ELEMENTS
  // ========================================================

  const nameError = document.querySelector("#nameError");

  const emailError = document.querySelector("#emailError");

  const messageError = document.querySelector("#messageError");

  // ========================================================
  // CLEAR PREVIOUS ERRORS
  // ========================================================

  nameError.textContent = "";

  emailError.textContent = "";

  messageError.textContent = "";

  formStatus.textContent = "";

  let isValid = true;

  // ========================================================
  // NAME VALIDATION
  // ========================================================

  const name = nameInput.value.trim();

  if (name.length < 2) {
    nameError.textContent = "Please enter your full name.";

    isValid = false;
  }

  // ========================================================
// EMAIL VALIDATION
// ========================================================

const email = emailInput.value.trim();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {

    emailError.textContent =
        "Please enter a valid email address.";

    isValid = false;

}

  // ========================================================
  // MESSAGE VALIDATION
  // ========================================================

  const message = messageInput.value.trim();

  if (message.length < 10) {
    messageError.textContent = "Message must contain at least 10 characters.";

    isValid = false;
  }

  return isValid;
}

// ============================================================
// 6. CONTACT FORM SUBMISSION
// ============================================================

// IMPORTANT:
// The contact form only exists on contact.html.
// Therefore, check if contactForm exists first.

if (contactForm) {

  contactForm.addEventListener(
    "submit",
    async function (event) {

      // Prevent page refresh.
      event.preventDefault();

      // ====================================================
      // VALIDATE FORM
      // ====================================================

      const isValid =
        validateContactForm();

      // Stop if the form is invalid.
      if (!isValid) {

        formStatus.textContent =
          "Please correct the highlighted fields.";

        return;
      }

      // ====================================================
      // GET FORM VALUES
      // ====================================================

      const name =
        document.querySelector("#name")
          .value
          .trim();

      const email =
        document.querySelector("#email")
          .value
          .trim();

      const subjectInput =
        document.querySelector("#subject");

      const subject =
        subjectInput
          ? subjectInput.value.trim()
          : "";

      const message =
        document.querySelector("#message")
          .value
          .trim();

      // ====================================================
      // SEND MESSAGE TO BACKEND
      // ====================================================

      try {

    formStatus.textContent =
        "Sending message...";

    // Show loading animation
    if (sendButton) {

        sendButton.disabled = true;
        sendButton.classList.add("loading");

        if (sendButtonText) {
            sendButtonText.textContent = "Sending...";
        }

    }

        const response =
          await fetch(
            "http://localhost:5000/api/messages",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                name: name,
                email: email,
                subject: subject,
                message: message
              })
            }
          );

        // ==================================================
        // GET BACKEND RESPONSE
        // ==================================================

        const result =
          await response.json();

        // Check if the backend returned an error.
        if (!response.ok) {

          throw new Error(
            result.error ||
            "Failed to send message"
          );

        }

        // ==================================================
        // SUCCESS MESSAGE
        // ==================================================

        formStatus.textContent =
          "Message sent successfully!";

        // Clear the form after successful submission.
        contactForm.reset();

        // Stop loading animation
        if (sendButton) {

            sendButton.disabled = false;
            sendButton.classList.remove("loading");

            if (sendButtonText) {
                sendButtonText.textContent = "Send Message";
            }

        }

        // Show the saved message information
        // in the browser console.
        console.log(
          "Contact message saved:",
          result
        );

      } catch (error) {

        // ==================================================
        // ERROR HANDLING
        // ==================================================

        console.error(
          "Unable to send contact message:",
          error
        );

        formStatus.textContent =
          "Unable to send your message. Please try again.";

          if (sendButton) {

    sendButton.disabled = false;
    sendButton.classList.remove("loading");

    if (sendButtonText) {
        sendButtonText.textContent = "Send Message";
    }

}

      }

    }
  );

}

// ============================================================
// 7. MOBILE NAVIGATION
// ============================================================
//
// Opens and closes the navigation menu on mobile.
// ============================================================

// Check that the navigation elements exist first.

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });
}

// ============================================================
// 8. CLOSE MOBILE MENU
// ============================================================
//
// When the user clicks a navigation link,
// automatically close the mobile menu.
// ============================================================

if (navLinks) {
  navLinks.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      navLinks.classList.remove("open");
    }
  });
}

// ============================================================
// 10. CURRENT YEAR
// ============================================================

const currentYear = document.querySelector("#currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// ============================================================
// 11. INITIALIZE WEBSITE
// ============================================================

loadMembersFromDatabase();

loadProjectsFromDatabase();

loadIntroductionsFromDatabase();

// ============================================================
// 12. OOP DEVELOPMENT CHECK
// ============================================================

console.log("======================================");

console.log("PERSONAL WEBSITE APPLICATION");

console.log("======================================");

console.log("Members:", portfolio.getMemberCount());

console.log("Projects:", portfolio.getProjectCount());

console.log("First Member:", portfolio.members[0].name);

console.log("First Member Role:", portfolio.members[0].getRole());

console.log("======================================");

// ========================================
// VIDEO CAROUSEL
// ========================================

const videoCarousel =
    document.querySelector("#videoCarousel");

const videoPrev =
    document.querySelector("#videoPrev");

const videoNext =
    document.querySelector("#videoNext");


if (videoCarousel && videoPrev && videoNext) {

    videoNext.addEventListener("click", () => {

        videoCarousel.scrollBy({
            left: videoCarousel.clientWidth,
            behavior: "smooth"
        });

    });


    videoPrev.addEventListener("click", () => {

        videoCarousel.scrollBy({
            left: -videoCarousel.clientWidth,
            behavior: "smooth"
        });

    });

}
