(function(){
  const get=()=>{try{return localStorage.getItem('nd_theme')||'system'}catch(e){return 'system'}};
  const apply=t=>{const r=document.documentElement;if(t==='light'||t==='dark')r.setAttribute('data-theme',t);else r.removeAttribute('data-theme')};
  const effective=()=>{const t=get();return t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t};
  window.getTheme=get;
  window.setTheme=t=>{try{localStorage.setItem('nd_theme',t)}catch(e){}apply(t);window.themeChanged&&window.themeChanged()};
  window.toggleTheme=()=>window.setTheme(effective()==='dark'?'light':'dark');
  window.themeIcon=()=>effective()==='dark'?'☀':'🌙';
  apply(get());
})();
