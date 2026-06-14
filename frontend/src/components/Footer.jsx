export default function Footer() {
  return (
    <footer className="bg-navy-900 py-8 border-t border-navy-light/30">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-cyan-light text-sm font-medium mb-2">
          DermacareVision AI — Educational Clinical Support Prototype
        </p>
        <p className="text-white text-sm">
          Developed by{' '}
          <span className="font-semibold text-cyan">Ibrahim Shaikh</span>,{' '}
          <span className="font-semibold text-cyan">Sahil Sahare</span>, and{' '}
          <span className="font-semibold text-cyan">Tohid Pathan</span>
        </p>
        <p className="text-cyan-pale/50 text-xs mt-3">
          © {new Date().getFullYear()} DermacareVision AI. For educational use only.
        </p>
      </div>
    </footer>
  );
}
