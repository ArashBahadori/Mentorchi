document.addEventListener("DOMContentLoaded", () => {
  const signupButton = document.querySelector(".btn-signup");
  if (signupButton) {
    signupButton.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }
  const loginButton = document.querySelector(".btn-login");
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
  const buttons = document.querySelectorAll(".nav .buttons .btn"); //disable all buttns except quiz button
  const quizButton = document.getElementById("quiz_button");
  buttons.forEach((button) => {
    if (button != quizButton){
      button.disabled = true;
    } 
  });
  if (quizButton) {
    quizButton.addEventListener("click", () => {
      window.location.href = "quiz.html"; // Navigate to the quiz page
    });
  }
  
  //IIFE (Immediately Invoked Function Expression)
  let { setSection } = (() => {
    // switch dashbords pages
    let selectedSection = "roadmap";

    function setSection(section) {
      selectedSection = section;
      onSectionChanged();
    }

    function onSectionChanged() {
      document.querySelectorAll(".container2 > div").forEach((div) => {
        div.classList.add("hide");
        div.classList.remove("show");
      });

      const selectedElement = document.querySelector(`#${selectedSection}`);
      selectedElement?.classList.add("show");
      selectedElement?.classList.remove("hide");
      // selectedElement?.style.text.decoration: 'underline'; //???
    }

    // Initialize with default section

    return { setSection };
  })();

  // Expose setSection to the global scope
  window.setSection = setSection;
  //exit from account
  document
    .querySelector("#exit_from_account")
    ?.addEventListener("click", () => {
      const container = document.querySelector("#dashbord-container");
      const exitContainer = document.querySelector("#exit_container");
      // const profileContainer = document.querySelector("#profile");

      exitContainer.style.display = "block";
      container.style.filter = "blur(4px)";

      const button1 = document.querySelector("#back");
      button1.addEventListener("click", () => {
        exitContainer.style.display = "none";
        container.style.filter = "none";
      });
      const button2 = document.querySelector("#exit");
      button2.addEventListener("click", () => {
        window.location.href = "homepage.html";
      });
    });
  //login
  const loginButtonInLoginPage = document.querySelector("#login_button");
  if (loginButtonInLoginPage) {
    loginButtonInLoginPage.addEventListener("click", async (event) => {
      event.preventDefault();

      const email = document.querySelector("#email_login").value;
      const password = document.querySelector("#password_login").value;
      const url = "http://localhost:5505/api/users/login";

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          window.location.href = "dashboard2.html";
        } else {
          console.error("Login error:", data);
          alert(data.message || "Invalid email or password.");
        }
      } catch (error) {
        console.error("Error:", error.message);
        alert("Failed to connect to the server.");
      }
    });
  }
  //sign up

  const signupButtonInSignupPage = document.querySelector("#signup_button");
  signupButtonInSignupPage?.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email_signup").value;
    const name = document.querySelector("#name_signup").value;
    const password = document.querySelector("#password_signup").value;
    const errorContainer = document.querySelector("#error");

    if (!email || !name || !password) {
      errorContainer.textContent = "تمامی فیلد ها الزامی است";
      errorContainer.style.background = "red";
      errorContainer.style.display = "block";
      setTimeout(() => {
        errorContainer.style.display = "none";
      }, 3000);

      return;
    }

    const url = "http://localhost:5505/api/users/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "dashboard1.html"; //error
      } else {
        console.error("Signup error:", data);
        alert(data.message || "An error occurred during signup.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to connect to the server.");
    }
  });
  //select only one answer
  function selectOnlyOne(selectedCheckbox, questionId) {
    const checkboxes = document.querySelectorAll(
      `input[type="checkbox"][id^="${questionId}"]`
    );

    // Uncheck all checkboxes except the one clicked0
    checkboxes.forEach((checkbox) => {
      if (checkbox !== selectedCheckbox) {
        checkbox.checked = false;
      }
    });
  }

  window.selectOnlyOne = selectOnlyOne;
  document
    .querySelector("#acceptance-button")
    ?.addEventListener("click", () => {
      // should be complited
      window.location.href = "dashboard2.html";
    });

  document
    .querySelector(".confirm-btn #acceptance-btn")
    ?.addEventListener("click", () => {
      // Collect all input elements
      const inputs = document.querySelectorAll(
        '.quiz-form input[type="checkbox"]:checked'
      );
      const answers = [];

      // Loop through the selected inputs and store their values
      inputs.forEach((input) => {
        answers.push(Number(input.value)); // Convert value to a number
      });

      // Validate: Ensure 10 answers are selected
      if (answers.length !== 10) {
        alert("Please answer all questions!");
        return;
      }

      // Send collected answers to the backend
      fetch("http://localhost:5505/api/users/analyze-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }), // Convert the answers array to JSON
      })
        .then((response) => {                                     
          if (!response.ok) {
            throw new Error("Failed to analyze answers.");
          }
          return response.json();
        })
        .then((result) => {
          // Check if result.data.result and result.data.header exist
          if (
            result.data?.result &&
            result.data?.header &&
            result.data?.key
          ) {
            const headerValue = result.data.header;
            const resultValue = result.data.result;
            const resultKey = result.data.key;

            // Save both values in localStorage separately
            localStorage.setItem("headerValue", headerValue);
            localStorage.setItem("resultValue", resultValue);
            localStorage.setItem("resultKey", resultKey);

            // Redirect to field.html
            window.location.href = "field.html";
          }
        })
        .catch((error) => {
          console.error("Error analyzing quiz:", error);
          alert(
            "There was an error processing your answers. Please try again."
          );
        });
    });
  //forgetpassword
  document.querySelector("#forgot-btn")?.addEventListener("click", () => {
    const emailField = document.querySelector("#email");

    if (!emailField || !emailField.value) {
      console.error("Email field is empty or not found");
      alert("Please enter your email address."); // User-friendly alert
      return;
    }

    const email = emailField.value;

    fetch("http://localhost:5505/api/users/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Corrected header
      },
      body: JSON.stringify({ email }), // Pass email as an object
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("resetToken", data.resetToken);
        window.location.href = "reset-password.html";
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        alert("An error occurred. Please try again."); // User-friendly alert
      });
  });
  document
    .querySelector("#reset-password-btn")
    ?.addEventListener("click", () => {
      const token = document.querySelector("#token-box").value;
      const password = document.querySelector("#new-password").value;

      fetch("http://localhost:5505/api/users/reset-password", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })
        .then((response) => {
          if (!response.ok) console.log("Network response was not ok");
          return response.json();
        })
        .then((result) => {
          console.log("seccess " + result);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          alert("An error occurred. Please try again."); // User-friendly alert
        });
    });
  //save cheched checkbox
  const checkboxes = document.querySelectorAll(
    ".roadmap-page input[type='checkbox']"
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = localStorage.getItem(checkbox.id) === "true";
    // Save state on change
    checkbox.addEventListener("change", () => {
      localStorage.setItem(checkbox.id, checkbox.checked);
    });
  });
  //mentor page

  // Cache DOM elements
  const inputField = document.querySelector("#text");
  const chatContainer = document.querySelector("#chat-history-container");
  const chatForm = document.querySelector("#chat-form");
  const sendButton = document.querySelector("#send-btn");
  
  // Function to add a message to the chat container
  function addMessageToChat(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.className = `message ${sender}`; // Adds class 'user' or 'ai'
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom
  }
  
  // Function to show "AI is typing..." message
  function showTypingIndicator() {
    const typingIndicator = document.createElement("div");
    typingIndicator.textContent = "در حال نوشتن...";
    typingIndicator.className = "typing-indicator";
    typingIndicator.id = "typing-indicator"; // Assign an ID for easy removal
    chatContainer.appendChild(typingIndicator);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom
  }
  function showDefaultText(){
    const defaultText = document.createElement('div');
    defaultText.textContent =  'سلام من اینجام که به تو کمک کنم هر سوالی داری از من بپرس ';
    defaultText.className = 'default-text';
    defaultText.id = 'default-text';
    chatContainer.appendChild(defaultText);
  }
  showDefaultText();
  function removeDefaulttext(){
    const textShow = document.querySelector('#default-text');
    if(textShow){
      chatContainer.removeChild(textShow);
    }
  }
  
  // Function to remove "AI is typing..." message
  function removeTypingIndicator() {
    const typingIndicator = document.querySelector("#typing-indicator");
    if (typingIndicator) {
      chatContainer.removeChild(typingIndicator);
    }
  }
  sendButton.addEventListener('click', () => {
    removeDefaulttext();
  })
  
  // Event listener for form submission
  chatForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userMessage = inputField.value.trim();
  
    if (userMessage !== "") {
      // Add user's message to chat
      addMessageToChat(userMessage, "user");
  
      // Clear input field
      inputField.value = "";
      
      // Show "AI is typing..." indicator
      showTypingIndicator();
  
      try {
        // Send the user's message to the backend API
        const response = await fetch("http://localhost:5505/api/users/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        });
  
        // Handle the backend response
        if (response.ok) {
          const data = await response.json();
          removeTypingIndicator(); // Remove "AI is typing..." indicator
          if (data.reply) {
            // Add AI's reply to chat
            addMessageToChat(data.reply, "ai");
          } else {
            addMessageToChat("پاسخی دریافت نشد.", "ai");
          }
        } else {
          removeTypingIndicator(); // Remove "AI is typing..." indicator
          addMessageToChat("مشکلی پیش آمد. لطفاً دوباره تلاش کنید.", "ai");
        }
      } catch (error) {
        console.error("Error communicating with API:", error);
        removeTypingIndicator(); // Remove "AI is typing..." indicator
        addMessageToChat("مشکلی در ارتباط با سرور وجود دارد.", "ai");
      }
    }
  });
  
});
