<!DOCTYPE html>
<html>
<head>
    <title>My Courses</title>
    <style>
        .course-card { border: 1px solid #ddd; padding: 15px; margin: 10px; border-radius: 8px; }
    </style>
</head>
<body>
    <h2>Available Courses</h2>
    <div id="courseList"></div>

    <script>
        async function loadCourses() {
            const response = await fetch('https://lms-backrnd.onrender.com/courses');
            const courses = await response.json();
            const list = document.getElementById('courseList');
            
            list.innerHTML = courses.map(c => `
                <div class="course-card">
                    <h3>${c.title}</h3>
                    <p>${c.description}</p>
                    <button>Enroll</button>
                </div>
            `).join('');
        }
        loadCourses();
    </script>
</body>
</html>
