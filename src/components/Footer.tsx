export const Footer = () => {
  return (
    <footer className="bg-fsm-dark text-white py-12">
      <div className="fsm-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">
              FSM<sup className="text-xs">®</sup>
            </div>
            <p className="text-white/70 text-sm">intelligent electronics</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Produkte</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-primary transition-colors">Batterie Management Systeme</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Messtechnik</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trafosanfteinschalter</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">E²MS</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Unternehmen</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-primary transition-colors">Über uns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Jobs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">News</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kontakt</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="text-sm text-white/70 space-y-2">
              <p>FSM AG</p>
              <p>Kirchzarten, Deutschland</p>
              <p>Tel: +49 7661 9855-0</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© 2024 FSM AG. Alle Rechte vorbehalten.</p>
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
