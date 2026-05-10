
const teacher=JSON.parse(localStorage.getItem('teacher'));
if(!teacher){
    window.location.replace("login.html");
}
async function load_teacher(i){
    const body={
        id:i
    }
    const response=await fetch('http://localhost:3000/teacher_courses',{
        method:"POST",
        headers:{
            'Content-Type':'application/json' 
        },
        body:JSON.stringify(body)
    })
    let courses_data=0
    const data=await response.json()
    courses_data=data.data
    return courses_data
}

let data=0

async function load_whole_courses(){
    data=await load_teacher(teacher.id)
    if(data.length==0){
        document.querySelector('.not_available').classList.add('active')
        document.querySelector('.course-list').classList.add('inactive')
        return
    }
    document.querySelector('.not_available').classList.remove('active')
    document.querySelector('.not_available').classList.add('inactive')
    document.querySelector('.course-list').classList.remove('inactive')
    list=document.querySelector('.course-list')
    // console.log(data)
    list.innerHTML=``
    for(let i=0;i<data.length;i++){
    list.innerHTML+=`
        <div class="nexus-card course-item">
                <div class="card-details">
                    <h4>${data[i].subjects.grade_levels.name}</h4>
                    <h4>${data[i].subjects.name}</h4>

                    <p>${data[i].student_count} Students Enrolled</p>
                </div>
            <button class="action-btn" onclick="load_course(${i})">MANAGE COURSE</button>
        </div>
        `
    }
}
load_whole_courses()


function load_course(i){
    localStorage.setItem('course',JSON.stringify(data[i]));
    window.location.href =`course.html`;
}


document.querySelector('.teacher-name').textContent=teacher.full_name
document.querySelector('.teacher-id').textContent=teacher.id

document.getElementById('profile').classList.add('active')
document.querySelector('.profile_btn').parentElement.classList.add('active');
document.querySelector('.content-container').classList.add('profile-mode')


document.getElementById('teacher-id').textContent = teacher.id;
document.getElementById('teacher-name').textContent = teacher.full_name;
document.getElementById('teacher-email').textContent = teacher.email;
document.getElementById('teacher-phone').textContent = teacher.phone;
document.getElementById('teacher-joined').textContent = teacher.created_at;


function logout(){
    localStorage.clear();
    window.location.replace("login.html");
}

function showsection(section){
    const container=document.querySelector('.content-container');
    if(section=='courses'){
        container.classList.remove('profile-mode');
        document.getElementById('profile').classList.remove('active')
        document.querySelector('.profile_btn').parentElement.classList.remove('active');
        document.getElementById('courses').classList.add('active')
        document.querySelector('.course_btn').parentElement.classList.add('active');
    }
    else{
        container.classList.add('profile-mode');
        document.getElementById('profile').classList.add('active')
        document.querySelector('.profile_btn').parentElement.classList.add('active');
        document.getElementById('courses').classList.remove('active')
        document.querySelector('.course_btn').parentElement.classList.remove('active');
    }
}