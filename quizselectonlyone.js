function selectOnlyOne(selectedCheckbox, questionId) {
    const checkboxes = document.querySelectorAll(`input[type="checkbox"][id^="${questionId}"]`);

    // Uncheck all checkboxes except the one clicked0
    checkboxes.forEach((checkbox) => {
        if (checkbox !== selectedCheckbox) {
            checkbox.checked = false;
        }
    });
}