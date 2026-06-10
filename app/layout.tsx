import './globals.css'

export const metadata = {
  title: 'XAUUSD — Celestial Terminal',
  description: 'Real-time XAUUSD predictions with 15-min horizon · Mechanical Watch System',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  // Anime.js-style mechanical gear system using Canvas
  // Runs after DOM is ready
  window.addEventListener('DOMContentLoaded', function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'gear-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;width:100%;height:100%;';
    document.body.insertBefore(canvas, document.body.firstChild);

    var ctx = canvas.getContext('2d');
    var W, H, dpr;
    var raf;

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

    // Gear definition
    function makeGear(cx, cy, outerR, innerR, teeth, speed, dir, strokeColor, fillColor) {
      return { cx, cy, outerR, innerR, teeth, speed, dir, strokeColor, fillColor, angle: Math.random() * Math.PI * 2 };
    }

    var gears = [
      // Top-left cluster
      makeGear(120, 130, 105, 82, 16, 0.0045,  1, 'rgba(86,143,135,0.32)', 'rgba(86,143,135,0.06)'),
      makeGear(275, 125,  64, 50, 12, 0.0072, -1, 'rgba(245,186,187,0.28)', 'rgba(245,186,187,0.05)'),
      makeGear(380, 135,  42, 32,  9, 0.011,   1, 'rgba(6,66,50,0.22)', 'rgba(6,66,50,0.04)'),
      // Top-right cluster
      makeGear(W - 130, 150, 120, 95, 18, 0.0038, -1, 'rgba(6,66,50,0.22)', 'rgba(6,66,50,0.04)'),
      makeGear(W - 268, 148,  72, 56, 12, 0.0065,  1, 'rgba(86,143,135,0.28)', 'rgba(86,143,135,0.05)'),
      // Bottom-center
      makeGear(W * 0.5, H - 90, 150, 120, 22, 0.003,   1, 'rgba(86,143,135,0.18)', 'rgba(86,143,135,0.03)'),
      makeGear(W * 0.5 + 268, H - 85, 90, 70, 14, 0.0048, -1, 'rgba(245,186,187,0.24)', 'rgba(245,186,187,0.04)'),
      // Bottom-left
      makeGear(65, H - 80, 58, 44, 10, 0.008,   1, 'rgba(6,66,50,0.20)', 'rgba(6,66,50,0.04)'),
      // Mid-right accent
      makeGear(W - 45, H * 0.5, 55, 42, 10, 0.006,  -1, 'rgba(86,143,135,0.22)', 'rgba(86,143,135,0.04)'),
    ];

    function drawGear(g) {
      var cx = g.cx, cy = g.cy, R = g.outerR, r = g.innerR, n = g.teeth, a = g.angle;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);

      // Tooth path
      ctx.beginPath();
      var step = (Math.PI * 2) / n;
      for (var i = 0; i < n; i++) {
        var a0 = i * step - step * 0.4;
        var a1 = i * step - step * 0.15;
        var a2 = i * step + step * 0.15;
        var a3 = i * step + step * 0.4;
        if (i === 0) ctx.moveTo(r * Math.cos(a0), r * Math.sin(a0));
        else ctx.lineTo(r * Math.cos(a0), r * Math.sin(a0));
        ctx.lineTo(R * Math.cos(a1), R * Math.sin(a1));
        ctx.lineTo(R * Math.cos(a2), R * Math.sin(a2));
        ctx.lineTo(r * Math.cos(a3), r * Math.sin(a3));
      }
      ctx.closePath();
      ctx.fillStyle = g.fillColor;
      ctx.fill();
      ctx.strokeStyle = g.strokeColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Inner circle
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.68, 0, Math.PI * 2);
      ctx.strokeStyle = g.strokeColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Hub
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = g.strokeColor;
      ctx.fill();

      // Spoke lines
      ctx.strokeStyle = g.strokeColor;
      ctx.lineWidth = 0.7;
      for (var s = 0; s < 6; s++) {
        var sa = s * Math.PI / 3;
        ctx.beginPath();
        ctx.moveTo(r * 0.2 * Math.cos(sa), r * 0.2 * Math.sin(sa));
        ctx.lineTo(r * 0.65 * Math.cos(sa), r * 0.65 * Math.sin(sa));
        ctx.stroke();
      }

      ctx.restore();
    }

    // Connecting rod between top-left pair
    function drawRod(g1, g2) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(g1.cx, g1.cy);
      ctx.lineTo(g2.cx, g2.cy);
      ctx.strokeStyle = 'rgba(86,143,135,0.12)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Pendulum
    var pendulum = { angle: -0.15, velocity: 0, length: 80, cx: W * 0.5, top: 0 };
    var pendulumGravity = 0.0012, pendulumDamping = 0.9996;

    function updatePendulum() {
      pendulum.velocity -= pendulumGravity * Math.sin(pendulum.angle);
      pendulum.velocity *= pendulumDamping;
      pendulum.angle += pendulum.velocity;
    }

    function drawPendulum() {
      var px = pendulum.cx + Math.sin(pendulum.angle) * pendulum.length;
      var py = pendulum.top + Math.cos(pendulum.angle) * pendulum.length;
      ctx.save();
      // Rod
      ctx.beginPath();
      ctx.moveTo(pendulum.cx, pendulum.top);
      ctx.lineTo(px, py);
      ctx.strokeStyle = 'rgba(86,143,135,0.20)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // Bob
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245,186,187,0.45)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(86,143,135,0.30)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    var then = performance.now();

    function loop(now) {
      raf = requestAnimationFrame(loop);
      var dt = (now - then);
      then = now;
      if (dt > 100) dt = 100; // cap on tab switch

      ctx.clearRect(0, 0, W, H);

      // Update gear angles
      for (var i = 0; i < gears.length; i++) {
        gears[i].angle += gears[i].speed * gears[i].dir * dt * 0.05;
      }

      updatePendulum();

      // Draw connecting rods first
      drawRod(gears[0], gears[1]);
      drawRod(gears[1], gears[2]);
      drawRod(gears[3], gears[4]);
      drawRod(gears[5], gears[6]);

      // Draw gears
      for (var j = 0; j < gears.length; j++) drawGear(gears[j]);

      // Draw pendulum at bottom-center gear
      pendulum.cx = gears[5].cx;
      pendulum.top = gears[5].cy - gears[5].innerR;
      drawPendulum();

      // Subtle tick-mark arcs (watch face style)
      ctx.save();
      ctx.strokeStyle = 'rgba(86,143,135,0.12)';
      ctx.lineWidth = 0.8;
      for (var t = 0; t < 12; t++) {
        var ta = (t / 12) * Math.PI * 2;
        var tx = gears[5].cx + Math.cos(ta) * (gears[5].outerR + 15);
        var ty = gears[5].cy + Math.sin(ta) * (gears[5].outerR + 15);
        ctx.beginPath();
        ctx.arc(tx, ty, 2, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    loop(performance.now());

    // Cleanup
    window.addEventListener('beforeunload', function() {
      cancelAnimationFrame(raf);
    });
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
