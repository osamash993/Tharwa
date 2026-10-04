window.__errs=[];
window.addEventListener('error',e=>{window.__errs.push(e.message);const box=document.getElementById('bErr');if(box)box.textContent=e.message;});
function __forceOpen(){if(window.__booted)return;window.__booted=true;document.getElementById('boot')?.remove();document.body.classList.remove('booting');try{if(typeof reveal==='function')reveal();}catch(e){console.error(e);}}
setTimeout(__forceOpen,7000);
