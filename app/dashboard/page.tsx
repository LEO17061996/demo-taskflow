"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

/* ─── Mock data ─── */
const ORDERS = [
  { id: "TF-1024", customer: "Nguyễn Thị Lan", service: "Sửa máy lạnh", staff: "Trần Minh", date: "26/05/2025", time: "09:00", status: "done",     amount: 450000 },
  { id: "TF-1025", customer: "Lê Văn Hùng",    service: "Nhuộm tóc",    staff: "Mai Linh",  date: "26/05/2025", time: "10:30", status: "progress", amount: 380000 },
  { id: "TF-1026", customer: "Phạm Thu Hà",    service: "Nail bộ",      staff: "Kim Oanh",  date: "26/05/2025", time: "14:00", status: "pending",  amount: 220000 },
  { id: "TF-1027", customer: "Đỗ Minh Khoa",   service: "Vệ sinh máy",  staff: "Trần Minh", date: "26/05/2025", time: "15:30", status: "pending",  amount: 320000 },
  { id: "TF-1028", customer: "Hoàng Thị Bích", service: "Cắt tóc",      staff: "Mai Linh",  date: "25/05/2025", time: "16:00", status: "done",     amount: 150000 },
  { id: "TF-1029", customer: "Trương Văn An",  service: "Massage 60p",  staff: "Lan Hương", date: "25/05/2025", time: "11:00", status: "done",     amount: 280000 },
  { id: "TF-1030", customer: "Vũ Thị Ngọc",   service: "Gội đầu phục hồi", staff: "Kim Oanh", date: "25/05/2025", time: "09:30", status: "cancel", amount: 180000 },
  { id: "TF-1031", customer: "Ngô Quang Hải",  service: "Sửa điện nước", staff: "Dũng Hà",  date: "24/05/2025", time: "08:00", status: "done",     amount: 520000 },
];

const STAFF = [
  { id: 1, name: "Trần Minh",    role: "Kỹ thuật viên", avatar: "#6366F1", orders: 12, done: 10, rating: 4.9, status: "active",  skills: ["Điện lạnh", "Điện nước"] },
  { id: 2, name: "Mai Linh",    role: "Stylist tóc",    avatar: "#EC4899", orders: 9,  done: 8,  rating: 4.8, status: "active",  skills: ["Cắt tóc", "Nhuộm", "Uốn"] },
  { id: 3, name: "Kim Oanh",   role: "Nail artist",     avatar: "#F59E0B", orders: 7,  done: 7,  rating: 5.0, status: "active",  skills: ["Nail", "Pedicure"] },
  { id: 4, name: "Lan Hương",  role: "Chuyên viên spa", avatar: "#10B981", orders: 5,  done: 4,  rating: 4.7, status: "busy",   skills: ["Massage", "Spa", "Detox"] },
  { id: 5, name: "Dũng Hà",    role: "Kỹ thuật viên",  avatar: "#8B5CF6", orders: 6,  done: 6,  rating: 4.6, status: "off",    skills: ["Điện nước", "Sửa chữa"] },
];

const WEEK_SCHEDULE: Record<string, { staff: string; service: string; time: string; color: string }[]> = {
  "T2": [
    { staff: "Trần Minh",  service: "Sửa máy lạnh",    time: "09:00", color: "#6366F1" },
    { staff: "Mai Linh",   service: "Nhuộm tóc",        time: "10:30", color: "#EC4899" },
    { staff: "Kim Oanh",  service: "Nail bộ",            time: "14:00", color: "#F59E0B" },
  ],
  "T3": [
    { staff: "Lan Hương", service: "Massage 60p",        time: "09:00", color: "#10B981" },
    { staff: "Dũng Hà",   service: "Sửa điện nước",     time: "13:00", color: "#8B5CF6" },
  ],
  "T4": [
    { staff: "Trần Minh",  service: "Bảo dưỡng hệ thống", time: "08:30", color: "#6366F1" },
    { staff: "Mai Linh",   service: "Cắt tóc",            time: "11:00", color: "#EC4899" },
    { staff: "Kim Oanh",  service: "Sơn gel",             time: "15:00", color: "#F59E0B" },
    { staff: "Lan Hương", service: "Gói spa",             time: "16:00", color: "#10B981" },
  ],
  "T5": [
    { staff: "Trần Minh",  service: "Sửa điều hòa",    time: "09:00", color: "#6366F1" },
    { staff: "Mai Linh",   service: "Uốn xoăn",        time: "10:00", color: "#EC4899" },
  ],
  "T6": [
    { staff: "Kim Oanh",  service: "Nail set đầy đủ",  time: "09:30", color: "#F59E0B" },
    { staff: "Lan Hương", service: "Massage đá nóng",  time: "14:00", color: "#10B981" },
    { staff: "Dũng Hà",   service: "Lắp đặt thiết bị", time: "08:00", color: "#8B5CF6" },
  ],
  "T7": [
    { staff: "Trần Minh",  service: "Vệ sinh máy",     time: "09:00", color: "#6366F1" },
    { staff: "Mai Linh",   service: "Nhuộm highlight",  time: "10:30", color: "#EC4899" },
    { staff: "Kim Oanh",  service: "Pedicure",          time: "13:00", color: "#F59E0B" },
    { staff: "Lan Hương", service: "Gói thư giãn",     time: "15:00", color: "#10B981" },
  ],
  "CN": [
    { staff: "Mai Linh",   service: "Cắt + Sấy",       time: "10:00", color: "#EC4899" },
    { staff: "Kim Oanh",  service: "Nail tay + chân",  time: "11:00", color: "#F59E0B" },
  ],
};

const REVENUE_DATA = [
  { month: "T1", revenue: 38, orders: 82 },
  { month: "T2", revenue: 42, orders: 95 },
  { month: "T3", revenue: 35, orders: 78 },
  { month: "T4", revenue: 48, orders: 108 },
  { month: "T5", revenue: 52, orders: 115 },
  { month: "T6", revenue: 45, orders: 98 },
];

/* ─── Types ─── */
type TabId = "overview" | "orders" | "staff" | "schedule" | "reports";

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { done: "badge-done", progress: "badge-progress", pending: "badge-pending", cancel: "badge-cancel" };
  const label: Record<string, string> = { done: "Hoàn thành", progress: "Đang làm", pending: "Chờ xử lý", cancel: "Đã hủy" };
  return <span className={`badge ${map[status]}`}>{label[status]}</span>;
}

/* ─── Tabs ─── */
const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: "overview",  icon: "▤",  label: "Tổng quan" },
  { id: "orders",    icon: "📋", label: "Đơn hàng" },
  { id: "staff",     icon: "👥", label: "Nhân viên" },
  { id: "schedule",  icon: "📅", label: "Lịch làm việc" },
  { id: "reports",   icon: "📊", label: "Báo cáo" },
];

/* ─── Overview tab ─── */
function OverviewTab() {
  const today = ORDERS.filter(o => o.date === "26/05/2025");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {[
          { label: "Đơn hôm nay",     value: today.length,              icon: "📋", color: "#6366F1", bg: "#EEF2FF" },
          { label: "Đang thực hiện",  value: today.filter(o => o.status === "progress").length, icon: "⚡", color: "#F59E0B", bg: "#FEF3C7" },
          { label: "Hoàn thành",      value: ORDERS.filter(o => o.status === "done").length, icon: "✅", color: "#059669", bg: "#D1FAE5" },
          { label: "Doanh thu tháng", value: "45.2M", icon: "💰", color: "#8B5CF6", bg: "#EDE9FE" },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className="kpi-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
            </div>
            <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 28, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Bar chart — đơn hàng 7 ngày */}
        <div style={{ background: "white", borderRadius: 14, padding: "20px 22px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Đơn hàng 7 ngày qua</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>Tổng: 128 đơn tuần này</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
            {[{ d: "T2", v: 14 }, { d: "T3", v: 19 }, { d: "T4", v: 11 }, { d: "T5", v: 23 }, { d: "T6", v: 18 }, { d: "T7", v: 27 }, { d: "CN", v: 16 }].map(({ d, v }, i) => (
              <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{v}</span>
                <div className="chart-bar" style={{ width: "100%", height: `${(v / 27) * 80}px` }} title={`${d}: ${v} đơn`} />
                <span style={{ fontSize: 11, color: i === 5 ? "var(--amber)" : "var(--text-muted)", fontWeight: i === 5 ? 700 : 400 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tỷ lệ trạng thái */}
        <div style={{ background: "white", borderRadius: 14, padding: "20px 22px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Tỷ lệ trạng thái đơn</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>Tháng 05/2025</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Hoàn thành", pct: 72, color: "#059669" },
              { label: "Đang xử lý", pct: 18, color: "#2563EB" },
              { label: "Chờ xử lý",  pct: 7,  color: "#D97706" },
              { label: "Đã hủy",     pct: 3,  color: "#DC2626" },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: "var(--text-mid)", fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border-light)", overflow: "hidden" }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 15, fontWeight: 700 }}>Đơn hàng hôm nay</div>
          <span style={{ fontSize: 13, color: "var(--indigo)", cursor: "pointer", fontWeight: 500 }}>Xem tất cả →</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr>
              <th>Mã đơn</th><th>Khách hàng</th><th>Dịch vụ</th><th>Nhân viên</th><th>Giờ</th><th>Trạng thái</th><th>Doanh thu</th>
            </tr></thead>
            <tbody>
              {today.map(o => (
                <tr key={o.id}>
                  <td><span style={{ fontWeight: 600, color: "var(--indigo)", fontSize: 13 }}>{o.id}</span></td>
                  <td style={{ fontWeight: 500, color: "var(--text-dark)" }}>{o.customer}</td>
                  <td>{o.service}</td>
                  <td>{o.staff}</td>
                  <td>{o.time}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td style={{ fontWeight: 600, color: "var(--text-dark)" }}>{o.amount.toLocaleString("vi")}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Orders tab ─── */
function OrdersTab() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = ORDERS.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()) || o.service.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "var(--text-muted)" }}>🔍</span>
          <input className="tf-input" style={{ paddingLeft: 36 }} placeholder="Tìm kiếm đơn hàng, khách hàng..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="tf-input" style={{ flex: "0 0 180px" }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="progress">Đang làm</option>
          <option value="done">Hoàn thành</option>
          <option value="cancel">Đã hủy</option>
        </select>
        <button style={{ padding: "8px 20px", borderRadius: 8, background: "var(--indigo)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          + Tạo đơn mới
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border-light)", overflow: "hidden" }}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>{filtered.length} đơn hàng</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr>
              <th>Mã đơn</th><th>Khách hàng</th><th>Dịch vụ</th><th>Nhân viên</th><th>Ngày</th><th>Giờ</th><th>Trạng thái</th><th>Doanh thu</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td><span style={{ fontWeight: 600, color: "var(--indigo)", fontSize: 13 }}>{o.id}</span></td>
                  <td style={{ fontWeight: 500, color: "var(--text-dark)" }}>{o.customer}</td>
                  <td>{o.service}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: STAFF.find(s => s.name === o.staff)?.avatar || "#999", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700 }}>{o.staff[0]}</div>
                      {o.staff}
                    </div>
                  </td>
                  <td>{o.date}</td>
                  <td>{o.time}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td style={{ fontWeight: 600 }}>{o.amount.toLocaleString("vi")}đ</td>
                  <td>
                    <button style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border-light)", background: "white", fontSize: 12, cursor: "pointer", color: "var(--text-mid)", transition: "border-color 0.2s" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "var(--indigo)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)")}
                    >Chi tiết</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>Không tìm thấy đơn hàng phù hợp</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Staff tab ─── */
function StaffTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 18, fontWeight: 700 }}>Đội ngũ nhân viên</div>
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 2 }}>{STAFF.length} thành viên · {STAFF.filter(s => s.status === "active").length} đang hoạt động</div>
        </div>
        <button style={{ padding: "9px 20px", borderRadius: 8, background: "var(--indigo)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          + Thêm nhân viên
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
        {STAFF.map(s => (
          <div key={s.id} style={{ background: "white", borderRadius: 16, padding: "24px 22px", border: "1px solid var(--border-light)", transition: "box-shadow 0.2s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(55,48,163,0.08)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: s.avatar, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jakarta)", fontWeight: 700, color: "#fff", fontSize: 18 }}>{s.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-dark)" }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.role}</div>
                </div>
              </div>
              <span style={{
                padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500,
                background: s.status === "active" ? "#D1FAE5" : s.status === "busy" ? "#FEF3C7" : "#F3F4F6",
                color: s.status === "active" ? "#065F46" : s.status === "busy" ? "#92400E" : "#6B7280",
              }}>{s.status === "active" ? "Hoạt động" : s.status === "busy" ? "Đang bận" : "Nghỉ"}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { label: "Đơn tháng", value: s.orders },
                { label: "Hoàn thành", value: s.done },
                { label: "Đánh giá", value: `⭐ ${s.rating}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--bg)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 16, fontWeight: 700, color: "var(--text-dark)" }}>{value}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 8 }}>Kỹ năng</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {s.skills.map(sk => (
                  <span key={sk} style={{ padding: "3px 10px", borderRadius: 99, background: "var(--indigo-pale)", color: "var(--indigo)", fontSize: 12, fontWeight: 500 }}>{sk}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Tỷ lệ hoàn thành</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--indigo)" }}>{Math.round(s.done / s.orders * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.round(s.done / s.orders * 100)}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Schedule tab ─── */
function ScheduleTab() {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 18, fontWeight: 700 }}>Lịch làm việc tuần này</div>
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 2 }}>26/05 – 01/06/2025</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border-light)", background: "white", fontSize: 14, cursor: "pointer", color: "var(--text-mid)" }}>← Tuần trước</button>
          <button style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border-light)", background: "white", fontSize: 14, cursor: "pointer", color: "var(--text-mid)" }}>Tuần sau →</button>
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border-light)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "2px solid var(--border-light)" }}>
          {days.map((d, i) => (
            <div key={d} style={{ padding: "12px 8px", textAlign: "center", borderRight: i < 6 ? "1px solid var(--border-light)" : "none", background: d === "T7" ? "var(--indigo-pale)" : "white" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: d === "T7" ? "var(--indigo)" : "var(--text-muted)", textTransform: "uppercase" }}>{d}</div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-jakarta)", color: d === "T7" ? "var(--indigo)" : "var(--text-dark)", marginTop: 2 }}>{25 + i + 1}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", minHeight: 280 }}>
          {days.map((d, i) => (
            <div key={d} style={{ padding: 8, borderRight: i < 6 ? "1px solid var(--border-light)" : "none", display: "flex", flexDirection: "column", gap: 6, background: d === "T7" ? "rgba(238,242,255,0.3)" : "white" }}>
              {(WEEK_SCHEDULE[d] || []).map((item, j) => (
                <div key={j} style={{ borderRadius: 8, padding: "6px 8px", background: `${item.color}18`, borderLeft: `3px solid ${item.color}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: item.color }}>{item.time}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dark)", fontWeight: 500, marginTop: 2, lineHeight: 1.3 }}>{item.service}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.staff}</div>
                </div>
              ))}
              {(WEEK_SCHEDULE[d] || []).length === 0 && (
                <div style={{ textAlign: "center", padding: "20px 4px", fontSize: 12, color: "var(--text-muted)" }}>Trống</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {STAFF.map(s => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.avatar }} />
            <span style={{ fontSize: 13, color: "var(--text-mid)" }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Reports tab ─── */
function ReportsTab() {
  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.revenue));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {[
          { label: "Doanh thu tháng 5",  value: "45.2M",  delta: "+12%", positive: true },
          { label: "Tổng đơn tháng 5",    value: "115",    delta: "+6.5%", positive: true },
          { label: "Tỷ lệ hoàn thành",   value: "94%",    delta: "+2%", positive: true },
          { label: "Đơn hủy",            value: "8",      delta: "-3", positive: true },
        ].map(({ label, value, delta, positive }) => (
          <div key={label} className="kpi-card">
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{label}</div>
            <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 28, fontWeight: 800, color: "var(--text-dark)", marginBottom: 6 }}>{value}</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: positive ? "var(--success)" : "var(--danger)", background: positive ? "#D1FAE5" : "#FEE2E2", padding: "2px 8px", borderRadius: 99 }}>{delta} so với T4</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        {/* Revenue chart */}
        <div style={{ background: "white", borderRadius: 14, padding: "22px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 15, fontWeight: 700 }}>Doanh thu 6 tháng</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Đơn vị: triệu đồng</div>
            </div>
            <select className="tf-input" style={{ width: "auto", padding: "6px 12px" }}>
              <option>6 tháng gần nhất</option>
              <option>Năm 2025</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
            {REVENUE_DATA.map(({ month, revenue }) => (
              <div key={month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>{revenue}M</span>
                <div className="chart-bar" style={{ width: "100%", height: `${(revenue / maxRevenue) * 110}px`, background: month === "T5" ? `linear-gradient(180deg, var(--amber-light), var(--amber))` : `linear-gradient(180deg, var(--indigo-light), var(--indigo-mid))` }} />
                <span style={{ fontSize: 12, color: month === "T5" ? "var(--amber)" : "var(--text-muted)", fontWeight: month === "T5" ? 700 : 400 }}>{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top services */}
        <div style={{ background: "white", borderRadius: 14, padding: "22px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Dịch vụ hàng đầu</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>Tháng 05/2025</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { name: "Nhuộm & uốn tóc", pct: 28, color: "#EC4899" },
              { name: "Nail & pedicure",  pct: 24, color: "#F59E0B" },
              { name: "Sửa chữa điện",   pct: 20, color: "#6366F1" },
              { name: "Massage & spa",   pct: 17, color: "#10B981" },
              { name: "Cắt tóc",        pct: 11, color: "#8B5CF6" },
            ].map(({ name, pct, color }) => (
              <div key={name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: "var(--text-mid)", fontWeight: 500 }}>{name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff performance */}
      <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border-light)", overflow: "hidden" }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border-light)" }}>
          <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 15, fontWeight: 700 }}>Hiệu suất nhân viên — Tháng 05</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr>
              <th>Nhân viên</th><th>Tổng đơn</th><th>Hoàn thành</th><th>Tỷ lệ</th><th>Doanh thu</th><th>Đánh giá</th>
            </tr></thead>
            <tbody>
              {STAFF.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.avatar, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 13 }}>{s.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-dark)" }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{s.orders}</td>
                  <td style={{ fontWeight: 600, color: "var(--success)" }}>{s.done}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar" style={{ flex: 1, maxWidth: 80 }}>
                        <div className="progress-fill" style={{ width: `${Math.round(s.done / s.orders * 100)}%` }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--indigo)" }}>{Math.round(s.done / s.orders * 100)}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{(s.orders * 320000).toLocaleString("vi")}đ</td>
                  <td>
                    <span style={{ color: "#F59E0B" }}>{"★".repeat(Math.floor(s.rating))}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 4, color: "var(--text-dark)" }}>{s.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard layout ─── */
function DashboardContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth guard
  if (key !== "admin123") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ background: "white", borderRadius: 20, padding: "48px 40px", textAlign: "center", border: "1px solid var(--border-light)", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 22, fontWeight: 800, color: "var(--text-dark)", marginBottom: 8 }}>Truy cập bị từ chối</div>
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28 }}>Vui lòng sử dụng đường dẫn hợp lệ để truy cập dashboard.<br/>Demo: <code style={{ background: "var(--indigo-pale)", padding: "1px 6px", borderRadius: 4, color: "var(--indigo)" }}>?key=admin123</code></div>
          <a href="/" style={{ display: "inline-block", padding: "10px 24px", borderRadius: 8, background: "var(--indigo)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>← Về trang chủ</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, background: "white",
        borderRight: "1px solid var(--border-light)",
        display: "flex", flexDirection: "column",
        padding: "0 12px",
        overflowY: "auto",
      }} className="hidden md:flex">
        {/* Logo */}
        <div style={{ padding: "20px 8px 24px", borderBottom: "1px solid var(--border-light)", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--indigo), var(--indigo-light))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" fill="white"/><rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/><rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/><rect x="10" y="10" width="6" height="6" rx="1.5" fill="white"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-jakarta)", fontSize: 16, fontWeight: 700, color: "var(--indigo-mid)" }}>TaskFlow</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, paddingTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "8px 14px 4px" }}>Menu</div>
          {TABS.map(tab => (
            <button key={tab.id} className={`dash-tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
              <span style={{ fontSize: 16 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "16px 0 24px", borderTop: "1px solid var(--border-light)", marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--indigo), #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 13 }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>Admin</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Quản lý</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header style={{ background: "white", borderBottom: "1px solid var(--border-light)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-jakarta)", fontSize: 18, fontWeight: 700, color: "var(--text-dark)" }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </span>
            {activeTab === "overview" && (
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}>Thứ Hai, 26/05/2025</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <button style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border-light)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔔</button>
              <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--danger)", border: "2px solid white" }} />
            </div>
            <a href="/" style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid var(--border-light)", fontSize: 13, fontWeight: 500, color: "var(--text-mid)", textDecoration: "none" }}>← Trang chủ</a>
          </div>
        </header>

        {/* Mobile tabs */}
        <div className="md:hidden" style={{ background: "white", borderBottom: "1px solid var(--border-light)", display: "flex", overflowX: "auto", padding: "0 16px" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "12px 14px", border: "none", background: "none", cursor: "pointer", whiteSpace: "nowrap",
              fontSize: 13, fontWeight: 500,
              color: activeTab === tab.id ? "var(--indigo)" : "var(--text-muted)",
              borderBottom: activeTab === tab.id ? "2px solid var(--indigo)" : "2px solid transparent",
              transition: "color 0.2s",
            }}>{tab.icon} {tab.label}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {activeTab === "overview"  && <OverviewTab />}
          {activeTab === "orders"    && <OrdersTab />}
          {activeTab === "staff"     && <StaffTab />}
          {activeTab === "schedule"  && <ScheduleTab />}
          {activeTab === "reports"   && <ReportsTab />}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", fontSize: 14, color: "var(--text-muted)" }}>Đang tải...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
