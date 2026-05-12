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



function showsection(section){
    const container=document.querySelector('.content-container');
    document.getElementById('profile').classList.remove('active')
    document.getElementById('courses').classList.remove('active')
    document.querySelector('.profile_btn').parentElement.classList.remove('active')
    document.querySelector('.course_btn').parentElement.classList.remove('active')
    // document.querySelector('.general_btn').parentElement.classList.remove('active')
    if(section=='courses'){
         container.classList.remove('profile-mode');
        document.getElementById('courses').classList.add('active')
        document.querySelector('.course_btn').parentElement.classList.add('active')
    }
     else if(section == 'profile'){
        container.classList.add('profile-mode');
        document.getElementById('profile').classList.add('active')
        document.querySelector('.profile_btn').parentElement.classList.add('active')
    }
    else if(section == 'general'){
        document.querySelector('.general_btn').parentElement.classList.add('active')

    }
}

function logout(){
    localStorage.clear();
    window.location.replace("login.html");
}


let a=JSON.parse(localStorage.getItem('student'));
if(!a){
    window.location.replace("login.html");
}

let STUDENT
let REGISTER;

async function load_register(){


    const response=await fetch(`${BASE}/load_register_student`,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({id:a})
    })
    const data=await response.json()
    if(response.ok){
        return {data:data.data,ok:true}
    }
    else{
        return {error:data.error,ok:false}
    }
}
async function load_student(){


    const response=await fetch(`${BASE}/load_original_student`,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({id:a})
    })
    const data=await response.json()
    if(response.ok){
        return {data:data.data,ok:true}
    }
    else{
        return {error:data.error,ok:false}
    }
}

function convertDate(d){
    const parts = d.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function load_course(i){
    localStorage.setItem('course',JSON.stringify(data[i].courses.id));
    window.location.href =`student_course.html`;
}

(async ()=>{
    dat=await load_register()
    if(dat.ok){
        REGISTER=dat.data 
    }
    else{
        showMessage(dat.error,'error')
    }
    dat2=await load_student()
    if(dat2.ok){
        STUDENT=dat2.data 
    }
    else{
        showMessage(dat.error,'error')
    }
    
    document.querySelector('.student-name').textContent=REGISTER[0].full_name
    document.querySelector('.student-id').textContent=STUDENT[0].roll_no
    
    document.querySelector('#student-contact').textContent=REGISTER[0].guardian_contact
    let num=STUDENT[0].accepted_at.slice(0,10).split('-')
    let nums=num[2]+'-'+num[1]+'-'+num[0]   
    document.querySelector('#student-reg').textContent=nums
    document.querySelector('#student-status').textContent=REGISTER[0].status
    document.querySelector('#student-fullname').textContent=REGISTER[0].full_name
    document.querySelector('#student-dob').textContent=convertDate(REGISTER[0].date_of_birth)
    document.querySelector('#student-rollno').textContent=STUDENT[0].roll_no
    document.querySelector('#student-classyear').textContent=REGISTER[0].class_year
    document.querySelector('#student-grade').textContent=REGISTER[0].grade_levels.name
    document.querySelector('#student-fathername').textContent=REGISTER[0].father_name


    async function load_teacher(i){
    const body={
        id:i
    }
    const response=await fetch(`${BASE}/student_courses`,{
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

    async function load_whole_courses(){
    data=await load_teacher(STUDENT[0].roll_no)
    if(data.length==0){
        document.querySelector('.not_available').classList.add('active')
        document.querySelector('.course-list').classList.add('inactive')
        return
    }
    document.querySelector('.not_available').classList.remove('active')
    document.querySelector('.not_available').classList.add('inactive')
    document.querySelector('.course-list').classList.remove('inactive')
    list=document.querySelector('.course-list')
    list.innerHTML=``
    for(let i=0;i<data.length;i++){
    list.innerHTML+=`
        <div class="nexus-card course-item">
                <div class="card-details">
                    <h4>${REGISTER[0].grade_levels.name}</h4>
                    <h4>${data[i].courses.subjects.name}</h4>
                    <p>${data[i].courses.student_count} Students Enrolled</p>
                </div>
            <button class="action-btn" onclick="load_course(${i})">ENTER COURSE</button>
        </div>
        `
    }
}


load_whole_courses()
})()

document.getElementById('profile').classList.add('active')
document.querySelector('.profile_btn').parentElement.classList.add('active');
document.querySelector('.content-container').classList.add('profile-mode')









