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
    if (button != quizButton) {
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
        localStorage.removeItem("authToken"); 
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
      const errorContainer = document.querySelector("#login-error");
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      if (!email || !password) {
        errorContainer.textContent = "تمامی فیلد ها الزامی است";
        errorContainer.style.background = "red";
        errorContainer.style.display = "block";
        setTimeout(() => {
          errorContainer.style.display = "none";
        }, 3000);
        return;
      }
      if (!emailPattern.test(email)) {
        errorContainer.textContent = "ایمیل نامعتبر است";
        errorContainer.style.background = "red";
        errorContainer.style.display = "block";
        setTimeout(() => {
          errorContainer.style.display = "none";
        }, 3000);

        return;
      }

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
          localStorage.setItem("authToken", data.data.token);  // Save token to localStorage 
          window.location.href = "dashboard2.html";
        } else {
          errorContainer.textContent = "ایمیل یا رمز عبور اشتباه است";
          errorContainer.style.background = "red";
          errorContainer.style.display = "block";
          setTimeout(() => {
            errorContainer.style.display = "none";
          }, 3000);

          return;
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
    const password = document.querySelector("#password_signup1").value;
    // const password1 = document.querySelector("#password_signup2").value;
    const errorContainer = document.querySelector("#signup-error");
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !name || !password) {
      errorContainer.textContent = "تمامی فیلد ها الزامی است";
      errorContainer.style.background = "red";
      errorContainer.style.display = "block";
      setTimeout(() => {
        errorContainer.style.display = "none";
      }, 3000);

      return;
    }
    
    if (!emailPattern.test(email)) {
      errorContainer.textContent = "ایمیل نامعتبر است";
      errorContainer.style.background = "red";
      errorContainer.style.display = "block";
      setTimeout(() => {
        errorContainer.style.display = "none";
      }, 3000);

      return;
    }
    // if(password != password1){
    //   errorContainer.textContent = "تکرار رمز عبور اشتباه است";
    //   errorContainer.style.background = "red";
    //   errorContainer.style.display = "block";
    //   setTimeout(() => {
    //     errorContainer.style.display = "none";
    //   }, 3000);

    //   return;
    // }

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
      window.location.href = "dashboard2.html";
    });

  document.querySelector("#acceptance-btn")?.addEventListener("click", () => {
    const errorContainer = document.querySelector("#quiz-error");
    const questions = document.querySelectorAll(".questions");
    let counter = 0;

    // Ensure every question element has a unique ID.
    questions.forEach((question) => {
      question.id = `question-0${++counter}`;
    });

    const inputs = document.querySelectorAll(
      '.quiz-form input[type="checkbox"]'
    );
    const answers = [];
    const unansweredQuestions = [];

    // Collect answers and track unanswered questions
    inputs.forEach((input) => {
      if (input.checked) {
        answers.push(Number(input.value));
      } else {
        unansweredQuestions.push(input.closest(".questions")); // Ensure we track the parent question
      }
    });

    // Check if all questions are answered
    if (answers.length !== 10) {
      errorContainer.textContent = "لطفا تمامی سوالات را پاسخ دهید";
      errorContainer.style.background = "red";
      errorContainer.style.display = "block";

      // Hide the error message after 3 seconds
      setTimeout(() => {
        errorContainer.style.display = "none";
      }, 3000);

      // Log unanswered questions for debugging
      console.log("Unanswered questions:", unansweredQuestions);

      // Add fragment to URL for first unanswered question without page refresh
      if (unansweredQuestions.length > 0) {
        const firstUnansweredQuestion = unansweredQuestions[0];
        const questionId = firstUnansweredQuestion?.id; // Ensure we get the ID of the first unanswered question

        console.log("First unanswered question ID:", questionId); // Debug log to ensure ID is correct

        // Update the URL without refreshing the page
        if (questionId) {
          history.pushState(null, null, `#${questionId}`);

          // Scroll to the unanswered question
          const questionElement = document.getElementById(questionId);
          if (questionElement) {
            questionElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          } else {
            console.log("Question element not found:", questionId); // Debugging missing question element
          }
        }
      }

      return;
    }

    // Process answers if all are provided
    fetch("http://localhost:5505/api/users/analyze-answers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to analyze answers.");
        }
        return response.json();
      })
      .then((result) => {
        if (result.data?.result && result.data?.header && result.data?.key) {
          const headerValue = result.data.header;
          const resultValue = result.data.result;
          const resultKey = result.data.key;

          localStorage.setItem("headerValue", headerValue);
          localStorage.setItem("resultValue", resultValue);
          localStorage.setItem("resultKey", resultKey);

          window.location.href = "field.html";
        }
      })
      .catch((error) => {
        console.error("Error analyzing quiz:", error);
        alert("There was an error processing your answers. Please try again.");
      });
  });

  //forgetpassword
  document.querySelector("#forgot-btn")?.addEventListener("click", () => {
    const emailField = document.querySelector("#email");
    const errorContainer = document.querySelector("#forgotPassword-error");
    localStorage.setItem("emailreseted", emailField.value);
    
    console.log(localStorage.getItem("emailreseted"));
    
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailField || !emailField.value) {
      errorContainer.textContent = "ایمیل خود را وارد کنید";
      errorContainer.style.background = "red";
      errorContainer.style.display = "block";

      // Hide the error message after 3 seconds
      setTimeout(() => {
        errorContainer.style.display = "none";
      }, 3000);
      return;
    }

    if (!emailPattern.test(emailField.value)) {
      errorContainer.textContent = "ایمیل نامعتبر است";
      errorContainer.style.background = "red";
      errorContainer.style.display = "block";

      // Hide the error message after 3 seconds
      setTimeout(() => {
        errorContainer.style.display = "none";
      }, 3000);
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
      
      const token = document.querySelector("#token-box")?.value;
      const password = document.querySelector("#new-password")?.value;
      const email = localStorage.getItem("emailreseted");
      if(!email){
        alert("error");
        return;
      }
      console.log({ token, newPassword: password, email });
      
      fetch("http://localhost:5505/api/users/reset-password", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify({ token, newPassword: password, email }),
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
      window.location.href = "login.html";
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
  function parseJwt(token) {
    const base64Url = token?.split(".")[1]; // بخش Payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // اصلاح Base64 (برای تطبیق با URL-safe encoding)

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload); // تبدیل به JSON
  }

  const token = localStorage.getItem("authToken"); // اینجا توکن رو وارد کنید
  const decodedToken = parseJwt(token);
  console.log(decodedToken); // اطلاعات دیکد شده رو نمایش میده

  const userEmail = decodedToken.email; // ایمیل را از توکن استخراج می‌کنیم
  const userEmailElement = document.querySelector("#user-email");
  if (userEmailElement) {
    userEmailElement.textContent = userEmail;
  } else {
    console.error("userEmailElement not found.");
  }

  //change password 
   
//change password 
   
document.getElementById('-btn')?.addEventListener('click', async (event) => { 
  event.preventDefault(); // Prevent form submission 
 
  // Get input values 
  const oldPassword = document.getElementById('old-password').value; 
  const newPassword = document.getElementById('new-password').value; 
  const confirmNewPassword = document.getElementById('confirm-new-password').value; 
 
  // Getting email from localStorage or the decoded token (assuming it's already decoded and saved) 
  const email = decodedToken.email;  // You can replace this with your decoded JWT logic if needed 
 
  // Validation 
  if (!oldPassword || !newPassword || !confirmNewPassword) { 
    alert('لطفاً تمام فیلدها را پر کنید.'); 
    return; 
  } 
 
  if (newPassword !== confirmNewPassword) { 
    alert('رمز عبور جدید و تکرار آن مطابقت ندارند.'); 
    return; 
  } 
 
  // Prepare data for the API request 
  const data = { 
    email, 
    oldPassword, 
    newPassword, 
  }; 
 
  try { 
    // Send request to the backend 
    const response = await fetch('http://localhost:5505/api/change-password', { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
      }, 
      body: JSON.stringify(data), 
    }); 
 
    // Check if response is OK 
    if (!response.ok) { 
      const errorMessage = await response.text(); 
      alert(`Error: ${errorMessage}`); 
      return; 
    } 
 
    // Handle response if success 
    const result = await response.json(); 
    if (result.message) { 
      alert(result.message); 
      // Optionally, clear the form or redirect the user 
      document.getElementById('old-password').value = ''; 
      document.getElementById('new-password').value = ''; 
      document.getElementById('confirm-new-password').value = ''; 
    } 
  } catch (error) { 
    console.error('Error:', error); 
    alert('خطایی در ارتباط با سرور رخ داده است.'); 
  } 
});
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
        localStorage.removeItem("authToken"); 
        window.location.href = "homepage.html"; 
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
  function showDefaultText() {
    const defaultText = document.createElement("div");
    defaultText.textContent =
      "سلام، آماده‌ای دنیای برنامه‌نویسی رو کشف کنی؟ من اینجا هستم تا تو این مسیر بهت کمک کنم!";
    defaultText.className = "default-text";
    defaultText.id = "default-text";
    chatContainer?.appendChild(defaultText);
  }
  showDefaultText();
  function removeDefaulttext() {
    const textShow = document.querySelector("#default-text");
    if (textShow) {
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
  sendButton?.addEventListener("click", () => {
    removeDefaulttext();
  });

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
