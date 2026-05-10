const teacher=JSON.parse(localStorage.getItem('teacher'));
if(!teacher){
    window.location.replace("login.html");
}


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




let teachers=JSON.parse(localStorage.getItem('teacher'))
let courses=JSON.parse(localStorage.getItem('course'))

map=['general','attendance','marks','students','info']

document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('.'+map[0]).classList.add('active')
    document.querySelector('#section-'+map[0]).classList.add('active-section')
    
})
 



function goback(){
    localStorage.removeItem('course');
    window.location.replace("teacher.html");
}


async function course_update(){
    const body={
        id:courses.id
    }
    const response=await fetch('http://localhost:3000/course_update',{
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




document.querySelector('.course-title').textContent=courses.subjects.grade_levels.name+' - '+courses.subjects.name
document.querySelector('.teacher-name').textContent=teachers.full_name
document.querySelector('.teacher-id').textContent=teachers.id
k=document.getElementsByClassName('profile-value')


async function  assign_k4() {
    let course_data=await course_update()
    k[4].textContent=course_data[0].student_count
}


k[0].textContent=courses.subjects.grade_levels.name+' - '+courses.subjects.name
k[1].textContent=courses.subjects.name
k[2].textContent=courses.subjects.id
k[3].textContent=teachers.full_name
assign_k4()
k[5].textContent=courses.created_at

async function get_students_in_course(){
    const body={
        course_id:courses.id
    }
    const response=await fetch('http://localhost:3000/student_in_course',{
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
        document.querySelector('.student_tables').classList.remove('inactive')
    courses_data=data.data
    return courses_data
}





const openBtn=document.getElementById('openPostModal');
const closeBtn=document.getElementById('closeModal');
const overlay=document.getElementById('modalOverlay');
const submitBtn=document.getElementById('submitPost');
const feed=document.getElementById('postFeed');
const post_not=document.getElementById('post_not');
const badgeOpts=document.querySelectorAll('.badge-opt');
let selectedBadge = 'ANNOUNCEMENT';
badgeOpts.forEach(btn => {
    btn.addEventListener('click', () => {
        badgeOpts.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedBadge = btn.dataset.badge;
    });
});
openBtn.addEventListener('click', () => overlay.classList.add('open'));
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
function closeModal() {
    overlay.classList.remove('open');
    document.getElementById('postTitle').value = '';
    document.getElementById('postText').value  = '';
    document.getElementById('postLink').value  = '';
    badgeOpts.forEach(b => b.classList.remove('active'));
    badgeOpts[0].classList.add('active');
    selectedBadge = 'ANNOUNCEMENT';
}
submitBtn.addEventListener('click',async () => {
    const title=document.getElementById('postTitle').value.trim();
    const text=document.getElementById('postText').value.trim();
    const link=document.getElementById('postLink').value.trim();
    if (!title && !text) {
        showMessage("Title and Text are Empty",'error')
        return;
    }
    
    const now  = new Date();
    const time = now.toLocaleString('en-PK', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    }).toUpperCase();

    const card = document.createElement('div');
    card.className = 'nexus-card post-card';
    card.innerHTML = `
        <div class="post-top">
            <span class="post-badge ${selectedBadge}">${selectedBadge}</span>
            <span class="post-time">${time}</span>
        </div>
        ${title ? `<div class="post-title">${title}</div>` : ''}
        ${text  ? `<div class="post-body">${text}</div>`  : ''}
        ${link  ? `<div class="post-link">
                        <a href="${link}" target="_blank">
                            ${link}
                        </a>
                   </div>` : ''}
    `;

    body={
        badge:selectedBadge,
        id:courses.id,
        topic:title,
        tex:text,
        ln:link
    }
     const response=await fetch('http://localhost:3000/add_post',{
        method:"POST",
        headers:{
            'Content-Type':'application/json' 
        },
        body:JSON.stringify(body)
    })
    const data = await response.json();
    if(response.ok){
        showMessage('Posted','Success')
    }
    else{
        showMessage(data.error,'error')
        
    }


    feed.insertBefore(card, feed.firstChild);
    post_not.style.display = 'none';
    closeModal();
});


async function add_posts(){
    body={
        id:courses.id
    }
    const data=await fetch('http://localhost:3000/get_post',{
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
        k.innerHTML += `
            <div class="nexus-card post-card">
            <div class="post-top">
                <span class="post-badge ${data[i].post_type}">${data[i].post_type}</span>
                <span class="post-time">${data[i].created_at}</span>
            </div>
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




async function clicked(j){
    if(j==='students'){
        const updated= await course_update()
        let data=await get_students_in_course()
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
        add_posts_res()

    }
    for(let i=0;i<map.length;i++){
        document.querySelector('.'+map[i]).classList.remove('active')
        document.querySelector('#section-'+map[i]).classList.remove('active-section')
    }
    document.querySelector('.'+j).classList.add('active')
    document.querySelector('#section-'+j).classList.add('active-section')
}









