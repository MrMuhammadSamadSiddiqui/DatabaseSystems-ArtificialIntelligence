   let siblingCount = 0;

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

      entry.innerHTML = `
        <div class="sibling-header">
          <span style="font-weight:700; color:var(--primary-color);">Sibling #${siblingCount}</span>
          ${siblingCount > 1 ? `<button type="button" class="remove-btn" onclick="removeSibling(${siblingCount})">✕ Remove</button>` : ''}
        </div>
        <div class="grid-2">
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

    function updateAddButton() {
      const btn = document.getElementById('add-sibling-btn');
      btn.style.display = siblingCount >= 5 ? 'none' : 'block';
    }

    // ── Form Submission ───────────────────────────────
    document.getElementById('reg-form').addEventListener('submit', function(e) {
      // Form submission logic remains same as before
      console.log("Form submitted!");
    });