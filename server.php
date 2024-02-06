<?php
$dataFilePath = 'data.json';

function loadData() {
    global $dataFilePath;
    if (file_exists($dataFilePath)) {
        $jsonData = file_get_contents($dataFilePath);
        return json_decode($jsonData, true);
    }
    return ['courses' => [], 'textbooks' => [], 'students' => []];
}

function saveData($data) {
    global $dataFilePath;
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($dataFilePath, $jsonData);
}

header('Content-Type: application/json');

$requestData = json_decode(file_get_contents('php://input'), true);

switch ($requestData['action']) {
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

function removeStudentFromCourse($data) {
    $allData = loadData();
    $studentId = $data['studentId'];
    $courseId = $data['courseId'];

    // Remove the course from the student's list of enrolled courses
    if (($key = array_search($courseId, $allData['students'][$studentId]['enrolledCourses'])) !== false) {
        unset($allData['students'][$studentId]['enrolledCourses'][$key]);
    }

    // Save the updated data
    saveData($allData);
    echo json_encode(['success' => true, 'message' => 'Student removed from course successfully']);
}

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

function addStudent($data) {
    $allData = loadData();
    $studentId = uniqid('student_');
    $allData['students'][$studentId] = [
        'name' => $data['name'],
        'enrolledCourses' => []
    ];
    saveData($allData);
    echo json_encode(['success' => true, 'message' => 'Student added successfully']);
}

function updateCourse($data) {
    $allData = loadData();
    if (isset($allData['courses'][$data['courseId']])) {
        $course = &$allData['courses'][$data['courseId']];
        $course['title'] = $data['title'];
        $course['textbooks'] = array_merge($data['primaryTextbooks'], $data['secondaryTextbooks']);
        saveData($allData);
        echo json_encode(['success' => true, 'message' => 'Course updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Course not found']);
    }
}

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

function fetchAll() {
    echo json_encode(['success' => true, 'data' => loadData()]);
}
