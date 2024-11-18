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
        onSectionChanged();
    
        return { setSection};
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

            const email = document.querySelector('#email_login').value;
            const password = document.querySelector('#password_login').value;
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
        });
    }
    //sign up

    const signupButtonInSignupPage = document.querySelector('#signup_button');
    signupButtonInSignupPage?.addEventListener('click', async (event) => {
        
        event.preventDefault();
        
        const email = document.querySelector('#email_signup').value;
        const name = document.querySelector('#name_signup').value;
        const password = document.querySelector('#password_signup').value;

        if (!email || !name || !password) {
            alert("All fields are required!");
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
                console.error("Signup error:", data);
                alert(data.message || "An error occurred during signup.");
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert("Failed to connect to the server.");
        }
    });
    //select only one answer 
    function selectOnlyOne(selectedCheckbox, questionId) {
        const checkboxes = document.querySelectorAll(`input[type="checkbox"][id^="${questionId}"]`);
    
        // Uncheck all checkboxes except the one clicked0
        checkboxes.forEach((checkbox) => {
            if (checkbox !== selectedCheckbox) {
                checkbox.checked = false;
            }
        });
    }
    
    window.selectOnlyOne = selectOnlyOne;

    document.querySelector('#acceptance-btn').addEventListener('click', () => { // should be complited
        window.location.href = 'dashboard2.html';
    });
});



