export function Footer() {
  return (
    <footer className="studio-footer">
      <a
        className="footer-wordmark"
        href="#top"
        aria-label="Wendava Studio home"
      >
        wendava<span>studio</span>
      </a>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Wendava Studio</span>
        <span>Creative thinking. Real-world solutions.</span>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}
