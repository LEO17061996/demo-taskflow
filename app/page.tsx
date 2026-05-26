"use client";
import { useState, useEffect } from "react";

/* ─── Geometric shape data (deterministic, no Math.random) ─── */
const SHAPES = [
  { type: "square", top: 8,  left: 6,  size: 28, dur: 14, delay: 0   },
  { type: "circle", top: 15, left: 78, size: 18, dur: 18, delay: 2   },
  { type: "tri",    top: 30, left: 15, size: 22, dur: 16, delay: 5   },
  { type: "square", top: 55, left: 88, size: 14, dur: 20, delay: 1   },
  { type: "circle", top: 70, left: 5,  size: 32, dur: 12, delay: 7   },
  { type: "tri",    top: 20, left: 50, size: 16, dur: 22, delay: 3.5 },
  { type: "square", top: 80, left: 60, size: 20, dur: 17, delay: 9   },
  { type: "circle", top: 45, left: 92, size: 12, dur: 15, delay: 4   },
];

function GeoShapes() {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {SHAPES.map((s, i) => {
        const base: React.CSSProperties = {
          position: "absolute",
          top: `${s.top}%`,
          left: `${s.left}%`,
          width: s.size,
          height: s.size,
          opacity: 0.08,
          animation: `geo-drift ${s.dur}s ${s.delay}s infinite ease-in-out`,
        };
        if (s.type === "square") return (
          <div key={i} style={{ ...base, border: "2px solid rgba(255,255,255,0.9)", borderRadius: 4 }} />
        );
        if (s.type === "circle") return (
          <div key={i} style={{ ...base, border: "2px solid rgba(255,255,255,0.9)", borderRadius: "50%" }} />
        );
        // triangle
        return (
          <div key={i} style={{
            position: "absolute", top: `${s.top}%`, left: `${s.left}%`,
            width: 0, height: 0, opacity: 0.08,
            borderLeft: `${s.size / 2}px solid transparent`,
            borderRight: `${s.size / 2}px solid transparent`,
            borderBottom: `${s.size}px solid rgba(255,255,255,0.7)`,
            animation: `geo-float ${s.dur}s ${s.delay}s infinite ease-in-out`,
          }} />
        );
      })}
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "background 0.4s, box-shadow 0.4s",
      background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      boxShadow: scrolled ? "0 1px 24px rgba(55,48,163,0.08)" : "none",
      borderBottom: scrolled ? "1px solid rgba(55,48,163,0.08)" : "none",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #4F46E5, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white"/>
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            fontSize: 18, fontWeight: 700,
            color: scrolled ? "var(--indigo-mid)" : "#fff",
            transition: "color 0.3s",
          }}>
            TaskFlow
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 32 }}>
          {[["Tính năng", "#features"], ["Cách hoạt động", "#how-it-works"], ["Bảng giá", "#pricing"]].map(([label, href]) => (
            <a key={href} href={href} style={{
              fontSize: 14, fontWeight: 500,
              color: scrolled ? "var(--text-mid)" : "rgba(255,255,255,0.85)",
              textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = scrolled ? "var(--indigo)" : "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "var(--text-mid)" : "rgba(255,255,255,0.85)")}
            >{label}</a>
          ))}
          <a href="/dashboard?key=admin123" style={{
            fontSize: 14, fontWeight: 500,
            color: scrolled ? "var(--text-mid)" : "rgba(255,255,255,0.85)",
            textDecoration: "none", transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = scrolled ? "var(--indigo)" : "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "var(--text-mid)" : "rgba(255,255,255,0.85)")}
          >Dashboard</a>
          <a href="#pricing" style={{
            padding: "9px 22px", borderRadius: 8,
            background: scrolled ? "var(--indigo)" : "rgba(255,255,255,0.15)",
            border: scrolled ? "none" : "1px solid rgba(255,255,255,0.4)",
            backdropFilter: "blur(8px)",
            fontSize: 14, fontWeight: 600,
            color: "#fff", textDecoration: "none",
            transition: "background 0.3s, opacity 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >Dùng thử miễn phí</a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(v => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", color: scrolled ? "var(--text-mid)" : "#fff", padding: 8 }}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
            {menuOpen
              ? <path strokeLinecap="round" d="M4 4 L18 18 M18 4 L4 18" />
              : <><line x1="3" y1="7" x2="21" y2="7" strokeLinecap="round"/><line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round"/><line x1="3" y1="17" x2="21" y2="17" strokeLinecap="round"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid var(--border-light)" }}>
          {[["Tính năng", "#features"], ["Cách hoạt động", "#how-it-works"], ["Bảng giá", "#pricing"], ["Dashboard", "/dashboard?key=admin123"]].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{ fontSize: 14, fontWeight: 500, color: "var(--text-mid)", textDecoration: "none" }}>{label}</a>
          ))}
          <a href="#pricing" onClick={() => setMenuOpen(false)} style={{ padding: "11px", borderRadius: 8, background: "var(--indigo)", fontSize: 14, fontWeight: 600, textAlign: "center", color: "#fff", textDecoration: "none" }}>Dùng thử miễn phí</a>
        </div>
      )}
    </nav>
  );
}

/* ─── Feature card ─── */
function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="feature-card" style={{ background: "white", borderRadius: 16, padding: "28px 24px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--indigo-pale)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 16, fontWeight: 700, color: "var(--text-dark)", marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, var(--indigo-deep) 0%, var(--indigo-mid) 50%, #312E81 100%)",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        paddingTop: 68,
      }}>
        <GeoShapes />

        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "20%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "rgba(99,102,241,0.15)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "rgba(217,119,6,0.08)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 680 }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 99, background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.20)", marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber-light)", display: "block" }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.88)" }}>Mới: Tích hợp thông báo Zalo OA</span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 800, lineHeight: 1.15,
              color: "#fff", marginBottom: 24,
            }}>
              Quản Lý Đơn Dịch Vụ<br />
              <span style={{ color: "var(--amber-light)" }}>Thông Minh</span> & Hiệu Quả
            </h1>

            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
              Tự động hóa quy trình nhận đơn, phân công nhân viên và báo cáo doanh thu — giúp doanh nghiệp dịch vụ tiết kiệm <strong style={{ color: "#fff" }}>2–3 giờ</strong> mỗi ngày.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#pricing" style={{
                padding: "14px 32px", borderRadius: 10,
                background: "linear-gradient(135deg, var(--amber), var(--amber-light))",
                fontSize: 15, fontWeight: 700, color: "var(--indigo-deep)",
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(217,119,6,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(217,119,6,0.45)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(217,119,6,0.35)"; }}
              >Dùng thử miễn phí 14 ngày</a>

              <a href="/dashboard?key=admin123" style={{
                padding: "14px 28px", borderRadius: 10,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.25)",
                fontSize: 15, fontWeight: 600, color: "#fff",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)")}
              >
                Xem Demo Dashboard →
              </a>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 40 }}>
              <div style={{ display: "flex" }}>
                {["#C084FC", "#60A5FA", "#34D399", "#F472B6"].map((c, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: "2px solid rgba(30,27,75,0.8)", marginLeft: i > 0 ? -10 : 0 }} />
                ))}
              </div>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>
                <strong style={{ color: "#fff" }}>500+</strong> doanh nghiệp đang dùng TaskFlow
              </span>
            </div>
          </div>

          {/* Dashboard preview card */}
          <div className="hidden md:block" style={{
            position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)",
            width: 400, background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20,
            padding: 20, boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
              <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>taskflow.app/dashboard</span>
            </div>
            {/* Mini KPI */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[["128", "Đơn hàng", "#6366F1"], ["32", "Đang làm", "#F59E0B"], ["94%", "Đúng hạn", "#10B981"], ["45.2M", "Doanh thu", "#8B5CF6"]].map(([val, label, color]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "var(--font-jakarta)" }}>{val}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
            {/* Mini bar chart */}
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Đơn hàng 7 ngày qua</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 50 }}>
                {[55, 80, 45, 90, 65, 100, 72].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0", background: i === 5 ? "var(--amber-light)" : "rgba(99,102,241,0.7)" }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => (
                  <span key={d} style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "white", borderBottom: "1px solid var(--border-light)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
            {[
              ["500+", "Doanh nghiệp tin dùng"],
              ["50,000+", "Đơn xử lý mỗi tháng"],
              ["98%", "Khách hàng hài lòng"],
              ["15 phút", "Tiết kiệm mỗi đơn"],
            ].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center", padding: "16px 24px" }}>
                <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 36, fontWeight: 800, color: "var(--indigo)", marginBottom: 4 }}>{num}</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ display: "inline-block", padding: "5px 16px", borderRadius: 99, background: "var(--indigo-pale)", color: "var(--indigo)", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Tính Năng</span>
            <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text-dark)", marginBottom: 16 }}>Mọi thứ bạn cần để vận hành trơn tru</h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)", maxWidth: 540, margin: "0 auto" }}>Từ tiếp nhận đơn đến nghiệm thu — tất cả trong một nền tảng duy nhất.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <FeatureCard icon="📋" title="Quản lý đơn hàng" desc="Tiếp nhận, theo dõi và cập nhật trạng thái đơn dịch vụ real-time. Lịch sử đầy đủ, không bỏ sót đơn nào." />
            <FeatureCard icon="👥" title="Phân công nhân viên" desc="Tự động đề xuất nhân viên phù hợp theo kỹ năng và lịch rảnh. Giảm thời gian điều phối xuống 80%." />
            <FeatureCard icon="📅" title="Lịch làm việc thông minh" desc="Xem lịch tuần/tháng toàn đội. Kéo thả để sắp xếp lại, phát hiện xung đột tự động." />
            <FeatureCard icon="📊" title="Báo cáo & thống kê" desc="Dashboard real-time: doanh thu, tỷ lệ hoàn thành, hiệu suất nhân viên, xu hướng theo tháng." />
            <FeatureCard icon="🔔" title="Thông báo tự động" desc="Gửi SMS/Zalo cho khách khi đơn được xác nhận, đang thực hiện và hoàn thành. 100% tự động." />
            <FeatureCard icon="👤" title="Quản lý khách hàng" desc="Lưu thông tin, lịch sử dịch vụ, ghi chú ưu tiên và điểm tích lũy của từng khách hàng." />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: "var(--indigo-pale)", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ display: "inline-block", padding: "5px 16px", borderRadius: 99, background: "white", color: "var(--indigo)", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Quy trình</span>
            <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text-dark)", marginBottom: 16 }}>Chỉ 3 bước để bắt đầu</h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)" }}>Đơn giản, nhanh chóng, không cần đào tạo nhiều.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32, maxWidth: 900, margin: "0 auto" }}>
            {[
              { step: "01", icon: "✏️", title: "Tạo đơn dịch vụ", desc: "Nhân viên lễ tân hoặc khách hàng tạo đơn trong vài giây. Hệ thống tự điền thông tin quen thuộc." },
              { step: "02", icon: "⚡", title: "Phân công & xác nhận", desc: "AI đề xuất nhân viên phù hợp nhất. Quản lý 1 click xác nhận — nhân viên nhận thông báo ngay." },
              { step: "03", icon: "✅", title: "Hoàn thành & báo cáo", desc: "Cập nhật tiến độ, chụp ảnh nghiệm thu, thu tiền. Doanh thu tự động ghi vào báo cáo cuối ngày." },
            ].map(({ step, icon, title, desc }, i) => (
              <div key={i} style={{ background: "white", borderRadius: 20, padding: "36px 28px", position: "relative", boxShadow: "0 4px 20px rgba(55,48,163,0.06)" }}>
                <div style={{ position: "absolute", top: 20, right: 24, fontFamily: "var(--font-jakarta)", fontSize: 48, fontWeight: 800, color: "rgba(79,70,229,0.06)", lineHeight: 1 }}>{step}</div>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontFamily: "var(--font-jakarta)", fontSize: 18, fontWeight: 700, color: "var(--text-dark)", marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ display: "inline-block", padding: "5px 16px", borderRadius: 99, background: "var(--indigo-pale)", color: "var(--indigo)", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Bảng Giá</span>
            <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text-dark)", marginBottom: 16 }}>Minh bạch, không ẩn phí</h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)" }}>Bắt đầu miễn phí 14 ngày. Không cần thẻ tín dụng.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
            {/* Starter */}
            <div className="pricing-card" style={{ background: "white", borderRadius: 20, padding: "36px 28px", border: "1px solid var(--border-light)" }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Cơ Bản</div>
                <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 40, fontWeight: 800, color: "var(--text-dark)" }}>299k <span style={{ fontSize: 16, fontWeight: 400, color: "var(--text-muted)" }}>/tháng</span></div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Phù hợp cho cơ sở nhỏ 1-3 nhân viên</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {["Tối đa 100 đơn/tháng", "3 tài khoản nhân viên", "Quản lý đơn hàng cơ bản", "Báo cáo tuần", "Hỗ trợ email"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-mid)" }}>
                    <span style={{ color: "var(--success)", fontSize: 16 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <a href="#" style={{ display: "block", padding: "12px", borderRadius: 10, border: "2px solid var(--indigo)", textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--indigo)", textDecoration: "none", transition: "background 0.2s, color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--indigo)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--indigo)"; }}
              >Bắt đầu miễn phí</a>
            </div>

            {/* Pro — featured */}
            <div className="pricing-card" style={{ background: "linear-gradient(160deg, var(--indigo-mid) 0%, var(--indigo-deep) 100%)", borderRadius: 20, padding: "36px 28px", position: "relative", overflow: "hidden", boxShadow: "0 20px 50px rgba(55,48,163,0.30)" }}>
              <div style={{ position: "absolute", top: 20, right: 20, padding: "4px 12px", borderRadius: 99, background: "var(--amber)", fontSize: 11, fontWeight: 700, color: "white" }}>PHỔ BIẾN NHẤT</div>
              <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.2)", transform: "translate(50%,-50%)", pointerEvents: "none" }} />
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Chuyên Nghiệp</div>
                <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 40, fontWeight: 800, color: "#fff" }}>699k <span style={{ fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>/tháng</span></div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Phù hợp cho chuỗi 5-15 nhân viên</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {["Không giới hạn đơn hàng", "15 tài khoản nhân viên", "Phân công tự động AI", "Báo cáo real-time", "Thông báo Zalo OA", "Hỗ trợ 24/7 qua chat"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                    <span style={{ color: "var(--amber-light)", fontSize: 16 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <a href="#" style={{ display: "block", padding: "12px", borderRadius: 10, background: "linear-gradient(135deg, var(--amber), var(--amber-light))", textAlign: "center", fontSize: 14, fontWeight: 700, color: "var(--indigo-deep)", textDecoration: "none", transition: "opacity 0.2s", boxShadow: "0 4px 16px rgba(217,119,6,0.35)" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >Dùng thử 14 ngày miễn phí</a>
            </div>

            {/* Enterprise */}
            <div className="pricing-card" style={{ background: "white", borderRadius: 20, padding: "36px 28px", border: "1px solid var(--border-light)" }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Doanh Nghiệp</div>
                <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 40, fontWeight: 800, color: "var(--text-dark)" }}>Liên hệ</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Cho chuỗi lớn 15+ nhân viên, nhiều chi nhánh</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {["Không giới hạn mọi thứ", "API tích hợp hệ thống", "Quản lý đa chi nhánh", "Báo cáo tùy chỉnh", "Dedicated support", "Đào tạo onboarding"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-mid)" }}>
                    <span style={{ color: "var(--indigo)", fontSize: 16 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <a href="#" style={{ display: "block", padding: "12px", borderRadius: 10, border: "2px solid var(--border-light)", background: "var(--bg)", textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--text-mid)", textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--indigo)"; (e.currentTarget as HTMLElement).style.color = "var(--indigo)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)"; (e.currentTarget as HTMLElement).style.color = "var(--text-mid)"; }}
              >Liên hệ tư vấn</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: "white", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ display: "inline-block", padding: "5px 16px", borderRadius: 99, background: "var(--indigo-pale)", color: "var(--indigo)", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Khách Hàng</span>
            <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text-dark)" }}>Doanh nghiệp nói gì về TaskFlow?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { name: "Chị Lan Anh", role: "Chủ chuỗi salon tóc Hà Nội", avatar: "#8B5CF6", quote: "Trước đây mình dùng sổ tay, hay quên đơn lắm. Sau khi dùng TaskFlow, tỷ lệ đơn trễ giảm từ 30% xuống còn dưới 5%. Nhân viên cũng ít nhầm lịch hơn nhiều." },
              { name: "Anh Minh Tuấn", role: "Giám đốc chuỗi sửa chữa điện lạnh", avatar: "#3B82F6", quote: "Phần phân công kỹ thuật viên theo kỹ năng là killer feature của TaskFlow. Tiết kiệm được gần 2 tiếng/ngày cho tôi so với điều phối thủ công trước đây." },
              { name: "Chị Thu Hà", role: "Chủ spa & massage 3 chi nhánh", avatar: "#EC4899", quote: "Báo cáo real-time giúp tôi biết ngay chi nhánh nào đang dưới target để can thiệp kịp thời. Doanh thu tháng tăng 22% sau 2 tháng dùng TaskFlow." },
            ].map(({ name, role, avatar, quote }) => (
              <div key={name} style={{ background: "var(--bg)", borderRadius: 20, padding: "32px 28px", border: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: 40, color: "var(--indigo-pale)", fontWeight: 800, lineHeight: 1, marginBottom: 16 }}>❝</div>
                <p style={{ fontSize: 15, color: "var(--text-mid)", lineHeight: 1.7, marginBottom: 24 }}>{quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: avatar, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jakarta)", fontWeight: 700, color: "#fff", fontSize: 16 }}>{name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-dark)" }}>{name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(135deg, var(--indigo-deep) 0%, var(--indigo-mid) 100%)", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 600, height: 600, borderRadius: "50%", background: "rgba(99,102,241,0.12)", filter: "blur(80px)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>Sẵn sàng tối ưu quy trình?</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", marginBottom: 36 }}>Dùng thử miễn phí 14 ngày — không cần thẻ tín dụng, hủy bất kỳ lúc nào.</p>
          <a href="#" style={{
            display: "inline-block", padding: "15px 40px", borderRadius: 12,
            background: "linear-gradient(135deg, var(--amber), var(--amber-light))",
            fontSize: 16, fontWeight: 700, color: "var(--indigo-deep)",
            textDecoration: "none", boxShadow: "0 8px 28px rgba(217,119,6,0.40)",
            transition: "transform 0.2s",
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "")}
          >Bắt đầu ngay hôm nay →</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="footer" style={{ background: "var(--indigo-deep)", padding: "56px 24px 32px", color: "rgba(255,255,255,0.55)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(3, 1fr)", gap: 40, marginBottom: 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--indigo), var(--indigo-light))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" fill="white"/><rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/><rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/><rect x="10" y="10" width="6" height="6" rx="1.5" fill="white"/></svg>
                </div>
                <span style={{ fontFamily: "var(--font-jakarta)", fontSize: 18, fontWeight: 700, color: "#fff" }}>TaskFlow</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>Nền tảng quản lý đơn dịch vụ thông minh dành cho doanh nghiệp Việt Nam.</p>
            </div>
            {[
              { title: "Sản phẩm", links: ["Tính năng", "Bảng giá", "Dashboard Demo", "API Docs"] },
              { title: "Công ty", links: ["Về chúng tôi", "Blog", "Tuyển dụng", "Đối tác"] },
              { title: "Hỗ trợ", links: ["Trung tâm hỗ trợ", "Liên hệ", "Zalo: 0779 854 336", "Email hỗ trợ"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>{title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {links.map(l => <a key={l} href="#" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#fff")} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}>{l}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 13 }}>© 2025 TaskFlow. Được xây dựng bởi Leo Studio.</span>
            <span style={{ fontSize: 13 }}>Điều khoản · Chính sách bảo mật</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
