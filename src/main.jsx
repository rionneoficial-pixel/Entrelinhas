import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const HOME_PATH = import.meta.env.BASE_URL;
const ARTICLE_PATH = `${HOME_PATH}#/caso-samsa`;
const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`;
const safeGet = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
const safeSession = (key) => { try { return sessionStorage.getItem(key); } catch { return null; } };
const markSession = (key) => { try { sessionStorage.setItem(key, '1'); } catch { /* A sessão continua funcionando sem armazenamento. */ } };

function Header({ onHome, active = 'Últimas' }) {
  const categories = ['Últimas', 'Famosos', 'Política', 'Relacionamentos', 'Mistérios', 'Cultura'];
  return <header className="site-header"><div className="header-inner"><a href={HOME_PATH} className="brand" onClick={onHome}>Entrelinhas</a><nav className="nav-wrap" aria-label="Categorias"><div className="nav-inner">{categories.map(category => <span className={active === category ? 'nav-current' : ''} key={category}>{category}</span>)}</div></nav></div></header>;
}

function AdModal({ onDismiss }) {
  const dialogRef = useRef(null);
  const firstRef = useRef(null);
  const [purchased, setPurchased] = useState(false);
  const finish = () => { markSession('entrelinhas-ad-seen'); onDismiss(); };
  useEffect(() => { if (purchased) dialogRef.current?.querySelector('.ad-success h2')?.focus(); }, [purchased]);
  useEffect(() => {
    markSession('entrelinhas-ad-seen');
    const prior = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstRef.current?.focus();
    const handle = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); finish(); }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = [...dialogRef.current.querySelectorAll('button:not([disabled]),a[href]')];
        const first = focusables[0], last = focusables.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handle);
    return () => { document.removeEventListener('keydown', handle); document.body.style.overflow = oldOverflow; prior?.focus?.(); };
  }, []);
  return <div className="modal-scrim"><section className="ad-dialog" role="dialog" aria-modal="true" aria-labelledby="ad-title" ref={dialogRef}>
    <div className="ad-close-sticky"><button className="ad-close" aria-label="Fechar anúncio" onClick={finish} ref={firstRef}>×</button></div>
    {purchased ? <div className="ad-success"><div className="ad-brand">LOJA DO BRAINROT</div><div className="success-mark" aria-hidden="true">67</div><h2 id="ad-title" tabIndex="-1">Você desbloqueou o modo 67.</h2><p>Compra de mentirinha concluída. Seu saldo continua intacto e seu senso de humor foi atualizado.</p><button className="ad-cta" onClick={finish}>Voltar às fofocas</button></div> : <>
      <div className="ad-topline"><span className="fiction-tag">PUBLICIDADE FICTÍCIA</span><span className="ad-brand">LOJA DO BRAINROT</span></div>
      <div className="ad-layout"><div className="ad-copy-side">
        <div className="ad-copy"><span className="ad-eyebrow">O combo do momento</span><h2 id="ad-title">Seu drip tá<br /><em>meio NPC?</em></h2><p>Equipe o <strong>KIT 67</strong> e desbloqueie o modo protagonista.</p></div>
        <div className="product-lines"><strong>Camiseta + caneca + adesivos</strong><span>67% estilo. 0% sentido.</span><span>O combo que sua mãe não vai entender.</span></div>
        <div className="ad-price-row"><span>COMBO COMPLETO</span><strong className="price">R$ 67,00</strong></div>
        <button className="ad-cta" onClick={() => setPurchased(true)}>QUERO MEU KIT 67 <span aria-hidden="true">→</span></button>
      </div><img className="kit-image" src={asset('kit-67.png')} alt="Kit completo sobre fundo azul: camiseta clara com o número 67, caneca azul e cartela de adesivos com calculadora divertida" /></div>
      <p className="ad-footnote">Loja e produtos fictícios • Nenhuma compra real</p>
    </>}
  </section></div>;
}

const latest = [
  ['Cultura', 'Cantora cancela aparição e equipe evita explicar motivo', 'A equipe não comentou o cancelamento. Imagem de arquivo, de uma apresentação anterior.', asset('cantora-palco.png'), 'Cantora fictícia se apresenta em um palco durante um show anterior.'],
  ['Mistérios', 'Caso Samsa: ausência de Gregor e ruídos no quarto intrigam vizinhos', 'O atraso no trabalho e uma voz que ninguém reconhece alimentam perguntas no prédio.', asset('porta-samsa.png'), 'Porta entreaberta de um quarto antigo, sem mostrar quem está dentro.'],
  ['Famosos', 'Influenciadores apagam fotos juntos e fãs especulam', 'Publicações desapareceram quase ao mesmo tempo, mas nenhum dos dois se pronunciou.', asset('influenciadores.png'), 'Duas pessoas fictícias consultam os celulares sentadas à mesa de um café.'],
  ['Política', 'Jantar fora da agenda vira assunto nos corredores', 'Um encontro discreto terminou tarde e deixou os assessores com poucas explicações.', asset('jantar-politico.png'), 'Grupo de políticos fictícios conversa durante um jantar reservado.']
];
function NewsCard({ item }) {
  const [category, title, summary, image, alt] = item;
  return <article className="news-card"><img className="news-card-image" src={image} alt={alt} loading="lazy"/><span className="category category-over-image">{category}</span><h3>{title}</h3><p>{summary}</p></article>;
}
function Home({ onNavigate }) {
  return <><Header onHome={onNavigate} /><div className="ticker"><span>EM DESTAQUE</span><p>Fim do romance? saída separada reacende rumores <i>•</i> Encontro reservado movimenta os bastidores <i>•</i> Caso Samsa: ruídos no quarto seguem sem explicação</p></div><main className="page-shell home-page"><div className="section-heading"><span>O que está acontecendo</span><span className="today">EDIÇÃO DE HOJE</span></div>
    <section className="lead-grid" aria-label="Destaques"><article className="lead-main"><div className="photo-link"><img src={asset('casal-evento.png')} alt="Casal fictício deixa um evento noturno em momentos diferentes" /></div><span className="category">Relacionamentos</span><h1>Fim do romance? Casal deixa evento separado e aumenta rumores</h1><p>Os dois chegaram juntos à estreia, mas saíram por portas diferentes. Amigos próximos evitam confirmar qualquer mudança.</p></article><div className="lead-side"><article className="side-story side-story-photo"><img src={asset('corredor.png')} alt="Três profissionais conversam em um corredor institucional"/><div><span className="category">Política</span><h2>Encontro reservado entre aliados movimenta os bastidores</h2><p>Uma conversa longe dos flashes já entrou na pauta dos corredores.</p></div></article><article className="side-story side-story-photo"><img src={asset('ator-estreia.png')} alt="Ator fictício chega a uma estreia ao lado de uma convidada"/><div><span className="category">Famosos</span><h2>Ator é visto com nova companhia após estreia</h2><p>A saída discreta da sessão não passou despercebida por quem estava por perto.</p></div></article></div></section>
    <section id="ultimas" className="latest-section"><div className="section-heading"><h2>Últimas notícias</h2><span>LEIA OS DESTAQUES</span></div><div className="latest-grid">{latest.map((item, i) => i === 1 ? <article className="news-card linked-card" key={item[1]}><a href={ARTICLE_PATH} onClick={onNavigate} aria-label={`Ler matéria: ${item[1]}`}><img className="news-card-image" src={item[3]} alt={item[4]} loading="lazy"/><span className="category category-over-image">{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p><span className="read-link">Leia a matéria <span aria-hidden="true">→</span></span></a></article> : <NewsCard key={item[1]} item={item} />)}</div></section>
    <footer className="site-footer"><a className="brand footer-brand" href={HOME_PATH} onClick={onNavigate}>Entrelinhas</a><p>Notícias, cultura e o que se comenta nos bastidores.</p><small>Ficção editorial criada para um trabalho escolar.</small></footer>
  </main></>;
}

const clues = [
  ['A mudança na voz', 'Do outro lado da porta, a família percebe que a voz de Gregor soa diferente e difícil de compreender. A alteração pode ser lida como um sinal físico ou como a distância entre ele e os demais.', 'Se Gregor entende as perguntas, o que impede que os outros reconheçam sua resposta?'],
  ['A visita do gerente', 'A cobrança profissional chega ao apartamento antes que a família consiga entender a ausência. A presença do gerente mostra quanto o emprego e a dívida pesam sobre Gregor.', 'Por que Gregor se preocupa primeiro em justificar o atraso, mesmo diante de algo tão estranho?'],
  ['A reação da família', 'Quando a porta se abre, o espanto toma o lugar das explicações. O choque de quem está no quarto não esclarece o que ocorreu, mas muda a maneira como todos passam a olhar para Gregor.', 'A reação confirma uma transformação ou mostra apenas o limite do que os presentes conseguem compreender?']
];
function AudioPlayer() {
  const duration = 2.4;
  const [status, setStatus] = useState('idle');
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const ctxRef = useRef(null); const bufferRef = useRef(null); const sourceRef = useRef(null);
  const startAtRef = useRef(0); const offsetRef = useRef(0); const timerRef = useRef(null);
  const createBuffer = ctx => {
    if (bufferRef.current) return bufferRef.current;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate;
      const syllable = Math.max(Math.exp(-Math.pow((t - .32) / .22, 2)), .82 * Math.exp(-Math.pow((t - 1.02) / .2, 2)), .72 * Math.exp(-Math.pow((t - 1.78) / .34, 2)));
      const pitch = 118 - 18 * (t / duration) + 5 * Math.sin(t * 8);
      const phase = 2 * Math.PI * pitch * t;
      const voiced = Math.sin(phase) * .35 + Math.sin(phase * 2) * .2 + Math.sin(phase * 3) * .1 + Math.sin(2 * Math.PI * 710 * t) * .08;
      const breath = (Math.random() * 2 - 1) * .035;
      data[i] = (voiced + breath) * syllable;
    }
    bufferRef.current = buffer;
    return buffer;
  };
  const playFrom = async offset => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) { setError('Este navegador não permite reproduzir o áudio.'); return; }
    try {
      const ctx = ctxRef.current || (ctxRef.current = new Ctx());
      await ctx.resume();
      clearInterval(timerRef.current);
      if (sourceRef.current) { const previous = sourceRef.current; sourceRef.current = null; try { previous.stop(); } catch {} }
      const source = ctx.createBufferSource(); source.buffer = createBuffer(ctx);
      const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1100; filter.Q.value = .7;
      const gain = ctx.createGain(); gain.gain.value = .72;
      source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      sourceRef.current = source; offsetRef.current = offset; startAtRef.current = ctx.currentTime;
      source.onended = () => {
        if (sourceRef.current !== source) return;
        sourceRef.current = null; clearInterval(timerRef.current); offsetRef.current = duration; setElapsed(duration); setStatus('finished');
      };
      setElapsed(offset); setError(''); setStatus('playing');
      source.start(0, offset);
      timerRef.current = setInterval(() => {
        const time = Math.min(duration, offsetRef.current + ctx.currentTime - startAtRef.current);
        setElapsed(time);
      }, 50);
    } catch { setError('Não foi possível iniciar o áudio neste navegador.'); setStatus('idle'); }
  };
  const pause = () => {
    const ctx = ctxRef.current;
    if (!ctx || !sourceRef.current) return;
    const source = sourceRef.current;
    offsetRef.current = Math.min(duration, offsetRef.current + ctx.currentTime - startAtRef.current);
    sourceRef.current = null; clearInterval(timerRef.current);
    try { source.stop(); } catch {}
    setElapsed(offsetRef.current); setStatus('paused');
  };
  const primaryAction = () => status === 'playing' ? pause() : playFrom(status === 'paused' ? offsetRef.current : 0);
  const replay = () => playFrom(0);
  const timeLabel = value => `${Math.floor(value / 60)}:${(value % 60).toFixed(1).padStart(4, '0')}`;
  useEffect(() => () => { clearInterval(timerRef.current); try { sourceRef.current?.stop(); } catch {} ctxRef.current?.close(); }, []);
  const stateLabel = { idle: 'Pronto para ouvir', playing: 'Reproduzindo', paused: 'Pausado', finished: 'Finalizado' }[status];
  const primaryLabel = status === 'playing' ? 'Pausar' : status === 'paused' ? 'Continuar' : status === 'finished' ? 'Ouvir novamente' : 'Ouvir';
  return <section className="audio-card" aria-labelledby="audio-title"><div className="audio-icon" aria-hidden="true">♫</div><div className="audio-copy"><h3 id="audio-title">A voz atrás da porta</h3><p>Recriação fictícia · som sintetizado</p></div><div className="audio-controls"><button className="audio-button" onClick={primaryAction}>{status === 'playing' ? 'Ⅱ' : '▶'} {primaryLabel}</button><button className="audio-replay" onClick={replay}>Ouvir novamente</button></div><div className="audio-progress-row"><div className={`soundline ${status === 'playing' ? 'is-playing' : ''}`} aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><span className="audio-time">{timeLabel(elapsed)} / {timeLabel(duration)}</span></div><div className="audio-progress" role="progressbar" aria-label="Progresso do áudio" aria-valuemin="0" aria-valuemax={duration} aria-valuenow={elapsed}><span style={{width: `${elapsed / duration * 100}%`}}/></div><p className="audio-status" aria-live="polite">{stateLabel}{error && ` — ${error}`}</p></section>;
}
const options = ['Gregor passou por uma transformação.', 'A família está escondendo informações.', 'Os relatos ainda são insuficientes.'];
function Poll() {
  const [choice, setChoice] = useState(() => safeGet('samsa-poll-choice') || '');
  const [voted, setVoted] = useState(() => safeGet('samsa-poll-voted') === 'yes');
  const [message, setMessage] = useState('');
  const percentages = choice === '0' ? [52, 28, 20] : choice === '1' ? [25, 50, 25] : [23, 29, 48];
  const vote = (e) => { e.preventDefault(); if (!choice) { setMessage('Escolha uma hipótese antes de votar.'); return; } safeSet('samsa-poll-choice', choice); safeSet('samsa-poll-voted', 'yes'); setVoted(true); setMessage('Voto registrado neste navegador. Você pode alterá-lo quando quiser.'); };
  return <section className="poll-box"><div className="eyebrow">INTERPRETAÇÃO DO LEITOR</div><h2>Qual hipótese parece mais provável?</h2>{!voted ? <form onSubmit={vote}><fieldset><legend className="sr-only">Escolha uma hipótese</legend>{options.map((o,i)=><label className="poll-option" key={o}><input type="radio" name="hypothesis" value={String(i)} checked={choice===String(i)} onChange={e=>setChoice(e.target.value)} /><span>{o}</span></label>)}</fieldset><button className="wine-button">Votar</button><p className="form-message" aria-live="polite">{message}</p></form> : <><div className="poll-results">{options.map((o,i)=><div className="result-row" key={o}><div className="result-label"><span>{o}</span><strong>{percentages[i]}%</strong></div><div className="result-track"><span style={{width:`${percentages[i]}%`}}/></div></div>)}</div><p className="poll-note">Simulação local; estes percentuais são demonstrativos, não representam votos reais.</p><button className="text-button" onClick={()=>{setVoted(false); setMessage('');}}>Alterar meu voto</button></>}<p className="form-message" aria-live="polite">{message}</p></section>;
}
const seedComments = [
  {name:'Marina', text:'O mais estranho é ninguém tentar entender o que ele diz.'},
  {name:'Rafael', text:'A reação da família diz muito sobre essa história.'}
];
function Comments() {
  const [saved, setSaved] = useState(() => { try { return JSON.parse(safeGet('samsa-comments') || '[]'); } catch { return []; } });
  const [name, setName] = useState(''); const [comment, setComment] = useState(''); const [message, setMessage] = useState('');
  const submit = e => { e.preventDefault(); const n=name.trim(), c=comment.trim(); if(!n || !c){setMessage('Preencha seu nome e escreva um comentário.');return;} if(n.length>48 || c.length>500){setMessage('Use até 48 caracteres no nome e 500 no comentário.');return;} const next=[{name:n,text:c,date:new Date().toLocaleDateString('pt-BR')},...saved].slice(0,30); setSaved(next); safeSet('samsa-comments',JSON.stringify(next)); setName('');setComment('');setMessage('Comentário publicado neste dispositivo.'); };
  return <section className="comments-section"><div className="section-heading"><h2>O que você percebeu?</h2><span>CONVERSA DA REDAÇÃO</span></div><div className="comment-list">{[...saved,...seedComments].map((c,i)=><article className="comment" key={`${c.name}-${i}-${c.text}`}><div className="comment-avatar" aria-hidden="true">{c.name[0]?.toUpperCase()}</div><div><strong>{c.name}</strong>{c.date&&<time>{c.date}</time>}<p>{c.text}</p></div></article>)}</div><form className="comment-form" onSubmit={submit}><label>Seu nome<input value={name} onChange={e=>setName(e.target.value)} maxLength="48" required /></label><label>Comentário<textarea value={comment} onChange={e=>setComment(e.target.value)} maxLength="500" rows="3" required /></label><div className="form-bottom"><small>Os comentários ficam apenas neste dispositivo.</small><button className="wine-button">Publicar comentário</button></div><p className="form-message" aria-live="polite">{message}</p></form></section>;
}
function Sidebar() { return <aside className="sidebar"><section className="sidebar-box"><div className="section-heading"><h2>Mais lidas</h2></div><article className="side-link side-link-photo"><span className="rank">01</span><div><span className="category">Relacionamentos</span><h3>Fim do romance? O que se sabe sobre a saída em separado</h3><small>Há pouco</small></div><img src={asset('casal-evento.png')} alt="" loading="lazy"/></article><article className="side-link side-link-photo"><span className="rank">02</span><div><span className="category">Famosos</span><h3>Ator é visto com nova companhia após estreia</h3><small>Há pouco</small></div><img src={asset('ator-estreia.png')} alt="" loading="lazy"/></article><article className="side-link side-link-photo"><span className="rank">03</span><div><span className="category">Relacionamentos</span><h3>Influenciadores apagam fotos juntos e fãs especulam</h3><small>Há pouco</small></div><img src={asset('influenciadores.png')} alt="" loading="lazy"/></article><article className="side-link side-link-photo"><span className="rank">04</span><div><span className="category">Política</span><h3>Jantar fora da agenda vira assunto nos corredores</h3><small>Há pouco</small></div><img src={asset('jantar-politico.png')} alt="" loading="lazy"/></article><article className="side-link side-link-photo"><span className="rank">05</span><div><span className="category">Política</span><h3>Encontro reservado entre aliados movimenta os bastidores</h3><small>Há pouco</small></div><img src={asset('corredor.png')} alt="" loading="lazy"/></article><article className="side-link side-link-photo"><span className="rank">06</span><div><span className="category">Cultura</span><h3>Cantora cancela aparição e equipe evita explicar motivo</h3><small>Imagem de arquivo</small></div><img src={asset('cantora-palco.png')} alt="" loading="lazy"/></article></section></aside>; }
function Timeline() { return <section className="timeline-section"><h2>O que aconteceu naquela manhã</h2><ol className="timeline"><li><span className="timeline-dot"/><div><strong>O atraso</strong><p>Gregor não sai para trabalhar e permanece no quarto.</p></div></li><li><span className="timeline-dot"/><div><strong>A visita</strong><p>O gerente aparece no apartamento para cobrar explicações.</p></div></li><li><span className="timeline-dot"/><div><strong>A porta se abre</strong><p>A reação dos presentes deixa novas perguntas no ar.</p></div></li></ol></section>; }
function Article({ onNavigate }) {
  const [open, setOpen] = useState({});
  const topRef = useRef(null);
  return <><Header onHome={onNavigate} active="Mistérios"/><main className="page-shell article-layout" ref={topRef}><article className="article-main"><div className="breadcrumbs"><a href={HOME_PATH} onClick={onNavigate}>Início</a><span>/</span><span>Mistérios</span></div><header className="article-header"><span className="category">Mistérios</span><h1>Caso Samsa: ausência de Gregor e ruídos no quarto intrigam vizinhos</h1><p className="article-subtitle">Voz incomum, uma visita do trabalho e a porta fechada alimentam rumores sobre o jovem.</p><div className="byline"><span>Por Redação Entrelinhas</span><span className="adaptation-tag">Adaptação literária</span></div></header>
    <figure className="hero-figure"><img src={asset('porta-samsa.png')} alt="Porta entreaberta de um quarto antigo; o interior permanece na penumbra"/><figcaption>Uma porta fechada e sons incomuns mantêm o apartamento em alerta. <span>Imagem editorial</span></figcaption></figure>
    <div className="article-body"><p className="lead-paragraph">Gregor Samsa não apareceu no trabalho nesta manhã. Em casa, a demora já tinha ultrapassado o horário habitual quando a família começou a bater na porta do quarto. As respostas vieram abafadas e difíceis de entender. Em poucos minutos, o atraso deixou de ser apenas um problema de pontualidade: a voz desconhecida e a porta fechada viraram o principal assunto do apartamento.</p>
    <p>Os familiares tentaram obter uma explicação sem entrar no quarto. Do lado de dentro, Gregor respondia, mas as palavras chegavam deformadas ao corredor. O tom parecia vir de alguém que compreendia as perguntas, embora ninguém conseguisse decifrar suas respostas. A cena se repetiu diante de parentes e, mais tarde, de um representante do trabalho.</p>
    <h2>Um atraso que pesa sobre a casa</h2>
    <p>O detalhe que mais chama atenção? Mesmo sem sair do quarto, Gregor parecia preocupado com o emprego. Enquanto a família cobrava uma explicação, ouviam-se referências ao horário, à viagem a serviço e aos compromissos daquela manhã. A informação vem dos acontecimentos observados do lado de fora; ninguém tem acesso ao que ele pensa em silêncio.</p>
    <p>O trabalho não era um assunto qualquer para os Samsa. A renda de Gregor ajudava a sustentar a casa e a pagar dívidas assumidas pela família. Por isso, sua ausência tinha consequências imediatas: cada minuto sem resposta aumentava a preocupação com o emprego e com as contas. A porta fechada mantinha os familiares sem notícia justamente quando mais precisavam de uma explicação.</p>
    <h2>A voz muda o rumo da manhã</h2>
    <p>Quando Gregor tentou falar com mais clareza, a família continuou sem compreender o que dizia. O gerente, que chegou ao apartamento para cobrar a falta no serviço, também ouviu a voz alterada. Até aquele momento, os presentes ainda podiam tratar a situação como um atraso ou um mal-estar. A tentativa de comunicação mudou o clima: já não parecia haver uma justificativa simples.</p>
    <AudioPlayer/>
    <p>Do corredor vinham perguntas; do quarto, respostas que não convenciam quem as escutava. A família não sabia se Gregor estava doente, se precisava de ajuda ou se tentava evitar a conversa. O gerente aguardava uma explicação profissional, mas o assunto rapidamente ultrapassou o expediente. Ninguém ali parecia saber como conduzir a situação.</p>
    <h2>O gerente também espera do lado de fora</h2>
    <p>A visita tornou pública uma tensão que até então pertencia à família. O gerente foi até o apartamento porque Gregor não havia comparecido ao trabalho e não dera notícias. Em vez de uma conversa direta, encontrou uma porta fechada, parentes inquietos e uma voz que mal conseguia reconhecer. Sua presença aumentou o constrangimento: a ausência agora podia custar o emprego de quem mantinha parte do sustento da casa.</p>
    <Timeline/>
    <p>Os familiares insistiram para que a porta se abrisse. O gerente também aguardava, sem conseguir confirmar o que estava acontecendo lá dentro. A demora transformou cada ruído em pista e cada pausa em mais uma dúvida. Até então, nenhum dos relatos esclarecia se Gregor responderia, sairia do quarto ou precisaria de ajuda.</p>
    <h2>Uma forma vista por poucos segundos</h2>
    <p>Quando a porta finalmente se abriu, a reação dos presentes foi de espanto. A família e o gerente se depararam com uma aparência que não esperavam. Gregor estava transformado; a mudança era visível para quem entrou no quarto, mas não veio acompanhada de uma explicação que pudesse ser repetida com segurança no corredor.</p>
    <p>Uma versão não confirmada, criada para esta adaptação e atribuída a alguém que teria passado pelo corredor, descreve por poucos segundos uma silhueta baixa, de contorno irregular e vários pontos de apoio junto à cama. O suposto observador não identificou o que viu, e ninguém confirmou essa descrição. O relato não é uma citação do livro nem prova independente: é mais um boato que circula depois da abertura da porta.</p>
    <p>O que se sabe nesta manhã é mais limitado. Gregor faltou ao serviço, não conseguiu se fazer entender, recebeu a visita do gerente e surpreendeu a família ao aparecer. A mudança de aparência alimenta a hipótese de uma transformação, enquanto a situação financeira dos Samsa torna cada consequência mais urgente. O que aconteceu dentro do quarto continua sem uma versão aceita por todos.</p>
    <section className="clues-section"><div className="eyebrow">LEITURA EM CAMADAS</div><h2>Os indícios do caso</h2><p className="section-intro">Abra cada pista e compare o que a cena mostra com o que ainda deixa em aberto.</p>{clues.map(([title, explanation, question],i)=><div className={`clue ${open[i]?'is-open':''}`} key={title}><h3><button aria-expanded={Boolean(open[i])} aria-controls={`clue-${i}`} onClick={()=>setOpen(v=>({...v,[i]:!v[i]}))}><span>{title}</span><span className="clue-toggle" aria-hidden="true">{open[i]?'−':'+'}</span></button></h3><div className="clue-content" id={`clue-${i}`} hidden={!open[i]}><p>{explanation}</p><p className="interpretive-question"><strong>Para pensar:</strong> {question}</p></div></div>)}</section>
    <Poll/><Comments/>
    <div className="editorial-note">Esta publicação é uma adaptação criativa de <em>A metamorfose</em>, de Franz Kafka, realizada para um trabalho escolar. Os relatos jornalísticos, o observador externo, a propaganda, o áudio e os comentários iniciais são recursos fictícios do trabalho; não são citações do livro.</div>
    </div><div className="article-end"><a href={HOME_PATH} onClick={onNavigate}>← Voltar à página inicial</a><button className="back-top" onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>Voltar ao topo ↑</button></div></article><Sidebar/></main><footer className="site-footer article-footer"><a className="brand footer-brand" href={HOME_PATH} onClick={onNavigate}>Entrelinhas</a><p>Notícias, cultura e o que se comenta nos bastidores.</p><small>Adaptação literária para fins escolares.</small></footer></>;
}
function App() {
  const [path, setPath] = useState(() => window.location.hash === '#/caso-samsa' ? ARTICLE_PATH : HOME_PATH);
  const [showAd, setShowAd] = useState(() => !safeSession('entrelinhas-ad-seen'));
  useEffect(()=>{ const syncRoute=()=>setPath(window.location.hash === '#/caso-samsa' ? ARTICLE_PATH : HOME_PATH); window.addEventListener('popstate',syncRoute); window.addEventListener('hashchange',syncRoute); return()=>{window.removeEventListener('popstate',syncRoute);window.removeEventListener('hashchange',syncRoute);};},[]);
  const navigate=(e)=>{ if(e && (e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)) return; if(e?.preventDefault) e.preventDefault(); const href=e?.currentTarget?.getAttribute('href')||HOME_PATH; history.pushState({},'',href); setPath(window.location.hash === '#/caso-samsa' ? ARTICLE_PATH : HOME_PATH); window.scrollTo(0,0); };
  const isArticle=path===ARTICLE_PATH;
  return <>{isArticle?<Article onNavigate={navigate}/>:<Home onNavigate={navigate}/ >}{showAd&&<AdModal onDismiss={()=>setShowAd(false)}/>}</>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
