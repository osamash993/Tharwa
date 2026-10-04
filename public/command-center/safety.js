window.__errs=[];
window.addEventListener('error',e=>{window.__errs.push(e.message);const box=document.getElementById('bErr');if(box)box.textContent=e.message;});
function __forceOpen(){if(window.__booted)return;window.__booted=true;const boot=document.getElementById('boot');if(boot){boot.classList.add('out');setTimeout(()=>boot.remove(),400);}document.body.classList.remove('booting');try{if(typeof reveal==='function')reveal();}catch(e){console.error(e);}}
setTimeout(__forceOpen,7000);
