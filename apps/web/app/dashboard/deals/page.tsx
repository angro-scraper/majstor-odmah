import { AppShell } from "../../../src/components/app-shell";
import { Button, Input } from "../../../src/components/ui";

export default function BusinessDealsPage() {
  return <AppShell active=""><section className="page-heading business-heading"><p>DEALS I FLAJERI</p><h1>Objavi akciju koja se vidi.</h1><span>Jedan unos postaje ponuda u aplikaciji i deo tvog digitalnog flajera.</span></section><section className="creation-layout"><aside><div className="step active"><span>1</span>Detalji</div><div className="step"><span>2</span>Cena</div><div className="step"><span>3</span>Važenje</div></aside><form className="creation-form"><p className="label">NOVA PONUDA</p><h2>Šta želiš da promovišeš?</h2><label>Naziv ponude<Input placeholder="npr. Vikend popust na servis" /></label><label>Redovna cena / akcijska cena<Input placeholder="npr. 4.900 RSD / 3.900 RSD" /></label><label>Datum završetka<Input type="date" /></label><div className="form-actions"><a href="/dashboard"><Button className="secondary" type="button">Nazad</Button></a><Button type="button">Sačuvaj nacrt</Button></div></form></section></AppShell>;
}
