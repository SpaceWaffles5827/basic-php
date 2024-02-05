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

    fetchData();
});

function updateCourse() {
    const courseData = {
        action: "updateCourse",
        courseId: document.getElementById("updateCourseId").value,
        title: document.getElementById("updateCourseTitle").value,
    };
    sendFormData("server.php", courseData, function(response) {
        if (response.success) {
            alert("Course updated successfully");
            fetchData(); // Refresh data display
            document.getElementById('updateCourseSection').style.display = 'none';
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

function showUpdateCourseForm(courseId, currentTitle) {
    document.getElementById('updateCourseId').value = courseId;
    document.getElementById('updateCourseTitle').value = currentTitle;
    document.getElementById('updateCourseSection').style.display = 'block';
}

function showUpdateTextbookForm(textbookId, currentTitle, currentPublisher, currentEdition, currentYear) {
    document.getElementById('updateTextbookId').value = textbookId;
    document.getElementById('updateTextbookTitle').value = currentTitle;
    document.getElementById('updateTextbookPublisher').value = currentPublisher;
    document.getElementById('updateTextbookEdition').value = currentEdition;
    document.getElementById('updateTextbookYear').value = currentYear;
    document.getElementById('updateTextbookSection').style.display = 'block';
}

function showUpdateStudentForm(studentId, currentName) {
    document.getElementById('updateStudentId').value = studentId;
    document.getElementById('updateStudentName').value = currentName;
    document.getElementById('updateStudentSection').style.display = 'block';
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
    const courseData = {
        action: "addCourse",
        title: document.getElementById("courseTitle").value,
    };
    sendFormData("server.php", courseData, function(response) {
        if (response.success) {
            alert("Course added successfully");
            fetchData(); // Refresh data display
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
    };
    sendFormData("server.php", studentData, function(response) {
        if (response.success) {
            alert("Student added successfully");
            fetchData();
        }
    });
}

function fetchData() {
    sendFormData("server.php", {action: "fetchAll"}, function(response) {
        if (response.success && response.data) {
            const displayArea = document.getElementById("displayArea");
            displayArea.innerHTML = '';

            const coursesHeading = document.createElement('h3');
            coursesHeading.textContent = 'Courses';
            displayArea.appendChild(coursesHeading);
            const coursesList = document.createElement('ul');
            Object.entries(response.data.courses).forEach(([courseId, course]) => {
                const li = document.createElement('li');
                li.textContent = `${course.title} (ID: ${courseId}) `;
                const updateCourseBtn = document.createElement('button');
                updateCourseBtn.textContent = 'Update';
                updateCourseBtn.onclick = function() {
                    showUpdateCourseForm(courseId, course.title);
                };
                li.appendChild(updateCourseBtn);
                coursesList.appendChild(li);
            });
            displayArea.appendChild(coursesList);

            const textbooksHeading = document.createElement('h3');
            textbooksHeading.textContent = 'Textbooks';
            displayArea.appendChild(textbooksHeading);
            const textbooksList = document.createElement('ul');
            Object.entries(response.data.textbooks).forEach(([textbookId, textbook]) => {
                const li = document.createElement('li');
                li.textContent = `${textbook.title}, Publisher: ${textbook.publisher}, Edition: ${textbook.edition}, Year: ${textbook.year} (ID: ${textbookId})`;
                const updateTextbookBtn = document.createElement('button');
                updateTextbookBtn.textContent = 'Update';
                updateTextbookBtn.onclick = function() {
                    showUpdateTextbookForm(textbookId, textbook.title, textbook.publisher, textbook.edition, textbook.year);
                };
                li.appendChild(updateTextbookBtn);
                textbooksList.appendChild(li);
            });
            displayArea.appendChild(textbooksList);

            const studentsHeading = document.createElement('h3');
            studentsHeading.textContent = 'Students';
            displayArea.appendChild(studentsHeading);
            const studentsList = document.createElement('ul');
            Object.entries(response.data.students).forEach(([studentId, student]) => {
                const li = document.createElement('li');
                li.textContent = `${student.name} (ID: ${studentId})`;
                const updateStudentBtn = document.createElement('button');
                updateStudentBtn.textContent = 'Update';
                updateStudentBtn.onclick = function() {
                    showUpdateStudentForm(studentId, student.name);
                };
                li.appendChild(updateStudentBtn);
                studentsList.appendChild(li);
            });
            displayArea.appendChild(studentsList);
        }
    });
}

