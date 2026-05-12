 function showMessage(message,type='error'){           
    const box =document.getElementById('msg-box')
    box.textContent = message
    box.className =`show ${type}`
    if(type=='success'){
      box.innerHTML+=`<i class="fa-solid fa-check"></i>`
    }
    else{
      box.innerHTML+=`<i class="fa-solid fa-x"></i>`
    }
    setTimeout(()=>{box.classList.remove('show')},3000)
    }

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

        async function handleLogin(role) {
            if (role === 'teacher') {
                const id = document.getElementById('teacher-id').value.trim();
                const pass = document.getElementById('teacher-pass').value.trim();
                const err = document.getElementById('teacher-error');

                if (!id || !pass) {
                    err.textContent = 'Please fill in both fields.';
                    err.style.display = 'block';
                    return;
                }

                 const body={
                    id,
                    pass
                }
                const response=await fetch( `${BASE}/login_teacher`,{
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(body)
                })
    
                const data=await response.json()
            
                if(response.ok){
                    localStorage.clear()
                    localStorage.setItem('teacher',JSON.stringify(data.teacher));
                    showMessage(data.message,'success')
                    setTimeout(()=>{window.location.href="teacher.html";},3000);
                }
                else{showMessage(data.error,'error')}

            } else {
                const roll = document.getElementById('student-roll').value.trim();
                const pass = document.getElementById('student-pass').value.trim();
                const err = document.getElementById('student-error');
                
                if (!roll || !pass) {
                    err.textContent = 'Please fill in both fields.';
                    err.style.display = 'block';
                    return;
                }
                
                const body={
                    roll,
                    pass
                }
                const response=await fetch( `${BASE}/login_student`,{
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(body)
                })
    
                const data=await response.json()
            
                if(response.ok){
                    localStorage.clear()
                    localStorage.setItem('student',JSON.stringify(data.student.student_id));
                    showMessage(data.message,'success')
                    setTimeout(()=>{window.location.href="student.html";},3000);
                }
                else{showMessage(data.error,'error')}
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


        function toggle_pass(id,b){
            const a=document.getElementById(id)
            if(a.type=='password'){
                a.type='text';
                b.classList.add('fa-eye-slash')
                b.classList.remove('fa-eye')
            }
            else if(a.type=='text'){
                a.type='password';
                b.classList.remove('fa-eye-slash')
                b.classList.add('fa-eye')
            }
        }

        const m=window.matchMedia("(max-width:768px)");
        function atag(e){
            const d=document.getElementById('a-tag')
            if(e.matches){
                d.innerHTML=`<i class="fa-solid fa-arrow-left"></i>`
            }
            else{
                d.innerHTML=`BACK TO MAIN`
            }
        }
        atag(m)
        m.addEventListener("change",atag);


    

        
   