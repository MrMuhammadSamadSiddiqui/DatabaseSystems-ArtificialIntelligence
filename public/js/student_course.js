const STUDENT_ID=JSON.parse(localStorage.getItem('student'));
const COURSE_ID=JSON.parse(localStorage.getItem('course'));
if(!STUDENT_ID || !COURSE_ID){

    window.location.replace("login.html");
}
// console.log(STUDENT_ID)
// console.log(COURSE_ID)

function set_date(i){
        let num=i.slice(0,10).split('-')
    let nums=num[2]+'-'+num[1]+'-'+num[0]   
    return nums
}

let STUDENT;
let REGISTER;
let COURSE;
let ENROLLED

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

async function load_student(){


    const response=await fetch(`${BASE}/load_original_student`,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({id:STUDENT_ID})
    })
    const data=await response.json()
    if(response.ok){
        return {data:data.data,ok:true}
    }
    else{
        return {error:data.error,ok:false}
    }
}

async function load_register(){


    const response=await fetch(`${BASE}/load_register_student`,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({id:STUDENT_ID})
    })
    const data=await response.json()
    if(response.ok){
        return {data:data.data,ok:true}
    }
    else{
        return {error:data.error,ok:false}
    }
}

async function course_update(){
    const body={
        id:COURSE_ID
    }
    const response=await fetch(`${BASE}/complete_course_update`,{
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

function goback(){
    localStorage.removeItem('course');
    window.location.replace("student.html");
}


const map=['general','attendance','students','info']

document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('.'+map[0]).classList.add('active')
    document.querySelector('#section-'+map[0]).classList.add('active-section')
})

async function get_students_in_course(){
    const body={
        course_id:COURSE_ID
    }
    const response=await fetch(`${BASE}/student_in_course`,{
        method:"POST",
        headers:{
            'Content-Type':'application/json' 
        },
        body:JSON.stringify(body)
    })
    let courses_data=0
    const data=await response.json()
    if (!data.ok) {
        if (data.error === "No Student Yet") { 
            document.querySelector('#student_not').classList.add('active')
            document.querySelector('.student_tables').classList.add('inactive')
            document.querySelector('#student_card').classList.add('inactive')
            return []; 
        }}
        document.querySelector('#student_not').classList.remove('active')
        document.querySelector('#student_not').classList.add('inactive')
        document.querySelector('.student_tables').classList.remove('inactive')
    courses_data=data.data
    return courses_data
}

async function student_in(){
    const body={
        course_id:COURSE_ID
    }
    const response=await fetch(`${BASE}/student_in_course`,{
        method:"POST",
        headers:{
            'Content-Type':'application/json' 
        },
        body:JSON.stringify(body)
    })
    let courses_data=0
    const data=await response.json()
    if (!data.ok) {
        if (data.error === "No Student Yet") { 
            document.querySelector('#student_not').classList.add('active')
            document.querySelector('.student_tables').classList.add('inactive')
            document.querySelector('#student_card').classList.add('inactive')
            return []; 
        }}
        document.querySelector('#student_not').classList.remove('active')
        document.querySelector('#student_not').classList.add('inactive')
        document.querySelector('.student_tables').classList.remove('inactive')
    courses_data=data.data
    return courses_data
}



async function add_posts(){
    let body={
        id:COURSE_ID
    }
    const data=await fetch(`${BASE}/get_post`,{
        method:"POST",
        headers:{
            'Content-Type':'application/json' 
        },
        body:JSON.stringify(body)
    })
    const data2 = await data.json();
    return data2.data 
}


async function add_posts_res(){
    const data=await add_posts()
    if(data.length!=0){
        post_not.style.display = 'none';
        
    
    const k =document.querySelector('#postFeed')
    for(let i=0;i<data.length;i++){
        let num=data[i].created_at.slice(0,10).split('-')
        let nums=num[2]+'-'+num[1]+'-'+num[0]   
        let time=data[i].created_at.slice(11,19)
        let actual_date=time+' | '+nums

        k.innerHTML += `
            <div class="nexus-card post-card">
            <div class="post-top">
                <span class="post-badge ${data[i].post_type}">${data[i].post_type}</span>
                <span class="post-time">${actual_date}</span>
            </div>
            <div class="line"></div>
            <div class="post-title">${data[i].title}</div>
            <div class="post-body">${data[i].content}</div>
            <div class="post-link">
                            <a href="${data[i].link}" target="_blank">
                                ${data[i].link}
                            </a>
                       </div></div>
        `;
    }
    }
    else{
        post_not.style.display = 'none';
    }
}

add_posts_res()



async function get_atten() {
    if (!STUDENT || !STUDENT[0]) {
        return [];
    }
    let body = {
        id: COURSE_ID,
        std_id: STUDENT[0].roll_no
    };
    const data = await fetch(`${BASE}/get_std_attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data2 = await data.json();
    return data2.data;
}


function loadStudentAttendance(records) {
    const list= document.getElementById('attList');
    list.innerHTML=``
    const emptyState = document.getElementById('attEmptyStudent');
    if (!records || records.length === 0) {
        emptyState.style.display = 'flex';
        return;
    }
    emptyState.style.display = 'none';
    list.innerHTML = '';

    const total   = records.length;
    const present = records.filter(r => r.status === 'P').length;
    const absent  = total - present;

    document.getElementById('att-total').textContent   = total;
    document.getElementById('att-present').textContent = present;
    document.getElementById('att-absent').textContent  = absent;
    document.getElementById('att-percent').textContent = ENROLLED[0].attendance + '%';

    records.forEach(r => {
        const label=set_date(r.attendance_date);
        const isPresent=r.status === 'P';

       list.innerHTML += `
    <div class="att-student-row">
        <span class="att-row-date">${label}</span>
        <span class="post-badge ${isPresent ? 'RESOURCE' : 'ANNOUNCEMENT'}">
            ${isPresent ? 'PRESENT' : 'ABSENT'}
        </span>
    </div>
        `;
    });
}
async function setup_atten() {
    const attendance = await get_atten();

    if (attendance.length == 0) {
        document.getElementById('attEmptyStudent').style.display = 'flex';
        return;
    }
    document.getElementById('attEmptyStudent').style.display = 'none';
    loadStudentAttendance(attendance)
}



async function clicked(j){
    if(j==='students'){
        const updated= await course_update()
        let data=await student_in()
        document.querySelector('.count-badge').innerHTML=updated[0].student_count+' STUDENTS'
        let k=document.querySelector('.tbody_class')
        k.innerHTML=``
        
        for(let l=0;l<data.length;l++){
            k.innerHTML+=`
            <tr>
                    <td>${data[l].students.register_students.full_name}</td>
                            <td>${data[l].student_roll_no}</td>            
                    </tr>
            `
        }
        
    }
    else if(j==='general'){
        document.querySelector('.post-feed').innerHTML=``
        add_posts_res()
    }
    else if(j==='attendance'){
        setup_atten()
    }
    for(let i=0;i<map.length;i++){
        document.querySelector('.'+map[i]).classList.remove('active')
        document.querySelector('#section-'+map[i]).classList.remove('active-section')
    }
    document.querySelector('.'+j).classList.add('active')
    document.querySelector('#section-'+j).classList.add('active-section')
}





async function get_students_in_course(){
    
    const body={
        course_id:COURSE_ID,
        std_id:STUDENT[0].roll_no

    }
    const response=await fetch(`${BASE}/course_student`,{
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
    COURSE=await course_update()
    ENROLLED=await get_students_in_course()
    setup_atten()

    
    document.querySelector('.student-name').textContent=REGISTER[0].full_name
    document.querySelector('.student-id').textContent=STUDENT[0].roll_no
    document.querySelector('.course-title').textContent=COURSE[0].subjects.grade_levels.name+' - '+COURSE[0].subjects.name

    const k=document.getElementsByClassName('profile-value')
    k[0].textContent=COURSE[0].subjects.grade_levels.name+' - '+COURSE[0].subjects.name
    k[1].textContent=COURSE[0].subjects.name 
    k[2].textContent=COURSE[0].subjects.id
    k[3].textContent=COURSE[0].teachers.full_name
    k[4].textContent=COURSE[0].student_count 

    k[5].textContent=set_date(COURSE[0].created_at)
    k[6].textContent=set_date(ENROLLED[0].enrolled_at)
    k[7].textContent=ENROLLED[0].attendance+'%'
    
})();





