<?php
$dataFilePath = 'data.json';

// Load the data from the file data.json
function loadData() {
    global $dataFilePath;
    if (file_exists($dataFilePath)) {
        $jsonData = file_get_contents($dataFilePath);
        return json_decode($jsonData, true);
    }
    return ['courses' => [], 'textbooks' => [], 'students' => []];
}

// Save the data to the file data.json
function saveData($data) {
    global $dataFilePath;
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($dataFilePath, $jsonData);
}

header('Content-Type: application/json');

$requestData = json_decode(file_get_contents('php://input'), true);

// Handle the request action
switch ($requestData['action']) {
    case 'removeTextbookFromStudent':
        removeTextbookFromStudent($requestData);
        break;
    case 'addTextbookToStudent':
        addTextbookToStudent($requestData);
        break;
    case 'removeTextbook':
        removeTextbook($requestData);
        break;
    case 'removeStudent':
        removeStudent($requestData);
        break;
    case 'removeCourse':
        removeCourse($requestData);
        break;
    case 'removeStudentFromCourse':
        removeStudentFromCourse($requestData);
        break;
    case 'addStudentToCourse':
        addStudentToCourse($requestData);
        break;
    case 'updateCourse':
        updateCourse($requestData);
        break;    
    case 'updateTextbook':
        updateTextbook($requestData);
        break;
    case 'updateStudent':
        updateStudent($requestData);
        break;
    case 'addCourse':
        addCourse($requestData);
        break;
    case 'addTextbook':
        addTextbook($requestData);
        break;
    case 'addStudent':
        addStudent($requestData);
        break;
    case 'fetchAll':
        fetchAll();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

// Add a textbook to a student
function addTextbookToStudent($data) {
    $allData = loadData();
    $studentId = $data['studentId'];
    $textbookId = $data['textbookId'];

    if (!in_array($textbookId, $allData['students'][$studentId]['textbooks'])) {
        $allData['students'][$studentId]['textbooks'][] = $textbookId;
    }

    saveData($allData);
    echo json_encode(['success' => true, 'message' => 'Textbook added to student successfully']);
}

// Remove a textbook from the data
function removeTextbook($data) {
    $allData = loadData();
    if (isset($allData['textbooks'][$data['textbookId']])) {
        unset($allData['textbooks'][$data['textbookId']]);
        saveData($allData);
        echo json_encode(['success' => true, 'message' => 'Textbook removed successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Textbook not found']);
    }
}

// Remove a student from the data
function removeStudent($data) {
    $allData = loadData();
    if (isset($allData['students'][$data['studentId']])) {
        unset($allData['students'][$data['studentId']]);
        saveData($allData);
        echo json_encode(['success' => true, 'message' => 'Student removed successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Student not found']);
    }
}

// Add a student to a course
function addStudentToCourse($data) {
    $allData = loadData();
    $studentId = $data['studentId'];
    $courseId = $data['courseId'];

    if (!in_array($courseId, $allData['students'][$studentId]['enrolledCourses'])) {
        $allData['students'][$studentId]['enrolledCourses'][] = $courseId;
    }

    saveData($allData);
    echo json_encode(['success' => true, 'message' => 'Student added to course successfully']);
}

// Remove a student from a course
function removeStudentFromCourse($data) {
    $allData = loadData();
    $studentId = $data['studentId'];
    $courseId = $data['courseId'];

    if (($key = array_search($courseId, $allData['students'][$studentId]['enrolledCourses'])) !== false) {
        unset($allData['students'][$studentId]['enrolledCourses'][$key]);
    }

    saveData($allData);
    echo json_encode(['success' => true, 'message' => 'Student removed from course successfully']);
}

// Add a course to the data
function addCourse($data) {
    $allData = loadData();
    $courseId = uniqid('course_');
    $primaryTextbooks = isset($data['primaryTextbooks']) ? $data['primaryTextbooks'] : [];
    $secondaryTextbooks = isset($data['secondaryTextbooks']) ? $data['secondaryTextbooks'] : [];

    $allData['courses'][$courseId] = [
        'title' => $data['title'],
        'textbooks' => array_merge($primaryTextbooks, $secondaryTextbooks)
    ];
    saveData($allData);
    echo json_encode(['success' => true, 'message' => 'Course added successfully']);
}

// Add a textbook to the data
function addTextbook($data) {
    $allData = loadData();
    $textbookId = uniqid('textbook_');
    $allData['textbooks'][$textbookId] = [
        'title' => $data['title'],
        'publisher' => $data['publisher'],
        'edition' => $data['edition'],
        'year' => $data['year']
    ];
    saveData($allData);
    echo json_encode(['success' => true, 'message' => 'Textbook added successfully']);
}

// Remove a course from the data
function removeCourse($data) {
    $allData = loadData();
    if (isset($allData['courses'][$data['courseId']])) {
        unset($allData['courses'][$data['courseId']]);
        saveData($allData);
        echo json_encode(['success' => true, 'message' => 'Course removed successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Course not found']);
    }
}

// Remove a textbook from a student
function removeTextbookFromStudent($data) {
    $allData = loadData();
    $studentId = $data['studentId'];
    $textbookId = $data['textbookId'];

    if (($key = array_search($textbookId, $allData['students'][$studentId]['textbooks'])) !== false) {
        unset($allData['students'][$studentId]['textbooks'][$key]);
        $allData['students'][$studentId]['textbooks'] = array_values($allData['students'][$studentId]['textbooks']);
    }

    saveData($allData);
    echo json_encode(['success' => true, 'message' => 'Textbook removed from student successfully']);
}

// Add a student to the data
function addStudent($data) {
    $allData = loadData();
    $studentId = uniqid('student_');
    $allData['students'][$studentId] = [
        'name' => $data['name'],
        'enrolledCourses' => [],
        'textbooks' => []
    ];
    saveData($allData);
    echo json_encode(['success' => true, 'message' => 'Student added successfully']);
}

// Update a course information
function updateCourse($data) {
    $allData = loadData();
    if (isset($allData['courses'][$data['courseId']])) {
        $allData['courses'][$data['courseId']]['title'] = $data['title'];
        $allData['courses'][$data['courseId']]['textbooks'] = $data['textbooks'];
        saveData($allData);
        echo json_encode(['success' => true, 'message' => 'Course updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Course not found']);
    }
}

// Update a textbook information
function updateTextbook($data) {
    $allData = loadData();
    if (isset($allData['textbooks'][$data['textbookId']])) {
        $allData['textbooks'][$data['textbookId']]['title'] = $data['title'];
        $allData['textbooks'][$data['textbookId']]['publisher'] = $data['publisher'];
        $allData['textbooks'][$data['textbookId']]['edition'] = $data['edition'];
        $allData['textbooks'][$data['textbookId']]['year'] = $data['year'];
        saveData($allData);
        echo json_encode(['success' => true, 'message' => 'Textbook updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Textbook not found']);
    }
}

// Update a student information
function updateStudent($data) {
    $allData = loadData();
    if (isset($allData['students'][$data['studentId']])) {
        $allData['students'][$data['studentId']]['name'] = $data['name'];
        saveData($allData);
        echo json_encode(['success' => true, 'message' => 'Student updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Student not found']);
    }
}

// Fetch all the data from the file
function fetchAll() {
    echo json_encode(['success' => true, 'data' => loadData()]);
}
