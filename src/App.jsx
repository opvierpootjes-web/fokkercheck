import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

const C = {
  copper:      '#845814',
  copperMid:   '#a87d38',
  copperLight: '#b9a46e',
  grey:        '#7f8a8a',
  ice:         '#aabfcd',
  iceLight:    '#e8f0f4',
  dark:        '#1a1a1a',
  stone:       '#f7f5f2',
  stoneBorder: '#e8e3db',
  orange:      '#ff914d',
  orangeBg:    '#fff8f3',
  orangeBorder:'#ffc4a0',
  orangeDark:  '#c05200',
};

const THEMES = [
  {
    id: 'ei', name: 'Eerste indruk',
    questions: [
      { id: 'q_ei_1', goodAnswer: 'ja', weight: 'hard',
        text: 'Neemt de fokker rustig de tijd om je vragen te beantwoorden?',
        flagText: 'Een fokker die gehaast is of vragen ontwijkt of niet beantwoordt, geeft een signaal dat er weinig ruimte is voor open communicatie. Neem de tijd om te beoordelen of het contact soepel verloopt.',
        follow: 'Kun je me meer vertellen over het nest en hoe je de pups grootbrengt?' },
      { id: 'q_ei_2', goodAnswer: 'ja', weight: 'hard',
        text: 'Stelt de fokker ook vragen aan jou, over je thuissituatie en ervaring met honden?',
        flagText: 'Fokkers die hun pups goed begeleiden, willen weten hoe jouw thuissituatie is. Zij willen een zo goed mogelijk passende match vinden bij het karakter van de pupjes. Als er helemaal geen vragen worden gesteld, kan dat een aanwijzing zijn dat het welzijn van de pup minder centraal staat.',
        follow: 'Hoe kiezen jullie welke pup bij wie gaat wonen? Wat vind jij als fokker belangrijk bij nieuwe eigenaren?' },
      { id: 'q_ei_3', goodAnswer: 'ja', weight: 'hard',
        text: 'Mag je de pups bezoeken bij de fokker thuis, niet op een andere locatie?',
        flagText: 'Als een bezichtiging of overdracht niet bij de fokker thuis kan plaatsvinden, is dat een signaal om voorzichtig te zijn. Er is zelden een goede reden voor een andere locatie.',
        follow: 'Kan ik het nest bekijken op het adres waar de pups zijn opgegroeid?' },
      { id: 'q_ei_4', goodAnswer: 'nee', weight: 'soft',
        text: 'Zet de fokker je onder druk om snel een beslissing te nemen?',
        flagText: 'Tijdsdruk is een signaal om alert op te zijn. Een zorgvuldige fokker geeft je meestal de ruimte om na te denken en eventueel nog een keer langs te komen. Het gaat vooral om de manier waarop de fokker hiermee omgaat: voel je ruimte om rustig na te denken, of ervaar je druk om snel te beslissen?',
        follow: 'Hoeveel tijd heb ik om te beslissen? Mag ik ook nog een keer terugkomen?' },
      { id: 'q_ei_5', goodAnswer: 'nee', weight: 'soft',
        text: 'Zijn er meerdere rassen of steeds meerdere nesten tegelijk beschikbaar?',
        flagText: 'Het hebben van meerdere rassen of nesten tegelijk hoeft niet automatisch een probleem te zijn. Kijk naar de omvang van de fokkerij, hoeveel aandacht er per nest is en hoe goed de fokker de pups kent. Wanneer er voortdurend pups beschikbaar zijn of veel verschillende rassen worden aangeboden, is het verstandig om extra vragen te stellen. Meerdere nesten tegelijk betekent vrijwel altijd dat de individuele aandacht per nest minder is — een aandachtspunt dat het verder vragen waard is.',
        follow: 'Hoeveel nestjes heb je per jaar en met hoeveel moederhonden fok je?' },
      { id: 'q_ei_6', goodAnswer: 'ja', weight: 'soft',
        text: 'Vertelt de fokker uit zichzelf wat er bij dit ras komt kijken aan verzorging, zoals vachtonderhoud, beweging of andere raskenmerken?',
        flagText: 'Een fokker die dit soort informatie uit zichzelf deelt, laat zien dat hij verder kijkt dan de verkoop en jou helpt een weloverwogen keuze te maken die past bij jouw leven en situatie.',
        follow: 'Wat komt er bij dit ras precies kijken aan verzorging, en waar moet ik me op voorbereiden voor ik de pup mee naar huis neem?' },
    ],
  },
  {
    id: 'mn', name: 'Moederhond en nest',
    questions: [
      { id: 'q_mn_1', goodAnswer: 'ja', weight: 'hard',
        text: 'Is de moederhond aanwezig en kun je haar zien, samen en in contact met de pups?',
        flagText: 'Als je de moederhond niet te zien krijgt, heb je geen directe manier om te controleren of zij de moeder van de pups is. Let niet alleen op haar aanwezigheid, maar ook op de interactie met de pups: zoeken de pups vanzelf contact met haar, hoe reageert zij op hen en maakt het geheel een natuurlijke indruk? Als de pups actief bij haar drinken of zogen, is dat een sterke aanwijzing dat zij echt hun moeder is. Dit is moeilijk te faken en geeft direct meer zekerheid over de herkomst van de pups.',
        follow: 'Kan ik de moederhond zien en hoe verloopt het contact tussen haar en de pups?' },
      { id: 'q_mn_2', goodAnswer: 'ja', weight: 'hard',
        text: 'Lijkt de moederhond gezond, sociaal en op haar gemak?',
        flagText: 'De moederhond geeft een indruk van de omstandigheden waarin de pups opgroeien. Let op haar gezondheid, gedrag en hoe zij reageert op bezoekers. Houd er rekening mee dat sommige moederhonden hun nest beschermen of tijdelijk wat terughoudender zijn. Kijk naar het totaalplaatje.',
        follow: 'Hoe is het karakter van de moederhond? Is ze gewend aan bezoekers?' },
      { id: 'q_mn_3', goodAnswer: 'ja', weight: 'hard',
        text: 'Groeien de pups op in een huiselijke omgeving, niet in een schuur of buitenkennel?',
        flagText: 'Pups die opgroeien in een huiselijke omgeving krijgen van jongs af aan prikkels mee die later van belang zijn voor hun karakter en aanpassingsvermogen. Het is belangrijk dat de pups en hun moeder zich veilig voelen en geen stress ervaren. Let ook op de naamgeving die fokkers soms gebruiken: termen als "kraamkamer", "pups-serre" of "speelkamer" klinken warm en zorgzaam, maar zijn in de praktijk vaak gewone, steriele hokken die makkelijk schoon te maken zijn. Een echte huiselijke omgeving is er een waar de pups integraal deel uitmaken van het dagelijkse leven.',
        follow: 'Waar groeien de pups precies op en hoeveel menselijk contact hebben ze dagelijks?' },
      { id: 'q_mn_4', goodAnswer: 'ja', weight: 'hard',
        text: 'Zijn de pups levendig, nieuwsgierig en schoon?',
        flagText: 'De conditie van de pups en hun omgeving geeft informatie over de zorg die zij krijgen. Gezonde pups zijn meestal alert en nieuwsgierig. Houd er rekening mee dat pups ook kunnen slapen of een rustmoment hebben. Beoordeel niet alleen één pup, maar kijk naar het nest als geheel.',
        follow: 'Zijn de pups al bij de dierenarts geweest voor een eerste gezondheidscontrole?' },
      { id: 'q_mn_5', goodAnswer: 'ja', weight: 'hard',
        text: 'Gaan de pups pas mee na minimaal 7 weken? (Wettelijk verplicht in Nederland.)',
        flagText: 'Pups mogen wettelijk pas na 7 weken worden overgedragen. Experts adviseren echter om minimaal 8 tot 12 weken aan te houden — langer bij de moeder en het nest zorgt voor een betere sociale en emotionele ontwikkeling. Gaan de pups naar het buitenland? Dan geldt een wettelijke minimumleeftijd van 15 weken, vanwege de verplichte rabiësvaccinatie en de bijbehorende wachttijd.',
        follow: 'Op welke leeftijd mag ik de pup meenemen?' },
      { id: 'q_mn_6', goodAnswer: 'ja', weight: 'soft',
        text: 'Wordt bekeken welke pup het beste bij jouw situatie past?',
        flagText: 'Veel fokkers leren hun pups gedurende de eerste weken goed kennen. Daardoor kunnen zij adviseren welke pup het beste aansluit bij een gezin, leefstijl of ervaring. Het zelf uitkiezen van een pup kan iets positiefs lijken, maar de fokker kent de pups het beste en kan daarin een fijne leidraad zijn.',
        follow: '' },
      { id: 'q_mn_7', goodAnswer: 'ja', weight: 'soft',
        text: 'Kun je informatie krijgen over de vader: zijn karakter, gezondheid en waar hij woont?',
        flagText: 'De vader heeft ook invloed op het karakter en de gezondheid van de pups. Een betrouwbare fokker kan je minimaal vertellen wie de vader is, hoe zijn karakter is en welke gezondheidstesten bij hem zijn gedaan. Als er helemaal geen informatie beschikbaar is, is dat een aandachtspunt.',
        follow: 'Wie is de vader en kan ik meer informatie over hem krijgen? Zijn er ook gezondheidstesten van hem gedaan?' },
      { id: 'q_mn_8', goodAnswer: 'ja', weight: 'hard',
        text: 'Zijn er duidelijke tekenen dat de pups daar daadwerkelijk verblijven, zoals voerbakjes, speeltjes en een vertrouwde geur?',
        flagText: 'Een ruimte die te leeg of te schoon is, zonder voerbakjes, speeltjes of andere sporen van gebruik, kan erop wijzen dat de pups elders leven en alleen voor het bezoek tijdelijk zijn neergezet. Dit is een bekende werkwijze bij malafide handelaars.',
        follow: 'Kan je me het voer laten zien dat de pups krijgen? Slapen ze hier ook elke nacht?' },
      { id: 'q_mn_9', goodAnswer: 'ja', weight: 'hard',
        text: 'Lijken de pups op elkaar en op de moederhond?',
        flagText: 'Soms worden pups uit meerdere nestjes samengevoegd. Pups die sterk van elkaar afwijken in type, formaat of uiterlijk, of die weinig gelijkenis vertonen met de moederhond, kunnen uit verschillende nesten komen. Dit is een duidelijk signaal van handel.',
        follow: 'Zijn dit allemaal pups van dezelfde moeder en hetzelfde nest?' },
    ],
  },
  {
    id: 'gp', name: 'Gezondheid en papieren',
    questions: [
      { id: 'q_gp_1', goodAnswer: 'ja', weight: 'hard',
        text: 'Is de pup gechipt en staat het chipnummer geregistreerd op naam van de fokker?',
        flagText: 'Een geregistreerde chip is wettelijk verplicht en maakt het mogelijk de herkomst van de pup te controleren. Chippen gebeurt meestal tussen de 6 en 7 weken, maar in ieder geval voor de overdracht. Vraag het chipnummer op en verifieer het in het I&R-register.',
        follow: 'Is de pup al gechipt? Kan ik het chipnummer opzoeken in het register?' },
      { id: 'q_gp_2', goodAnswer: 'ja', weight: 'hard',
        text: 'Is er een Europees dierenpaspoort aanwezig voor de pup?',
        flagText: 'Een Europees dierenpaspoort is wettelijk verplicht bij overdracht en bevat informatie over vaccinaties en behandelingen. Een in Nederland uitgegeven paspoort heeft een uniek serienummer dat begint met 528 NL — 528 is de officiële landcode voor Nederland. Klopt dit nummer niet, of is het paspoort in het buitenland uitgegeven terwijl de pup in Nederland geboren zou zijn? Dan is dat een duidelijk aandachtspunt.',
        follow: 'Is er een geldig Europees dierenpaspoort?' },
      { id: 'q_gp_3', goodAnswer: 'ja', weight: 'hard',
        text: 'Zijn er vaccinatiepapieren aanwezig? Zijn de pups ontwormd of nagekeken op wormen?',
        flagText: 'Zonder duidelijke vaccinatiepapieren of informatie over het ontwormen weet je niet wat er medisch al gedaan is. Dat maakt het moeilijker om een goede medische start te maken. Een goed alternatief voor (her)vaccinatie is een titertest: een bloedtest die aantoont of een hond nog voldoende bescherming heeft van eerdere vaccinaties. Een fokker die hier kennis van heeft en het toepast, toont betrokkenheid bij de gezondheid van zijn dieren en vaccineert op maat.',
        follow: 'Welke vaccinaties en ontwormingen heeft de pup gehad en wanneer was dat?' },
      { id: 'q_gp_4', goodAnswer: 'ja', weight: 'hard',
        text: 'Zijn er gezondheidstesten gedaan bij de ouderdieren, passend bij het ras?',
        flagText: 'Gezondheidstesten kunnen inzicht geven in erfelijke aandoeningen die binnen een ras voorkomen. Het is niet alleen belangrijk dát er getest is, maar ook of de juiste testen zijn uitgevoerd voor het betreffende ras. Vraag altijd of je de uitslagen mag inzien.',
        follow: 'Welke gezondheidstesten zijn er bij de ouderdieren gedaan? Kan ik de uitslagen zien?' },
      { id: 'q_gp_5', goodAnswer: 'ja', weight: 'soft',
        text: 'Krijg je een schriftelijk koopcontract?',
        flagText: 'Een schriftelijk contract legt jullie afspraken vast en beschermt jou als koper. Het is ook een teken dat de fokker zijn rol serieus neemt.',
        follow: 'Is er een koopcontract? Wat staat daarin over garanties bij gezondheidsklachten?' },
      { id: 'q_gp_6', goodAnswer: 'ja', weight: 'soft',
        text: 'Vertelt de fokker open over eventuele gezondheidsproblemen binnen de lijn?',
        flagText: 'Geen enkele lijn is perfect. Openheid over eventuele problemen geeft vaak meer vertrouwen dan doen alsof er nooit iets voorkomt.',
        follow: 'Zijn er ziekten of aandoeningen die je vaker terugziet bij dit ras?' },
      { id: 'q_gp_7', goodAnswer: 'ja', weight: 'hard',
        text: 'Is de pup in Nederland geboren en opgegroeid?',
        flagText: 'Pups uit het buitenland moeten aan aanvullende eisen voldoen: ze moeten minimaal 15 weken oud zijn, een geldige rabiësvaccinatie hebben en er geldt een wachttijd van 3 weken na die vaccinatie. Buitenlandse pups zijn ook een veelgebruikte route voor malafide handel. Controleer de nationaliteit altijd in het paspoort.',
        follow: 'Waar is de pup precies geboren? Kan ik de geboorteplaats en nationaliteit terugvinden in het paspoort?' },
    ],
  },
  {
    id: 'soc', name: 'Socialisatie en gedrag',
    questions: [
      { id: 'q_soc_1', goodAnswer: 'ja', weight: 'soft',
        text: 'Zijn de pups gewend aan normale huisgeluiden, zoals de stofzuiger, muziek of kinderstemmen?',
        flagText: 'Pups die van jongs af aan worden blootgesteld aan normale huisgeluiden en het huiselijke leven, wennen doorgaans gemakkelijker aan hun nieuwe omgeving.',
        follow: 'Aan welke geluiden en situaties zijn de pups al blootgesteld?' },
      { id: 'q_soc_2', goodAnswer: 'ja', weight: 'soft',
        text: 'Hebben de pups regelmatig contact met verschillende mensen, ook bezoekers of kinderen?',
        flagText: 'Vroeg contact met verschillende mensen helpt een pup vertrouwen opbouwen. Pups die alleen de fokker kennen, hebben soms meer moeite met vreemden. Positief is het als een nest in contact komt met mensen van verschillende leeftijden, geslachten en uiterlijken. Let ook op oversocialisatie: te veel prikkels in korte tijd — zoals een bezoek aan een school met meerdere klassen achter elkaar — kan voor jonge pups juist overweldigend en stressvol zijn. Kwaliteit van contact weegt zwaarder dan kwantiteit.',
        follow: 'Komen er regelmatig verschillende mensen bij de pups?' },
      { id: 'q_soc_3', goodAnswer: 'ja', weight: 'soft',
        text: 'Reageren de pups nieuwsgierig en ontspannen wanneer jij er bent?',
        flagText: 'Let op hoe de pups reageren wanneer je aanwezig bent. Nieuwsgierigheid en ontspanning zijn positieve signalen. Sommige pups zijn uitbundig, andere wat rustiger of voorzichtiger. Kijk naar het nest als geheel en vraag de fokker naar de verschillende karakters.',
        follow: 'Zijn er pups die meer teruggetrokken zijn? Wat is daarvoor de reden?' },
      { id: 'q_soc_4', goodAnswer: 'ja', weight: 'soft',
        text: 'Kan de fokker iets vertellen over karakterverschillen tussen de pups in het nest?',
        flagText: 'Fokkers die hun pups goed kennen, kunnen vertellen hoe elk dier in elkaar zit. Dat helpt ook om de juiste pup bij de juiste situatie te vinden.',
        follow: 'Welke soort pup past volgens jou het beste bij mijn situatie en waarom?' },
      { id: 'q_soc_5', goodAnswer: 'nee', weight: 'hard',
        text: 'Vraagt de fokker al een aanbetaling of dringt hij aan op directe overdracht bij het eerste bezoek?',
        flagText: 'Een aanbetaling is op zichzelf niet ongebruikelijk. Veel fokkers werken met een reservering wanneer je bewust voor een pup kiest. Het aandachtspunt zit vooral in druk om direct te beslissen, zonder voldoende tijd om na te denken of nog eens terug te komen.',
        follow: 'Kunnen we nog een keer contact hebben voordat ik beslis?' },
    ],
  },
  {
    id: 'beg', name: 'Voeding en begeleiding',
    questions: [
      { id: 'q_beg_1', goodAnswer: 'ja', weight: 'soft',
        text: 'Vertelt de fokker wat de pups eten en hoe je een eventuele overgang rustig aanpakt?',
        flagText: 'Informatie over wat de pups eten en hoe je een overgang aanpakt, helpt je een goede start te maken. Een abrupte voedingswissel kan maagdarmklachten geven.',
        follow: 'Wat eten de pups? Krijgen we deze voeding ook mee?' },
      { id: 'q_beg_2', goodAnswer: 'ja', weight: 'soft',
        text: 'Krijg je schriftelijke informatie mee over de eerste periode thuis?',
        flagText: 'Een overdrachtsblad of instructies voor de eerste weken kunnen je helpen de overgang soepeler te laten verlopen.',
        follow: 'Geef je iets mee over de eerste weken thuis, zoals slaap, gedrag en gewenning?' },
      { id: 'q_beg_3', goodAnswer: 'ja', weight: 'soft',
        text: 'Is de fokker ook na de overdracht bereikbaar als je vragen hebt?',
        flagText: 'Het is prettig als je met vragen bij de fokker terechtkan, ook nadat je de pup mee hebt genomen.',
        follow: 'Kan ik ook na de overdracht nog bij je terecht met vragen?' },
      { id: 'q_beg_4', goodAnswer: 'ja', weight: 'soft',
        text: 'Vraagt de fokker je te laten weten hoe het met de pup gaat?',
        flagText: 'Een fokker die wil weten hoe het gaat, toont betrokkenheid. Dat is geen vereiste, maar een teken van zorg voor zijn dieren.',
        follow: 'Wil je updates over hoe de pup het bij ons doet?' },
      { id: 'q_beg_5', goodAnswer: 'ja', weight: 'soft',
        text: 'Krijg je van de fokker informatie mee over de verzorgingsbehoeften van dit ras, denk aan vacht, beweging of andere aandachtspunten?',
        flagText: 'Praktische informatie over verzorging bij de overdracht helpt je goed voorbereid te starten, en voorkomt dat je achteraf voor verrassingen komt te staan.',
        follow: '' },
    ],
  },
];

const ALL_Q = THEMES.flatMap(t => t.questions);

// Paginering: 5 vragen per pagina
const PAGE_SIZE = 5;
const PAGES = [];
for (let i = 0; i < ALL_Q.length; i += PAGE_SIZE) {
  PAGES.push(ALL_Q.slice(i, i + PAGE_SIZE));
}
// Geef elke pagina een themakoptekst op basis van de eerste vraag op die pagina
function pageTitle(pageQuestions) {
  const firstId = pageQuestions[0]?.id ?? '';
  for (const t of THEMES) {
    if (t.questions.some(q => q.id === firstId)) return t.name;
  }
  return '';
}
function pageThemeIndex(pageQuestions) {
  const firstId = pageQuestions[0]?.id ?? '';
  const idx = THEMES.findIndex(t => t.questions.some(q => q.id === firstId));
  return idx >= 0 ? idx + 1 : null;
}

const DISCLAIMER = 'Deze tool geeft een inschatting op basis van de antwoorden die je hebt ingevuld. Geen enkele vraag bepaalt op zichzelf of een fokker goed of slecht is. Meerdere kleine aandachtspunten samen kunnen een reden zijn om extra kritisch te zijn. Andersom hoeft één aandachtspunt niet direct te betekenen dat er iets mis is. Voelt iets niet goed, maar kun je niet precies uitleggen waarom? Neem dat gevoel serieus.';

// ── Score ─────────────────────────────────────────────────────
function calcScore(answers) {
  const hard = [], soft = [];
  let answered = 0;
  ALL_Q.forEach(q => {
    const a = answers[q.id];
    if (!a) return;
    answered++;
    if (a !== q.goodAnswer) { q.weight === 'hard' ? hard.push(q) : soft.push(q); }
  });
  if (answered === 0) return { level: 'grey', hard, soft };
  return { level: hard.length ? 'red' : soft.length ? 'orange' : 'green', hard, soft };
}

function qStatus(q, ans) {
  const a = ans[q.id];
  if (!a) return 'empty';
  if (a === q.goodAnswer) return 'good';
  return q.weight === 'hard' ? 'hard' : 'soft';
}

const CARD_S = {
  empty: { background: '#fff',     border: '1px solid #e5e7eb' },
  good:  { background: '#f6fef9',  border: '1px solid #86efac' },
  soft:  { background: C.orangeBg, border: `1px solid ${C.orangeBorder}` },
  hard:  { background: '#fef7f7',  border: '2px solid #e08080' },
};

// ── Antwoordknop ──────────────────────────────────────────────
function AnsBtn({ val, label, q, ans, onAns }) {
  const isSel = ans[q.id] === val;
  let bg = '#fff', color = '#6b7280', border = '1.5px solid #d1d5db';
  if (isSel) {
    if (val === q.goodAnswer) { bg = '#16a34a'; color = '#fff'; border = '1.5px solid #16a34a'; }
    else if (q.weight === 'hard') { bg = '#c0392b'; color = '#fff'; border = '1.5px solid #c0392b'; }
    else { bg = C.orange; color = '#fff'; border = `1.5px solid ${C.orange}`; }
  }
  return (
    <button onClick={() => onAns(q.id, val)} style={{ fontFamily: 'inherit', fontSize: 12, fontWeight: 600, padding: '5px 16px', borderRadius: 6, border, background: bg, color, cursor: 'pointer', transition: 'all 0.15s ease' }}>
      {label}
    </button>
  );
}

// ── Vraagkaart met accordion ──────────────────────────────────
function QuestionCard({ q, ans, onAns }) {
  const [open, setOpen] = useState(false);
  const s = qStatus(q, ans);
  const isBad = s === 'hard' || s === 'soft';
  const dividerColor = s === 'hard' ? '#f5b8b8' : s === 'soft' ? C.orangeBorder : s === 'good' ? '#c6f0d4' : '#e5e7eb';

  return (
    <div style={{ ...CARD_S[s], borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.2s ease, background 0.2s ease' }}>

      {/* Kaartinhoud */}
      <div style={{ padding: '10px 12px' }}>

        {/* Badge */}
        {s === 'hard' && (
          <div style={{ display: 'inline-block', background: '#c0392b', color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4, marginBottom: 6 }}>
            Rode vlag
          </div>
        )}
        {s === 'soft' && (
          <div style={{ display: 'inline-block', background: C.orange, color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4, marginBottom: 6 }}>
            Aandachtspunt
          </div>
        )}

        {/* Vraagtekst */}
        <p style={{ margin: '0 0 9px', fontSize: 14, lineHeight: 1.55, fontWeight: isBad ? 600 : 500, color: C.dark }}>
          {q.text}
        </p>

        {/* Ja / Nee */}
        <div style={{ display: 'flex', gap: 6 }}>
          <AnsBtn val="ja"  label="Ja"  q={q} ans={ans} onAns={onAns} />
          <AnsBtn val="nee" label="Nee" q={q} ans={ans} onAns={onAns} />
        </div>

        {/* Bevestiging bij goed antwoord */}
        {s === 'good' && (
          <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: '#16a34a' }}>Goed teken</div>
        )}
      </div>

      {/* Altijd uitklapbare toelichting */}
      <div style={{ borderTop: `1px solid ${dividerColor}` }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '8px 12px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 600,
            color: C.copperMid,
            textAlign: 'left',
          }}
        >
          <span>Meer uitleg</span>
          <span style={{ fontSize: 9, marginLeft: 8, transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>

        {open && (
          <div style={{ padding: '0 12px 12px', borderTop: `1px solid ${dividerColor}` }}>
            <p style={{ margin: '10px 0 0', fontSize: 11, lineHeight: 1.65, color: isBad ? (s === 'hard' ? '#9b2222' : C.orangeDark) : '#374151' }}>
              {q.flagText}
            </p>
            {q.follow && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${dividerColor}` }}>
                <p style={{ margin: '0 0 3px', fontSize: 9, fontWeight: 700, color: C.copperMid, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Vraag aan de fokker</p>
                <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#374151', fontStyle: 'italic' }}>{q.follow}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Accordion sectie ─────────────────────────────────────────
function AccordionSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e3db', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: C.dark, textAlign: 'left' }}
      >
        <span>{title}</span>
        <span style={{ fontSize: 10, color: C.grey, transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>
      {open && (
        <div style={{ borderTop: '1px solid #e8e3db', padding: '14px 18px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Werkboek-kaart ────────────────────────────────────────────
const WERKBOEK_URL = 'https://www.opvierpootjes.nl/werkboek-fokkercheck'; // pas URL aan als werkboek beschikbaar is

function WorkbookCard() {
  const [choice, setChoice] = useState(null);
  return (
    <div style={{ background: '#fffbf5', border: `1.5px solid ${C.copperLight}`, borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}>
      <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: C.dark }}>
        Wil je een downloadbaar werkboek?
      </p>
      <p style={{ margin: '0 0 12px', fontSize: 12, color: C.grey, lineHeight: 1.6 }}>
        Met het werkboek bereid je je voor op het bezoek aan de fokker — alle vragen op een rij, printbaar en om mee te nemen.
      </p>
      {choice === null && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setChoice('ja')} style={{ fontFamily: 'inherit', padding: '8px 20px', borderRadius: 7, border: 'none', background: C.copper, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Ja, ik wil het werkboek</button>
          <button onClick={() => setChoice('nee')} style={{ fontFamily: 'inherit', padding: '8px 16px', borderRadius: 7, border: '1.5px solid #d1d5db', background: '#fff', color: C.grey, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Nee, bedankt</button>
        </div>
      )}
      {choice === 'ja' && (
        <div>
          <a href={WERKBOEK_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', background: C.copper, color: '#fff', borderRadius: 7, padding: '9px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none', marginBottom: 8 }}>
            ↓ Download werkboek (PDF)
          </a>
          <p style={{ margin: 0, fontSize: 11, color: C.grey }}>Opent als PDF in een nieuw tabblad.</p>
        </div>
      )}
      {choice === 'nee' && (
        <p style={{ margin: 0, fontSize: 12, color: C.grey }}>Geen probleem. Je kunt altijd terugkomen via <a href="https://www.opvierpootjes.nl" style={{ color: C.copperMid }}>opvierpootjes.nl</a>.</p>
      )}
    </div>
  );
}

// ── Stap-stippen ──────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 7, width: i === current ? 18 : 7, borderRadius: 99, background: i < current ? C.copperMid : i === current ? C.copper : '#d1d5db', transition: 'all 0.25s' }} />
      ))}
    </div>
  );
}

// ── Live scorebadge ───────────────────────────────────────────
function LiveBadge({ answers }) {
  const { hard, soft } = calcScore(answers);
  const n = hard.length + soft.length;
  if (!n) return <span style={{ fontSize: 11, fontWeight: 600, color: '#15803d', background: '#f0fdf4', border: '1px solid #86efac', padding: '2px 10px', borderRadius: 20 }}>Geen signalen</span>;
  if (hard.length) return <span style={{ fontSize: 11, fontWeight: 700, color: '#991b1b', background: '#fef7f7', border: '1px solid #fca5a5', padding: '2px 10px', borderRadius: 20 }}>{hard.length} rode vlag{hard.length > 1 ? 'gen' : ''}{soft.length ? ` · ${soft.length}` : ''}</span>;
  return <span style={{ fontSize: 11, fontWeight: 600, color: C.orangeDark, background: C.orangeBg, border: `1px solid ${C.orangeBorder}`, padding: '2px 10px', borderRadius: 20 }}>{soft.length} aandachtspunt{soft.length > 1 ? 'en' : ''}</span>;
}

// ── Startscherm ───────────────────────────────────────────────
function StartScreen({ onStart }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f5f7', fontFamily: 'Montserrat, Helvetica Neue, Arial, sans-serif', color: C.dark }}>
      <div style={{ background: '#f0f5f7', padding: '28px 24px 24px', textAlign: 'center' }}>
        <a href="https://www.opvierpootjes.nl" style={{ display: 'inline-block', marginBottom: 14, fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.55)', textDecoration: 'none', letterSpacing: '0.02em' }}>
          ← Homepage Op Vier Pootjes
        </a>
        <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.5 }}>Ben je op zoek naar een pup?</p>
        <h1 style={{ margin: '0 0 14px', fontSize: 22, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.01em' }}>Doe de Fokkercheck</h1>
        <p style={{ margin: 0, fontSize: 13, color: '#1a1a1a', lineHeight: 1.65, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
          Beantwoord een reeks vragen op basis van wat je ziet en hoort, en ontdek wat het totaalplaatje over deze fokker zegt.
        </p>
      </div>
      <div style={{ padding: '20px 20px 48px', maxWidth: 480, margin: '0 auto' }}>
        <button onClick={onStart}
          style={{ fontFamily: 'inherit', display: 'block', width: '100%', background: '#8b7752', color: '#fff', fontSize: 14, fontWeight: 700, padding: '14px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 20, letterSpacing: '0.01em', transition: 'opacity 0.2s' }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.85'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
          Start de check
        </button>
        <div style={{ background: '#fff', border: '1px solid #e8e3db', borderRadius: 10, padding: '18px 20px', marginBottom: 16 }}>
          {THEMES.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: i < THEMES.length - 1 ? 10 : 0, marginBottom: i < THEMES.length - 1 ? 10 : 0, borderBottom: i < THEMES.length - 1 ? '1px solid #f0ece6' : 'none' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid ${C.copperLight}`, color: C.copper, fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a' }}>{t.name}</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', border: '1px solid #e8e3db', borderRadius: 10, padding: '18px 20px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Zo werkt de uitslag</p>
          {[{ color: '#16a34a', text: 'geen duidelijke rode vlaggen' }, { color: C.orange, text: 'aandachtspunten, vraag verder voor je beslist' }, { color: '#c0392b', text: 'duidelijke rode vlaggen, neem dit serieus' }].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>{row.text}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: C.grey, marginTop: 16 }}>{ALL_Q.length} vragen · ca. 5 minuten</p>
      </div>
    </div>
  );
}

// ── Themascherm ───────────────────────────────────────────────
function ThemeScreen({ questions, idx, total, answers, onAns, onNext, onPrev }) {
  const unanswered = questions.filter(q => !answers[q.id]).length;
  const isLast = idx === total - 1;
  const title = pageTitle(questions);
  const themeIndex = pageThemeIndex(questions);
  return (
    <div style={{ minHeight: '100vh', background: '#f0f5f7', fontFamily: 'Montserrat, Helvetica Neue, Arial, sans-serif', color: C.dark, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff', borderBottom: '1px solid #e8e3db', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StepDots current={idx} total={total} />
          <span style={{ fontSize: 11, color: C.grey, fontWeight: 600 }}>{idx + 1} / {total}</span>
        </div>
        <LiveBadge answers={answers} />
      </div>
      <div style={{ background: '#f0f5f7', color: '#1a1a1a', padding: '18px 20px 16px' }}>
        {themeIndex && (
          <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Thema {themeIndex} van 5
          </p>
        )}
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{title}</h2>
      </div>
      <div style={{ flex: 1, padding: '10px 12px 8px', maxWidth: 600, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {questions.map(q => <QuestionCard key={q.id} q={q} ans={answers} onAns={onAns} />)}
        </div>
      </div>
      <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: '1px solid #e8e3db', padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 10, maxWidth: 600, margin: '0 auto' }}>
          <button onClick={onPrev} style={{ fontFamily: 'inherit', flexShrink: 0, padding: '10px 18px', borderRadius: 8, border: '1.5px solid #e8e3db', background: '#fff', color: C.grey, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Vorige</button>
          <button onClick={onNext}
            style={{ fontFamily: 'inherit', flex: 1, padding: '10px 18px', borderRadius: 8, border: 'none', background: '#8b7752', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.85')} onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
            {isLast ? 'Bekijk uitslag' : 'Volgende'}
          </button>
        </div>
        {unanswered > 0 && (
          <p style={{ textAlign: 'center', fontSize: 11, color: C.grey, marginTop: 8, marginBottom: 0 }}>
            {unanswered} {unanswered > 1 ? 'vragen' : 'vraag'} nog niet ingevuld — je kunt ook zo doorgaan
          </p>
        )}
      </div>
    </div>
  );
}

// ── Uitslagscherm ─────────────────────────────────────────────
function ResultScreen({ answers, onRestart, onRequestGids }) {
  const { level, hard, soft } = calcScore(answers);
  const skipped = ALL_Q.filter(q => !answers[q.id]).length;
  const LEVEL = {
    green:  { bg: '#f6fef9', border: '#86efac', headerText: 'Ziet er zorgvuldig uit',  lc: '#15803d', dot: '#16a34a' },
    orange: { bg: C.orangeBg, border: C.orangeBorder, headerText: 'Er zijn aandachtspunten', lc: C.orangeDark, dot: C.orange },
    red:    { bg: '#fef7f7', border: '#f5b8b8', headerText: 'Er zijn rode vlaggen',    lc: '#991b1b', dot: '#c0392b' },
    grey:   { bg: '#f3f4f6', border: '#d1d5db', headerText: 'Geen vragen beantwoord',  lc: '#374151', dot: '#9ca3af' },
  };
  const L = LEVEL[level];
  const VERDICT = {
    green:  { desc: 'Er zijn geen duidelijke rode vlaggen naar voren gekomen. Dat is een goed teken. Blijf wel kritisch en neem nooit bij het eerste bezoek direct een pup mee.', advice: 'Je kunt voorzichtig verder, maar vertrouw ook op je eigen gevoel.' },
    orange: { desc: 'Er zijn signalen die om aandacht vragen. Dit betekent niet dat de fokker onbetrouwbaar is, maar je hebt meer informatie nodig voor je beslist.', advice: 'Stel je openstaande vragen eerst. Neem de tijd en kom desnoods nog een keer terug.' },
    red:    { desc: 'Er zijn een of meer rode vlaggen gevonden. Dit zijn signalen die je serieus moet nemen. Het is verstandig om eerst alle twijfels op te helderen voor je een beslissing neemt.', advice: 'Ga niet verder zonder alle vragen beantwoord te hebben. Twijfel je flink? Neem dan de tijd.' },
    grey:   { desc: 'Je hebt geen vragen beantwoord, dus er kan geen uitslag worden gegeven. Ga terug en beantwoord de vragen om een betrouwbaar beeld te krijgen.', advice: 'Hoe meer vragen je invult, hoe betrouwbaarder het beeld.' },
  };
  const v = VERDICT[level];
  const followItems = [...hard, ...soft].filter(q => q.follow);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f5f7', fontFamily: 'Montserrat, Helvetica Neue, Arial, sans-serif', color: C.dark }}>
      <div style={{ background: '#f0f5f7', color: '#1a1a1a', padding: '28px 24px 22px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: L.dot, flexShrink: 0 }} />
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{L.headerText}</h1>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.7, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>{v.desc}</p>
      </div>

      <div style={{ padding: '16px 16px 48px', maxWidth: 580, margin: '0 auto' }}>

        {/* Compact advies */}
        <div style={{ background: L.bg, border: `1px solid ${L.border}`, borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: L.lc, lineHeight: 1.65 }}>{v.advice}</p>
        </div>

        {/* Melding onbeantwoorde vragen */}
        {skipped > 0 && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
            <p style={{ margin: 0, fontSize: 12, color: '#92400e', lineHeight: 1.65 }}>
              Je hebt {skipped} van de {ALL_Q.length} vragen niet beantwoord. De uitslag is daardoor gebaseerd op een deel van de informatie — hoe meer je invult, hoe betrouwbaarder het beeld.
            </p>
          </div>
        )}

        {/* Samenvatting signalen — compact, altijd zichtbaar */}
        {(hard.length > 0 || soft.length > 0) && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {hard.length > 0 && (
              <span style={{ fontSize: 12, fontWeight: 700, background: '#fef7f7', border: '1px solid #f5b8b8', color: '#991b1b', padding: '4px 12px', borderRadius: 20 }}>
                {hard.length} rode vlag{hard.length > 1 ? 'gen' : ''}
              </span>
            )}
            {soft.length > 0 && (
              <span style={{ fontSize: 12, fontWeight: 700, background: C.orangeBg, border: `1px solid ${C.orangeBorder}`, color: C.orangeDark, padding: '4px 12px', borderRadius: 20 }}>
                {soft.length} aandachtspunt{soft.length > 1 ? 'en' : ''}
              </span>
            )}
          </div>
        )}
        {hard.length === 0 && soft.length === 0 && skipped === 0 && level === 'green' && (
          <div style={{ background: '#f6fef9', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#166534', lineHeight: 1.65 }}>Je hebt alle vragen positief beantwoord. Vertrouw ook op je eigen gevoel en neem nooit bij het eerste bezoek direct een pup mee.</p>
          </div>
        )}

        {/* Gevonden signalen — uitklapbaar */}
        {(hard.length > 0 || soft.length > 0) && (
          <AccordionSection title={`Gevonden signalen (${hard.length + soft.length})`} defaultOpen={false}>
            {hard.length > 0 && (
              <div style={{ marginBottom: soft.length ? 14 : 0 }}>
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rode vlaggen</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {hard.map(q => (
                    <div key={q.id} style={{ background: '#fef7f7', border: '1px solid #f5b8b8', borderRadius: 8, padding: '11px 14px' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#7f1d1d' }}>{q.text}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#991b1b', lineHeight: 1.6 }}>{q.flagText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {soft.length > 0 && (
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: C.orangeDark, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Aandachtspunten</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {soft.map(q => (
                    <div key={q.id} style={{ background: C.orangeBg, border: `1px solid ${C.orangeBorder}`, borderRadius: 8, padding: '11px 14px' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: C.orangeDark }}>{q.text}</p>
                      <p style={{ margin: 0, fontSize: 11, color: C.orangeDark, lineHeight: 1.6 }}>{q.flagText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AccordionSection>
        )}

        {/* Vragen voor de fokker — uitklapbaar */}
        {followItems.length > 0 && (
          <AccordionSection title={`Vragen voor de fokker (${followItems.length})`} defaultOpen={false}>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: C.grey }}>Stel deze vragen voor je een definitieve beslissing neemt.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {followItems.map(q => (
                <div key={q.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: C.copperMid, fontWeight: 700, flexShrink: 0, fontSize: 14 }}>›</span>
                  <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{q.follow}</span>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}

        {/* Disclaimer — uitklapbaar */}
        <AccordionSection title="Toelichting op deze uitslag" defaultOpen={false}>
          <p style={{ margin: 0, fontSize: 12, color: C.grey, lineHeight: 1.7 }}>{DISCLAIMER}</p>
        </AccordionSection>

        {/* Gids aanvragen — subtiel */}
        <p style={{ textAlign: 'center', fontSize: 13, color: C.grey, marginBottom: 12 }}>
          Ik wil toch graag de complete gids of de waardevolle mails ontvangen —{' '}
          <button onClick={onRequestGids} style={{ fontFamily: 'inherit', background: 'none', border: 'none', padding: 0, fontSize: 13, color: C.copperMid, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>klik hier</button>
        </p>

        <button onClick={onRestart} style={{ fontFamily: 'inherit', width: '100%', background: '#fff', color: C.grey, fontSize: 13, fontWeight: 600, padding: '11px 24px', borderRadius: 8, border: '1.5px solid #e8e3db', cursor: 'pointer', marginTop: 4 }}>Opnieuw beginnen</button>
        <a href="https://opvierpootjes.nl/?page_id=21895&preview=true" style={{ display: 'block', textAlign: 'center', background: '#fff', color: C.copperMid, border: '1.5px solid ' + C.copperMid, borderRadius: 8, padding: '11px 24px', fontSize: 13, fontWeight: 700, textDecoration: 'none', marginTop: 8 }}>Ga naar de website van Op Vier Pootjes →</a>
      </div>
    </div>
  );
}

// ── Opt-in webhook ────────────────────────────────────────────
const OPTIN_WEBHOOK_URL = '/api/subscribe';

// ── Opt-in scherm ─────────────────────────────────────────────
function OptinScreen({ onSuccess, onSkip }) {
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const isValid = name.trim().length > 0 && email.includes('@') && email.includes('.');

  const handleSubmit = async () => {
    if (!isValid) { setError('Vul een geldig e-mailadres in.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(OPTIN_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, source: 'fokkercheck', timestamp: new Date().toISOString() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Fout ${res.status}`);
      }
    } catch (err) {
      setLoading(false);
      setError('Er ging iets mis. Probeer het opnieuw of sla dit stap over.');
      return;
    }
    setLoading(false);
    setSubmitted(true);
    setTimeout(onSuccess, 2200);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f5f7', fontFamily: 'Montserrat, Helvetica Neue, Arial, sans-serif', color: C.dark, display: 'flex', flexDirection: 'column' }}>

      {/* Smalle header */}
      <div style={{ background: '#f0f5f7', padding: '14px 20px', textAlign: 'center' }}>
        <a href="https://opvierpootjes.nl/?page_id=21895&preview=true" style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', textDecoration: 'none', letterSpacing: '0.02em' }}>← opvierpootjes.nl</a>
      </div>

      {/* Inhoud */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px 32px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          {/* Kaart */}
          <div style={{ background: '#f6f6f6', border: '1px solid #e5e7eb', borderRadius: 14, padding: '22px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* Icoon + titel op één rij */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                📋
              </div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.dark, lineHeight: 1.25 }}>
                Ontvang de complete gids
              </h2>
            </div>

            <p style={{ margin: '0 0 8px', fontSize: 13, color: '#000', lineHeight: 1.65 }}>
              Je hebt nu een eerste indruk gekregen van mogelijke aandachtspunten en signalen. Wil je beter begrijpen waar je op kunt letten tijdens je zoektocht naar een pup?
            </p>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#000', lineHeight: 1.65 }}>
              Vraag de gratis gids aan — met praktische uitleg, checklists, vragen voor fokkers en handige formulieren om fokkers te vergelijken.
            </p>

            {!submitted ? (
              <>
                {/* Voornaam */}
                <input
                  type="text"
                  placeholder="Voornaam"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{
                    fontFamily: 'inherit',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1.5px solid ${C.stoneBorder}`,
                    fontSize: 13,
                    marginBottom: 8,
                    boxSizing: 'border-box',
                    background: '#fff',
                    color: C.dark,
                    outline: 'none',
                  }}
                />

                {/* E-mailinvoer */}
                <input
                  type="email"
                  placeholder="jouw@emailadres.nl"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{
                    fontFamily: 'inherit',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: error ? '1.5px solid #e08080' : `1.5px solid ${C.stoneBorder}`,
                    fontSize: 13,
                    marginBottom: error ? 5 : 8,
                    boxSizing: 'border-box',
                    background: '#fff',
                    color: C.dark,
                    outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                />
                {error && <p style={{ margin: '0 0 8px', fontSize: 12, color: '#c0392b' }}>{error}</p>}

                {/* CTA-knop */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    fontFamily: 'inherit',
                    width: '100%',
                    padding: '11px 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: loading ? '#b9a46e' : '#8b7752',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: loading ? 'default' : 'pointer',
                    transition: 'opacity 0.2s',
                    marginBottom: 6,
                    letterSpacing: '0.01em',
                  }}
                  onMouseOver={e => !loading && (e.currentTarget.style.opacity = '0.85')}
                  onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? 'Even geduld…' : 'Ontvang de gids'}
                </button>

                {/* Spam-notitie */}
                <p style={{ margin: '0 0 10px', fontSize: 11, color: '#000', lineHeight: 1.65, textAlign: 'center' }}>
                  <strong>Controleer je spammap als je de mail niet direct ziet.</strong> Het helpt ook om het afzenderadres op te slaan, zodat je niks mist.
                </p>

                {/* Skip-link */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={onSkip}
                    style={{ fontFamily: 'inherit', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#000', textDecoration: 'underline', padding: 0 }}
                  >
                    Nee bedankt, toon mijn uitslag
                  </button>
                </div>
              </>
            ) : (
              /* Bedankbericht */
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✉️</div>
                <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: C.copper }}>
                  Bedankt!
                </p>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: '#000', lineHeight: 1.65 }}>
                  De gids is onderweg naar je mailbox.
                </p>
                <p style={{ margin: 0, fontSize: 12, color: '#000' }}>Je uitslag wordt zo geladen…</p>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  const [screen,   setScreen]   = useState('start');
  const [themeIdx, setThemeIdx] = useState(0);
  const [answers,  setAnswers]  = useState({});

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const onAns          = (id, val) => setAnswers(p => ({ ...p, [id]: val }));
  const onStart        = () => { setAnswers({}); setThemeIdx(0); setScreen('questions'); };
  const onNext         = () => { themeIdx < PAGES.length - 1 ? setThemeIdx(i => i + 1) : setScreen('optin'); };
  const onPrev         = () => { themeIdx > 0 ? setThemeIdx(i => i - 1) : setScreen('start'); };
  const onRestart      = () => { setAnswers({}); setThemeIdx(0); setScreen('start'); };
  const onRequestGids  = () => setScreen('optin');

  if (screen === 'start')     return <><StartScreen onStart={onStart} /><Analytics /></>;
  if (screen === 'questions') return <><ThemeScreen questions={PAGES[themeIdx]} idx={themeIdx} total={PAGES.length} answers={answers} onAns={onAns} onNext={onNext} onPrev={onPrev} /><Analytics /></>;
  if (screen === 'optin')     return <><OptinScreen onSuccess={() => setScreen('results')} onSkip={() => setScreen('results')} /><Analytics /></>;
  if (screen === 'results')   return <><ResultScreen answers={answers} onRestart={onRestart} onRequestGids={onRequestGids} /><Analytics /></>;
}
