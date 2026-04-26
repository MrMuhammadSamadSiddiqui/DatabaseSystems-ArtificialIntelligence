    function selectRole(role) {
            document.getElementById('step-role').classList.remove('active');
            document.getElementById('step-' + role).classList.add('active');
        }

        function goBack() {
            document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
            // clear errors
            document.getElementById('teacher-error').style.display = 'none';
            document.getElementById('student-error').style.display = 'none';
            document.getElementById('step-role').classList.add('active');
        }

        function handleLogin(role) {
            if (role === 'teacher') {
                const id = document.getElementById('teacher-id').value.trim();
                const pass = document.getElementById('teacher-pass').value.trim();
                const err = document.getElementById('teacher-error');

                if (!id || !pass) {
                    err.textContent = 'Please fill in both fields.';
                    err.style.display = 'block';
                    return;
                }

                // TODO: Replace with your actual authentication logic / API call
                // Example: fetch('/api/teacher-login', { method: 'POST', body: JSON.stringify({ id, pass }) })
                err.style.display = 'none';
                alert('Teacher login submitted! Connect to your backend here.');

            } else {
                const roll = document.getElementById('student-roll').value.trim();
                const pass = document.getElementById('student-pass').value.trim();
                const err = document.getElementById('student-error');

                if (!roll || !pass) {
                    err.textContent = 'Please fill in both fields.';
                    err.style.display = 'block';
                    return;
                }

                // TODO: Replace with your actual authentication logic / API call
                err.style.display = 'none';
                alert('Student login submitted! Connect to your backend here.');
            }
        }

        // Allow pressing Enter to submit
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const teacherStep = document.getElementById('step-teacher');
                const studentStep = document.getElementById('step-student');
                if (teacherStep.classList.contains('active')) handleLogin('teacher');
                if (studentStep.classList.contains('active')) handleLogin('student');
            }
        });