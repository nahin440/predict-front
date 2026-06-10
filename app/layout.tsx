import './globals.css'

export const metadata = {
  title: 'XAUUSD — Apex Terminal',
  description: 'Real-time XAUUSD predictions · 15-min horizon · ML-powered',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Anime.js v3 from CDN */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js" async />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  window.addEventListener('DOMContentLoaded', function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'gear-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1;width:100%;height:100%;';
    document.body.insertBefore(canvas, document.body.firstChild);

    var ctx = canvas.getContext('2d');
    var W, H, dpr, raf;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function hexagon(cx, cy, r, rotation) {
      ctx.beginPath();
      for (var i = 0; i < 6; i++) {
        var a = rotation + (i * Math.PI * 2) / 6;
        var x = cx + r * Math.cos(a);
        var y = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    // Grid of subtle hexagons in background
    var hexGrid = [];
    var hexR = 28;
    var hexW = hexR * 2;
    var hexH = Math.sqrt(3) * hexR;
    var cols = Math.ceil(W / hexW) + 2;
    var rows = Math.ceil(H / hexH) + 2;
    for (var row = -1; row < rows; row++) {
      for (var col = -1; col < cols; col++) {
        var hx = col * hexW * 0.75;
        var hy = row * hexH + (col % 2 === 0 ? 0 : hexH * 0.5);
        hexGrid.push({ x: hx, y: hy, phase: Math.random() * Math.PI * 2 });
      }
    }

    // Grid lines (circuit board style)
    function drawCircuitGrid() {
      ctx.save();
      ctx.strokeStyle = 'rgba(0,198,215,0.028)';
      ctx.lineWidth = 0.5;
      var spacing = 48;
      for (var x = 0; x < W; x += spacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (var y = 0; y < H; y += spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.restore();
    }

    // Moving data particles
    var particles = [];
    for (var p = 0; p < 18; p++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.35 + 0.05,
        color: Math.random() > 0.6 ? '245,166,35' : '0,198,215',
      });
    }

    // Corner ornament circles
    var ornaments = [
      { cx: 0,   cy: 0,   r: 120, speed: 0.0006,  dir: 1,  color: 'rgba(0,198,215,0.04)' },
      { cx: W,   cy: 0,   r: 90,  speed: 0.0009,  dir: -1, color: 'rgba(245,166,35,0.03)' },
      { cx: 0,   cy: H,   r: 80,  speed: 0.0007,  dir: 1,  color: 'rgba(0,198,215,0.03)' },
      { cx: W,   cy: H,   r: 140, speed: 0.0005,  dir: -1, color: 'rgba(245,166,35,0.04)' },
      { cx: W/2, cy: H/2, r: 200, speed: 0.0003,  dir: 1,  color: 'rgba(0,198,215,0.02)' },
    ];
    ornaments.forEach(function(o) { o.angle = Math.random() * Math.PI * 2; });

    function drawOrnament(o) {
      ctx.save();
      ctx.translate(o.cx, o.cy);
      ctx.rotate(o.angle);
      // Dashed ring
      ctx.beginPath();
      ctx.arc(0, 0, o.r, 0, Math.PI * 2);
      ctx.strokeStyle = o.color;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 12]);
      ctx.stroke();
      ctx.setLineDash([]);
      // Tick marks
      ctx.strokeStyle = o.color.replace(')', ', 1.5)').replace('rgba(', 'rgba(');
      ctx.lineWidth = 1;
      for (var t = 0; t < 8; t++) {
        var ta = (t / 8) * Math.PI * 2;
        var tx1 = (o.r - 5) * Math.cos(ta);
        var ty1 = (o.r - 5) * Math.sin(ta);
        var tx2 = (o.r + 5) * Math.cos(ta);
        var ty2 = (o.r + 5) * Math.sin(ta);
        ctx.beginPath(); ctx.moveTo(tx1, ty1); ctx.lineTo(tx2, ty2); ctx.stroke();
      }
      ctx.restore();
    }

    var then = performance.now();

    function loop(now) {
      raf = requestAnimationFrame(loop);
      var dt = Math.min(now - then, 100);
      then = now;

      ctx.clearRect(0, 0, W, H);

      drawCircuitGrid();

      // Update + draw ornaments
      ornaments.forEach(function(o) {
        o.angle += o.speed * o.dir * dt;
        drawOrnament(o);
      });

      // Update + draw particles
      particles.forEach(function(p) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
        ctx.fill();
      });

      // Connect nearby particles with lines
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            var alpha = (1 - dist / 120) * 0.08;
            ctx.strokeStyle = 'rgba(0,198,215,' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    loop(performance.now());

    window.addEventListener('beforeunload', function() {
      cancelAnimationFrame(raf);
    });

    // ── Anime.js entrance animations (fire after short delay) ──
    function tryAnime() {
      if (!window.anime) { setTimeout(tryAnime, 100); return; }
      // Stagger cards
      anime({
        targets: '.info-box, .trade-plan, .history-table, .signal-card',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(60, { start: 200 }),
        duration: 600,
        easing: 'easeOutExpo',
      });
      // Shimmer the top border of signal card
      anime({
        targets: '.signal-card::before',
        backgroundPositionX: ['0%', '200%'],
        duration: 3000,
        loop: true,
        easing: 'linear',
      });
    }
    tryAnime();
  });
})();
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
