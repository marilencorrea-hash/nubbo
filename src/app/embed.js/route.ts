// Snippet de inserción: <script src=".../embed.js" data-width="100%"></script>. Crea un iframe aislado (no toca los estilos del host).
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const js = `(function(){
var s=document.currentScript;if(!s)return;
var f=document.createElement('iframe');
f.src='${origin}/embed';f.title='Calculadora de viabilidad hipotecaria';
f.setAttribute('loading','lazy');
f.style.cssText='width:'+(s.getAttribute('data-width')||'100%')+';max-width:720px;height:640px;border:0;display:block;background:transparent;color-scheme:light';
s.parentNode.insertBefore(f,s);
window.addEventListener('message',function(e){
if(e.source!==f.contentWindow||!e.data||e.data.type!=='mortgage-embed:height')return;
f.style.height=Math.ceil(e.data.height)+'px';});
})();`;
  return new Response(js, { headers: { 'content-type': 'application/javascript; charset=utf-8', 'cache-control': 'public, max-age=300', 'access-control-allow-origin': '*' } });
}
