export default function NotFound() {
  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>页面未找到 (404)</h2>
      <p style={{ color: "#64748b" }}>您请求的页面不存在或已被移除。</p>
      <a href="/" style={{ color: "#0284c7" }}>返回首页</a>
    </div>
  );
}
