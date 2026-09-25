const TOPICS={"Biology": ["Cell biology", "Organisation", "Infection and response", "Bioenergetics", "Homeostasis and response", "Inheritance, variation and evolution", "Ecology"], "Chemistry": ["Atomic structure", "The periodic table", "Bonding", "Chemical changes", "Energy changes", "The rate and extent of chemical change", "Organic chemistry", "Chemical analysis", "Chemistry of the atmosphere", "Using resources"], "Physics": ["Energy", "Electricity", "Particle model of matter", "Atomic structure", "Forces", "Waves", "Magnetism and electromagnetism"]};let quiz=[],pos=0,score=0;function show(id){document.querySelectorAll('main>section').forEach(x=>x.hidden=x.id!==id);if(id==='topics')renderTopics();if(id==='quiz')setup()}function setup(){let s=document.getElementById('subject'),t=document.getElementById('topic');t.innerHTML='';t.hidden=s.value!=='Topic';if(s.value==='Topic')for(let [sub,arr] of Object.entries(TOPICS))for(let x of arr){let o=document.createElement('option');o.value=sub+'|'+x;o.textContent=sub+' — '+x;t.appendChild(o)}}function newQuiz(){let s=document.getElementById('subject').value,n=+document.getElementById('count').value,p=QUESTIONS;if(s!=='Mixed Science'&&s!=='Topic')p=p.filter(x=>x.subject===s);if(s==='Topic'){let [a,b]=document.getElementById('topic').value.split('|');p=p.filter(x=>x.subject===a&&x.topic===b)}quiz=[...p].sort(()=>Math.random()-.5).slice(0,n);pos=0;score=0;render()}function render(){let b=document.getElementById('box');if(pos>=quiz.length){b.innerHTML='<h2>Finished!</h2><p>Score: '+score+'/'+quiz.length+'</p><button onclick="newQuiz()">New quiz</button>';return}let q=quiz[pos];b.innerHTML='<p>Question '+(pos+1)+' of '+quiz.length+' · '+q.topic+'</p><h2>'+q.q+'</h2>'+q.c.map((x,j)=>'<button class="option" onclick="answer('+j+')">'+x+'</button>').join('')}function answer(j){let q=quiz[pos],o=document.querySelectorAll('.option');o.forEach((x,k)=>{x.disabled=true;if(x.textContent===q.a)x.classList.add('correct');if(k===j&&x.textContent!==q.a)x.classList.add('wrong')});if(o[j].textContent===q.a)score++;document.getElementById('box').insertAdjacentHTML('beforeend','<p>'+q.e+'</p><button onclick="pos++;render()">Next →</button>')}function renderTopics(){let l=document.getElementById('list');l.innerHTML='';for(let [s,arr] of Object.entries(TOPICS)){l.innerHTML+='<h2>'+s+'</h2>';for(let t of arr)l.innerHTML+='<div class="topic"><span>'+t+'<br>50 questions</span><button onclick="show(\'quiz\');document.getElementById(\'subject\').value=\'Topic\';setup();document.getElementById(\'topic\').value='+JSON.stringify(s+'|'+t)+';newQuiz()">Start</button></div>'}}setup();

const AI_CONFIG=window.AI_CONFIG||{backendUrl:""};
function escAI(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function populateAITopics(){
 const s=document.getElementById("aiSubject"),t=document.getElementById("aiTopic"); if(!s||!t)return;
 t.innerHTML=""; (TOPICS[s.value]||[]).forEach(x=>{let o=document.createElement("option");o.value=x;o.textContent=x;t.appendChild(o);});
}
function builtInAI(){
 const s=document.getElementById("aiSubject").value,t=document.getElementById("aiTopic").value,q=document.getElementById("aiQuestion").value.trim();
 const facts=[...new Set(QUESTIONS.filter(x=>x.subject===s&&x.topic===t).map(x=>x.e).filter(Boolean))].slice(0,10);
 document.getElementById("aiStatus").textContent="Built-in GCSE explanation";
 document.getElementById("aiAnswer").innerHTML="<h2>"+escAI(t)+"</h2><ul>"+facts.map(x=>"<li>"+escAI(x)+"</li>").join("")+"</ul>"+(q?"<p><b>Your question:</b> "+escAI(q)+"</p>":"");
}
async function askAI(){
 const question=document.getElementById("aiQuestion").value.trim();
 if(!question){document.getElementById("aiStatus").textContent="Type a question first.";return;}
 if(!AI_CONFIG.backendUrl){builtInAI();return;}
 const payload={subject:document.getElementById("aiSubject").value,topic:document.getElementById("aiTopic").value,level:document.getElementById("aiLevel").value,question};
 document.getElementById("aiStatus").textContent="AI is thinking…";
 try{
  const r=await fetch(AI_CONFIG.backendUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  if(!r.ok)throw Error();
  const d=await r.json();
  document.getElementById("aiAnswer").innerHTML="<p>"+escAI(d.answer||"No answer returned.").replace(/\n/g,"<br>")+"</p>";
  document.getElementById("aiStatus").textContent="AI Tutor";
 }catch(e){document.getElementById("aiStatus").textContent="AI unavailable — using built-in explanation.";builtInAI();}
}
document.addEventListener("DOMContentLoaded",populateAITopics);


/* UI micro-interactions */
document.addEventListener("click", function(e) {
  const el = e.target.closest("button, a, .subject-card, .option");
  if (!el) return;
  el.classList.remove("tap-pop");
  void el.offsetWidth;
  el.classList.add("tap-pop");
});

function animateVisibleSection(section) {
  if (!section) return;
  section.classList.remove("page-enter");
  void section.offsetWidth;
  section.classList.add("page-enter");
}
