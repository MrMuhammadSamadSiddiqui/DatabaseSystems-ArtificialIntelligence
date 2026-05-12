const teacher=JSON.parse(localStorage.getItem('teacher'));
if(!teacher){
    window.location.replace("login.html");
}

function convertDate(d){
    const parts = d.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
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

const map=['general','attendance','students','info']

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
    const response=await fetch(`${BASE}/course_update`,{
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
let k=document.getElementsByClassName('profile-value')


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
     const response=await fetch(`${BASE}/add_post`,{
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
    let body={
        id:courses.id
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
        document.querySelector('.post-feed').innerHTML=``
        add_posts_res()

    }
    for(let i=0;i<map.length;i++){
        document.querySelector('.'+map[i]).classList.remove('active')
        document.querySelector('#section-'+map[i]).classList.remove('active-section')
    }
    document.querySelector('.'+j).classList.add('active')
    document.querySelector('#section-'+j).classList.add('active-section')
}


// ── Attendance System ── COMPLETE HEAVY AI BASED JS, EXCEPT DB. 

async function set_std() {
    let students = [];
    students = await get_students_in_course();

    if (students.length == 0) {
        document.querySelector('.att-empty').classList.add('active');
    } else {
        document.querySelector('.att-empty').classList.remove('active');
    }

    const COLS_PER_WINDOW = 5;

    const attendance = {};
    const dates = [];

    let windowStart = 0;
    let dirty = false;

    // ── DB INTEGRATION POINT 1 — Load existing attendance ──
    const response = await fetch(`${BASE}/load_attendance`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ course_id: courses.id })
    });
    const data = await response.json();

    if (!response.ok) {
        showMessage(data.error, 'error');
    }

    // Initialize attendance object for each student first
    students.forEach(s => attendance[s.student_roll_no] = {});

    // ── POPULATE dates[] and attendance{} from DB response ──
    // data.data format: [{ student_roll_no, status, attendance_date: 'YYYY-MM-DD' }]
    if (response.ok && data.data && data.data.length > 0) {

        data.data.forEach(record => {
            // attendance_date comes as 'YYYY-MM-DD', convert to key 'DD-MM-YYYY'
            const [year, month, day] = record.attendance_date.split('-');
            const key = `${day}-${month}-${year}`;

            // build label: '11 MAY 2026'
            const dateObj = new Date(`${year}-${month}-${day}`);
            const monthName = dateObj.toLocaleString('en', { month: 'short' }).toUpperCase();
            const label = `${day} ${monthName} ${year}`;

            // add to dates array if not already there
            if (!dates.find(d => d.key === key)) {
                dates.push({ label, key });
            }

            // populate attendance — 'P' means present, 'A' means absent
            if (attendance[record.student_roll_no] !== undefined) {
                attendance[record.student_roll_no][key] = record.status === 'A' ? 'absent' : 'present';
            }
        });

        // sort dates chronologically oldest → newest
        dates.sort((a, b) => {
            const [d1, m1, y1] = a.key.split('-');
            const [d2, m2, y2] = b.key.split('-');
            return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`);
        });

        // start on the last window so teacher sees most recent dates
        windowStart = Math.max(0, dates.length - COLS_PER_WINDOW);
    }

    // ── Elements ──
    const attHeaderRow     = document.getElementById('attHeaderRow');
    const attBody          = document.getElementById('attBody');
    const attEmpty         = document.getElementById('attEmpty');
    const dateNav          = document.getElementById('dateNav');
    const windowLabel      = document.getElementById('windowLabel');
    const prevBtn          = document.getElementById('prevWindow');
    const nextBtn          = document.getElementById('nextWindow');
    const saveAttBtn       = document.getElementById('saveAttBtn');
    const addDateBtn       = document.getElementById('addDateBtn');

    // ── Add Date Modal elements ──
    const dateModalOverlay = document.getElementById('dateModalOverlay');
    const closeDateModal   = document.getElementById('closeDateModal');
    const useTodayBtn      = document.getElementById('useTodayBtn');
    const useCustomBtn     = document.getElementById('useCustomBtn');
    const customDateWrap   = document.getElementById('customDateWrap');
    const customDateInput  = document.getElementById('customDateInput');
    const datePreview      = document.getElementById('datePreview');
    const confirmDateBtn   = document.getElementById('confirmDateBtn');

    // ── Delete Date Modal elements ──
    const deleteDateOverlay = document.getElementById('deleteDateOverlay');
    const closeDeleteModal  = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn   = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn  = document.getElementById('confirmDeleteBtn');
    const deleteDateLabel   = document.getElementById('deleteDateLabel');

    let useToday = true;
    let pendingDeleteKey = null;

    // ════════════════════════════════
    // ADD DATE MODAL
    // ════════════════════════════════

    addDateBtn.addEventListener('click', () => {
        useToday = true;
        useTodayBtn.classList.add('active');
        useCustomBtn.classList.remove('active');
        customDateWrap.style.display = 'none';
        customDateInput.value = '';
        updateDatePreview();
        dateModalOverlay.classList.add('open');
    });

    closeDateModal.addEventListener('click', closeDModal);
    dateModalOverlay.addEventListener('click', e => {
        if (e.target === dateModalOverlay) closeDModal();
    });

    function closeDModal() {
        dateModalOverlay.classList.remove('open');
        datePreview.innerHTML = '';
        customDateInput.value = '';
        customDateInput.style.borderColor = '';
    }

    useTodayBtn.addEventListener('click', () => {
        useToday = true;
        useTodayBtn.classList.add('active');
        useCustomBtn.classList.remove('active');
        customDateWrap.style.display = 'none';
        updateDatePreview();
    });

    useCustomBtn.addEventListener('click', () => {
        useToday = false;
        useCustomBtn.classList.add('active');
        useTodayBtn.classList.remove('active');
        customDateWrap.style.display = 'block';
        updateDatePreview();
    });

    customDateInput.addEventListener('change', updateDatePreview);

    // ── Prevent 4+ digit year in date input ──
    customDateInput.addEventListener('input', () => {
        if (!customDateInput.value) return;
        const [year] = customDateInput.value.split('-');
        if (year && year.length > 4) {
            // trim year to 4 digits and reassemble
            const parts = customDateInput.value.split('-');
            parts[0] = parts[0].slice(0, 4);
            customDateInput.value = parts.join('-');
        }
    });

    function updateDatePreview() {
        let dateObj;
        if (useToday) {
            dateObj = new Date();
        } else {
            if (!customDateInput.value) { datePreview.innerHTML = ''; return; }
            dateObj = new Date(customDateInput.value);
        }

        // ── YEAR GUARD — block anything outside 2000–2099 ──
        const year = dateObj.getFullYear();
        if (year < 2000 || year > 2099) {
            datePreview.innerHTML = `<p class="date-error">Please enter a valid year (2000–2099).</p>`;
            return;
        }

        const day     = String(dateObj.getDate()).padStart(2, '0');
        const month   = dateObj.toLocaleString('en', { month: 'long' }).toUpperCase();
        const weekday = dateObj.toLocaleString('en', { weekday: 'long' }).toUpperCase();

        datePreview.innerHTML = `
            <div class="date-preview-box">
                <span class="preview-weekday">${weekday}</span>
                <span class="preview-date">${day} ${month} ${year}</span>
            </div>
        `;
    }

    confirmDateBtn.addEventListener('click', () => {
        let dateObj;

        if (useToday) {
            dateObj = new Date();
        } else {
            if (!customDateInput.value) {
                customDateInput.style.borderColor = 'rgba(255,77,77,0.5)';
                return;
            }
            dateObj = new Date(customDateInput.value);
        }

        // ── YEAR GUARD on confirm too — double safety ──
        const year = dateObj.getFullYear();
        if (year < 2000 || year > 2099) {
            datePreview.innerHTML = `<p class="date-error">Please enter a valid year (2000–2099).</p>`;
            return;
        }

        customDateInput.style.borderColor = '';

        const day   = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('en', { month: 'short' }).toUpperCase();
        const key   = `${day}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${year}`;
        const label = `${day} ${month} ${year}`;

        if (dates.find(d => d.key === key)) {
            datePreview.innerHTML += `<p class="date-error">This date already exists.</p>`;
            return;
        }

        // ── DATA WRITE: new date pushed to dates array ──
        dates.push({ label, key });

        // ── DATA WRITE: all students defaulted to present for this date ──
        students.forEach(s => { attendance[s.student_roll_no][key] = 'present'; });

        windowStart = Math.max(0, dates.length - COLS_PER_WINDOW);
        renderTable();
        markDirty();
        closeDModal();
    });

    // ════════════════════════════════
    // DELETE DATE MODAL
    // ════════════════════════════════

    closeDeleteModal.addEventListener('click', closeDeleteModal_fn);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal_fn);
    deleteDateOverlay.addEventListener('click', e => {
        if (e.target === deleteDateOverlay) closeDeleteModal_fn();
    });

    function closeDeleteModal_fn() {
        deleteDateOverlay.classList.remove('open');
        pendingDeleteKey = null;
    }

    confirmDeleteBtn.addEventListener('click', () => {
        if (!pendingDeleteKey) return;

        const key = pendingDeleteKey;

        // ── DATA WRITE: remove from dates array ──
        const idx = dates.findIndex(x => x.key === key);
        if (idx !== -1) dates.splice(idx, 1);

        // ── DATA WRITE: remove from every student's record ──
        students.forEach(s => delete attendance[s.student_roll_no][key]);

        windowStart = Math.max(0, Math.min(windowStart, dates.length - COLS_PER_WINDOW));

        closeDeleteModal_fn();
        renderTable();
        markDirty();
    });

    // ════════════════════════════════
    // NAVIGATION
    // ════════════════════════════════

    prevBtn.addEventListener('click', () => {
        windowStart = Math.max(0, windowStart - COLS_PER_WINDOW);
        renderTable();
    });

    nextBtn.addEventListener('click', () => {
        windowStart = Math.min(dates.length - COLS_PER_WINDOW, windowStart + COLS_PER_WINDOW);
        renderTable();
    });

    // ════════════════════════════════
    // RENDER TABLE
    // ════════════════════════════════

    function renderTable() {
        const hasStudents = students.length > 0;
        const hasDates    = dates.length > 0;

        if (!hasStudents || !hasDates) {
            attEmpty.style.display = 'flex';
            attEmpty.querySelector('p').textContent = !hasStudents
                ? 'No students found in this course.'
                : 'No attendance dates added yet.';
        } else {
            attEmpty.style.display = 'none';
        }

        addDateBtn.disabled      = !hasStudents;
        addDateBtn.style.opacity = !hasStudents ? '0.5' : '1';
        addDateBtn.style.cursor  = !hasStudents ? 'not-allowed' : 'pointer';

        if (!hasStudents) return;

        attEmpty.style.display   = hasDates ? 'none' : 'flex';
        dateNav.style.display    = hasDates && dates.length > COLS_PER_WINDOW ? 'flex' : 'none';
        saveAttBtn.style.display = dirty ? 'inline-block' : 'none';

        const visibleDates = dates.slice(windowStart, windowStart + COLS_PER_WINDOW);

        prevBtn.disabled = windowStart === 0;
        nextBtn.disabled = windowStart + COLS_PER_WINDOW >= dates.length;

        const from = windowStart + 1;
        const to   = Math.min(windowStart + COLS_PER_WINDOW, dates.length);
        windowLabel.textContent = `${from} – ${to} OF ${dates.length}`;

        // Header
        attHeaderRow.innerHTML = '<th class="att-name-col">STUDENT</th>';
        visibleDates.forEach(d => {
            const th = document.createElement('th');
            th.innerHTML = `
                <div class="att-th-wrap">
                    <span>${d.label}</span>
                    <button class="att-delete-date" title="Delete ${d.label}">✕</button>
                </div>
            `;
            th.querySelector('.att-delete-date').addEventListener('click', () => {
                deleteDateLabel.textContent = d.label;
                pendingDeleteKey = d.key;
                deleteDateOverlay.classList.add('open');
            });
            attHeaderRow.appendChild(th);
        });

        // Body
        attBody.innerHTML = '';
        students.forEach(s => {
            const tr = document.createElement('tr');

            const nameTd      = document.createElement('td');
            const rollNo      = s.student_roll_no;
            const studentName = s.students.register_students.full_name || 'Unknown';
            nameTd.textContent = `${rollNo} - ${studentName}`;
            tr.appendChild(nameTd);

            visibleDates.forEach(d => {
                const td    = document.createElement('td');
                const btn   = document.createElement('button');
                const state = attendance[s.student_roll_no][d.key] || 'present';

                btn.className   = 'att-cell' + (state === 'absent' ? ' absent' : '');
                btn.textContent = state === 'absent' ? 'A' : '—';
                btn.title       = state === 'absent' ? 'Absent — click to mark Present' : 'Present — click to mark Absent';

                btn.addEventListener('click', () => {
                    const current = attendance[s.student_roll_no][d.key];
                    attendance[s.student_roll_no][d.key] = current === 'absent' ? 'present' : 'absent';
                    btn.className   = 'att-cell' + (attendance[s.student_roll_no][d.key] === 'absent' ? ' absent' : '');
                    btn.textContent = attendance[s.student_roll_no][d.key] === 'absent' ? 'A' : '—';
                    btn.title       = attendance[s.student_roll_no][d.key] === 'absent' ? 'Absent — click to mark Present' : 'Present — click to mark Absent';
                    markDirty();
                });

                td.appendChild(btn);
                tr.appendChild(td);
            });

            attBody.appendChild(tr);
        });
    }

    // ════════════════════════════════
    // DIRTY STATE & SAVE
    // ════════════════════════════════

    function markDirty() {
        dirty = true;
        saveAttBtn.style.display = 'inline-block';
    }

    saveAttBtn.addEventListener('click', async () => {
        const body = { att: attendance, cou: courses };
        const response = await fetch(`${BASE}/save_attendance`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();

        if (response.ok) {
            showMessage('Attendance Saved', 'success');
        } else {
            showMessage(data.error, 'error');
        }

        dirty = false;
        saveAttBtn.style.display = 'none';
        saveAttBtn.textContent = 'SAVED ✓';
        saveAttBtn.style.color = '#4ade80';
        setTimeout(() => {
            saveAttBtn.textContent = 'SAVE';
            saveAttBtn.style.color = '';
        }, 2000);
    });

    renderTable();
}

set_std();