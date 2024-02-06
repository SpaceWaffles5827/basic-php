document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('courseForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addCourse();
    });

    document.getElementById('textbookForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addTextbook();
    });

    document.getElementById('studentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addStudent();
    });

    document.getElementById('updateCourseForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateCourse();
    });

    document.getElementById('updateTextbookForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateTextbook();
    });

    document.getElementById('updateStudentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateStudent();
    });

    document.querySelectorAll('.cancelButton').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('section').style.display = 'none';
        });
    });

    document.getElementById('manageStudentEnrollmentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const action = document.getElementById('action').value;
        const studentId = document.getElementById('manageSelectStudent').value;
        const courseId = document.getElementById('manageSelectCourse').value;
        
        if (action === 'add') {
            addStudentToCourse(studentId, courseId);
        } else if (action === 'remove') {
            removeStudentFromCourse(studentId, courseId);
        }
    });

    document.getElementById('manageStudentTextbooksForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const action = document.getElementById('textbookAction').value;
        const studentId = document.getElementById('selectStudentForTextbookAction').value;
        const textbookId = document.getElementById('selectTextbookForAction').value;
        
        if (action === 'add') {
            addTextbookToStudent(studentId, textbookId);
        } else if (action === 'remove') {
            removeTextbookFromStudent(studentId, textbookId);
        }
    });
    

    fetchData();
});

function updateCourse() {
    const courseId = document.getElementById('updateCourseId').value;
    const title = document.getElementById('updateCourseTitle').value;
    let primaryTextbooks = Array.from(document.getElementById('updatePrimaryTextbooks').selectedOptions).map(option => option.value);
    let secondaryTextbooks = Array.from(document.getElementById('updateSecondaryTextbooks').selectedOptions).map(option => option.value);

    // Filter out 'none' value if present
    primaryTextbooks = primaryTextbooks.filter(value => value !== "none");
    secondaryTextbooks = secondaryTextbooks.filter(value => value !== "none");

    // Merge primary and secondary textbooks into a single array
    const textbooks = [...primaryTextbooks, ...secondaryTextbooks];

    const data = {
        action: "updateCourse",
        courseId: courseId,
        title: title,
        textbooks: textbooks // Send as a single merged array
    };

    sendFormData("server.php", data, function(response) {
        if (response.success) {
            alert("Course updated successfully");
            fetchData(); // Refresh to show updated data
            document.getElementById('updateCourseSection').style.display = 'none';
        } else {
            alert("Failed to update course: " + (response.message || "Unknown error"));
        }
    });
}


function removeTextbookFromStudent(studentId, textbookId) {
    const data = {
        action: "removeTextbookFromStudent",
        studentId: studentId,
        textbookId: textbookId
    };
    sendFormData("server.php", data, function(response) {
        if (response.success) {
            alert("Textbook removed from student successfully");
            fetchData(); // Refresh to show updated data
        } else {
            alert("Failed to remove textbook from student: " + (response.message || "Unknown error"));
        }
    });
}

function addTextbookToStudent(studentId, textbookId) {
    const data = {
        action: "addTextbookToStudent",
        studentId: studentId,
        textbookId: textbookId
    };
    sendFormData("server.php", data, function(response) {
        if (response.success) {
            alert("Textbook added to student successfully");
            fetchData(); // Refresh to show updated data
        } else {
            alert("Failed to add textbook to student: " + (response.message || "Unknown error"));
        }
    });
}

function updateTextbook() {
    const textbookData = {
        action: "updateTextbook",
        textbookId: document.getElementById("updateTextbookId").value,
        title: document.getElementById("updateTextbookTitle").value,
        publisher: document.getElementById("updateTextbookPublisher").value,
        edition: document.getElementById("updateTextbookEdition").value,
        year: document.getElementById("updateTextbookYear").value,
    };
    sendFormData("server.php", textbookData, function(response) {
        if (response.success) {
            alert("Textbook updated successfully");
            fetchData(); // Refresh data display
            document.getElementById('updateTextbookSection').style.display = 'none';
        }
    });
}

function updateStudent() {
    const studentData = {
        action: "updateStudent",
        studentId: document.getElementById("updateStudentId").value,
        name: document.getElementById("updateStudentName").value,
    };
    sendFormData("server.php", studentData, function(response) {
        if (response.success) {
            alert("Student updated successfully");
            fetchData();
            document.getElementById('updateStudentSection').style.display = 'none';
        }
    });
}

function showUpdateCourseForm(courseId, courseTitle, data) {
    const updateCourseSection = document.getElementById('updateCourseSection');
    const updateCourseId = document.getElementById('updateCourseId');
    const updateCourseTitle = document.getElementById('updateCourseTitle');
    const updatePrimaryTextbooks = document.getElementById('updatePrimaryTextbooks');
    const updateSecondaryTextbooks = document.getElementById('updateSecondaryTextbooks');

    // Pre-fill form fields
    updateCourseId.value = courseId;
    updateCourseTitle.value = courseTitle;

    // Clear existing options
    updatePrimaryTextbooks.innerHTML = '';
    updateSecondaryTextbooks.innerHTML = '';

    // Add options for primary textbooks
    const primaryNoneOption = document.createElement('option');
    primaryNoneOption.value = "none";
    primaryNoneOption.textContent = "None";
    updatePrimaryTextbooks.appendChild(primaryNoneOption);

    // Add options for secondary textbooks
    const secondaryNoneOption = document.createElement("option");
    secondaryNoneOption.value = "none";
    secondaryNoneOption.textContent = "None";
    updateSecondaryTextbooks.appendChild(secondaryNoneOption);

    // Add all textbooks to the dropdowns
    Object.entries(data.textbooks).forEach(([textbookId, textbook]) => {
        const option = document.createElement('option');
        option.value = textbookId;
        option.textContent = textbook.title;
        updatePrimaryTextbooks.appendChild(option);

        const secondaryOption = option.cloneNode(true);
        updateSecondaryTextbooks.appendChild(secondaryOption);
    });

    // Pre-select the textbooks that are already associated with the course
    const course = data.courses[courseId];
    course.textbooks.forEach(textbookId => {
        updatePrimaryTextbooks.querySelector(`option[value="${textbookId}"]`).selected = true;
        updateSecondaryTextbooks.querySelector(`option[value="${textbookId}"]`).selected = true;
    });

    updateCourseSection.style.display = 'block';
}


function showUpdateTextbookForm(textbookId, title, publisher, edition, year) {
    const updateTextbookSection = document.getElementById('updateTextbookSection');
    const updateTextbookId = document.getElementById('updateTextbookId');
    const updateTextbookTitle = document.getElementById('updateTextbookTitle');
    const updateTextbookPublisher = document.getElementById('updateTextbookPublisher');
    const updateTextbookEdition = document.getElementById('updateTextbookEdition');
    const updateTextbookYear = document.getElementById('updateTextbookYear');

    updateTextbookId.value = textbookId;
    updateTextbookTitle.value = title;
    updateTextbookPublisher.value = publisher;
    updateTextbookEdition.value = edition;
    updateTextbookYear.value = year;

    updateTextbookSection.style.display = 'block';
}

function showUpdateStudentForm(studentId, studentName) {
    const updateStudentSection = document.getElementById('updateStudentSection');
    const updateStudentId = document.getElementById('updateStudentId');
    const updateStudentName = document.getElementById('updateStudentName');

    updateStudentId.value = studentId;
    updateStudentName.value = studentName;

    updateStudentSection.style.display = 'block';
}

function sendFormData(path, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", path, true);
    xhr.setRequestHeader("Content-Type", "application/json"); // Adjusted for JSON
    xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
            callback(JSON.parse(xhr.responseText));
        } else {
            console.error("Request failed with status: " + xhr.status);
        }
    };
    xhr.send(JSON.stringify(data));
}

function addCourse() {
    const title = document.getElementById("courseTitle").value;
    let primaryTextbooks = Array.from(document.getElementById("primaryTextbooks").selectedOptions)
                                  .map(option => option.value);
    let secondaryTextbooks = Array.from(document.getElementById("secondaryTextbooks").selectedOptions)
                                    .map(option => option.value);

    if (primaryTextbooks.includes("none")) {
        primaryTextbooks = [];
    }

    if (secondaryTextbooks.includes("none")) {
        secondaryTextbooks = [];
    }

    const courseData = {
        action: "addCourse",
        title: title,
        primaryTextbooks: primaryTextbooks,
        secondaryTextbooks: secondaryTextbooks
    };

    sendFormData("server.php", courseData, function(response) {
        if (response.success) {
            alert("Course added successfully");
            fetchData(); // Refresh data display
        } else {
            alert("Failed to add course: " + (response.message || "Unknown error"));
        }
    });
}


function addTextbook() {
    const textbookData = {
        action: "addTextbook",
        title: document.getElementById("textbookTitle").value,
        publisher: document.getElementById("textbookPublisher").value,
        edition: document.getElementById("textbookEdition").value,
        year: document.getElementById("textbookYear").value,
    };
    sendFormData("server.php", textbookData, function(response) {
        if (response.success) {
            alert("Textbook added successfully");
            fetchData(); // Refresh data display
        }
    });
}

function addStudent() {
    const studentData = {
        action: "addStudent",
        name: document.getElementById("studentName").value,
        textbooks: [],
    };
    sendFormData("server.php", studentData, function(response) {
        if (response.success) {
            alert("Student added successfully");
            fetchData(); // Refresh data display
        }
    });
}

function populateDropdowns(data) {
    // Dropdowns for adding a student to a course
    const selectStudent = document.getElementById('manageSelectStudent');
    const selectCourse = document.getElementById('manageSelectCourse');

    // Dropdown for adding a textbook to a student
    const selectStudentForTextbook = document.getElementById('selectStudentForTextbookAction');
    const selectTextbook = document.getElementById('selectTextbookForAction');


    // Clear current options
    selectStudentForTextbook.innerHTML = '';
    selectStudent.innerHTML = '';
    selectCourse.innerHTML = '';
    selectTextbook.innerHTML = '';

    Object.entries(data.students).forEach(([studentId, student]) => {
        let option = document.createElement('option');
        option.value = studentId;
        option.textContent = student.name;
        selectStudent.appendChild(option);
        let optionForRemove = option.cloneNode(true);
    });

    // add students to selectStudentForTextbook
    Object.entries(data.students).forEach(([studentId, student]) => {
        let option = document.createElement('option');
        option.value = studentId;
        option.textContent = student.name;
        selectStudentForTextbook.appendChild(option);
    });

    // Populate courses
    Object.entries(data.courses).forEach(([courseId, course]) => {
        let option = document.createElement('option');
        option.value = courseId;
        option.textContent = course.title;
        selectCourse.appendChild(option);
        // Clone the option for removing courses
    });

    // Populate textbooks
    Object.entries(data.textbooks).forEach(([textbookId, textbook]) => {
        let option = document.createElement('option');
        option.value = textbookId;
        option.textContent = textbook.title + " - " + textbook.publisher + ", Edition: " + textbook.edition + ", Year: " + textbook.year;
        selectTextbook.appendChild(option);
    });
}


function removeCourse(courseId) {
    const data = {
        action: "removeCourse",
        courseId: courseId
    };
    sendFormData("server.php", data, function(response) {
        if (response.success) {
            alert("Course removed successfully");
            fetchData(); // Refresh to show updated data
        } else {
            alert("Failed to remove course: " + (response.message || "Unknown error"));
        }
    });
}

function addStudentToCourse(studentId, courseId) {
    const data = {
        action: "addStudentToCourse",
        studentId: studentId,
        courseId: courseId
    };
    sendFormData("server.php", data, function(response) {
        if (response.success) {
            alert("Student added to course successfully");
            fetchData(); // Refresh to show updated data
        } else {
            alert("Failed to add student to course: " + (response.message || "Unknown error"));
        }
    });
}

function removeStudentFromCourse(studentId, courseId) {
    const data = {
        action: "removeStudentFromCourse",
        studentId: studentId,
        courseId: courseId
    };
    sendFormData("server.php", data, function(response) {
        if (response.success) {
            alert("Student removed from course successfully");
            fetchData();
        } else {
            alert("Failed to remove student from course: " + (response.message || "Unknown error"));
        }
    });
}

function removeStudent(studentId) {
    const data = {
        action: "removeStudent",
        studentId: studentId
    };
    sendFormData("server.php", data, function(response) {
        if (response.success) {
            alert("Student removed successfully");
            fetchData(); // Refresh to show updated data
        } else {
            alert("Failed to remove student: " + (response.message || "Unknown error"));
        }
    });
}

function removeTextbook(textbookId) {
    const data = {
        action: "removeTextbook",
        textbookId: textbookId
    };
    sendFormData("server.php", data, function(response) {
        if (response.success) {
            alert("Textbook removed successfully");
            fetchData(); // Refresh to show updated data
        } else {
            alert("Failed to remove textbook: " + (response.message || "Unknown error"));
        }
    });
}


function fetchData() {
    sendFormData("server.php", {action: "fetchAll"}, function(response) {
        if (response.success && response.data) {
            populateDropdowns(response.data);
            
            const displayArea = document.getElementById("displayArea");
            displayArea.innerHTML = '';

            const primaryTextbooksDropdown = document.getElementById("primaryTextbooks");
            const secondaryTextbooksDropdown = document.getElementById("secondaryTextbooks");

            const noneOption = document.createElement('option');
            noneOption.value = "none";
            noneOption.textContent = "None";

            primaryTextbooksDropdown.innerHTML = ''; // Clear existing options
            primaryTextbooksDropdown.appendChild(noneOption);

            secondaryTextbooksDropdown.innerHTML = ''; // Clear existing options
            secondaryTextbooksDropdown.appendChild(noneOption.cloneNode(true));


            Object.entries(response.data.textbooks).forEach(([textbookId, textbook]) => {
                const primaryOption = document.createElement('option');
                primaryOption.value = textbookId;
                primaryOption.textContent = textbook.title;
                primaryTextbooksDropdown.appendChild(primaryOption);

                const secondaryOption = document.createElement('option');
                secondaryOption.value = textbookId;
                secondaryOption.textContent = textbook.title;
                secondaryTextbooksDropdown.appendChild(secondaryOption);
            });

            const coursesHeading = document.createElement('h3');
            coursesHeading.textContent = 'Courses';
            displayArea.appendChild(coursesHeading);
            const coursesList = document.createElement('ul');
            Object.entries(response.data.courses).forEach(([courseId, course]) => {
                const li = document.createElement('li');
                li.textContent = `${course.title} (ID: ${courseId}) - Textbooks: `;
                const textbooks = course.textbooks.map(textbookId => response.data.textbooks[textbookId]?.title || "Unknown Textbook").join(", ");
                li.textContent += textbooks;

                const enrolledStudents = Object.entries(response.data.students)
                    .filter(([_, student]) => student.enrolledCourses.includes(courseId))
                    .map(([studentId, student]) => student.name)
                    .join(", ");

                if (enrolledStudents.length > 0) {
                    li.textContent += ` - Enrolled Students: ${enrolledStudents}`;
                } else {
                    li.textContent += " - No Students Enrolled";
                }

                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.onclick = () => showUpdateCourseForm(courseId, course.title, response.data); // Function to show and pre-fill the course update form
                li.appendChild(updateButton);

                // add remove course button
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.onclick = () => removeCourse(courseId); // Function to remove the course
                li.appendChild(removeButton);


                coursesList.appendChild(li);
            });
            displayArea.appendChild(coursesList);

            const studentsHeading = document.createElement('h3');
            studentsHeading.textContent = 'Students';
            displayArea.appendChild(studentsHeading);
            const studentsList = document.createElement('ul');
            Object.entries(response.data.students).forEach(([studentId, student]) => {
                const li = document.createElement('li');
                // Start with student name and ID
                li.textContent = `${student.name} (ID: ${studentId}) - `;

                // Append Textbooks: Adjusted to directly start listing textbooks
                const textbooksContent = student.textbooks.map(textbookId => {
                    const textbook = response.data.textbooks[textbookId];
                    return textbook ? `${textbook.title} (Publisher: ${textbook.publisher}, Edition: ${textbook.edition}, Year: ${textbook.year})` : "Unknown Textbook";
                }).join(", ");
                
                // Adding textbooks information
                li.textContent += "Textbooks: " + (textbooksContent || "None");

                // Update button for student
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.onclick = () => showUpdateStudentForm(studentId, student.name);
                li.appendChild(updateButton);

                // Remove button for student
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.onclick = () => removeStudent(studentId);
                li.appendChild(removeButton);

                studentsList.appendChild(li);
            });
            displayArea.appendChild(studentsList);

            // Correctly appending the textbooks list here
            const textbooksHeading = document.createElement('h3');
            textbooksHeading.textContent = 'Textbooks';
            displayArea.appendChild(textbooksHeading);
            const textbooksList = document.createElement('ul');
            Object.entries(response.data.textbooks).forEach(([textbookId, textbook]) => {
                const li = document.createElement('li');
                li.textContent = `${textbook.title} (ID: ${textbookId}) - Publisher: ${textbook.publisher}, Edition: ${textbook.edition}, Year: ${textbook.year}`;

                // Update button for textbook
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.onclick = () => showUpdateTextbookForm(textbookId, textbook.title, textbook.publisher, textbook.edition, textbook.year); // Assuming this function exists
                li.appendChild(updateButton);

                // add remove button
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.onclick = () => removeTextbook(textbookId); 
                li.appendChild(removeButton);

                textbooksList.appendChild(li);
            });

            displayArea.appendChild(textbooksList);
        }
    });
}
