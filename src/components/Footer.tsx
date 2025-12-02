export const Footer = () => {
  return (
    <footer className="bg-fsm-dark text-white py-12">
      <div className="fsm-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">
              Sprich mit unserem Produkt
            </div>
            <p className="text-white/70 text-sm">Produkt-Informationen und Support</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="/" className="hover:text-primary transition-colors">Startseite</a></li>
              <li><a href="/backlog" className="hover:text-primary transition-colors">Backlog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Informationen</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-primary transition-colors">Über uns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kontakt</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="text-sm text-white/70 space-y-2">
              <p>Sprich mit unserem Produkt</p>
              <p>Deutschland</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© 2025 Sprich mit unserem Produkt. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Impressum</a>
            <a href="#" className="hover:text-primary transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-primary transition-colors">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
