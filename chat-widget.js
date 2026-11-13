(function(){
  /* ============ CONTENIDO (edita aquí textos, precios y palabras clave) ============ */
  var AGENDA='/.netlify/functions/agenda';
  var PHONE='+34 633 86 08 65', MAIL='appxpandcontact@gmail.com', WA='https://wa.me/34633860865';
  var CTA_REV={t:'Solicitar revisión gratuita',href:'#contacto',cta:1};
  var CTA_CONTACT=[CTA_REV,{t:'Escribir por WhatsApp',href:WA,cta:1},{t:'Email: '+MAIL,href:'mailto:'+MAIL}];

  var T={
    precios:{label:'Precios de webs',sub:'Básico, Inicial y Pro',
      kw:['precio','cuesta','cuanto vale','cuanto cuesta','tarifa','coste','euros','presupuesto','barato','cuanto'],
      a:['Webs de pago único (sin IVA desglosado):','- Web Básico: 337 €','- Pack Inicial: 649 €','- Pack Pro: 1.189 €','Toca uno para ver qué incluye.'],
      rel:['web_basico','pack_inicial','pack_pro','mantenimiento']},
    web_basico:{label:'Web Básico · 337 €',sub:'Landing para que te contacten',
      kw:['basico','landing','337','una pagina','pagina sencilla','web basica','web basico'],
      a:['Web Básico · 337 € (pago único)','Una página con un único objetivo: que el cliente contacte.','- Llamada a la acción clara','- Formulario con aviso por email','- Botones de llamada y WhatsApp en móvil','- Mapa con ubicación y horarios','- Móvil, tablet y ordenador','- Carga rápida y SEO local básico','- Publicación y puesta en marcha incluidas'],
      rel:['pack_inicial','mantenimiento','contacto']},
    pack_inicial:{label:'Pack Inicial · 649 €',sub:'Web corporativa completa',
      kw:['inicial','corporativa','649','legal','rgpd','cookies','pestanas','tres paginas','web completa'],
      a:['Pack Inicial · 649 € (pago único)','Todo lo de Web Básico, más una web completa:','- Hasta 3 pestañas (inicio, servicios, contacto)','- Textos legales RGPD y banner de cookies','- SEO y alta en Google Search Console','- Alta y optimización básica de la ficha de Google','- Textos redactados con enfoque comercial'],
      rel:['pack_pro','google','mantenimiento']},
    pack_pro:{label:'Pack Pro · 1.189 €',sub:'Web + asistente + métricas',
      kw:['pro','1189','1.189','metricas','informe mensual','asistente','chat','estadisticas','visitas','qr'],
      a:['Pack Pro · 1.189 € (pago único)','Todo lo de Pack Inicial, más asistente y seguimiento:','- Asistente 24 horas: responde dudas y recoge contactos (como este)','- Métricas mensuales: visitas, llamadas, formularios y rutas','- Informe mensual claro, sin tecnicismos','- Ficha de Google a fondo, con estudio de competencia','- Tarjeta de reseñas con QR para el mostrador','- Hasta 6 pestañas y formación de 30 minutos'],
      rel:['resenas','mantenimiento','contacto']},
    google:{label:'Perfil de Google',sub:'Ficha de Google Maps',
      kw:['google','ficha','maps','mapa de google','perfil','posicionar','posicionamiento','aparecer','encontrar','buscador','seo'],
      a:['Dejamos tu ficha de Google Maps completa y bien posicionada, con seguimiento:','- Estudio inicial frente a tu competencia','- Categorías, servicios, fotos y horarios','- Publicaciones','- Seguimiento de tu puntuación','- Informes: llamadas, rutas y visitas'],
      rel:['plazos','resenas','lanzadera','contacto']},
    resenas:{label:'Reseñas y tarjeta QR',sub:'Consigue más opiniones',
      kw:['resena','resenas','opiniones','estrellas','puntuacion','tarjeta','valoraciones','nota'],
      a:['Los clientes contentos no suelen dejar reseñas solos, y sin ellas otro negocio pasa por delante.','Te entregamos una tarjeta de reseñas para el mostrador (con QR en el Pack Pro) y hacemos seguimiento de cómo evoluciona tu puntuación.'],
      rel:['google','pack_pro','lanzadera']},
    lanzadera:{label:'Paquete lanzadera',sub:'Para negocios que acaban de abrir',
      kw:['lanzadera','nuevo negocio','acabo de abrir','acaba de abrir','empezar','abrir','330','29','nuevo','emprendedor','startup'],
      a:['Paquete lanzadera · 330 € de alta + 29 €/mes','Alta:','- Web con formulario y mapa','- Estudio y optimización de la ficha de Google','- Tarjeta de reseñas para tu mostrador','Mantenimiento:','- Ajustes de SEO revisados cada 3 meses','- Una modificación por campaña (Navidad, verano, Black Friday…)','Cambios extra, a consulta.'],
      rel:['google','mantenimiento','contacto']},
    mantenimiento:{label:'Mantenimiento mensual',sub:'Básico, Avanzado y Premium',
      kw:['mantenimiento','mensual','cuota','mensualidad','horas','soporte','seguridad','copias','39','69','117','avanzado','premium','al mes','desarrollo'],
      a:['Opcional, se contrata aparte (sin IVA desglosado):','- Básico · 39,99 €/mes: seguridad, copias, revisiones, formularios y enlaces, soporte por email y WhatsApp. Sin horas de desarrollo.','- Avanzado · 69,99 €/mes (el más recomendado): lo del Básico + optimización de velocidad, revisiones técnicas semanales, 1 hora de desarrollo al mes y soporte prioritario.','- Premium · 117 €/mes: lo del Avanzado + 3 horas de desarrollo al mes, mejoras y nuevas funcionalidades, cambios de diseño, SEO periódico, informe mensual y atención prioritaria.'],
      rel:['descuentos','condiciones','contacto']},
    descuentos:{label:'Descuentos por adelantado',sub:'3, 6 o 12 meses',
      kw:['descuento','adelantado','adelanto','ahorrar','3 meses','6 meses','12 meses','pack de meses','anual','promocion','oferta'],
      a:['Pagando el mantenimiento por adelantado (cualquier plan):','- 3 meses: 5 % dto.','- 6 meses: 10 % dto.','- 12 meses: 15 % dto.','Totales:','- Básico: 113,97 € / 215,95 € / 407,90 €','- Avanzado: 199,47 € / 377,95 € / 713,90 €','- Premium: 333,45 € / 631,80 € / 1.193,40 €','Los descuentos no se acumulan con otras promociones.'],
      rel:['mantenimiento','contacto']},
    proceso:{label:'Cómo trabajamos',sub:'Tres pasos, sin tecnicismos',
      kw:['como trabajais','como trabajan','proceso','pasos','como funciona','metodologia','que tengo que hacer','que necesitais','que necesitan'],
      a:['Tres pasos, sin que tengas que aprender nada técnico:','1. Revisamos cómo te ven hoy: perfil, web y reseñas frente a tu zona, y te contamos qué falla.','2. Lo montamos todo: configuramos el perfil, publicamos la web y te entregamos la tarjeta de reseñas. Tú solo aportas fotos y datos.','3. Mejoramos e informamos: seguimiento de tu puntuación, revisión de SEO cada 3 meses e informe de lo que ha entrado.'],
      rel:['plazos','precios','contacto']},
    plazos:{label:'Plazos y resultados',sub:'Cuándo se nota',
      kw:['plazo','plazos','cuanto tarda','tarda','tiempo','cuando','resultados','garantia','garantizar','rapido','entrega'],
      a:['El posicionamiento local suele tardar entre 1 y 3 meses en notarse. Te lo decimos desde el principio para que no te sorprenda.','Los plazos de entrega concretos de tu web los confirmamos al revisar tu caso.'],
      rel:['proceso','google','contacto']},
    condiciones:{label:'Condiciones generales',sub:'Horas, dominios, IVA…',
      kw:['condiciones','iva','dominio','dominios','acumulan','ilimitado','presupuesto aparte','integraciones','compleja','funcionalidades','terceros','contrato'],
      a:['- Las horas de desarrollo se renuevan cada mes y no se acumulan.','- Se cuentan por tiempo real dedicado; no son desarrollo ilimitado.','- Funcionalidades complejas, proyectos grandes e integraciones se presupuestan aparte.','- El mantenimiento es opcional y se contrata aparte.','- Dominios y servicios de terceros no incluidos salvo que se indique.','- Los packs se pagan por adelantado; descuentos no acumulables.'],
      rel:['mantenimiento','contacto']},
    llamada:{label:'Quiero una llamada',sub:'Hablar con el equipo',
      kw:['llamada','llamar','cita','agendar','reunion','reservar','reserva','disponibilidad','hueco','videollamada','teams','hablar','telefono','llamadme'],
      a:['Aún no puedo reservar citas aquí, pero lo resolvemos rápido: deja tus datos en el formulario y te contactamos en menos de 24 horas, o llámanos directamente al '+PHONE+'.'],
      act:[CTA_REV,{t:'Llamar al '+PHONE,href:'tel:+34633860865'},{t:'Escribir por WhatsApp',href:WA}],
      rel:['contacto']},
    contacto:{label:'Contacto y revisión gratuita',sub:'Respondemos en menos de 24 h',
      kw:['contacto','contactar','email','correo','whatsapp','revision','gratis','gratuita','donde','ubicacion','zona','albacete','ciudad real','alicante','escribir','formulario'],
      a:['Empezamos por una revisión gratuita de tu negocio: dinos cómo se llama y dónde está, y respondemos en menos de 24 horas con lo que hemos visto.','Email: '+MAIL,'Teléfono: '+PHONE,'Zonas: Albacete · Ciudad Real · Alicante'],
      act:CTA_CONTACT, rel:[]}
  };
  var MENU=['precios','google','lanzadera','mantenimiento','proceso','llamada','contacto'];
  T.llamada.a=['Reserva tú mismo el día y la hora para una llamada o videollamada de 30 min. Se comprueba al momento que el hueco esté libre y te llega la invitación por email.'];
  T.llamada.act=[{t:'📅 Elegir día y hora',fn:function(){startBooking();},cta:1},{t:'Prefiero que me llaméis vosotros',href:'#contacto'},{t:'Llamar al '+PHONE,href:'tel:+34633860865'}];
  T.llamada.label='Reservar llamada o reunión';T.llamada.sub='Elige día y hora';
  var HI=['hola','buenas','buenos dias','buenas tardes','buenas noches','hey','ey','que tal'];
  var BYE=['gracias','muchas gracias','vale gracias','perfecto gracias','genial'];

  /* ============ LÓGICA ============ */
  function norm(s){return ' '+s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9., ]/g,' ').replace(/\s+/g,' ').trim()+' ';}
  function find(q){
    var n=norm(q), best=null, bs=0;
    for(var id in T){
      var s=0;
      T[id].kw.forEach(function(k){
        var kk=norm(k).trim();
        var re=kk.length<=3 ? ' '+kk+' ' : kk; // palabras muy cortas: coincidencia exacta
        if(n.indexOf(re)>-1) s+=kk.length+(kk.indexOf(' ')>-1?4:0);
      });
      if(s>bs){bs=s;best=id;}
    }
    return best;
  }

  var btn=document.createElement('button');
  btn.className='axc-btn';btn.setAttribute('aria-label','Abrir asistente');
  btn.innerHTML='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var p=document.createElement('div');
  p.className='axc-panel';
  p.innerHTML='<div class="axc-head"><div>Asistente AppXpand<small>Resuelve tus dudas al momento · 24 horas</small></div><button class="axc-x" aria-label="Cerrar">&times;</button></div>'+
    '<div class="axc-msgs"></div>'+
    '<form class="axc-form"><input class="axc-in" maxlength="120" placeholder="Escribe una palabra: precio, google…" autocomplete="off"><button class="axc-send" type="submit">Enviar</button></form>'+
    '<div class="axc-note">Elige un tema o escribe una palabra clave.</div>';
  document.body.appendChild(btn);document.body.appendChild(p);
  var box=p.querySelector('.axc-msgs'),form=p.querySelector('form'),inp=p.querySelector('.axc-in');
  var busy=false, started=false;

  function scroll(){box.scrollTop=box.scrollHeight;}
  function bubble(role,text){
    var d=document.createElement('div');d.className='axc-m '+(role==='user'?'me':'bot');
    if(text!=null)d.textContent=text;box.appendChild(d);scroll();return d;
  }
  function cardBtn(id){
    var b=document.createElement('button');b.type='button';b.className='axc-card';
    b.textContent=T[id].label;
    if(T[id].sub){var s=document.createElement('small');s.textContent=T[id].sub;b.appendChild(s);}
    b.onclick=function(){show(id,true);};
    return b;
  }
  function cards(ids,acts,withMenu){
    var w=document.createElement('div');w.className='axc-cards';
    (acts||[]).forEach(function(a){
      if(a.fn){var bb=document.createElement('button');bb.type='button';bb.className='axc-card'+(a.cta?' cta':'');bb.textContent=a.t;bb.onclick=a.fn;w.appendChild(bb);return;}
      var l=document.createElement('a');l.className='axc-card'+(a.cta?' cta':'');l.textContent=a.t;l.href=a.href;
      if(a.href.indexOf('http')===0){l.target='_blank';l.rel='noopener';}
      if(a.href.charAt(0)==='#'){l.onclick=function(){p.classList.remove('open');};}
      w.appendChild(l);
    });
    ids.forEach(function(id){w.appendChild(cardBtn(id));});
    if(withMenu){
      var m=document.createElement('button');m.type='button';m.className='axc-card';m.textContent='↩ Volver al menú';
      m.onclick=function(){menu('¿Sobre qué quieres saber?',true);};w.appendChild(m);
    }
    box.appendChild(w);scroll();
  }
  /* ---------- RESERVAS ---------- */
  var SL=null,SLt=0,inBook=false,REP=null,TEAM=null,pendingWhen=null;
  var DN=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],MN=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  function dt(s){var a=s.split('-');return new Date(Date.UTC(+a[0],a[1]-1,+a[2]));}
  function lab(s){var d=dt(s);return DN[d.getUTCDay()].slice(0,3)+' '+d.getUTCDate()+' '+MN[d.getUTCMonth()].slice(0,3);}
  function labL(s){var d=dt(s);return DN[d.getUTCDay()]+' '+d.getUTCDate()+' de '+MN[d.getUTCMonth()];}
  function today(){return new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Madrid'});}
  function addD(s,k){var d=dt(s);d.setUTCDate(d.getUTCDate()+k);return d.toISOString().slice(0,10);}
  function typing(){var t=bubble('bot');t.innerHTML='<span class="axc-dots"><span></span><span></span><span></span></span>';return t;}
  function load(force){
    if(!force&&SL&&Date.now()-SLt<60000)return Promise.resolve(SL);
    return fetch(AGENDA+'?rep='+encodeURIComponent(REP?REP.id:'admin')).then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(j){SL=j;SLt=Date.now();return j;});
  }
  function fail(){
    bubble('bot','Ahora mismo no puedo consultar la agenda. Déjanos tus datos en el formulario o llámanos al '+PHONE+' y lo cerramos contigo.');
    cards([],[CTA_REV,{t:'Llamar al '+PHONE,href:'tel:+34633860865'}],true);
  }
  function loadTeam(){
    if(TEAM)return Promise.resolve(TEAM);
    return fetch(AGENDA+'?team=1').then(function(r){return r.json();}).then(function(j){TEAM=j.team||[];return TEAM;}).catch(function(){TEAM=[];return TEAM;});
  }
  function repCards(tm){
    cards([],tm.map(function(x){return{t:'Con '+x.name+(x.zone?' · '+x.zone:''),fn:function(){chooseRep(x);}};}),true);
  }
  function chooseRep(x,quiet){
    if(busy)return;
    REP=x;SL=null;
    if(!quiet)bubble('user','Con '+x.name);
    busy=true;var t=typing();
    load().then(function(j){
      t.remove();busy=false;
      if(pendingWhen){var w=pendingWhen;pendingWhen=null;handleWhen(w);return;}
      days(j,'Elige el día para hablar con '+x.name+'. También puedes escribirlo, por ejemplo: "viernes a las 17:30".');
    }).catch(function(){t.remove();busy=false;fail();});
  }
  function askRep(msg){
    REP=null;SL=null;
    bubble('bot',msg||'¿Con quién quieres hablar?');repCards(TEAM);
  }
  function startBooking(preset){
    if(busy)return;inBook=true;
    if(typeof preset!=='string')bubble('user','Reservar llamada');
    busy=true;var t=typing();
    loadTeam().then(function(tm){
      t.remove();busy=false;
      var pr=typeof preset==='string'&&tm.filter(function(x){return x.id===preset;})[0];
      if(pr)return chooseRep(pr,true);
      if(tm.length>=2)return askRep();
      REP=tm[0]||{id:'admin',name:''};SL=null;
      busy=true;var t2=typing();
      load().then(function(j){t2.remove();busy=false;days(j,'Elige el día que te venga bien. También puedes escribirlo, por ejemplo: "viernes a las 17:30".');})
        .catch(function(){t2.remove();busy=false;fail();});
    });
  }
  function days(j,msg){
    bubble('bot',msg);
    var ds=Object.keys(j.slots).filter(function(d){return j.slots[d].length;}).sort().slice(0,8);
    if(!ds.length){bubble('bot','Ahora mismo no tengo huecos libres. Déjanos tus datos y te llamamos.');cards([],[CTA_REV],true);return;}
    var acts=ds.map(function(d){return{t:lab(d)+' · '+j.slots[d].length+' huecos',fn:function(){pickDay(d);}};});
    if(TEAM&&TEAM.length>1)acts.push({t:'👤 Cambiar de persona',fn:function(){if(!busy)askRep('¿Con quién quieres hablar?');}});
    cards([],acts,true);
  }
  function times(d,list){
    var w=document.createElement('div');w.className='axc-times';
    list.forEach(function(tm){var b=document.createElement('button');b.type='button';b.className='axc-time';b.textContent=tm;b.onclick=function(){pickTime(d,tm);};w.appendChild(b);});
    box.appendChild(w);
    cards([],[{t:'← Elegir otro día',fn:function(){if(!busy)days(SL,'¿Qué otro día te viene bien?');}}]);
  }
  function pickDay(d){
    if(busy)return;bubble('user',labL(d));
    reply(function(){bubble('bot','Huecos libres el '+labL(d)+' (hora de España):');times(d,SL.slots[d]||[]);});
  }
  function alts(d,tm,j){
    var tgt=dt(d).getTime()/864e5*1440+(+tm.slice(0,2))*60+(+tm.slice(3)),list=[];
    Object.keys(j.slots).forEach(function(x){j.slots[x].forEach(function(t){
      list.push({d:x,t:t,k:Math.abs(dt(x).getTime()/864e5*1440+(+t.slice(0,2))*60+(+t.slice(3))-tgt)});});});
    list.sort(function(a,b){return a.k-b.k;});list=list.slice(0,6);
    if(!list.length){bubble('bot','Ahora mismo no tengo huecos libres. Déjanos tus datos y te llamamos.');cards([],[CTA_REV],true);return;}
    cards([],list.map(function(x){return{t:lab(x.d)+' · '+x.t,fn:function(){pickTime(x.d,x.t);}};}).concat([{t:'Ver otros días',fn:function(){if(!busy)days(SL,'Estos son los días con huecos:');}}]));
  }
  function pickTime(d,tm,typed){
    if(busy&&!typed)return;
    if(!typed)bubble('user',lab(d)+' · '+tm);
    reply(function(){bubble('bot','Perfecto: '+labL(d)+' a las '+tm+(REP&&REP.name?' con '+REP.name:'')+'. Solo me faltan tus datos para confirmar la reserva:');bookForm(d,tm);});
  }
  function bookForm(d,tm){
    var f=document.createElement('form');f.className='axc-m bot axc-fm';
    f.innerHTML='<input name="name" required maxlength="60" placeholder="Tu nombre" autocomplete="name">'+
      '<input name="email" type="email" required maxlength="100" placeholder="Tu email" autocomplete="email">'+
      '<input name="phone" type="tel" maxlength="25" placeholder="Teléfono (opcional)" autocomplete="tel">'+
      '<input name="hp" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">'+
      '<small>Al confirmar aceptas la <a href="privacidad.html" target="_blank">política de privacidad</a>.</small>'+
      '<button type="submit" class="axc-card cta">Confirmar reserva</button>';
    box.appendChild(f);scroll();f.name.focus();
    f.addEventListener('submit',function(e){
      e.preventDefault();if(busy)return;
      var v={rep:REP?REP.id:'admin',date:d,time:tm,name:f.name.value,email:f.email.value,phone:f.phone.value,hp:f.hp.value};
      f.querySelectorAll('input,button').forEach(function(x){x.disabled=true;});
      busy=true;var t=typing();
      fetch(AGENDA,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v)})
        .then(function(r){return r.json().then(function(j){return{s:r.status,j:j};});})
        .then(function(r){
          t.remove();busy=false;
          if(r.s===200){
            var wn=REP&&REP.name;inBook=false;SL=null;REP=null;
            bubble('bot','✅ Reunión agendada: '+labL(d)+' a las '+tm+(wn?' con '+wn:'')+' (hora de España).\nTe hemos enviado la invitación a '+v.email+' con el enlace de Google Meet. Si no la ves, mira en spam.\n¡Hablamos pronto, '+v.name.trim().split(' ')[0]+'!');
            cards([],[],true);
          }else if(r.s===409){
            SL=r.j;SLt=Date.now();
            bubble('bot','Vaya, ese hueco se acaba de ocupar. Te dejo los más cercanos:');alts(d,tm,SL);
          }else if(r.s===400){
            bubble('bot','Revisa tu nombre y tu email e inténtalo de nuevo.');f.remove();bookForm(d,tm);
          }else fail();
        }).catch(function(){t.remove();busy=false;fail();});
    });
  }
  function parseWhen(text){
    var pn=text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/de la manana/g,' AM ');
    var t0=today(),date=null,time=null,m,Y=+t0.slice(0,4);
    if(/pasado manana/.test(pn))date=addD(t0,2);
    else if(/\bmanana\b/.test(pn))date=addD(t0,1);
    else if(/\bhoy\b/.test(pn))date=t0;
    else if((m=pn.match(/\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\b/))){
      var idx=['domingo','lunes','martes','miercoles','jueves','viernes','sabado'].indexOf(m[1]);
      date=addD(t0,((idx-dt(t0).getUTCDay()+7)%7)||7);
    }else if((m=pn.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-]\d{2,4})?\b/))||(m=pn.match(/\b(\d{1,2}) de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/))){
      var mo=isNaN(m[2])?['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'].indexOf(m[2])+1:+m[2];
      var ds=Y+'-'+('0'+mo).slice(-2)+'-'+('0'+m[1]).slice(-2);
      if(mo>=1&&mo<=12&&+m[1]>=1&&+m[1]<=31)date=ds<t0?(Y+1)+ds.slice(4):ds;
    }
    var h=null,mi='00';
    if((m=pn.match(/\b(\d{1,2})[:h](\d{2})\b/))){h=+m[1];mi=m[2];}
    else if((m=pn.match(/\b(?:a las|sobre las|las)\s*(\d{1,2})(?:\s*(y media|y cuarto))?/))){h=+m[1];mi=m[2]==='y media'?'30':m[2]==='y cuarto'?'15':'00';}
    else if((m=pn.match(/\b(\d{1,2})\s*h\b/))){h=+m[1];}
    if(h!==null&&h<=23){
      if(h<12&&(/tarde|noche/.test(pn)||(h<=7&&!/ AM /.test(pn))))h+=12;
      time=('0'+h).slice(-2)+':'+mi;
    }
    return(date||time)?{date:date,time:time}:null;
  }
  function handleWhen(w){
    inBook=true;busy=true;var t=typing();
    loadTeam().then(function(tm){
      if(!REP){
        if(tm.length>=2){t.remove();busy=false;pendingWhen=w;askRep('Antes de nada, ¿con quién quieres hablar?');return;}
        REP=tm[0]||{id:'admin',name:''};SL=null;
      }
      return load().then(function(j){
        t.remove();busy=false;
        if(!w.date){days(j,'¿Qué día te viene bien?');return;}
        var list=j.slots[w.date]||[];
        if(w.time){
          if(list.indexOf(w.time)>-1){pickTime(w.date,w.time,true);return;}
          bubble('bot',(list.length?'Ese hueco no está libre. ':'Ese día no tengo huecos libres. ')+'Te propongo los más cercanos:');alts(w.date,w.time,j);return;
        }
        if(list.length){bubble('bot','Huecos libres el '+labL(w.date)+' (hora de España):');times(w.date,list);}
        else{bubble('bot','Ese día no tengo huecos libres. Te propongo los más cercanos:');alts(w.date,'17:00',j);}
      });
    }).catch(function(){t.remove();busy=false;fail();});
  }
  function reply(fn){
    busy=true;
    var t=bubble('bot');t.innerHTML='<span class="axc-dots"><span></span><span></span><span></span></span>';
    setTimeout(function(){t.remove();fn();busy=false;},550);
  }
  function menu(msg,delay){
    var go=function(){bubble('bot',msg);cards(MENU);};
    delay?reply(go):go();
  }
  function show(id,fromCard){
    if(busy)return;
    if(fromCard)bubble('user',T[id].label);
    reply(function(){
      bubble('bot',T[id].a.join('\n'));
      var acts=T[id].act||((id==='contacto'||id==='llamada')?null:[CTA_REV]);
      cards(T[id].rel,acts,true);
    });
  }
  function ask(text){
    text=(text||'').trim();if(!text||busy)return;
    inp.value='';bubble('user',text);
    var n=norm(text).trim();
    if(BYE.some(function(g){return n.indexOf(g)===0;})){
      return reply(function(){bubble('bot','¡A ti! Si quieres que miremos tu caso, pide la revisión gratuita.');cards([],[CTA_REV],true);});
    }
    var w=parseWhen(text);
    if(w&&(inBook||/llamada|llamar|reunion|cita|reservar|agendar|videollamada|hueco|disponib/.test(n)))return handleWhen(w);
    var id=find(text);
    if(id){
      return reply(function(){
        bubble('bot',T[id].a.join('\n'));
        var acts=T[id].act||((id==='contacto'||id==='llamada')?null:[CTA_REV]);
        cards(T[id].rel,acts,true);
      });
    }
    if(HI.some(function(g){return n===g||n.indexOf(g+' ')===0;})){
      return reply(function(){bubble('bot','¡Hola! ¿Sobre qué quieres saber?');cards(MENU);});
    }
    reply(function(){
      bubble('bot','No he encontrado nada con eso. Prueba con una palabra como "precio", "google", "mantenimiento" o elige un tema. Si es algo concreto de tu negocio, te respondemos en menos de 24 h.');
      cards(MENU,[CTA_REV]);
    });
  }

  function open(){
    p.classList.toggle('open');
    if(p.classList.contains('open')){
      if(!started){started=true;bubble('bot','¡Hola! Soy el asistente de AppXpand. Elige sobre qué quieres saber o escribe una palabra clave.');cards(MENU);}
      inp.focus();
    }
  }
  btn.onclick=open;
  window.axcBook=function(id){
    p.classList.add('open');
    if(!started){started=true;bubble('bot','¡Hola! Vamos a reservar tu llamada.');}
    startBooking(id||undefined);
  };
  var deep=new URLSearchParams(location.search).get('cita');
  if(deep)setTimeout(function(){window.axcBook(deep);},700);
  p.querySelector('.axc-x').onclick=function(){p.classList.remove('open');};
  form.addEventListener('submit',function(e){e.preventDefault();ask(inp.value);});
})();
