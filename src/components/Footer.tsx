export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50 text-foreground py-12 mt-auto">
      <div className="fsm-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-light mb-4">
              Produkt-Assistent
            </div>
            <p className="text-muted-foreground text-sm">Produkt-Informationen und Support</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-foreground transition-colors">Startseite</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Informationen</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Über uns</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Kontakt</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Produkt-Assistent</p>
              <p>Deutschland</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Produkt-Assistent. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Impressum</a>
            <a href="#" className="hover:text-foreground transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-foreground transition-colors">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
