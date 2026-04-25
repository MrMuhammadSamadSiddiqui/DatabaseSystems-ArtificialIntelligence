
let started = false;
let cursor=document.getElementById('cursor')
let ring=document.getElementById('ring')

document.addEventListener('mousemove', e => {
    if (!started){
      cursor.style.left=e.clientX+'px'
      cursor.style.top=e.clientY+'px'
      ring.style.left=e.clientX+'px'
      ring.style.top=e.clientY+'px'
      cursor.style.opacity = '1';
      ring.style.opacity   = '1';
      started = true;
    }
});

document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.body.style.opacity = 0;
    setTimeout(() => {
      window.location = link.href;
    }, 0);
  });
});

let mx=0
let my=0
document.addEventListener('mousemove',e=>{
    mx=e.clientX
    my=e.clientY
    cursor.style.left=e.clientX+'px'
    cursor.style.top=e.clientY+'px'
})
let rx=0
let ry=0;
(function loop() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
})();