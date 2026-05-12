   let siblingCount = 0;

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

    // ── Toggle Custom Class ───────────────────────────
    function toggleCustomClass(value) {
      const container = document.getElementById('custom-class-container');
      const input = document.getElementById('custom_class_input');
      if (value === 'other') {
        container.style.display = 'block';
        input.required = true;
      } else {
        container.style.display = 'none';
        input.required = false;
        input.value = '';
      }
    }

    // ── Toggle Siblings (Working Fix) ──────────────────
    function toggleSiblings(show) {
      const container = document.getElementById('siblings-container');
      const hiddenInput = document.getElementById('has_sibling');
      const btnYes = document.getElementById('sib-yes');
      const btnNo = document.getElementById('sib-no');

      if (show) {
        container.style.display = 'block';
        hiddenInput.value = 'yes';
        btnYes.classList.add('active');
        btnNo.classList.remove('active');
        if (siblingCount === 0) addSibling();
      } else {
        container.style.display = 'none';
        hiddenInput.value = 'no';
        btnNo.classList.add('active');
        btnYes.classList.remove('active');
      }
    }

    // ── Add Sibling Row ───────────────────────────────
    function addSibling() {
      if (siblingCount >= 5) return;
      siblingCount++;
      const list = document.getElementById('sibling-list');
      const entry = document.createElement('div');
      entry.className = 'sibling-entry';
      entry.id = `sibling-${siblingCount}`;
       if(siblingCount>1){
            entry.innerHTML+=`
            <div style="opacity: 1; height: 0; border-top: 1px solid rgba(145,168,195,0.2);"></div>
            <div class="sibling-header" style="margin-top:1rem; display:flex; align-items:center; justify-content:space-between;">
          <span style="font-weight:700; color:var(--primary-color); ">Sibling #${siblingCount}</span>
        <a class="remove-btn" style="text-decoration:none;  display:flex; align-items:center; justify-content:center; " onclick="removeSibling(${siblingCount})"><i class="fa-solid fa-xmark"></i></a>
        
      
        </div>
        `
      }
      else{

      entry.innerHTML+=`
      <div class="sibling-header" >
    <span style="font-weight:700; color:var(--primary-color); ">Sibling #${siblingCount}</span>
  </div>
  `

      }
      
      entry.innerHTML += `
        <div class="grid-2" style="margin-bottom:1.5rem;" >
          <div class="field">
            <label>Full Name</label>
            <input type="text" name="sibling_name_${siblingCount}" placeholder="Full Name" />
          </div>
          <div class="field">
            <label>Roll Number</label>
            <input type="text" name="sibling_roll_${siblingCount}" placeholder="e.g. VE-123" />
          </div>
        </div>
      `;
      list.appendChild(entry);
      updateAddButton();
    }
  

    function removeSibling(id) {
      const el = document.getElementById(`sibling-${id}`);
      if (el) el.remove();
      
      const entries = document.querySelectorAll('.sibling-entry');
      siblingCount = entries.length;
      entries.forEach((entry, i) => {
        const n = i + 1;
        entry.id = `sibling-${n}`;
        entry.querySelector('span').textContent = `Sibling #${n}`;
      });
      
      updateAddButton();
      if (siblingCount === 0) toggleSiblings(false);
    }

    window.toggleCustomClass =
    toggleCustomClass

window.toggleSiblings =
    toggleSiblings

window.addSibling =
    addSibling

window.removeSibling =removeSibling
    
    function updateAddButton() {
      const btn = document.getElementById('add-sibling-btn');
      btn.style.display = siblingCount >= 5 ? 'none' : 'block';
    }


    // ── Form Submission ───────────────────────────────
    document.getElementById('reg-form').addEventListener('submit',async function(e) {
      e.preventDefault()

      
    let classyear=this.class_year.value
    if(classyear==="other"){
        classyear=this.custom_class_year.value
    }

      const siblings=[]
      for(let i=1;i<=siblingCount;i++){

        const name=document.querySelector(`[name="sibling_name_${i}"]`).value
        const roll=document.querySelector(`[name="sibling_roll_${i}"]`).value
        if(name&&roll){
          siblings.push({name,roll})
        }
      }
      const body={
        full_name:this.full_name.value,
        father_name:this.father_name.value,
        guardian_contact:this.guardian_contact.value,
        date_of_birth:this.date_of_birth.value,
        education_board:this.education_board.value,
        class_year:classyear,
        has_sibling:this.has_sibling.value,
        siblings
      }
      const response=await fetch( `${BASE}/register`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json' 
        },
        body:JSON.stringify(body)
      })
const data = await response.json()
if(response.ok){showMessage(data.message,'success')}
else{showMessage(data.error,'error')}});






