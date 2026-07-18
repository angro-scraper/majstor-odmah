import { ContactForm } from "./contact-form";
import styles from "./contact.module.css";

export const metadata = { title: "Kontakt | Balkan.works", description: "Kontaktirajte Balkan.works tim." };

export default function ContactPage() {
  return <main className={styles.page}><section className={styles.hero}><span>BALKAN.WORKS PODRŠKA</span><h1>Kako možemo da pomognemo?</h1><p>Pošaljite pitanje, prijavu problema ili predlog saradnje. Odgovaramo radnim danima.</p></section><section className={styles.content}><ContactForm /></section></main>;
}
