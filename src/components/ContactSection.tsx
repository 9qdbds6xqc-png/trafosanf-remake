import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail } from "lucide-react";

const contacts = [
  {
    name: "Manuel Beha",
    role: "Technischer Ansprechpartner",
    phone: "+49 7661 9855 377",
    email: "manuel.beha@fsm.ag",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=180&fit=crop&crop=face",
  },
  {
    name: "Marvin Heinrich",
    role: "Vertrieb",
    phone: "+49 7661 9855 186",
    email: "marvin.heinrich@fsm.ag",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=180&fit=crop&crop=face",
  },
];

export const ContactSection = () => {
  return (
    <section id="kontakt" className="fsm-section bg-secondary">
      <div className="fsm-container">
        <h2 className="fsm-heading">Passt das zu deinem Anwendungsfall?</h2>
        <p className="fsm-text mb-10">Dann kontaktiere uns gerne!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mb-10">
          {contacts.map((contact, index) => (
            <div key={index} className="bg-background rounded-sm p-6 shadow-sm">
              <img
                src={contact.imageUrl}
                alt={contact.name}
                className="w-full h-40 object-cover rounded-sm mb-4"
              />
              <h3 className="text-lg font-semibold text-foreground">{contact.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{contact.role}</p>
              
              <div className="space-y-2">
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="font-medium text-foreground">Telefon</span>
                  <span className="ml-2">{contact.phone}</span>
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center text-sm text-primary hover:underline"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {contact.email}
                </a>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          Zum Kontaktformular
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};
