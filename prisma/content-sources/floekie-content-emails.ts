/**
 * Floekie — Email Sequences
 * GH6: Quiz-to-Profile Nurture (5 emails, dag 0-12)
 * GH8: Subscriber Feature Adoption (5 emails, dag 0-18)
 *
 * Taal: Nederlands (BE/NL)
 * Tone of Voice: Warm, persoonlijk, Imen als afzender
 * Frameworks: Soap Opera Sequence (druppelsgewijs waarde onthullen)
 */

export const floekieEmailSequences = {
  GH6_nurture: {
    name: "Quiz-to-Profile Nurture",
    trigger: "quiz_complete + email_captured + NOT payment_complete",
    emails: [
      {
        day: 0,
        subject: "Je quizresultaat staat klaar!",
        previewText: "En er is nog zoveel meer te ontdekken over jouw match...",
        body: `<p>Hey!</p>

<p>Imen hier, van Floekie. Super leuk dat je de ras-quiz hebt gedaan! Je hebt je top 3 matches gezien en ik hoop dat er een ras tussen zat waar je meteen dacht: ja, die past bij mij.</p>

<p>Maar eerlijk? Die quizresultaten zijn eigenlijk pas het begin.</p>

<p>Ik heb Floekie gebouwd omdat ik zelf jarenlang heb geworsteld met vragen als: hoeveel voer geef ik nu precies? Zit mijn hond op een gezond gewicht? Welke producten zijn echt goed voor haar ras? Met 4 honden in huis (waarvan 2 rescue) heb ik geleerd dat elk ras andere noden heeft. En dat de informatie online vaak tegenstrijdig is.</p>

<p>Daarom heb ik alles wat ik weet samengebracht in een persoonlijk hondenprofiel. Denk aan een op-maat voedingsplan, een gewichttracker, persoonlijke productaanbevelingen en tips per levensfase. Allemaal afgestemd op jouw specifieke hond.</p>

<p>De komende dagen laat ik je zien wat dat profiel precies voor jou en je (toekomstige) viervoeter kan betekenen. En als je nu al nieuwsgierig bent:</p>`,
        ctaText: "Ontdek wat je profiel bevat",
        ctaLink: "/profiel-aanmaken",
      },
      {
        day: 2,
        subject: "Hoeveel voer geef jij je hond?",
        previewText: "De meeste hondeneigenaren gissen. Dat kan anders.",
        body: `<p>Hey!</p>

<p>Wist je dat de meeste hondeneigenaren het voer van hun hond gewoon inschatten? Een beetje meer als ze hongerig lijken, een beetje minder als er wat overblijft. Ik deed het vroeger ook zo.</p>

<p>Tot ik ontdekte dat de juiste portie echt per hond verschilt. En dan heb ik het niet over "klein/middel/groot" op de verpakking. Ik bedoel: berekend op basis van het gewicht, de leeftijd, het ras en het activiteitsniveau van jouw specifieke hond.</p>

<p>In Floekie zit een voedingsplan dat precies dat doet. Het is gebaseerd op veterinaire formules (RER en MER) die dierenartsen ook gebruiken. Je vult het gewicht en de gegevens van je hond in, en je krijgt direct te zien hoeveel gram droogvoer, natvoer of vers voer je hond per dag nodig heeft.</p>

<p>Waarom dat belangrijk is? Omdat te veel voer leidt tot overgewicht (en dat is helaas de nummer 1 gezondheidskiller bij honden). En te weinig voer zorgt voor energietekort, een doffe vacht en minder weerstand. Het juiste evenwicht maakt echt verschil.</p>

<p>Het voedingsplan past zich ook aan als je hond ouder wordt of als het gewicht verandert. Het groeit mee met je viervoeter.</p>

<p>Benieuwd wat het voedingsplan voor jouw hond berekent?</p>`,
        ctaText: "Bereken het voedingsplan voor jouw hond",
        ctaLink: "/profiel-aanmaken",
      },
      {
        day: 5,
        subject: "Floekie woog vorig jaar 2 kilo te veel",
        previewText: "Hoe ik erachter kwam en wat ik deed.",
        body: `<p>Hey!</p>

<p>Ik moet je iets eerlijks vertellen. Floekie, mijn teckel van 11 jaar en de naamgever van de app, woog vorig jaar 2 kilo te veel. En ik had het niet eens door.</p>

<p>Ze leek gewoon lekker stevig. Maar toen de dierenarts haar woog en zei "Imen, dit is te veel voor een teckel van haar leeftijd", schrok ik. Twee kilo klinkt misschien niet veel, maar voor een teckel van 8 kilo is dat 25% overgewicht. Dat belast haar rug, haar gewrichten, alles.</p>

<p>Sindsdien houd ik haar gewicht elke twee weken bij. En precies dat is waarom ik de gewichttracker in Floekie heb gebouwd. Je logt het gewicht van je hond, en de app laat je zien of het normaal is voor het ras, de leeftijd en de grootte. Met een duidelijke status: te licht, normaal, of te zwaar.</p>

<p>Het klinkt simpel, maar het heeft mij geholpen om Floekie gezond terug op gewicht te krijgen. Stap voor stap, zonder crash-dieet, gewoon door de juiste porties te geven en het bij te houden.</p>

<p>Ik wil niet dat jij dezelfde fout maakt als ik. Dus als je een hond hebt (of binnenkort krijgt), en je wilt het gewicht in de gaten houden:</p>`,
        ctaText: "Start met de gewichttracker",
        ctaLink: "/profiel-aanmaken",
      },
      {
        day: 8,
        subject: "De juiste producten voor jouw hond (zonder urenlang zoeken)",
        previewText: "Persoonlijke aanbevelingen op basis van ras, leeftijd en gewicht.",
        body: `<p>Hey!</p>

<p>Heb jij ook weleens een half uur in de dierenwinkel gestaan, niet wetend welk voer of welke snack nu echt goed is voor jouw hond? Ik wel. Keer op keer.</p>

<p>Met 4 honden heb ik inmiddels een klein fortuin uitgegeven aan producten die uiteindelijk niet pasten. Te groot, verkeerde voedingswaarde, niet geschikt voor de leeftijd. Frustrerend.</p>

<p>Daarom heb ik in Floekie persoonlijke productaanbevelingen ingebouwd. Op basis van het ras, de leeftijd en het gewicht van jouw hond krijg je suggesties die echt relevant zijn. Voer dat past bij de grootte van je hond. Snacks die geschikt zijn voor de leeftijdsfase. Verzorgingsproducten die werken voor het type vacht.</p>

<p>De producten komen van Maxizoo, een van de grootste dierenwinkels in de Benelux. Je kan ze direct online bestellen of in de winkel ophalen. En het mooie is: doordat de aanbevelingen op maat zijn, koop je minder onzin. Dat scheelt je op de lange termijn echt geld.</p>

<p>Ik gebruik het zelf ook nog steeds. Vooral voor Floekie, die als senior teckel ander voer nodig heeft dan mijn jongere honden. Het bespaart me tijd en ik weet zeker dat ik het juiste in huis haal.</p>

<p>Wil je zien welke producten bij jouw hond passen?</p>`,
        ctaText: "Bekijk jouw productaanbevelingen",
        ctaLink: "/profiel-aanmaken",
      },
      {
        day: 12,
        subject: "Alles voor je hond, op een plek",
        previewText: "Voedingsplan, gewichttracker, producten en tips. Voor €4.95/maand.",
        body: `<p>Hey!</p>

<p>De afgelopen dagen heb ik je laten zien wat Floekie allemaal kan. Laat me het even samenvatten, want het is best veel voor een kleine app:</p>

<p><strong>Wat je krijgt met een Floekie profiel:</strong></p>
<ul>
<li>Een persoonlijk voedingsplan op basis van veterinaire formules, afgestemd op het ras, gewicht en de leeftijd van jouw hond</li>
<li>Een gewichttracker die je laat zien of je hond op een gezond gewicht zit</li>
<li>Productaanbevelingen van Maxizoo, op maat geselecteerd</li>
<li>Tips per levensfase: puppy, volwassen of senior</li>
<li>Een dierenarts zoeker voor heel Vlaanderen</li>
<li>Alles op een persoonlijk dashboard, speciaal voor jouw hond</li>
</ul>

<p>Ik heb dit gebouwd vanuit mijn eigen ervaring met 4 honden. Geen grote bedrijfsbelangen, geen verborgen agenda. Gewoon alles wat ik zelf had willen hebben, samengebracht op een plek.</p>

<p>Een Floekie profiel kost €4.95 per maand en je kan maandelijks opzeggen. Geen contract, geen verrassingen.</p>

<p>Al meer dan 500 hondeneigenaren hebben de quiz gedaan en ontdekt wat Floekie voor hun hond kan betekenen. Klaar om de volgende stap te zetten?</p>`,
        ctaText: "Maak nu je hondenprofiel aan",
        ctaLink: "/profiel-aanmaken",
      },
    ],
  },

  GH8_onboarding: {
    name: "Subscriber Feature Adoption",
    trigger: "payment_complete",
    emails: [
      {
        day: 0,
        subject: "Welkom bij Floekie! Dit is jouw startpunt",
        previewText: "Je hond heeft nu een eigen profiel. Hier begin je.",
        body: `<p>Hey!</p>

<p>YES! Welkom bij Floekie. Ik ben Imen, en ik ben oprecht blij dat je een profiel hebt aangemaakt voor je hond. Je gaat hier zoveel aan hebben, geloof me.</p>

<p>Even een snelle rondleiding zodat je weet wat je allemaal kan:</p>

<p><strong>Jouw dashboard</strong> is je thuisbasis. Hier zie je alles over je hond in een oogopslag: het voedingsplan, het gewicht, tips die speciaal voor jouw ras en levensfase zijn geselecteerd, en productaanbevelingen.</p>

<p><strong>Wat ik aanraad om als eerste te doen:</strong></p>
<ol>
<li><strong>Check je hondgegevens</strong> — kloppen het ras, de leeftijd en het gewicht? Dan worden al je tips en plannen automatisch afgestemd.</li>
<li><strong>Bekijk je voedingsplan</strong> — je ziet direct hoeveel voer je hond per dag nodig heeft.</li>
<li><strong>Log het huidige gewicht</strong> — dan kan de tracker je laten zien of je hond goed zit.</li>
</ol>

<p>Het hele idee achter Floekie is simpel: alles wat je nodig hebt voor je hond, op een plek, zonder dat je overal hoeft te zoeken. Ik gebruik het zelf ook dagelijks voor mijn 4 honden. Floekie (de teckel, 11 jaar) heeft andere noden dan mijn jongere honden, en het profiel houdt daar rekening mee.</p>

<p>De komende weken stuur ik je af en toe een mail om je te helpen alles uit je profiel te halen. Maar voor nu: ga lekker rondkijken!</p>`,
        ctaText: "Ga naar je dashboard",
        ctaLink: "/dashboard",
      },
      {
        day: 2,
        subject: "Heb je het voedingsplan al bekeken?",
        previewText: "Zo werkt het en waarom het verschilt van de verpakking.",
        body: `<p>Hey!</p>

<p>Nu je profiel staat, wil ik even stilstaan bij de feature waar ik zelf het meest trots op ben: het voedingsplan.</p>

<p>Je hebt misschien al gezien dat Floekie een dagportie berekent voor je hond. Maar hoe werkt dat precies?</p>

<p>Het voedingsplan is gebaseerd op twee veterinaire formules: <strong>RER</strong> (Resting Energy Requirement) en <strong>MER</strong> (Maintenance Energy Requirement). Simpel gezegd: RER berekent hoeveel energie je hond nodig heeft in rust, en MER past dat aan op basis van het activiteitsniveau, de leeftijd en of je hond moet afvallen, aankomen of op gewicht moet blijven.</p>

<p>Waarom is dat beter dan de tabel op de voerverpakking? Omdat die tabellen heel generiek zijn. Ze houden geen rekening met het specifieke ras, de exacte leeftijd of het huidige gewicht van jouw hond. Het verschil kan makkelijk 20-30% zijn. En dat merk je op de lange termijn: in het gewicht, de energie, de vacht.</p>

<p><strong>Wat je nu kan doen:</strong> ga naar je voedingsplan en check of het gewicht van je hond up-to-date is. Hoe nauwkeuriger het gewicht, hoe beter de berekening. Je kan kiezen tussen droogvoer, natvoer en vers voer, en het plan past zich direct aan.</p>

<p>Tip van mij: weeg het voer de eerste week even af met een keukenweegschaal. Je zal verbaasd zijn hoeveel verschil er zit tussen "een schep" en de echte hoeveelheid.</p>`,
        ctaText: "Bekijk je voedingsplan",
        ctaLink: "/dashboard/voedingsplan",
      },
      {
        day: 5,
        subject: "Houd je het gewicht van je hond bij?",
        previewText: "Floekie woog 2 kilo te veel. Zo ontdekte ik het.",
        body: `<p>Hey!</p>

<p>Ik heb je al verteld over het voedingsplan. Nu wil ik het hebben over iets wat minstens zo belangrijk is: het gewicht van je hond bijhouden.</p>

<p>Kleine bekentenis: Floekie (mijn teckel, de naamgever van de app) woog vorig jaar 2 kilo te veel. En ik merkte het niet. Ze leek gewoon "lekker stevig". Tot de dierenarts me wakker schudde. Twee kilo op een teckel van 8 kilo, dat is 25% overgewicht. Niet handig voor een ras dat al gevoelig is voor rugproblemen.</p>

<p>Sindsdien weeg ik haar elke twee weken. En precies dat stukje discipline heeft haar geholpen om weer op een gezond gewicht te komen. Geen ingewikkeld dieet. Gewoon de juiste porties (dankzij het voedingsplan) en het bijhouden.</p>

<p>De gewichttracker in Floekie werkt simpel:</p>
<ul>
<li>Log het gewicht van je hond (zo vaak als je wilt, ik raad elke 2 weken aan)</li>
<li>De app vergelijkt het met het ideale gewicht voor het ras en de leeftijd</li>
<li>Je krijgt een duidelijke status: te licht, normaal, of te zwaar</li>
<li>Na een paar metingen zie je de trend: gaat het de goede kant op?</li>
</ul>

<p>Het kost je letterlijk 30 seconden. Zet je hond op de weegschaal (of weeg jezelf met en zonder je hond, dat werkt ook), en log het in de app.</p>`,
        ctaText: "Log het gewicht van je hond",
        ctaLink: "/dashboard/gewicht",
      },
      {
        day: 10,
        subject: "Producten op maat voor je hond (en een bespaartip)",
        previewText: "Niet meer gokken in de dierenwinkel.",
        body: `<p>Hey!</p>

<p>Heb je de productaanbevelingen al ontdekt in je profiel? Als je er nog niet naar hebt gekeken, dan is dit het moment.</p>

<p>Floekie selecteert producten die passen bij het ras, de leeftijd en het gewicht van jouw hond. Geen willekeurige suggesties, maar producten die echt relevant zijn. Voer dat past bij de grootte. Snacks die geschikt zijn voor de levensfase. Verzorgingsproducten voor het type vacht.</p>

<p>De producten komen van Maxizoo, een van de grootste dierenwinkels in de Benelux. Je kan direct vanuit de app bekijken wat er beschikbaar is en online bestellen of in de winkel ophalen.</p>

<p><strong>Bespaartip van Imen:</strong> Ik koop het droogvoer voor mijn honden altijd in de grote verpakking. Per kilo is dat vaak 30-40% goedkoper. En met het voedingsplan weet je precies hoeveel je nodig hebt per maand, dus je kan uitrekenen welke verpakking het voordeligst is. Geen verspilling, geen te weinig. Win-win.</p>

<p>Nog een tip: Maxizoo heeft regelmatig acties op hondenvoer. Als je weet welk merk en type je hond eet (en dat weet je dankzij de aanbevelingen), kan je gericht wachten op een aanbieding en dan inslaan. Zo bespaar ik zelf makkelijk €10-15 per maand. Met 4 honden telt dat op!</p>

<p>Ga eens kijken welke producten er voor jouw hond zijn geselecteerd.</p>`,
        ctaText: "Ontdek jouw productaanbevelingen",
        ctaLink: "/dashboard/producten",
      },
      {
        day: 18,
        subject: "Heb je alles al ontdekt?",
        previewText: "Tips per levensfase, dierenarts zoeker en meer.",
        body: `<p>Hey!</p>

<p>Je bent nu een paar weken bezig met Floekie. Hopelijk heb je het voedingsplan ingesteld, het gewicht gelogd en de productaanbevelingen bekeken. Maar er is nog meer dat je misschien nog niet hebt ontdekt.</p>

<p><strong>Tips per levensfase</strong><br>
In je dashboard vind je tips die speciaal zijn geselecteerd voor de levensfase van jouw hond. Heb je een puppy? Dan krijg je tips over socialisatie, training en de eerste dierenarsbezoeken. Een volwassen hond? Tips over beweging, tandverzorging en gedrag. Een senior? Advies over gewrichtsondersteuning, voedingsaanpassingen en comfort. De tips veranderen mee naarmate je hond ouder wordt.</p>

<p><strong>Dierenarts zoeker</strong><br>
Wist je dat je in Floekie een dierenarts kan zoeken in heel Vlaanderen? Op postcode, stad of naam. Handig als je net verhuisd bent, op vakantie gaat, of gewoon wil vergelijken. Ik heb de database zelf samengesteld, en ik werk hem regelmatig bij.</p>

<p><strong>Een vraag aan jou</strong><br>
Ik ontwikkel Floekie nog steeds door. Elke week voeg ik dingen toe en verbeter ik features. Als er iets is dat je mist, of iets dat beter kan, laat het me weten. Je kan gewoon op deze mail antwoorden. Ik lees alles zelf en ik vind het fijn om te horen hoe je de app gebruikt.</p>

<p>Bedankt dat je Floekie een kans geeft. Het betekent echt veel voor me.</p>

<p>Liefs,<br>
Imen (en Floekie de teckel, die naast me op de bank ligt terwijl ik dit schrijf)</p>`,
        ctaText: "Ga naar je dashboard",
        ctaLink: "/dashboard",
      },
    ],
  },
};
