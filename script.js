document.addEventListener('DOMContentLoaded', () => {
    const signupButton = document.querySelector('.btn-signup');
    if (signupButton) {
        signupButton.addEventListener('click', () => {
            window.location.href = 'signup.html';
        });
    }
    //IIFE (Immediately Invoked Function Expression)
    const loginButton = document.querySelector('.btn-login');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
    const buttons = document.querySelectorAll('.nav .buttons .btn');//disable all buttns except quiz button 
    const quizButton = document.getElementById('quiz_button');
    buttons.forEach(button => {
        if (button != quizButton)
            button.disabled = true;
    })
    if (quizButton) {
        quizButton.addEventListener('click', () => {
            window.location.href = 'quiz.html'; // Navigate to the quiz page
        });
    }


    let { setSection } = (() => { // switch dashbords pages
        let selectedSection = 'roadmap';

        function setSection(section) {
            selectedSection = section;
            onSectionChanged();
        }

        function onSectionChanged() {
            document.querySelectorAll('.container2 > div').forEach(div => {
                div.classList.add('hide');
                div.classList.remove('show');
            });

            const selectedElement = document.querySelector(`#${selectedSection}`);
            selectedElement?.classList.add('show');
            selectedElement?.classList.remove('hide');
        }

        // Initialize with default section

        return { setSection };
    })();

    // Expose setSection to the global scope
    window.setSection = setSection;
    //exit from account 
    document.querySelector('#exit_from_account')?.addEventListener('click', () => {
        const container = document.querySelector('#dashbord-container');
        const exitContainer = document.querySelector('#exit_container');
        const profileContainer = document.querySelector('#profile');

        exitContainer.style.display = 'block';
        container.style.filter = 'blur(4px)';

        const button1 = document.querySelector('#back');
        button1.addEventListener('click', () => {

            profileContainer.style.display = 'block';
            exitContainer.style.display = 'none';
            container.style.filter = 'none';
        });
        const button2 = document.querySelector('#exit');
        button2.addEventListener('click', () => {
            window.location.href = 'homepage.html';
        });
    });


    //login
    const loginButtonInLoginPage = document.querySelector('#login_button');
    if (loginButtonInLoginPage) {
        loginButtonInLoginPage.addEventListener('click', async (event) => {

            event.preventDefault();

            const email = document.querySelector('#email_login').value.trim();
            const password = document.querySelector('#password_login').value.trim();

            let hasErrors = false;

            if (!email) {
                showError(document.querySelector('#email_login'), 'email-error', 'ایمیل را وارد کنید');
                hasError = true;
            }
            if (!password) {
                showError(document.querySelector('#password_login'), 'password-error', 'رمزعبور را وارد کنید');
                hasError = true;
            }
            if (hasErrors) {
                return;
            }
            const url = "http://localhost:5505/api/users/login";

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.href = 'dashboard2.html';
                } else {
                    console.error("Login error:", data);
                    alert(data.message || "Invalid email or password.");
                }
            } catch (error) {
                console.error('Error:', error.message);
                alert("Failed to connect to the server.");
            }

            function showError(inputElement, errorId, message) {
                const errorMessageElement = document.getElementById(errorId);
                errorMessageElement.textContent = message;
                errorMessageElement.style.display = 'block';
            }
        });
    }

    //sign up

    const signupButtonInSignupPage = document.querySelector('#signup_button');
    signupButtonInSignupPage?.addEventListener('click', async (event) => {

        event.preventDefault();

        const email = document.querySelector('#email_signup').value.trim();
        const name = document.querySelector('#name_signup').value.trim();
        const password = document.querySelector('#password_signup').value.trim();

        clearErrors();

        let hasErrors = false;

        if (!name) {
            showError(document.querySelector('#name_signup'), 'name-error', 'نام را وارد کنید');
            hasError = true;
        }
        if (!email) {
            showError(document.querySelector('#email_signup'), 'email-error', 'ایمیل را وارد کنید');
            hasError = true;
        }
        if (!password) {
            showError(document.querySelector('#password_signup'), 'password-error', 'رمزعبور را وارد کنید');
            hasError = true;
        }

        if (hasErrors) {
            return;
        }

        const url = "http://localhost:5505/api/users/register";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, name, password })
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = 'dashboard1.html';//error
            } else {
                handleBackendErrors(data);
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert("Failed to connect to the server.");
        }

        function showError(inputElement, errorId, message) {
            const errorMessageElement = document.getElementById(errorId);
            errorMessageElement.textContent = message;
            errorMessageElement.style.display = 'block';
        }
        
        // Function to clear all error messages
        function clearErrors() {
            document.querySelectorAll('.error-message').forEach((error) => {
                error.style.display = 'none';
                error.textContent = '';
            });
            document.querySelectorAll('.error-field').forEach((input) => {
                input.classList.remove('error-field');
            });
        }
        
        // Function to handle backend errors dynamically
        function handleBackendErrors(data) {
            if (data.errors) {
                // If the backend returns field-specific errors
                Object.keys(data.errors).forEach((field) => {
                    const inputElement = document.querySelector(`#${field}_signup`);
                    const errorId = `${field}-error`;
                    showError(inputElement, errorId, data.errors[field]);
                });
            } else if (data.message) {
                // If there's a generic error
                alert(data.message);
            }
        }        
    });


    //select only one answer 
    function selectOnlyOne(selectedCheckbox, questionId) {
        const checkboxes = document.querySelectorAll(`input[type="checkbox"][id^="${questionId}"]`);

        // Uncheck all checkboxes except the one clicked
        checkboxes.forEach((checkbox) => {
            if (checkbox !== selectedCheckbox) {
                checkbox.checked = false;
            }
        });
    }

    window.selectOnlyOne = selectOnlyOne;
    document.querySelector('#acceptance-button')?.addEventListener('click', () => { // should be complited
        window.location.href = 'dashboard2.html';
    });


    //road map selection
    const result = localStorage.getItem(''); //name of the variable that you got the answer from backend
   document.getElementById(`content${result}`)?.style.display = 'block';



















    document.querySelector('.confirm-btn #acceptance-btn').addEventListener('click', () => {
        // Collect all input elements
        const inputs = document.querySelectorAll('.quiz-form input[type="checkbox"]:checked');
        const answers = [];

        // Loop through the selected inputs and store their values
        inputs.forEach(input => {
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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to analyze answers.');
                }
                return response.json();
            })
            .then(result => {
                // Show the result
                alert(`Your suitable field is: ${result.field}\nSummary: ${result.summary}`);
            })
            .catch(error => {
                console.error("Error analyzing quiz:", error);
                alert("There was an error processing your answers. Please try again.");
            });
        window.location.href = 'field.html';
    });

});



