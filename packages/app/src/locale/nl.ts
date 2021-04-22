export default {
  andere_gegevens: 'Andere gegevens',
  blok_andere_gegevens: {
    title: 'Andere gegevens',
    message:
      'Cijfers die iets kunnen zeggen over de verspreiding van het virus.',
  },
  laatst_bijgewerkt: {
    message:
      'Het dashboard wordt dagelijks rond 15:20 voorzien van nieuwe data.',
    title: 'Laatst bijgewerkt',
  },
  notificatie: {
    titel: 'Britse variant wint terrein in Nederland',
    bericht:
      'Het aantal meldingen van mensen met een positieve coronatestuitslag is in de week van 20 tot en met 26 januari, in vergelijking met de week ervoor, licht gedaald naar 35.635 meldingen. Dit actuele beeld wordt overschaduwd door de snelle opmars van de coronavariant die in het Verenigd Koninkrijk en Ierland tot een zeer hoge toestroom aan patiënten in de ziekenhuizen heeft geleid. Geschat wordt dat van de mensen die afgelopen week (20 tot en met 26 januari) besmet werden, ruim een derde de Britse variant heeft. Met de opmars van de Britse variant hebben we te maken met twee virusvarianten die zich met verschillende snelheden verspreiden in Nederland. Daardoor zijn er eigenlijk twee aparte corona-epidemieën. Een epidemie met de ‘oude’ variant, waarin het aantal infecties daalt, en een epidemie met de Britse variant waarin het aantal infecties juist toeneemt.',
    link: {
      text: 'Bekijk de toelichting van het RIVM',
      href:
        'https://www.rivm.nl/nieuws/Britse-variant-wint-terrein-in-Nederland',
    },
    subtitel: 'Wekelijkse landelijke toelichting',
    datum: '12 december 2020',
  },
  error_titel: {
    text: 'Er is iets misgegaan',
  },
  error_beschrijving: {
    text:
      'Er is helaas iets misgegaan. Ververs de pagina of probeer het later opnieuw.',
  },
  error_probeer_opnieuw: {
    text: 'Probeer opnieuw',
  },
  skiplinks: {
    inhoud: 'Ga direct naar de inhoud',
    nav: 'Ga direct naar de navigatie',
    metric_nav: 'Ga direct naar de metrieken navigatie',
    footer_nav: 'Ga direct naar de footer navigatie',
  },
  header: {
    title: 'Coronadashboard',
    text:
      'Het Coronadashboard geeft informatie over de ontwikkeling van het coronavirus in Nederland.',
    link: 'Lees meer over dit dashboard',
    logo_alt: 'Rijksoverheid',
  },
  nav: {
    links: {
      index: 'Landelijk',
      over: 'Over dit dashboard',
      meer: 'Meer informatie over het coronavirus',
      verantwoording: 'Cijferverantwoording',
      meer_href:
        'https://www.rijksoverheid.nl/onderwerpen/coronavirus-covid-19',
      veiligheidsregio: "Veiligheidsregio's",
      gemeente: 'Gemeentes',
      over_risiconiveaus: 'Over de risiconiveaus',
      veelgestelde_vragen: 'Veelgestelde vragen over dit dashboard',
      actueel: 'Actueel',
      toegankelijkheid: 'Toegankelijkheid',
    },
    title: 'Coronadashboard',
    terug_naar_alle_cijfers: 'Alle landelijke cijfers',
    terug_naar_alle_cijfers_homepage: 'Alle landelijke cijfers',
    menu: {
      open_menu: 'Open menu',
      close_menu: 'Sluit menu',
    },
    terug_naar_alle_cijfers_veiligheidsregio:
      'Alle cijfers van deze veiligheidsregio',
    terug_naar_alle_cijfers_gemeente: 'Alle cijfers van deze gemeente',
  },
  ic_opnames_per_dag: {
    datums:
      'Laatste waardes verkregen op {{dateOfReport}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href:
        'https://www.databronnencovid19.nl/Bron?naam=Nationale-Intensive-Care-Evaluatie',
      text: 'NICE via RIVM',
    },
    titel: 'Gemeld aantal intensive care-opnames per dag',
    pagina_toelichting:
      'Aantal mensen met COVID-19 dat per dag op de intensive care (IC) is opgenomen, direct of vanaf de verpleegafdeling in een ziekenhuis. Om dubbel tellen te voorkomen wordt alleen de eerste IC-opname van een patiënt meegeteld. Een opname op de IC zegt iets over de ernst van het ziektebeloop en is daarom belangrijk om de ontwikkeling van de epidemie goed te monitoren.',
    barscale_titel: 'Intensive care-opnames per dag',
    barscale_screenreader_text:
      '{{value}} intensive care-opnames per dag. Signaalwaarde: {{signaalwaarde}} opnames per dag.',
    extra_uitleg:
      'Aantal mensen met bevestigd COVID-19 dat per dag op een intensive care-afdeling van een ziekenhuis is opgenomen. Dit cijfer laat het aantal IC-opnames zien dat op één dag gemeld is. Dit kunnen ook meldingen zijn van opnames van eerdere dagen.\n\nLet op: Vanaf 25 maart toont het dashboard het aantal gemelde IC-opnames per dag in plaats van het gemiddelde aantal opnames van de afgelopen drie dagen. Het getal hierboven is daarom niet vergelijkbaar met het getal dat voorheen op het dashboard stond.',
    linechart_titel: 'Intensive care-opnames door de tijd heen',
    bronnen: {
      nice: {
        href: 'https://data.rivm.nl/covid-19/COVID-19_ic_opnames.html',
        text: 'NICE via RIVM',
        download: 'https://data.rivm.nl/covid-19/COVID-19_ic_opnames.csv',
      },
      lnaz: {
        href: 'https://lcps.nu/datafeed/',
        text: 'LCPS',
        download: 'https://lcps.nu/wp-content/uploads/covid-19.csv',
      },
    },
    kpi_bedbezetting: {
      title: 'IC-bedden bezet door patiënten met COVID-19',
      description:
        'Dit getal laat zien hoeveel IC-bedden bezet worden door patiënten met COVID-19. Het percentage geeft aan hoeveel dit is ten opzichte van alle bezette IC-bedden. Dit zegt dus niet iets over de maximale IC-capaciteit.',
    },
    chart_bedbezetting: {
      title: 'Bezetting IC-bedden door de tijd heen',
      description:
        'Deze grafiek laat het aantal IC-bedden zien dat door de tijd heen is bezet door patiënten met COVID-19. Het gaat daarbij niet alleen om de dag van opname in het ziekenhuis, maar om alle dagen waarop patiënten met COVID-19 in het ziekenhuis lagen.',
      legend_trend_label: 'Bezetting IC-bedden',
      legend_inaccurate_label: 'Cijfers zijn minder nauwkeurig',
    },
    metadata: {
      title: 'Intensive care-opnames | Coronadashboard | Rijksoverheid.nl',
      description:
        'Landelijk overzicht van het aantal mensen met bevestigd COVID-19 dat per dag op een intensive care-afdeling van een ziekenhuis is opgenomen.',
    },
    titel_sidebar: 'Intensive care-opnames',
    titel_kpi: 'Het aantal IC-opnames dat op één dag gemeld is',
    reference: {
      href: '/verantwoording#intensive-care',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    kpi_titel: 'Het aantal IC-opnames dat op één dag gemeld is',
    linechart_legend_trend_label: 'Intensive care-opnames',
    linechart_legend_inaccurate_label:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
    linechart_description:
      'In deze grafiek staan de IC-opnames vermeld op de dag dat mensen ook echt zijn opgenomen, in plaats van op de dag dat ze gemeld zijn. Zo kunnen we namelijk de ontwikkeling van het coronavirus in Nederland goed zien. Let op: omdat het aanmelden van IC-opnames vaak een paar dagen later gebeurt, zijn de meest recente dagen nooit compleet en kan het lijken alsof het aantal IC-opnames afneemt terwijl dit niet zo is.',
  },
  verdenkingen_huisartsen: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt wekelijks bijgewerkt.',
    bron: {
      href:
        'https://www.nivel.nl/nl/nivel-zorgregistraties-eerste-lijn/monitor-cijfers-covid-19-achtige-klachten-huisartsenpraktijken#opendata',
      text: 'Nivel',
    },
    estimated_amount_of_patients:
      'Geschat aantal patiënten met COVID-19-achtige klachten:',
    titel:
      'Aantal patiënten met eerste melding van COVID-19 klachten bij de huisarts',
    pagina_toelichting:
      'Elke week berekent het Nivel aan de hand van de geregistreerde klachten door huisartsen, het aantal patiënten dat voor de eerste keer contact opneemt met de huisartsenpraktijk vanwege COVID-19-achtige klachten.',
    barscale_titel:
      'Aantal patiënten met eerste melding van COVID-19 klachten bij de huisarts',
    barscale_toelichting:
      'Geschat aantal patiënten dat voor het eerst contact opnemen met de huisartsenpraktijk vanwege COVID-19-achtige klachten per week.',
    kpi_titel: 'Geschat aantal patiënten met COVID-19-achtige klachten',
    kpi_toelichting:
      'Geschat aantal patiënten dat voor het eerst contact opnemen met de huisartsenpraktijk vanwege COVID-19-achtige klachten per week.',
    linechart_titel:
      'Aantal patiënten met COVID-19-achtige klachten door de tijd heen (per 100.000 inwoners)',
    barscale_screenreader_text:
      '{{value}} patiënten die voor het eerst contact opnemen met de huisartsenpraktijk vanwege COVID-19-achtige klachten, per 100.000 inwoners, per week.',
    titel_sidebar: 'Klachten bij huisartsen',
    metadata: {
      title:
        'Aantal meldingen COVID-19-achtige klachten bij huisartsen | Coronadashboard | Rijksoverheid.nl',
      description:
        'Landelijk overzicht van het geschat aantal patiënten dat voor het eerst contact opnemen met de huisartsenpraktijk vanwege COVID-19-achtige klachten per week.',
    },
    normalized_kpi_titel:
      'Aantal patiënten met COVID-19-achtige klachten per 100.000 inwoners',
    normalized_kpi_toelichting:
      'Aantal patiënten, per 100.000 inwoners, dat voor het eerst contact opnemen met de huisartsenpraktijk vanwege COVID-19-achtige klachten, per week.',
    titel_kpi:
      'Patiënten met eerste melding van COVID-19 klachten bij de huisarts',
    reference: {
      href: '/verantwoording#huisartsen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      nivel: {
        download:
          'https://www.nivel.nl/sites/default/files/covid/Nivel-verdenkingen-COVID-19.json',
        href:
          'https://www.nivel.nl/nl/nivel-zorgregistraties-eerste-lijn/monitor-cijfers-covid-19-achtige-klachten-huisartsenpraktijken#opendata',
        text: 'Nivel',
      },
    },
    tooltip_labels: {
      covid_klachten: 'Patiënten met klachten',
    },
  },
  ziekenhuisopnames_per_dag: {
    datums:
      'Laatste waardes verkregen op {{dateOfReport}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href: 'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.html',
      text: 'NICE via RIVM',
    },
    titel: 'Ziekenhuisopnames per dag',
    pagina_toelichting:
      'Groei van het aantal opgenomen patiënten met COVID-19 kan ervoor zorgen dat ziekenhuizen het te druk krijgen. Daarnaast geeft dit cijfer een goed beeld van hoe de epidemie zich ontwikkelt. We houden hier het aantal patiënten bij dat met COVID-19 wordt opgenomen in ziekenhuizen en het aantal bedden op gewone ziekenhuisafdelingen die door patiënten met COVID-19 wordt bezet. We houden dit zowel landelijk als regionaal bij en dat doen we op basis van verschillende bronnen.',
    barscale_titel: 'Gemeld aantal ziekenhuisopnames per dag',
    extra_uitleg:
      'Aantal mensen met COVID-19 dat per dag in een ziekenhuis is opgenomen. Dit cijfer laat het aantal ziekenhuisopnames - inclusief directe IC-opnames - zien dat op één dag gemeld is. Dit kunnen ook meldingen zijn van opnames van eerdere dagen.',
    map_titel: 'Woonplaats opgenomen patiënten',
    map_toelichting:
      'Deze kaart laat zien in welke gemeenten of veiligheidsregio’s patiënten wonen die met COVID-19 in het ziekenhuis zijn opgenomen. Patiënten kunnen ook in een ziekenhuis in een ander deel van Nederland worden opgenomen. Het gaat hier om de ziekenhuisopnames die op één dag gemeld zijn bij Stichting NICE.',
    linechart_titel: 'Ziekenhuisopnames door de tijd heen, op datum van opname',
    barscale_screenreader_text:
      '{{value}} ziekenhuisopnames per dag. Signaalwaarde: {{signaalwaarde}} opnames per dag.',
    chloropleth_legenda: {
      titel: 'Ziekenhuisopnames',
      geen_meldingen: 'Geen meldingen',
    },
    bronnen: {
      rivm: {
        href: 'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.html',
        text: 'NICE via RIVM',
        download:
          'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.csv',
      },
      lnaz: {
        href: 'https://lcps.nu/datafeed/',
        text: 'LCPS',
        download: 'https://lcps.nu/wp-content/uploads/covid-19.csv',
      },
      rivmSource: {
        href: 'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.html',
        text: 'NICE via RIVM',
      },
      nice: {
        href: 'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.html',
        text: 'NICE via RIVM',
        download:
          'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.csv',
      },
    },
    kpi_bedbezetting: {
      title: 'Gewone ziekenhuisbedden bezet door patiënten met COVID-19',
      description:
        'Dit getal laat zien hoeveel ziekenhuisbedden (exclusief IC-bedden) bezet worden door patiënten met COVID-19.',
    },
    chart_bedbezetting: {
      title:
        'Bezetting gewone ziekenhuisbedden (zonder IC-bedden) door de tijd heen',
      description:
        'Deze grafiek laat het aantal ziekenhuisbedden zien (IC-bedden niet meegerekend) dat door de tijd heen is bezet door patiënten met COVID-19. Het gaat daarbij niet alleen om de dag van opname in het ziekenhuis, maar om alle dagen waarop patiënten met COVID-19 in het ziekenhuis lagen.',
      legend_trend_label: 'Bezetting gewone ziekenhuisbedden',
      legend_inaccurate_label: 'Cijfers zijn minder nauwkeurig',
    },
    linechart_description:
      'In deze grafiek staan de ziekenhuisopnames (inclusief directe IC-opnames) vermeld op de dag dat mensen ook echt zijn opgenomen, in plaats van op de dag dat ze gemeld zijn. Zo kunnen we namelijk de ontwikkeling van het coronavirus in Nederland goed zien. Let op: omdat het aanmelden van ziekenhuisopnames vaak een paar dagen later gebeurt, zijn de meest recente dagen nooit compleet en kan het lijken alsof het aantal ziekenhuisopnames afneemt terwijl dit niet zo is.',
    metadata: {
      title: 'Ziekenhuisopnames | Coronadashboard | Rijksoverheid.nl',
      description:
        'Landelijk overzicht van het aantal mensen met COVID-19 dat een ziekenhuis is opgenomen.',
    },
    titel_sidebar: 'Ziekenhuisopnames',
    titel_kpi: 'Het aantal ziekenhuisopnames dat op één dag gemeld is.',
    reference: {
      href: '/verantwoording#ziekenhuizen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    tijdelijk_onbeschikbaar_titel: '',
    tijdelijk_onbeschikbaar: '',
    kpi_titel: 'Het aantal ziekenhuisopnames dat op één dag gemeld is.',
    linechart_legend_titel: 'Ziekenhuisopnames',
    linechart_legend_underreported_titel:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
  },
  positief_geteste_personen: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/5f6bc429-1596-490e-8618-1ed8fd768427',
      text: 'RIVM',
    },
    titel: 'Positief geteste mensen',
    pagina_toelichting:
      'Door het aantal positief geteste mensen bij te houden krijgen we een duidelijk beeld van hoe snel het virus zich verspreidt voordat het de intensive care bereikt. Hierdoor blijven we voorbereid.',
    barscale_titel:
      'Gemiddeld aantal positief geteste mensen per 100.000 inwoners',
    barscale_toelichting:
      'Dit getal laat zien van hoeveel mensen gisteren per 100.000 inwoners gemeld is dat ze positief getest zijn op het coronavirus.',
    barscale_screenreader_text: '{{value}} positief geteste mensen per dag.',
    kpi_titel: 'Aantal positief geteste mensen',
    kpi_toelichting:
      'Dit getal laat zien van hoeveel mensen gisteren gemeld is dat ze positief getest zijn op het coronavirus. Een deel van de meldingen zijn positieve tests van eerdere dagen, die later zijn doorgegeven.',
    map_titel: 'Verdeling positief geteste mensen in Nederland',
    map_toelichting:
      'Deze kaarten laten zien van hoeveel mensen gisteren is gemeld dat ze positief getest zijn op het coronavirus, per 100.000 inwoners.',
    linechart_titel:
      'Aantal positief geteste mensen door de tijd heen (per 100.000 inwoners)',
    linechart_toelichting:
      'Deze grafiek laat zien van hoeveel mensen in de geselecteerde periode gemeld is dat ze positief getest zijn op het coronavirus, per 100.000 inwoners.',
    barchart_titel: 'Verdeling naar leeftijd (totaal aantal mensen)',
    barchart_toelichting:
      'Deze grafiek toont de verdeling van het aantal positieve tests over leeftijdsgroepen.',
    barchart_axis_titel: 'Totaal aantal positief geteste mensen',
    barscale_keys: [
      '0 tot 10',
      '10 tot 20',
      '20 tot 30',
      '30 tot 40',
      '40 tot 50',
      '50 tot 60',
      '60 tot 70',
      '70 tot 80',
      '80 tot 90',
      '90+',
    ],
    chloropleth_legenda: {
      titel: 'Aantal per 100.000 inwoners',
      geen_meldingen: 'Geen meldingen',
    },
    titel_sidebar: 'Positieve testen',
    metadata: {
      title: 'Positief geteste mensen | Coronadashboard | Rijksoverheid.nl',
      description:
        'Landelijk overzicht van inwoners die positief getest zijn op het coronavirus.',
    },
    titel_kpi: 'Positief geteste mensen per dag',
    reference: {
      href: '/verantwoording#positieve-testen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_per_dag.csv',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/5f6bc429-1596-490e-8618-1ed8fd768427',
        text: 'RIVM',
        aria_text: 'Bekijk de databron van positief geteste mensen op het RIVM',
      },
    },
    tooltip_labels: {
      infected_per_100k: 'Positief getest per 100.000',
      infected_percentage: 'Percentage positieve testen',
      tested_total: 'Totaal aantal testen',
      infected: 'Aantal positieve testen',
    },
  },
  besmettelijke_personen: {
    title: 'Aantal besmettelijke mensen',
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt twee keer per week bijgewerkt.',
    bron: {
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/097155aa-75eb-4caa-8ed3-4c6edb80467e',
      text: 'RIVM',
    },
    legenda_line: 'Het aantal besmettelijke mensen in Nederland.',
    legenda_marge:
      'Het aantal besmettelijke mensen is een schatting. De onzekerheidsmarge geeft aan hoeveel hoger of lager het precieze aantal kan zijn.',
    rangeLegendLabel: 'Onzekerheidsmarge',
    lineLegendLabel: 'Besmettelijke mensen',
    geen_signaalwaarde_beschikbaar:
      'Vanwege een storing is deze informatie op dit moment helaas niet compleet. Aan een oplossing wordt gewerkt.',
    geen_signaalwaarde_beschikbaar_lees_waarom: 'Lees hier waarom',
    toelichting_pagina:
      'Als iemand het coronavirus oploopt, dan is deze persoon een tijd lang besmettelijk voor anderen. Hoe lang dit duurt verschilt van persoon tot persoon. Het aantal besmettingen blijft een schatting, maar we weten wel of het gaat om tientallen, honderden, duizenden of meer. ',
    barscale_titel:
      'Gemiddeld aantal besmettelijke mensen per 100.000 inwoners',
    barscale_screenreader_text: '{{value}} besmettelijke mensen',
    cijfer_titel: 'Aantal besmettelijke mensen in Nederland:',
    cijfer_toelichting:
      'Een berekening van het RIVM van hoeveel mensen met COVID-19 besmettelijk zijn voor anderen. Dit is altijd het aantal besmettelijke personen van een tot twee weken geleden, omdat de betrouwbaarheid van recentere berekeningen niet groot genoeg is.',
    linechart_titel: 'Aantal besmettelijke mensen door de tijd heen',
    titel_sidebar: 'Besmettelijke mensen',
    metadata: {
      title: 'Besmettelijke mensen | Coronadashboard | Rijksoverheid.nl',
      description:
        'Landelijk overzicht van hoeveel mensen met COVID-19 besmettelijk zijn voor anderen. Dit getal wordt door het RIVM berekend.',
    },
    barscale_toelichting:
      'Een berekening van hoeveel mensen met COVID-19 per 100.000 inwoners besmettelijk zijn voor anderen. Dit getal wordt door het RIVM berekend.',
    titel_kpi: 'Aantal besmettelijke mensen',
    reference: {
      href: '/verantwoording#besmettelijke-mensen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_prevalentie.json',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/097155aa-75eb-4caa-8ed3-4c6edb80467e',
        text: 'RIVM',
      },
    },
    kpi_titel: 'Aantal besmettelijke mensen',
  },
  reproductiegetal: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt twee keer per week bijgewerkt.',
    rangeLegendLabel: 'Onzekerheidsmarge',
    lineLegendLabel: 'Effectieve R',
    bron: {
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/ed0699d1-c9d5-4436-8517-27eb993eab6e',
      text: 'RIVM',
    },
    legenda_r:
      'De effectieve R is een schatting. Voor recente R schattingen is de betrouwbaarheid niet groot, daarom loopt de R-lijn niet door in de laatste twee weken.',
    legenda_marge:
      'De onzekerheidsmarge toont tussen welke waarden de R zich bevindt. Dit wordt twee keer per week bijgewerkt.',
    reproductie_explainer_alt:
      'Ondersteunende afbeelding bij bovenstaande uitleg',
    titel: 'Reproductiegetal',
    pagina_toelichting:
      'Het reproductiegetal laat zien hoe snel het virus zich verspreidt. Dit getal geeft aan hoeveel mensen gemiddeld besmet worden door één patiënt met COVID-19.',
    barscale_titel: 'Meest recente reproductiegetal',
    barscale_toelichting:
      'Aantal mensen dat besmet wordt door één besmettelijke persoon. Dit is altijd het reproductiegetal van twee weken geleden omdat de betrouwbaarheid van recentere berekeningen niet groot genoeg is.',
    barscale_screenreader_text: '{{value}} positief geteste mensen per dag.',
    extra_uitleg:
      'Het reproductiegetal laat zien hoe snel het virus zich verspreidt. Dit getal geeft aan hoeveel mensen gemiddeld besmet worden door één patiënt met COVID-19. Bij een reproductiegetal van rond de 1 blijft het aantal besmettingen ongeveer gelijk. Als het reproductiegetal lager is dan 1, dan daalt het aantal besmettingen. Bij een getal hoger dan 1 stijgt het aantal besmettingen.',
    linechart_titel: 'Het reproductiegetal door de tijd heen',
    metadata: {
      title: 'Reproductiegetal | Coronadashboard | Rijksoverheid.nl',
      description:
        'Het reproductiegetal laat zien hoe snel het virus zich verspreidt. Dit getal geeft aan hoeveel mensen gemiddeld besmet worden door één patiënt met COVID-19.',
    },
    titel_sidebar: 'Reproductiegetal',
    titel_kpi: 'Meest recente reproductiegetal',
    reference: {
      href: '/verantwoording#reproductiegetal',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_reproductiegetal.json',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/ed0699d1-c9d5-4436-8517-27eb993eab6e',
        text: 'RIVM',
      },
    },
    kpi_titel: 'Meest recente reproductiegetal',
  },
  overige_gegevens: {
    title: 'Nog te ontwikkelen',
    text:
      'Het is de bedoeling dat het dashboard in de toekomst wordt uitgebreid met de volgende gegevens:',
    fold_title: 'Wat betekent dit?',
    fold: '',
    graph_title: 'Verloop over tijd',
    open: 'Verberg uitleg',
    sluit: 'Meer uitleg',
    list: [
      {
        icon: '/images/Zelfrapportagegegevens.png',
        text: 'Zelfrapportagegegevens (infectieradar)',
        content:
          'Het RIVM houdt op verschillende manieren de verspreiding van infectieziekten in de gaten. Dat geldt ook voor COVID-19. Een van die manieren is door te kijken naar mensen met klachten die kunnen wijzen op een infectie. Dat doet het RIVM met de Infectieradar.\n\nIedereen in Nederland kan deelnemen aan de Infectieradar. Deelnemers geven één keer per week door of zij koorts of andere klachten hebben (gehad). Ook als mensen geen klachten hebben, geven ze dit door. Zo worden signalen van toename of afname van het virus eerder opgepikt.',
      },
      {
        icon: '/images/GGD-contactonderzoeken.png',
        text: 'GGD-contactonderzoeken',
        content:
          'Wanneer iemand besmet is met COVID-19 onderzoekt de GGD hoe de besmetting waarschijnlijk is ontstaan en met wie de persoon in contact is geweest. Op deze manier wordt onderzocht of er meer mensen besmet zijn met COVID-19.',
      },
      {
        icon: '/images/Sentinel-monitor.png',
        text: 'Sentinel monitoring (zorgverleners)',
        content:
          'Wanneer zorgverleners ziek zijn, kunnen zij patiënten besmetten met COVID-19. Door hun gezondheid in kaart te brengen, verkleint uiteindelijk de kans op ziekteverspreiding. Dit gebeurt door het aantal besmette zorgverleners en het aantal ziektemeldingen bij te houden. Ook draagt dit bij aan het voorkomen van overbelasting in de zorg.',
      },
      {
        icon: '/images/Verplaatsingsgegevens.png',
        text: 'Verplaatsingsgegevens',
        content:
          'Verplaatsingsgegevens kunnen een beeld geven hoe het coronavirus zich verspreidt. Het doel is om dit per gemeente in kaart te brengen.',
      },
      {
        icon: '/images/Nalevingsmonitor.png',
        text: 'Nalevingsmonitor',
        content:
          'De nalevingsmonitor geeft inzicht in hoeverre het mensen lukt om zich aan de coronamaatregelen te houden.',
      },
      {
        icon: '/images/Gedragsonderzoeken.png',
        text: 'Gedragsonderzoeken',
        content:
          'Gegevens uit gedragsonderzoeken worden regelmatig verzameld door het RIVM. Dit geeft inzicht in trends in naleving en draagvlak van de op dat moment geldende gedragsregels zoals handen wassen, thuisblijven en het laten testen bij klachten.',
      },
    ],
  },
  regio_link_block: {
    title: 'Informatie per regio',
    text: 'Bekijk de belangrijkste cijfers voor uw veiligheidsregio.',
  },
  verpleeghuis_besmette_locaties: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
      text: 'RIVM',
    },
    titel: 'Verpleeghuiszorg – Besmette locaties',
    pagina_toelichting:
      "Dit getal is een inschatting van het aantal nieuwe verpleeghuislocaties waar sprake is van tenminste een COVID-19 besmetting op basis van een positieve test.\n\nDe rekenmethode is per 29 september verbeterd. Zie ook de 'Cijferverantwoording'.",
    barscale_titel: 'Aantal nieuwe locaties per dag',
    barscale_toelichting:
      'Aantal nieuwe locaties waarbij ten minste één bewoner positief getest is. Een verpleeghuis telt mee als ‘nieuwe locatie’ als er een nieuwe besmetting is vastgesteld, terwijl in de voorgaande 28 dagen – dit is twee keer de incubatietijd – geen bewoners positief waren getest.',
    kpi_titel: 'Totaal aantal besmette locaties',
    kpi_toelichting:
      'Dit getal is een inschatting van het totaal aantal verpleeghuislocaties waar in de afgelopen 28 dagen minstens één (nieuwe) COVID-19 besmetting op basis van een positieve test, is gemeld. Het percentage geeft aan hoeveel dit is ten opzichte van het totaal aantal verpleeghuislocaties in Nederland.',
    linechart_titel: 'Totaal aantal besmette locaties door de tijd heen',
    barscale_screenreader_text:
      '{{value}} nieuwe locaties waarbij tenminste één bewoner positief getest is, per dag.',
    chloropleth_legenda: {
      titel: 'Percentage besmette locaties',
      geen_meldingen: 'Geen meldingen',
    },
    map_titel: 'Verdeling besmette locaties in Nederland',
    map_toelichting:
      'Deze kaart toont een schatting van het aantal verpleeghuislocaties waar in de afgelopen 28 dagen minstens één (nieuwe) COVID-19 besmetting op basis van een positieve test is gemeld.',
    metadata: {
      title: 'Besmette verpleeghuizen | Coronadashboard | Rijksoverheid.nl',
      description:
        'Landelijk overzicht van verpleeghuislocaties waar tenminste één COVID-19 besmetting is vastgesteld.',
    },
    titel_sidebar: 'Verpleeghuiszorg',
    titel_kpi: 'Aantal besmette locaties',
    reference: {
      href: '/verantwoording#verpleeghuizen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_verpleeghuizen.csv',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
        text: 'RIVM',
      },
    },
    linechart_tooltip_label: 'Aantal besmette locaties',
  },
  verpleeghuis_positief_geteste_personen: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
      text: 'RIVM',
    },
    titel: 'Verpleeghuiszorg – Aantal positief geteste bewoners',
    barscale_titel:
      'Aantal positief geteste bewoners in verpleeghuizen per dag',
    extra_uitleg:
      'Aantal nieuwe positief geteste bewoners in verpleeghuizen dat per dag gemeld is. Er wonen zo’n 125.000 personen in een verpleegtehuis.',
    pagina_toelichting:
      "Aantal nieuwe positief geteste bewoners in verpleeghuizen dat per dag is gemeld. Dit getal is een inschatting van het aantal gemelde bewoners in verpleeghuizen dat in Nederland positief getest is op het coronavirus.\n\nDe rekenmethode is per 29 september verbeterd. Zie ook de 'Cijferverantwoording'.",
    linechart_titel: 'Aantal positief geteste bewoners door de tijd heen',
    barscale_screenreader_text: '{{value}} positief geteste bewoners.',
    titel_sidebar: 'Positief geteste bewoners',
    chloropleth_legenda: {
      titel: 'Aantal per 100.000 inwoners',
      geen_meldingen: 'Geen meldingen',
    },
    map_titel: 'Verdeling positief geteste bewoners in Nederland',
    map_toelichting:
      'Deze kaarten laten zien van hoeveel bewoners gisteren is gemeld dat ze positief getest zijn op het coronavirus, per 100.000 inwoners.',
    metadata: {
      title:
        'Positief geteste bewoners verpleeghuizen | Coronadashboard | Rijksoverheid.nl',
      description:
        'Landelijk overzicht van het aantal bewoners van verpleeghuizen die positief getest zijn op het coronavirus.',
    },
    titel_kpi: 'Aantal positief geteste bewoners per dag',
    reference: {
      href: '/verantwoording#verpleeghuizen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_verpleeghuizen.csv',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
        text: 'RIVM',
      },
    },
    kpi_titel: 'Aantal positief geteste bewoners per dag',
    line_chart_legend_trend_label: 'Aantal positief geteste bewoners',
    line_chart_legend_inaccurate_label:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
    line_chart_legend_trend_moving_average_label:
      'Gemiddeld aantal over de afgelopen 7 dagen',
    tooltip_labels: {
      inaccurate: 'Incompleet',
      newly_infected_people: 'Gemeld aantal positief geteste bewoners',
      newly_infected_people_moving_average:
        'Gemiddeld aantal over de afgelopen 7 dagen',
    },
  },
  verpleeghuis_oversterfte: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
      text: 'RIVM',
    },
    titel: 'Verpleeghuiszorg – Sterfte',
    pagina_toelichting:
      'Aantal overleden bewoners in verpleeghuizen met een vastgestelde COVID-19-besmetting per dag.',
    barscale_titel: 'Aantal overleden bewoners per dag',
    barscale_screenreader_text: '{{value}} overleden bewoners.',
    extra_uitleg:
      'Dit getal is een inschatting van het aantal gemelde verpleeghuisbewoners dat in Nederland overlijdt aan de gevolgen van het nieuwe coronavirus.',
    linechart_titel: 'Aantal overleden bewoners door de tijd heen',
    map_titel: 'Verpleeghuis oversterfte in Nederland',
    map_toelichting:
      'Deze kaarten laten zien hoe de oversterfte in verpleeghuizen is in Nederland per dag.',
    titel_sidebar: 'Overleden bewoners verpleeghuizen per dag',
    metadata: {
      title:
        'Overleden bewoners verpleeghuizen | Coronadashboard | Rijksoverheid.nl',
      description:
        'Landelijk aantal gemelde verpleeghuisbewoners dat in Nederland overlijdt aan de gevolgen van het coronavirus.',
    },
    titel_kpi: 'Sterfte per dag',
    reference: {
      href: '/verantwoording#verpleeghuizen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_verpleeghuizen.csv',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
        text: 'RIVM',
      },
    },
    kpi_titel: 'Sterfte per dag',
    line_chart_legend_trend_label: 'Aantal overleden bewoners',
    line_chart_legend_inaccurate_label:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
    line_chart_legend_trend_moving_average_label:
      'Gemiddeld aantal overleden bewoners over de afgelopen 7 dagen',
    tooltip_labels: {
      inaccurate: 'Incompleet',
      deceased_daily: 'Gemeld aantal overleden bewoners',
      deceased_daily_moving_average:
        'Gemiddeld aantal over de afgelopen 7 dagen',
    },
  },
  blok_verpleeghuis_zorg: {
    title: 'Verpleeghuiszorg',
    text:
      'Informatie over de verspreiding van het coronavirus in verpleeghuizen.',
  },
  geen_selectie: {
    text: 'Selecteer uw regio bovenaan deze pagina',
  },
  rioolwater_metingen: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bron: {
      text: 'RIVM',
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/a2960b68-9d3f-4dc3-9485-600570cd52b9',
    },
    titel: 'Virusdeeltjes in rioolwater',
    pagina_toelichting:
      'Als je besmet bent met het coronavirus, zitten er vaak virusdeeltjes in je ontlasting. Deze komen in het riool terecht. Door het rioolwater bij zuiveringsinstallaties te testen op virusdeeltjes, krijgen we informatie over de ernst van het virus. Let op: Vanaf 4 maart is de rekenmethode verder verfijnd. Dit leidt tot andere waarden.',
    barscale_titel: 'Gemiddeld aantal virusdeeltjes per 100.000 inwoners',
    extra_uitleg:
      'Het gemiddelde wordt berekend aan de hand van de uitkomsten van alle rioolmetingen van één week. Hierbij wordt rekening gehouden met hoeveel inwoners er zijn aangesloten per rioolwaterzuiveringsinstallatie.',
    barscale_screenreader_text: '{{value}} virusdeeltjes per 100.000 inwoners',
    linechart_titel:
      'Gemiddeld aantal virusdeeltjes door de tijd heen (per 100.000 inwoners)',
    metadata: {
      title: 'Rioolwatermeting | Coronadashboard | Rijksoverheid.nl',
      description: 'Gemiddeld aantal virusdeeltjes per 100.000 inwoners',
    },
    titel_sidebar: 'Rioolwatermeting',
    titel_kpi: 'Gemiddelde aantal virusdeeltjes per 100.000 inwoners',
    total_installation_count_titel: 'Aantal meetlocaties',
    total_installation_count_description:
      'Meetlocaties kunnen meerdere metingen per week doorgeven. Per week kan het aantal metingen per locatie verschillen doordat niet alle metingen lukken.',
    rwzi_abbrev: '',
    map_titel:
      'Gemiddeld aantal virusdeeltjes per 100.000 inwoners in rioolwater',
    map_toelichting:
      'Deze kaart toont het gemiddeld aantal virusdeeltjes per 100.000 inwoners, per veiligheidsregio.',
    legenda_titel: 'Legenda',
    map_tooltip: 'per 100.000 inwoners',
    map_tooltip_value: '{{value}} x100 miljard',
    reference: {
      href: '/verantwoording#rioolwater',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_rioolwaterdata.csv',
        text: 'RIVM',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/a2960b68-9d3f-4dc3-9485-600570cd52b9',
      },
    },
    kpi_titel: 'Gemiddelde aantal virusdeeltjes per 100.000 inwoners',
    warning_method:
      'Deze manier van meten wordt nu nog getest. We hopen dat de rioolwatermetingen ons over een tijdje helpen om het virus op te sporen en te volgen. [Lees meer over dit programma op de website van het RIVM](https://www.rivm.nl/coronavirus-covid-19/onderzoek/rioolwater).',
    total_measurements_title: 'Aantal metingen per week',
    total_measurements_description:
      'Meetlocaties kunnen meerdere metingen per week doorgeven. Per week kan het aantal metingen per locatie verschillen doordat niet alle metingen lukken.',
    total_measurements_locations:
      'In totaal hebben {{sampled_installation_count}} van de {{total_installation_count}} meetlocaties minimaal één meting doorgegeven in de week.',
    linechart_particle_trend_label:
      'Gemiddeld aantal virusdeeltjes x100 miljard',
  },
  notfound_titel: {
    text: 'Er is iets misgegaan',
  },
  notfound_beschrijving: {
    text:
      'Er is helaas iets misgegaan. Ververs de pagina of probeer het later opnieuw.',
  },
  over_disclaimer: {
    title: 'Disclaimer',
    text: '',
  },
  over_veelgestelde_vragen: {
    text: 'Veelgestelde vragen',
    titel: 'Veelgestelde vragen',
    paragraaf: '',
  },
  terug_naar_regio_selectie: {
    text: 'Terug naar regio selectie',
  },
  error_metadata: {
    title: 'Foutmelding Coronadashboard | Rijksoverheid.nl',
  },
  nationaal_metadata: {
    title: 'Coronadashboard | COVID-19 | Rijksoverheid.nl',
    description:
      'Informatie over de ontwikkeling van het coronavirus in Nederland.',
    url: 'https://coronadashboard.rijksoverheid.nl',
  },
  notfound_metadata: {
    title: 'Pagina kan niet gevonden worden | Rijksoverheid.nl',
  },
  over_metadata: {
    title: 'Over het Coronadashboard | COVID-19 | Rijksoverheid.nl',
    description:
      'Informatie over de ontwikkeling van het coronavirus in Nederland.',
    url: 'https://coronadashboard.rijksoverheid.nl/over',
  },
  regionaal_metadata: {
    title: 'Regionaal Coronadashboard COVID-19 | Rijksoverheid.nl',
    description:
      'Informatie over de ontwikkeling van het coronavirus in Nederland.',
    url: 'https://coronadashboard.rijksoverheid.nl/regio',
  },
  verantwoording_metadata: {
    title: 'Cijferverantwoording | Coronadashboard | Rijksoverheid.nl',
    description:
      'Informatie over de ontwikkeling van het coronavirus in Nederland.',
    url: 'https://coronadashboard.rijksoverheid.nl/verantwoording',
  },
  metadata: {
    description:
      'Informatie over de ontwikkeling van het coronavirus in Nederland.',
    titel: 'Foutmelding Coronadashboard | Rijksoverheid.nl',
    title: 'Coronadashboard | COVID-19 | Rijksoverheid.nl',
    url: 'https://coronadashboard.rijksoverheid.nl',
  },
  charts: {
    time_controls: {
      all: 'Toon alles',
      week: 'Laatste week',
      '5weeks': 'Laatste 5 weken',
    },
    region_controls: {
      municipal: 'Per gemeente',
      region: 'Per veiligheidsregio',
    },
  },
  utils: {
    date_today: 'vandaag',
    date_yesterday: 'gisteren',
    date_day_before_yesterday: 'eergisteren',
  },
  regionaal_index: {
    your_safety_region: 'Veiligheidsregio',
    select_safety_region_municipality:
      'Selecteer een veiligheidsregio of gemeente',
    label_municipalities: 'Gemeenten',
    label_safety_regions: "Veiligheidsregio's",
    select_municipality: 'Selecteer een gemeente',
    select_region_municipality_legend: 'Selecteer een gemeente:',
    select_region_type_legend: 'Toon cijfers van:',
    your_municipality: 'Gemeente',
    belangrijk_bericht:
      '[De huidige maatregelen gelden voor het hele land tot en met ten minste 27 april](https://coronadashboard.rijksoverheid.nl/landelijk/maatregelen).',
  },
  common: {
    metadata: {
      source: 'Bron',
      date: 'Waarde van {{date}}',
      dateFromTo: 'Waarde van {{startDate}} - {{endDate}}',
      download: 'Download data',
      obtained: 'verkregen op {{date}}',
    },
    barScale: {
      signaalwaarde: 'Signaalwaarde',
    },
    zoekveld_geen_resultaten: 'Geen resultaten',
    zoekveld_placeholder_regio: 'Zoek op veiligheidsregio ',
    zoekveld_placeholder_gemeente: 'Zoek op gemeente ',
    veiligheidsregio_label: 'Veiligheidsregio:',
    metricKPI: {
      dateOfReport: 'Waarde van {{dateOfReport}}',
      dateRangeOfReport: 'Waarde van {{startDate}} - {{endDate}}',
    },
    tooltip: {
      positive_tested_people: '{{totalPositiveTestedPeople}} in totaal',
      positive_tested_value: '{{totalPositiveValue}} per 100.000',
      vaccinatie_bereidheid: '{{percentageInFavor}}% vaccinatiebereidheid',
    },
    niveau: 'niveau',
    clear_select_input: 'Leegmaken',
    incomplete: 'niet compleet',
    gm_singular: 'gemeente',
    gm_plural: 'gemeentes',
    vr_singular: 'Veiligheidsregio',
    vr_plural: "Veiligheidsregio's",
    gisteren: 'Gisteren',
    vandaag: 'Vandaag',
    read_more: 'Lees meer',
    absolute_date_template: 'op {{date}}',
    inwoners: 'inwoners',
    miljoen: 'miljoen',
    signaalwaarde: 'Signaalwaarde',
    totaal: 'Totaal',
    rond: 'rond',
    interactive_legend: {
      reset_button_label: 'Reset',
    },
  },
  seoHead: {
    default_description:
      'Informatie over de ontwikkeling van het coronavirus in Nederland.',
    default_title: 'Coronadashboard | COVID-19 | Rijksoverheid.nl',
    default_url: 'https://coronadashboard.rijksoverheid.nl',
  },
  no_data_for_this_municipality: {
    text: 'Deze informatie is niet beschikbaar voor deze gemeente.',
  },
  nationaal_layout: {
    headings: {
      medisch: 'Medische indicatoren',
      overig: 'Vroegsignalering',
      verpleeghuis: 'Verpleeghuiszorg',
      laatste: 'Laatste ontwikkelingen',
      algemeen: 'Algemeen',
      besmettingen: 'Besmettingen',
      ziekenhuizen: 'Ziekenhuizen',
      verpleeghuizen: 'Verpleeghuiszorg',
      vroege_signalen: 'Vroege signalen',
      gedrag: 'Gedrag',
      kwetsbare_groepen: 'Kwetsbare groepen',
      maatregelen: 'Maatregelen',
      vaccinaties: 'Vaccinaties',
    },
  },
  veiligheidsregio_layout: {
    headings: {
      medisch: 'Medische indicatoren',
      overig: 'Vroegsignalering',
      verpleeghuis: 'Verpleeghuiszorg',
      besmettingen: 'Besmettingen',
      ziekenhuizen: 'Ziekenhuizen',
      verpleeghuizen: 'Verpleeghuiszorg',
      vroege_signalen: 'Vroege signalen',
      gedrag: 'Gedrag',
      kwetsbare_groepen: 'Kwetsbare groepen',
      maatregelen: 'Maatregelen',
      algemeen: 'Algemeen',
      inschaling: 'Risiconiveau',
    },
  },
  veiligheidsregio_metadata: {
    title: 'Regionaal Coronadashboard | COVID-19 | Rijksoverheid.nl',
    description:
      'Informatie over de ontwikkeling van het coronavirus in Nederland.',
    url: 'https://coronadashboard.rijksoverheid.nl/regio',
  },
  gemeente_metadata: {
    title: 'Gemeente',
  },
  veiligheidsregio_ziekenhuisopnames_per_dag: {
    titel_sidebar: 'Ziekenhuisopnames',
    titel:
      'Gemeld aantal ziekenhuisopnames per dag van inwoners {{safetyRegion}}',
    pagina_toelichting:
      'Groei van het aantal opgenomen patiënten met COVID-19 kan ervoor zorgen dat ziekenhuizen het te druk krijgen. Daarnaast geeft dit cijfer een goed beeld van hoe de epidemie zich ontwikkelt. We houden hier het aantal patiënten bij dat met COVID-19 wordt opgenomen in ziekenhuizen en het aantal bedden op gewone ziekenhuisafdelingen die door patiënten met COVID-19 wordt bezet. We houden dit zowel landelijk als regionaal bij en dat doen we op basis van verschillende bronnen.',
    datums: 'Berekend: {{dateOfReport}}. Wordt dagelijks bijgewerkt.',
    screen_reader_graph_content: '{{value}} opnames.',
    barscale_titel: 'Gemeld aantal ziekenhuisopnames per dag',
    extra_uitleg:
      'Aantal mensen uit deze veiligheidsregio met COVID-19 dat per dag in een ziekenhuis is opgenomen. Dit cijfer laat het aantal ziekenhuisopnames - inclusief directe IC-opnames - zien dat op één dag gemeld is. Dit kunnen ook meldingen zijn van opnames van eerdere dagen. Patiënten kunnen in een ziekenhuis elders in Nederland zijn opgenomen.',
    map_titel: 'Verdeling ziekenhuisopnames in {{safetyRegion}}',
    map_toelichting:
      'Deze kaart laat zien in welke gemeenten of veiligheidsregio’s patiënten wonen die met COVID-19 in het ziekenhuis zijn opgenomen. Patiënten kunnen ook in een ziekenhuis in een ander deel van Nederland worden opgenomen. Het gaat hier om de ziekenhuisopnames die op één dag gemeld zijn bij Stichting NICE.',
    linechart_titel: 'Ziekenhuisopnames door de tijd heen, op datum van opname',
    barscale_screenreader_text:
      '{{value}} ziekenhuisopnames per dag. Signaalwaarde: {{signaalwaarde}} opnames per dag.',
    bron: {
      href: 'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.html',
      text: 'NICE via RIVM',
    },
    linechart_description:
      'In deze grafiek staan de ziekenhuisopnames (inclusief directe IC-opnames) vermeld op de dag dat mensen ook echt zijn opgenomen, in plaats van op de dag dat ze gemeld zijn. Zo kunnen we namelijk de ontwikkeling van het coronavirus in Nederland goed zien. Let op: omdat het aanmelden van ziekenhuisopnames vaak een paar dagen later gebeurt, zijn de meest recente dagen nooit compleet en kan het lijken alsof het aantal ziekenhuisopnames afneemt terwijl dit niet zo is.',
    metadata: {
      title:
        'Ziekenhuisopnames inwoners {{safetyRegionName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht van het aantal mensen in de veiligheidsregio {{safetyRegionName}} die met COVID-19 in het ziekenhuis zijn opgenomen.',
    },
    titel_kpi: 'Het aantal ziekenhuisopnames dat op één dag gemeld is.',
    reference: {
      href: '/verantwoording#ziekenhuizen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.html',
        text: 'NICE via RIVM',
      },
    },
    tijdelijk_onbeschikbaar_titel: '',
    tijdelijk_onbeschikbaar: '',
    kpi_titel: 'Het aantal ziekenhuisopnames dat op één dag gemeld is. ',
    linechart_legend_titel: 'Ziekenhuisopnames',
    linechart_legend_underreported_titel:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
  },
  veiligheidsregio_positief_geteste_personen: {
    titel_sidebar: 'Positief geteste mensen',
    titel: 'Positief geteste mensen in {{safetyRegion}}',
    pagina_toelichting:
      'Door het aantal positief geteste mensen bij te houden krijgen we een duidelijk beeld van hoe snel het virus zich verspreidt voordat het de intensive care bereikt. Hierdoor blijven we voorbereid.',
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    screen_reader_graph_content: '{{value}} positief geteste personen.',
    barscale_titel:
      'Gemiddeld aantal positief geteste mensen per 100.000 inwoners',
    barscale_toelichting:
      'Dit getal laat zien van hoeveel mensen gisteren per 100.000 inwoners gemeld is dat ze positief getest zijn op het coronavirus.',
    barscale_screenreader_text: '{{value}} positief geteste mensen per dag.',
    kpi_titel: 'Aantal positief geteste mensen',
    kpi_toelichting:
      'Dit getal laat zien van hoeveel mensen gisteren gemeld is dat ze positief getest zijn op het coronavirus. Een deel van de meldingen zijn positieve tests van eerdere dagen, die later zijn doorgegeven.',
    map_titel: 'Verdeling positief geteste mensen in {{safetyRegion}}',
    map_toelichting:
      "Deze kaart laat zien van hoeveel mensen in de gemeenten van deze veiligheidsregio's gisteren gemeld is dat ze positief getest zijn op het coronavirus, per 100.000 inwoners.",
    linechart_titel:
      'Aantal positief geteste mensen door de tijd heen (per 100.000 inwoners)',
    linechart_toelichting:
      'Deze grafiek laat zien van hoeveel mensen in de geselecteerde periode in deze veiligheidsregio gemeld is dat ze positief getest zijn op het coronavirus, per 100.000 inwoners.',
    barchart_titel: 'Verdeling naar leeftijd (totaal aantal mensen)',
    barchart_toelichting:
      'Deze grafiek toont de verdeling van het aantal positieve tests over leeftijdsgroepen.',
    barchart_axis_titel: 'Totaal aantal positief geteste mensen',
    barscale_keys: ['0 tot 20', '20 tot 40', '40 tot 60', '60 tot 80', '80+'],
    bron: {
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/5f6bc429-1596-490e-8618-1ed8fd768427',
      text: 'RIVM',
    },
    metadata: {
      title:
        'Positief geteste mensen in {{safetyRegionName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht van het aantal mensen in de veiligheidsregio {{safetyRegionName}} die positief getest zijn op het coronavirus.',
    },
    reference: {
      href: '/verantwoording#positieve-testen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_per_dag.csv',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/5f6bc429-1596-490e-8618-1ed8fd768427',
        text: 'RIVM',
      },
    },
  },
  veiligheidsregio_rioolwater_metingen: {
    titel_sidebar: 'Rioolwatermeting',
    titel: 'Virusdeeltjes in rioolwater {{safetyRegion}}',
    pagina_toelichting:
      'Als je besmet bent met het coronavirus, zitten er vaak virusdeeltjes in je ontlasting. Deze komen in het riool terecht. Door het rioolwater bij zuiveringsinstallaties te testen op virusdeeltjes, krijgen we informatie over de ernst van het virus. Let op: Vanaf 4 maart is de rekenmethode verder verfijnd. Dit leidt tot andere waarden. ',
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    screen_reader_graph_content: '{{value}} virusdeeltjes per 100.000 inwoners',
    barscale_titel: 'Gemiddelde aantal virusdeeltjes per 100.000 inwoners',
    extra_uitleg:
      'Een gemiddelde wordt berekend aan de hand van alle rioolmeetwaarden van één week. Er wordt hierbij rekening gehouden met hoeveel inwoners er zijn aangesloten per rioolwaterzuiveringsinstallatie, en voor welk deel een rioolwaterzuiveringsinstallatie in de veiligheidsregio ligt.',
    barscale_screenreader_text: '{{value}} virusdeeltjes per 100.000 inwoners',
    linechart_titel:
      'Gemiddeld aantal virusdeeltjes door de tijd heen (per 100.000 inwoners)',
    bar_chart_title: 'Meest recente meetwaarde per locatie in {{safetyRegion}}',
    bar_chart_axis_title:
      'Gemiddelde aantal virusdeeltjes (x100 miljard) per 100.000 inwoners',
    bron: {
      text: 'RIVM',
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/a2960b68-9d3f-4dc3-9485-600570cd52b9',
    },
    graph_average_label_text: 'Weekgemiddelde veiligheidsregio',
    graph_secondary_label_text: 'Individuele meetwaarden',
    graph_average_label_text_rwzi: 'Meetwaarde locatie {{name}}',
    average: 'Gemiddelde',
    metadata: {
      title:
        'Rioolwatermeting in {{safetyRegionName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht van rioolwatermetingen en aangetroffen COVID-19 virusdeeltjes in de veiligheidsregio {{safetyRegionName}}.',
    },
    graph_daily_label_text_rwzi: 'Meetwaarden locatie ({{name}})',
    graph_selected_rwzi_placeholder: 'Selecteer locatie',
    graph_range_description:
      'Gemiddeld aantal virusdeeltjes door de tijd heen (per 100.000 inwoners)',
    titel_kpi: 'Gemiddeld aantal virusdeeltjes per 100.000 inwoners',
    total_installation_count_titel: 'Aantal meetlocaties',
    total_installation_count_description:
      'Meetlocaties kunnen meerdere metingen per week doorgeven. Per week kan het aantal metingen per locatie verschillen doordat niet alle metingen lukken.',
    rwzi_abbrev: '',
    reference: {
      href: '/verantwoording#rioolwater',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_rioolwaterdata.csv',
        text: 'RIVM',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/a2960b68-9d3f-4dc3-9485-600570cd52b9',
      },
    },
    kpi_titel: 'Gemiddeld aantal virusdeeltjes per 100.000 inwoners',
    bar_chart_accessibility_description: '',
    display_outliers: 'Toon uitschieters',
    hide_outliers: 'Verberg uitschieters',
    warning_method:
      'Deze manier van meten wordt nu nog getest. We hopen dat de rioolwatermetingen ons over een tijdje helpen om het virus op te sporen en te volgen. [Lees meer over dit programma op de website van het RIVM](https://www.rivm.nl/coronavirus-covid-19/onderzoek/rioolwater).',
    total_measurements_title: 'Aantal metingen per week',
    total_measurements_description:
      'Meetlocaties kunnen meerdere metingen per week doorgeven. Per week kan het aantal metingen per locatie verschillen doordat niet alle metingen lukken.',
    total_measurements_locations:
      'In totaal hebben {{sampled_installation_count}} van de {{total_installation_count}} meetlocaties minimaal één meting doorgegeven in de week.',
  },
  gemeente_ziekenhuisopnames_per_dag: {
    titel_sidebar: 'Ziekenhuisopnames',
    titel:
      'Gemeld aantal ziekenhuisopnames per dag van inwoners {{municipality}}',
    pagina_toelichting:
      'Groei van het aantal opgenomen patiënten met COVID-19 kan ervoor zorgen dat ziekenhuizen het te druk krijgen. Daarnaast geeft dit cijfer een goed beeld van hoe de epidemie zich ontwikkelt. We houden hier het aantal patiënten bij dat met COVID-19 wordt opgenomen in ziekenhuizen en het aantal bedden op gewone ziekenhuisafdelingen die door patiënten met COVID-19 wordt bezet. We houden dit zowel landelijk als regionaal bij en dat doen we op basis van verschillende bronnen.',
    datums: 'Berekend: {{dateOfReport}}. Wordt dagelijks bijgewerkt.',
    screen_reader_graph_content: '{{value}} opnames.',
    barscale_titel: 'Gemeld aantal ziekenhuisopnames per dag',
    extra_uitleg:
      'Aantal mensen uit deze gemeente met COVID-19 dat per dag in een ziekenhuis is opgenomen. Dit cijfer laat het aantal ziekenhuisopnames - inclusief directe IC-opnames - zien dat op één dag gemeld is. Dit kunnen ook meldingen zijn van opnames van eerdere dagen. Patiënten kunnen in een ziekenhuis elders in Nederland zijn opgenomen.',
    map_titel:
      'Verdeling ziekenhuisopnames in veiligheidsregio van {{municipality}}',
    map_toelichting:
      'Deze kaart laat zien in welke gemeenten of veiligheidsregio’s patiënten wonen die met COVID-19 in het ziekenhuis zijn opgenomen. Patiënten kunnen ook in een ziekenhuis in een ander deel van Nederland worden opgenomen. Het gaat hier om de ziekenhuisopnames die op één dag gemeld zijn bij Stichting NICE.',
    linechart_titel: 'Ziekenhuisopnames door de tijd heen, op datum van opname',
    barscale_screenreader_text:
      '{{value}} ziekenhuisopnames per dag. Signaalwaarde: {{signaalwaarde}} opnames per dag.',
    bron: {
      href: 'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.html',
      text: 'NICE via RIVM',
    },
    linechart_description:
      'In deze grafiek staan de ziekenhuisopnames (inclusief directe IC-opnames) vermeld op de dag dat mensen ook echt zijn opgenomen, in plaats van op de dag dat ze gemeld zijn. Zo kunnen we namelijk de ontwikkeling van het coronavirus in Nederland goed zien. Let op: omdat het aanmelden van ziekenhuisopnames vaak een paar dagen later gebeurt, zijn de meest recente dagen nooit compleet en kan het lijken alsof het aantal ziekenhuisopnames afneemt terwijl dit niet zo is.',
    metadata: {
      title:
        'Ziekenhuisopnames inwoners {{municipalityName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht van het aantal mensen in de gemeente {{municipalityName}} die met COVID-19 in het ziekenhuis zijn opgenomen.',
    },
    titel_kpi: 'Het aantal ziekenhuisopnames dat op één dag gemeld is.',
    reference: {
      href: '/verantwoording#ziekenhuizen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.html',
        text: 'NICE via RIVM',
      },
    },
    tijdelijk_onbeschikbaar_titel: '',
    tijdelijk_onbeschikbaar: '',
    kpi_titel: 'Het aantal ziekenhuisopnames dat op één dag gemeld is.',
    linechart_legend_titel: 'Ziekenhuisopnames',
    linechart_legend_underreported_titel:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
  },
  gemeente_positief_geteste_personen: {
    titel_sidebar: 'Positief geteste mensen',
    titel: 'Positief geteste mensen in {{municipality}}',
    pagina_toelichting:
      'Door het aantal positief geteste mensen bij te houden krijgen we een duidelijk beeld van hoe snel het virus zich verspreidt voordat het de intensive care bereikt. Hierdoor blijven we voorbereid.',
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    screen_reader_graph_content: '{{value}} positief geteste personen.',
    barscale_titel:
      'Gemiddeld aantal positief geteste mensen per 100.000 inwoners',
    barscale_toelichting:
      'Dit getal laat zien van hoeveel mensen gisteren per 100.000 inwoners gemeld is dat ze positief getest zijn op het coronavirus.',
    barscale_screenreader_text: '{{value}} positief geteste mensen per dag.',
    kpi_titel: 'Aantal positief geteste mensen',
    kpi_toelichting:
      'Dit getal laat zien van hoeveel mensen gisteren gemeld is dat ze positief getest zijn op het coronavirus. Een deel van de meldingen zijn positieve tests van eerdere dagen, die later zijn doorgegeven.',
    map_titel:
      'Verdeling positief geteste mensen in veiligheidsregio van {{municipality}}',
    map_toelichting:
      'Deze kaart laat zien van hoeveel mensen in deze gemeente en in andere gemeenten in dezelfde veiligheidsregio gisteren gemeld is dat ze positief getest zijn op het coronavirus, per 100.000 inwoners.',
    linechart_titel:
      'Aantal positief geteste mensen door de tijd heen (per 100.000 inwoners)',
    linechart_toelichting:
      'Deze grafiek laat zien van hoeveel mensen in de geselecteerde periode in deze gemeente gemeld is dat ze positief getest zijn op het coronavirus, per 100.000 inwoners.',
    barchart_titel: 'Verdeling naar leeftijd (totaal aantal mensen)',
    barchart_toelichting:
      'Deze grafiek toont de verdeling van het aantal positieve tests over leeftijdsgroepen.',
    barchart_axis_titel: 'Totaal aantal positief geteste mensen',
    barscale_keys: [
      '0 tot 10',
      '10 tot 20',
      '20 tot 30',
      '30 tot 40',
      '40 tot 50',
    ],
    bron: {
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/5f6bc429-1596-490e-8618-1ed8fd768427',
      text: 'RIVM',
    },
    metadata: {
      title:
        'Positief geteste mensen in {{municipalityName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht van het aantal mensen in de gemeente {{municipalityName}} die positief getest zijn op het coronavirus.',
    },
    titel_kpi: 'Positief geteste mensen per dag',
    reference: {
      href: '/verantwoording#positieve-testen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_per_dag.csv',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/5f6bc429-1596-490e-8618-1ed8fd768427',
        text: 'RIVM',
      },
    },
  },
  gemeente_rioolwater_metingen: {
    titel_sidebar: 'Rioolwatermeting',
    titel: 'Virusdeeltjes in rioolwater {{municipality}}',
    pagina_toelichting:
      'Als je besmet bent met het coronavirus, zitten er vaak virusdeeltjes in je ontlasting. Deze komen in het riool terecht. Door het rioolwater bij zuiveringsinstallaties te testen op virusdeeltjes, krijgen we informatie over de ernst van het virus. Let op: Vanaf 4 maart is de rekenmethode verder verfijnd. Dit leidt tot andere waarden. ',
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    screen_reader_graph_content: '{{value}} virusdeeltjes per 100.000 inwoners',
    barscale_titel: 'Gemiddelde aantal virusdeeltjes per 100.000 inwoners',
    extra_uitleg:
      'Het gemiddelde wordt berekend aan de hand van de uitkomsten van alle rioolmetingen van één week. Hierbij wordt rekening gehouden met hoeveel inwoners er zijn aangesloten per rioolwaterzuiveringsinstallatie.',
    barscale_screenreader_text: '{{value}} virusdeeltjes per 100.000 inwoners',
    linechart_titel:
      'Gemiddeld aantal virusdeeltjes door de tijd heen (per 100.000 inwoners)',
    bar_chart_title: 'Meest recente meetwaarde per locatie in {{municipality}}',
    bar_chart_axis_title:
      'Gemiddelde aantal virusdeeltjes (x100 miljard) per 100.000 inwoners',
    bron: {
      text: 'RIVM',
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/a2960b68-9d3f-4dc3-9485-600570cd52b9',
    },
    graph_average_label_text: 'Weekgemiddelde gemeente',
    graph_secondary_label_text: 'Gemeten waarde per locatie.',
    graph_average_label_text_rwzi: 'Meetwaarde locatie {{name}}',
    average: 'Gemiddelde',
    metadata: {
      title:
        'Rioolwatermeting in {{municipalityName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht van rioolwatermetingen en de hoeveelheid aangetroffen COVID-19 virusdeeltjes in de gemeente {{municipalityName}}.',
    },
    nodata_sidebar: 'Deze informatie is niet beschikbaar voor deze gemeente.',
    total_installation_count_titel: 'Aantal meetlocaties',
    total_installation_count_description:
      'Meetlocaties kunnen meerdere metingen per week doorgeven. Per week kan het aantal metingen per locatie verschillen doordat niet alle metingen lukken.',
    rwzi_abbrev: '',
    graph_daily_label_text_rwzi: 'Meetwaarden locatie ({{name}})',
    graph_selected_rwzi_placeholder: 'Selecteer locatie',
    graph_range_description:
      'Gemiddeld aantal virusdeeltjes door de tijd heen (per 100.000 inwoners)',
    reference: {
      href: '/verantwoording#rioolwater',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_rioolwaterdata.csv',
        text: 'RIVM',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/a2960b68-9d3f-4dc3-9485-600570cd52b9',
      },
    },
    kpi_titel: 'Gemiddelde aantal virusdeeltjes per 100.000 inwoners',
    bar_chart_accessibility_description: '',
    display_outliers: 'Toon uitschieters',
    hide_outliers: 'Verberg uitschieters',
    warning_method:
      'Deze manier van meten wordt nu nog getest. We hopen dat de rioolwatermetingen ons over een tijdje helpen om het virus op te sporen en te volgen. [Lees meer over dit programma op de website van het RIVM](https://www.rivm.nl/coronavirus-covid-19/onderzoek/rioolwater).',
    total_measurements_title: 'Aantal metingen per week',
    total_measurements_description:
      'Meetlocaties kunnen meerdere metingen per week doorgeven. Per week kan het aantal metingen per locatie verschillen doordat niet alle metingen lukken.',
    total_measurements_locations:
      'In totaal hebben {{sampled_installation_count}} van de {{total_installation_count}} meetlocaties minimaal één meting doorgegeven in de week.',
  },
  veiligheidsregio_index: {
    selecteer_titel: 'De risicokaart van Nederland',
    selecteer_toelichting:
      'Iedere twee weken wordt bekeken of de situatie rond het coronavirus zich positief of negatief ontwikkelt. De laatste keer is dit op {{last_update}} gebeurd. Op welk niveau een regio zit, hangt af van het aantal positieve testen en het aantal ziekenhuisopnames. [Meer informatie over de risiconiveaus](/over-risiconiveaus).',
    metadata: {
      title:
        'Risiconiveaus per veiligheidsregio | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht van het huidige risiconiveau per veiligheidsregio in Nederland.',
    },
    belangrijk_bericht:
      '[De huidige maatregelen gelden voor het hele land tot en met ten minste 27 april](https://coronadashboard.rijksoverheid.nl/landelijk/maatregelen).',
  },
  gemeente_index: {
    selecteer_titel: 'Selecteer een gemeente',
    selecteer_toelichting: '',
    metadata: {
      title: 'Overzicht gemeentes | Coronadashboard | Rijksoverheid.nl',
      description: 'Overzichtspagina gemeentes in Nederland.',
    },
  },
  laatste_ontwikkelingen: {
    title: 'Laatste ontwikkelingen',
    menu_subtitle: 'Britse variant wint terrein in Nederland',
    alle_cijfers_header: 'Benieuwd naar alle cijfers?',
    alle_cijfers_link: 'Bekijk alle cijfers',
  },
  escalatie_niveau: {
    titel: 'Risiconiveaus',
    toelichting:
      'Iedere twee weken wordt bekeken of de situatie rond het coronavirus zich positief of negatief ontwikkelt. De laatste keer is dit op {{last_update}} gebeurd. Op welk niveau een regio zit, hangt af van het aantal positieve testen en het aantal ziekenhuisopnames. [Meer informatie over de risiconiveaus](/over-risiconiveaus).',
    types: {
      '1': {
        titel: 'Waakzaam',
        toelichting:
          'De situatie is onder controle te houden. Het aantal nieuwe besmettingen is laag. De druk op de zorg valt mee.',
      },
      '2': {
        titel: 'Zorgelijk',
        toelichting:
          'De situatie is lastig onder controle te houden. Er zijn veel nieuwe besmettingen. De druk op de zorg is groot.',
      },
      '3': {
        titel: 'Ernstig',
        toelichting:
          'De situatie is slecht. Er is een groot aantal nieuwe besmettingen. De druk op de zorg is erg groot.',
      },
      '4': {
        titel: 'Zeer Ernstig',
        toelichting:
          'De situatie is erg slecht. Er zijn extreem veel nieuwe besmettingen. De druk op de zorg is extreem groot.',
      },
      '5': {
        titel: 'Lockdown',
        toelichting: '',
      },
    },
    legenda: {
      titel: 'Legenda',
      geen_regio: "geen regio's",
      regio_singular: '{{amount}} regio',
      regio_plural: "{{amount}} regio's",
      determined_on: 'Risiconiveau bepaald op {{date}}',
    },
    valid_from: 'Geldig vanaf {{validFrom}}',
    sidebar_label: 'Risiconiveau:',
    tile_title: 'Wat betekenen de vier risiconiveaus?',
    lees_meer: 'Meer informatie over de risiconiveaus',
  },
  gemeente_layout: {
    headings: {
      medisch: 'Medische indicatoren',
      overig: 'Vroegsignalering',
      verpleeghuis: 'Verpleeghuiszorg',
      besmettingen: 'Besmettingen',
      ziekenhuizen: 'Ziekenhuizen',
      vroege_signalen: 'Vroege signalen',
    },
  },
  positief_geteste_personen_ggd: {
    titel: 'Percentage positief geteste personen via GGD-teststraten',
    summary_title: '{{percentage}} van de GGD-testen was positief',
    summary_link_cta:
      'Meer over het percentage positieve testen via alleen de GGD',
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href: 'https://data.rivm.nl/covid-19/COVID-19_uitgevoerde_testen.html',
      text: 'RIVM',
    },
    toelichting:
      'De cijfers hieronder geven inzicht in het aantal tests via de GGD-teststraten en van welk deel daarvan de uitslag positief is. Als het percentage positieve tests toeneemt kan dat erop wijzen dat de verspreiding van het virus toeneemt. Let op dat de meeste testen via de GGD lopen, maar dit niet voor alle testen geldt. Daarom wijkt het absolute aantal positief geteste personen af van het aantal positief testen door de GGD',
    totaal_getest_week_titel: 'Gemiddeld aantal GGD-testen per dag',
    totaal_getest_week_uitleg:
      'Het gemiddelde aantal testen per dag, berekend over zeven dagen. De testen waarvan de uitslag nog niet bekend is, zijn niet meegenomen in dit gemiddelde.',
    positief_getest_week_titel: 'Positief geteste personen',
    positief_getest_week_uitleg:
      'Percentage positieve testen in de GGD-teststraten, waarvan de uitslag bekend is. Dit is het gemiddelde van zeven dagen. Voor het berekenen van het percentage worden alleen tests meegeteld waarvan de testuitslag bekend is.',
    positief_getest_getest_week_uitleg:
      'Dit zijn {{numerator}} van {{denominator}} tests met een bekende uitslag.',
    linechart_percentage_titel: 'Percentage positieve testen door de tijd heen',
    linechart_percentage_toelichting:
      'Deze grafiek laat het dagelijks percentage GGD-testen zien met een positieve uitslag, ten opzichte van alle GGD-testen van die dag waarvan de uitslag bekend is. De gegevens zijn gesorteerd op de datum waarop de test bij de GGD plaatsvond. Het duurt gemiddeld één tot twee dagen voordat testuitslagen bekend zijn.',
    linechart_totaltests_titel: 'Aantal testen door de tijd heen',
    linechart_totaltests_toelichting:
      'Deze grafiek laat het dagelijks aantal bekende testuitslagen in de GGD-teststraten door de tijd heen zien, en hoeveel daarvan een positieve uitslag hebben. De gegevens zijn gesorteerd op de datum waarop de test bij de GGD plaatsvond. Het duurt gemiddeld één tot twee dagen voordat testuitslagen bekend zijn.',
    linechart_totaltests_legend_label: 'GGD-testen waarvan uitslag bekend is',
    linechart_positivetests_legend_label:
      'GGD-testen met een positieve uitslag',
    reference: {
      href: '/verantwoording#positieve-testen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_uitgevoerde_testen.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_uitgevoerde_testen.html',
        text: 'RIVM',
      },
    },
    summary_text:
      '{{percentage}} van de GGD testen was positief in de periode van {{dateFrom}} tot en met {{dateTo}}.',
  },
  over_risiconiveaus_metadata: {
    title: 'Risiconiveaus | Coronadashboard | Rijksoverheid.nl',
    description:
      'Informatie over de ontwikkeling van het coronavirus in Nederland.',
    url: 'https://coronadashboard.rijksoverheid.nl/over-risiconiveaus',
  },
  veiligheidsregio_positief_geteste_personen_ggd: {
    titel:
      'Percentage positief geteste personen via GGD-teststraten in {{safetyRegion}}',
    summary_title: '{{percentage}} van de GGD-testen was positief',
    summary_link_cta:
      'Meer over het percentage positieve testen via alleen de GGD',
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href: 'https://data.rivm.nl/covid-19/COVID-19_uitgevoerde_testen.html',
      text: 'RIVM',
    },
    toelichting:
      'De cijfers hieronder geven inzicht in het aantal tests via de GGD-teststraten en van welk deel daarvan de uitslag positief is. Als het percentage positieve tests toeneemt kan dat erop wijzen dat de verspreiding van het virus toeneemt. Let op dat de meeste testen via de GGD lopen, maar dit niet voor alle testen geldt. Daarom wijkt het absolute aantal positief geteste personen af van het aantal positief testen door de GGD.',
    totaal_getest_week_titel: 'Gemiddeld aantal GGD-testen per dag',
    totaal_getest_week_uitleg:
      'Het gemiddelde aantal testen per dag, berekend over zeven dagen. De testen waarvan de uitslag nog niet bekend is, zijn niet meegenomen in dit gemiddelde.',
    positief_getest_week_titel: 'Positief geteste personen',
    positief_getest_week_uitleg:
      'Percentage positieve testen in de GGD-teststraten, waarvan de uitslag bekend is. Dit is het gemiddelde van zeven dagen. Voor het berekenen van het percentage worden alleen tests meegeteld waarvan de testuitslag bekend is.',
    positief_getest_getest_week_uitleg:
      'Dit zijn {{numerator}} van {{denominator}} geteste personen',
    linechart_percentage_titel: 'Percentage positieve testen door de tijd heen',
    linechart_percentage_toelichting:
      'Deze grafiek laat het dagelijks percentage GGD-testen zien met een positieve uitslag, ten opzichte van alle GGD-testen van die dag waarvan de uitslag bekend is. De gegevens zijn gesorteerd op de datum waarop de test bij de GGD plaatsvond. Het duurt gemiddeld één tot twee dagen voordat testuitslagen bekend zijn.',
    linechart_totaltests_titel: 'Aantal testen door de tijd heen',
    linechart_totaltests_toelichting:
      'Deze grafiek laat het dagelijks aantal bekende testuitslagen in de GGD-teststraten door de tijd heen zien, en hoeveel daarvan een positieve uitslag hebben. De gegevens zijn gesorteerd op de datum waarop de test bij de GGD plaatsvond. Het duurt gemiddeld één tot twee dagen voordat testuitslagen bekend zijn.',
    linechart_totaltests_legend_label: 'GGD-testen waarvan uitslag bekend is',
    linechart_positivetests_legend_label:
      'GGD-testen met een positieve uitslag',
    reference: {
      href: '/verantwoording#positieve-testen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_uitgevoerde_testen.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_uitgevoerde_testen.html',
        text: 'RIVM',
      },
    },
  },
  veiligheidsregio_verpleeghuis_oversterfte: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
      text: 'RIVM',
    },
    titel: 'Verpleeghuiszorg – Sterfte in {{safetyRegion}}',
    pagina_toelichting:
      'Aantal overleden bewoners in verpleeghuizen met een vastgestelde COVID-19-besmetting per dag.',
    barscale_titel: 'Overleden bewoners verpleeghuizen',
    barscale_screenreader_text: '{{value}} overleden bewoners.',
    extra_uitleg:
      'Dit getal is een inschatting van het aantal gemelde verpleeghuisbewoners uit deze veiligheidsregio dat overlijdt aan de gevolgen van het nieuwe coronavirus.',
    linechart_titel: 'Aantal overleden bewoners door de tijd heen',
    map_titel: 'Verpleeghuis oversterfte in Nederland',
    map_toelichting:
      'Deze kaarten laten zien hoe de oversterfte in verpleeghuizen is in Nederland per dag.',
    titel_sidebar: 'Sterfte per dag',
    metadata: {
      title:
        'Overleden bewoners verpleeghuizen in {{safetyRegionName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Aantal gemelde verpleeghuisbewoners dat in veiligheidsregio {{safetyRegionName}} overlijdt aan de gevolgen van het coronavirus.',
    },
    reference: {
      href: '/verantwoording#verpleeghuizen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_verpleeghuizen.csv',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
        text: 'RIVM',
      },
    },
    line_chart_legend_trend_label: 'Aantal overleden bewoners',
    line_chart_legend_inaccurate_label:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
    line_chart_legend_trend_moving_average_label:
      'Gemiddeld aantal overleden bewoners over de afgelopen 7 dagen',
    tooltip_labels: {
      inaccurate: 'Incompleet',
      deceased_daily: 'Gemeld aantal overleden bewoners',
      deceased_daily_moving_average:
        'Gemiddeld aantal over de afgelopen 7 dagen',
    },
  },
  veiligheidsregio_verpleeghuis_besmette_locaties: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
      text: 'RIVM',
    },
    titel: 'Verpleeghuiszorg - Aantal besmette locaties in {{safetyRegion}}',
    pagina_toelichting:
      "Dit getal is een inschatting van het aantal nieuwe verpleeghuislocaties waar sprake is van tenminste een COVID-19 besmetting op basis van een positieve test.\n\nDe rekenmethode is per 29 september verbeterd. Zie ook de 'Cijferverantwoording'.",
    barscale_titel: 'Aantal nieuwe locaties per dag',
    barscale_toelichting:
      'Aantal nieuwe locaties waarbij ten minste één bewoner positief getest is. Een verpleeghuis telt mee als ‘nieuwe locatie’ als er een nieuwe besmetting is vastgesteld, terwijl in de voorgaande 28 dagen – dit is twee keer de incubatietijd – geen bewoners positief waren getest.',
    kpi_titel: 'Totaal aantal besmette locaties',
    kpi_toelichting:
      'Dit getal is een inschatting van het totaal aantal verpleeghuislocaties waar in de afgelopen 28 dagen minstens één (nieuwe) COVID-19 besmetting op basis van een positieve test, is gemeld. Het percentage geeft aan hoeveel dit is ten opzichte van het totaal aantal verpleeghuislocaties in deze veiligheidsregio.',
    linechart_titel: 'Totaal aantal besmette locaties door de tijd heen',
    barscale_screenreader_text:
      '{{value}} nieuwe locaties waarbij tenminste één bewoner positief getest is, per dag.',
    metadata: {
      title:
        'Besmette verpleeghuizen in {{safetyRegionName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht van verpleeghuislocaties in veiligheidsregio {{safetyRegionName}} waar tenminste één COVID-19 besmetting is vastgesteld.',
    },
    titel_sidebar: 'Verpleeghuiszorg',
    reference: {
      href: '/verantwoording#verpleeghuizen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_verpleeghuizen.csv',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
        text: 'RIVM',
      },
    },
    linechart_tooltip_label: 'Aantal besmette locaties',
  },
  veiligheidsregio_verpleeghuis_positief_geteste_personen: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
      text: 'RIVM',
    },
    titel:
      'Verpleeghuiszorg – Aantal positief geteste bewoners in {{safetyRegion}}',
    barscale_titel:
      'Aantal positief geteste bewoners in verpleeghuizen per dag',
    extra_uitleg:
      'Aantal nieuwe positief geteste bewoners in verpleeghuizen dat per dag gemeld is.',
    pagina_toelichting:
      "Aantal positief geteste bewoners in verpleeghuizen per dag in {{safetyRegion}}. Dit getal is een inschatting van het aantal gemelde bewoners in verpleeghuizen dat in Nederland positief getest is op het coronavirus.\n\nDe rekenmethode is per 29 september verbeterd. Zie ook de 'Cijferverantwoording'.",
    linechart_titel: 'Aantal positief geteste bewoners door de tijd heen',
    barscale_screenreader_text: '{{value}} positief geteste bewoners.',
    titel_sidebar: 'Positief geteste bewoners',
    chloropleth_legenda: {
      titel: 'Aantal per 100.000 inwoners',
      geen_meldingen: 'Geen meldingen',
    },
    map_titel: 'Verdeling positief geteste mensen in Nederland',
    map_toelichting:
      'Deze kaarten laten zien van hoeveel mensen gisteren is gemeld dat ze positief getest zijn op het coronavirus, per 100.000 inwoners.',
    metadata: {
      title:
        'Positief geteste bewoners verpleeghuizen in {{safetyRegionName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht aantal bewoners van verpleeghuizen in veiligheidsregio {{safetyRegionName}} waarbij COVID-19-besmetting is vastgesteld.',
    },
    reference: {
      href: '/verantwoording#verpleeghuizen',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_verpleeghuizen.csv',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/0179dd26-7bf6-4021-857f-8623aaf8e73a',
        text: 'RIVM',
      },
    },
    line_chart_legend_trend_label: 'Aantal positief geteste bewoners',
    line_chart_legend_inaccurate_label:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
    line_chart_legend_trend_moving_average_label:
      'Gemiddeld aantal over afgelopen 7 dagen',
    tooltip_labels: {
      inaccurate: 'Incompleet',
      newly_infected_people: 'Gemeld aantal positief geteste bewoners',
      newly_infected_people_moving_average:
        'Gemiddeld aantal over de afgelopen 7 dagen',
    },
  },
  data_warning_text: '',
  veelgestelde_vragen_metadata: {
    title: 'Veelgestelde vragen | Coronadashboard | Rijksoverheid.nl',
    description:
      'Informatie over de ontwikkeling van het coronavirus in Nederland.',
    url: 'https://coronadashboard.government.nl/veelgestelde-vragen',
  },
  waarde_annotaties: {
    riool_normalized: 'x100 miljard',
    x_miljoen: 'x miljoen',
    totaal: 'totaal',
    x_100k: 'x 100.000',
  },
  gedrag_onderwerpen: {
    wash_hands: 'Was vaak je handen',
    keep_distance: 'Houd 1,5 meter afstand',
    work_from_home: 'Werk volledig thuis als dat kan',
    avoid_crowds: 'Vermijd drukke plekken',
    symptoms_stay_home: 'Blijf thuis bij klachten',
    symptoms_get_tested: 'Laat je testen bij klachten',
    wear_mask_public_indoors: 'Draag een mondkapje in publieke binnenruimtes',
    wear_mask_public_transport: 'Draag een mondkapje in het OV',
    sneeze_cough_elbow: 'Hoest en nies in je elleboog',
    max_visitors: 'Ontvang het maximaal aantal personen thuis',
    curfew: 'Avondklok',
  },
  gedrag_common: {
    compliance: 'Naleving',
    support: 'Draagvlak',
    basisregels: {
      header_percentage: 'Percentage',
      header_basisregel: 'Gedragsregels',
      header_trend: 'Verschil met vorige meting*',
      trend_hoger: 'hoger',
      trend_lager: 'lager',
      trend_gelijk: 'gelijk',
    },
    titel_kpi:
      'Percentage mensen dat het eens is met de gedragsregels en het percentage dat zich vervolgens ook zelf aan de gedragsregels houdt.',
    kpi_titel:
      'Percentage mensen dat het eens is met de gedragsregels en het percentage dat zich vervolgens ook zelf aan de gedragsregels houdt.',
    meer_onderzoeksresultaten: {
      title: 'Meer onderzoeksresultaten',
      description:
        'Bekijk voor meer gedetailleerde resultaten het volledige onderzoek op de website van de RIVM.',
      linkLabel: 'Bekijk het gehele onderzoek op de website van de RIVM',
      linkHref:
        'https://www.rivm.nl/gedragsonderzoek/trendonderzoek/naleving-van-en-draagvlak-voor-basis-gedragsregels',
    },
  },
  nl_gedrag: {
    metadata: {
      title: 'Naleving en Draagvlak | Coronadashboard | Rijksoverheid.nl',
      description: 'Landelijk overzicht van naleving en draagvlak.',
    },
    pagina: {
      titel: 'Naleving en Draagvlak',
      toelichting:
        'De Nederlandse corona-aanpak is erop gericht het virus maximaal te controleren, de zorg niet te overbelasten en kwetsbare mensen in de samenleving te beschermen. Alleen als we allemaal de basisregels naleven kunnen we corona onder controle krijgen.',
    },
    sidebar: {
      titel: 'Naleving en Draagvlak',
    },
    datums:
      'Enquête is afgenomen tussen {{weekStart}} en {{weekEnd}}. Wordt 3-wekelijks bijgewerkt.',
    bron: {
      text: 'RIVM',
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/8a72d78a-fcf8-4882-b0ab-cd594961a267?tab=relations',
    },
    onderzoek_uitleg: {
      titel: 'Onderzoek onder de Nederlandse bevolking',
      toelichting:
        'Elke drie weken wordt een enquête gehouden onder een representatieve steekproef van de Nederlandse bevolking. Deelnemers aan deze enquête beantwoorden allemaal dezelfde vragen over de gedragsregels die de overheid opstelt vanwege corona. In hoeverre steunen ze de regels en in hoeverre leven ze de regels ook na? Dit onderzoek wordt gecoördineerd en gepubliceerd door RIVM. De praktische uitvoering wordt verzorgd door Kantar Public. ',
    },
    kpi: {
      aantal_respondenten: {
        titel: 'Aantal respondenten',
        toelichting: 'Aantal mensen dat heeft deelgenomen aan het onderzoek.',
        bron: {
          text: 'RIVM',
          href:
            'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/8a72d78a-fcf8-4882-b0ab-cd594961a267?tab=relations',
        },
      },
    },
    verdeling_in_nederland: {
      titel: "Verschillen tussen veiligheidsregio's",
      intro:
        'Selecteer een gedragsregel om de verschillen tussen de veiligheidsregio’s te zien.',
      onbekend: 'Onbekend',
      legenda_titel: 'Percentage',
    },
    basisregels: {
      title: 'Gedragsregels',
      intro: {
        compliance: '',
        support: '',
      },
      voetnoot: {
        compliance:
          'Deze tabel toont het percentage van de deelnemers aan het onderzoek dat aangeeft de gedragsregels te volgen in zijn/haar dagelijks leven.',
        support:
          'Deze tabel toont het percentage van de deelnemers aan het onderzoek dat aangeeft achter de gedragsregel te staan.',
      },
      voetnoot_asterisk: {
        compliance:
          '* De rechter kolom geeft aan of met minstens 95% zekerheid gezegd kan worden dat er een statistisch verantwoord verschil is vergeleken met de vorige meting.',
        support:
          '* De rechter kolom geeft aan of met minstens 95% zekerheid gezegd kan worden dat er een statistisch verantwoord verschil is vergeleken met de vorige meting.',
      },
    },
    basisregels_over_tijd: {
      title: 'Het volgen van de gedragsregels door de tijd heen',
      intro: {
        compliance:
          'Deze grafiek toont veranderingen in de loop van de tijd van het percentage van de respondenten dat aangeeft de gedragsregel te volgen in zijn/haar dagelijks leven.',
        support:
          'Deze grafiek toont veranderingen in de loop van de tijd van het percentage van de respondenten dat aangeeft achter de gedragsregel te staan.',
      },
    },
    reference: {
      href: 'https://coronadashboard.rijksoverheid.nl/verantwoording#gedrag',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_gedrag.csv',
        text: 'RIVM',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/8a72d78a-fcf8-4882-b0ab-cd594961a267?tab=relations',
      },
    },
  },
  regionaal_gedrag: {
    metadata: {
      title: 'Naleving en Draagvlak | Coronadashboard | Rijksoverheid.nl',
      description: 'Landelijk overzicht van naleving en draagvlak.',
    },
    pagina: {
      titel: 'Naleving en Draagvlak',
      toelichting:
        'De Nederlandse corona-aanpak is erop gericht het virus maximaal te controleren, de zorg niet te overbelasten en kwetsbare mensen in de samenleving te beschermen. Alleen als we allemaal de basisregels naleven kunnen we corona onder controle krijgen.',
    },
    sidebar: {
      titel: 'Naleving en Draagvlak',
    },
    datums:
      'Enquête is afgenomen tussen {{weekStart}} en {{weekEnd}}. Wordt 3-wekelijks bijgewerkt.',
    bron: {
      text: 'RIVM',
      href:
        'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/8a72d78a-fcf8-4882-b0ab-cd594961a267?tab=relations',
    },
    onderzoek_uitleg: {
      titel: 'Onderzoek onder de Nederlandse bevolking',
      toelichting:
        'Elke drie weken wordt een enquête gehouden onder een representatieve steekproef van de Nederlandse bevolking. Deelnemers aan deze enquête beantwoorden allemaal dezelfde vragen over de gedragsregels die de overheid opstelt vanwege corona. In hoeverre steunen ze de regels en in hoeverre leven ze de regels ook na? Dit onderzoek wordt gecoördineerd en gepubliceerd door RIVM. De praktische uitvoering wordt verzorgd door Kantar Public. ',
    },
    kpi: {
      aantal_respondenten: {
        titel: 'Aantal respondenten',
        toelichting: 'Aantal mensen dat heeft deelgenomen aan het onderzoek.',
        bron: {
          text: 'RIVM',
          href:
            'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/8a72d78a-fcf8-4882-b0ab-cd594961a267?tab=relations',
        },
      },
    },
    basisregels: {
      title: 'Gedragsregels',
      intro: {
        compliance: '',
        support: '',
      },
      voetnoot: {
        compliance:
          'Deze tabel toont het percentage van de deelnemers aan het onderzoek dat aangeeft de gedragsregels te volgen in zijn/haar dagelijks leven.',
        support:
          'Deze tabel toont het percentage van de deelnemers aan het onderzoek dat aangeeft achter de gedragsregel te staan.',
      },
      voetnoot_asterisk: {
        compliance:
          '* De rechter kolom geeft aan of met minstens 95% zekerheid gezegd kan worden dat er een statistisch verantwoord verschil is vergeleken met de vorige meting.',
        support:
          '* De rechter kolom geeft aan of met minstens 95% zekerheid gezegd kan worden dat er een statistisch verantwoord verschil is vergeleken met de vorige meting.',
      },
    },
    basisregels_over_tijd: {
      title: 'Gedragsregels door de tijd heen',
      intro: {
        compliance:
          'Deze grafiek toont veranderingen in de loop van de tijd van het percentage van de respondenten dat aangeeft de gedragsregel te volgen in zijn/haar dagelijks leven. ',
        support:
          'Deze grafiek toont veranderingen in de loop van de tijd van het percentage van de respondenten dat aangeeft achter de gedragsregel te staan.',
      },
    },
    reference: {
      href: 'https://coronadashboard.rijksoverheid.nl/verantwoording#gedrag',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download: 'https://data.rivm.nl/covid-19/COVID-19_gedrag.csv',
        text: 'RIVM',
        href:
          'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/8a72d78a-fcf8-4882-b0ab-cd594961a267?tab=relations',
      },
    },
  },
  toe_en_afname: {
    toename: 'meer dan',
    afname: 'minder dan',
    gelijk: 'gelijk aan',
    tijdverloop: {
      gisteren: 'gisteren',
      geleden: 'geleden',
      dagen: 'dagen',
      week: {
        enkelvoud: 'week',
        meervoud: 'weken',
      },
      hiervoor: 'hiervoor',
      vorige_week: 'vorige week',
      ervoor: 'ervoor',
    },
    ervoor: 'ervoor',
    vorige_waarde: 'de vorige waarde',
  },
  aria_labels: {
    pagina_keuze: 'Landelijk, regio of gemeente menu',
    footer_keuze: 'Pagina menu',
    metriek_navigatie: 'Metrieken per categorie menu',
    skip_links: 'Snelkoppeling menu',
  },
  infected_age_groups: {
    title: 'Verdeling naar leeftijd',
    description:
      'De blauwe rechterbalken in deze grafiek laten zien tot welke leeftijdsgroep positief geteste personen behoren. De grijze linkerbalken tonen hoe groot elke leeftijdsgroep is ten opzichte van de hele Nederlandse bevolking. De blauwe en grijze balken laten samen zien of leeftijdsgroepen naar verhouding meer of minder positief geteste personen hebben. Bijvoorbeeld: van alle positief geteste personen is 16% een twintiger (blauwe balk) en van alle Nederlanders is 13% een twintiger (grijze balk). De leeftijdsgroep twintigers heeft in dit voorbeeld naar verhouding meer positief geteste personen. De grafiek wordt dagelijks bijgewerkt en gaat alleen over de meest recent gemelde gevallen.',
    example:
      'Bijvoorbeeld: Van alle positief geteste mensen is {{infectedPercentage}} tussen de {{ageGroupRange}} jaar. Van alle Nederlanders is {{ageGroupPercentage}} tussen de {{ageGroupRange}} jaar.',
    graph: {
      age_group_percentage_title: 'Verdeling leeftijdsgroepen in Nederland',
      age_group_percentage_tooltip:
        'van de bevolking is {{ageGroupRange}} jaar',
      infected_percentage_title: 'Positieve testen per leeftijdsgroep',
      infected_percentage_tooltip:
        'van het aantal positief geteste mensen is {{ageGroupRange}} jaar',
      age_group_range_tooltip: '{{ageGroupRange}} jaar',
      accessibility_description:
        'Grafiek met percentages voor de verdeling van de bevolking en de verdeling van positief geteste leeftijdsgroepen.',
      clipped_value_message:
        'Deze waarde is groter dan in de grafiek is weergegeven',
      value_percentage_title: 'Positieve testen per leeftijdsgroep',
      value_percentage_tooltip:
        'van het aantal positief geteste mensen is {{ageGroupRange}} jaar',
    },
  },
  gehandicaptenzorg_besmette_locaties: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    titel: 'Gehandicaptenzorg – Besmette locaties',
    pagina_toelichting:
      'Dit getal is een berekening van het aantal locaties voor gehandicaptenzorg waar op dit moment sprake is van tenminste één COVID-19 besmetting.',
    barscale_titel: 'Aantal nieuwe locaties per dag',
    barscale_toelichting:
      'Het aantal nieuwe besmette locaties voor gehandicaptenzorg waarbij gisteren tenminste één bewoner positief is getest. Een locatie telt mee als “nieuwe locatie” wanneer er tenminste 28 dagen (dit is twee keer de incubatietijd) geen nieuwe patienten besmet zijn geweest.',
    kpi_titel: 'Totaal aantal besmette locaties',
    kpi_toelichting:
      'Het aantal besmette locaties is het aantal locaties voor gehandicaptenzorg waar de afgelopen 28 dagen sprake is geweest van tenminste één vastgestelde COVID-19 besmetting bij een bewoner op basis van een positieve test. Het percentage geeft aan op hoeveel locaties een besmetting is ten opzichte van het totaal aantal locaties voor gehandicaptenzorg in Nederland.',
    linechart_titel: 'Totaal aantal besmette locaties door de tijd heen',
    barscale_screenreader_text:
      '{{value}} nieuwe locaties waarbij tenminste één bewoner positief getest is, per dag.',
    chloropleth_legenda: {
      titel: 'Percentage besmette locaties',
      geen_meldingen: 'Geen meldingen',
    },
    map_titel: 'Verdeling besmette locaties in Nederland',
    map_toelichting:
      'Deze kaart toont het aantal locaties voor gehandicaptenzorg waar in de afgelopen 28 dagen minstens één (nieuwe) vastgestelde COVID-19 besmetting op basis van een positieve test is gemeld.',
    metadata: {
      title:
        'Besmette gehandicaptenzorglocaties | Coronadashboard | Rijksoverheid.nl',
      description:
        'Landelijk overzicht van gehandicaptenzorglocaties waar tenminste één COVID-19 besmetting is vastgesteld.',
    },
    titel_sidebar: 'Gehandicaptenzorg',
    titel_kpi: 'Aantal besmette locaties',
    reference: {
      href: '/verantwoording#gehandicaptenzorg',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.html',
        text: 'RIVM',
      },
    },
    linechart_metric_label: 'Geïnfecteerde locaties',
  },
  gehandicaptenzorg_positief_geteste_personen: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    titel: 'Gehandicaptenzorg – positief geteste bewoners',
    barscale_titel:
      'Aantal positief geteste bewoners van gehandicapteninstellingen per dag',
    extra_uitleg:
      'Het aantal bewoners van een instelling voor gehandicaptenzorg waarvan dagelijks is gemeld dat ze positief getest zijn op het coronavirus.',
    pagina_toelichting:
      'Bewoners van een instelling voor gehandicaptenzorg zijn vaak extra kwetsbaar bij een besmetting met het coronavirus. GGD’en houden daarom sinds 1 juli  bij of een positief geteste persoon in een instelling voor gehandicaptenzorg woont. Zo kunnen maatregelen worden genomen wanneer het aantal besmettingen in instellingen toeneemt.',
    linechart_titel: 'Aantal positief geteste bewoners door de tijd heen',
    barscale_screenreader_text: '{{value}} positief geteste bewoners.',
    chloropleth_legenda: {
      titel: 'Aantal per 100.000 inwoners',
      geen_meldingen: 'Geen meldingen',
    },
    map_titel: 'Verdeling positief geteste bewoners in Nederland',
    map_toelichting:
      'Deze kaarten laten zien van hoeveel bewoners gisteren is gemeld dat ze positief getest zijn op het coronavirus, per 100.000 inwoners.',
    metadata: {
      title:
        'Positief geteste bewoners gehandicaptenzorglocaties | Coronadashboard | Rijksoverheid.nl',
      description:
        'Landelijk overzicht van het aantal bewoners van gehandicaptenzorglocaties die positief getest zijn op het coronavirus.',
    },
    titel_kpi:
      'Aantal positief geteste bewoners van gehandicapteninstellingen per dag',
    reference: {
      href: '/verantwoording#gehandicaptenzorg',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.html',
        text: 'RIVM',
      },
    },
    kpi_titel:
      'Aantal positief geteste bewoners van gehandicapteninstellingen per dag',
    line_chart_legend_trend_label: 'Aantal positief geteste bewoners',
    line_chart_legend_inaccurate_label:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
  },
  gehandicaptenzorg_oversterfte: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    titel: 'Gehandicaptenzorg – Sterfte',
    pagina_toelichting:
      'Aantal bewoners van instellingen voor gehandicaptenzorg overleden aan COVID-19.',
    barscale_titel: 'Aantal overleden bewoners per dag',
    barscale_screenreader_text: '{{value}} overleden bewoners.',
    extra_uitleg:
      'Dit getal is een berekening van het aantal bewoners van instellingen voor gehandicaptenzorg dat is overleden per dag.',
    linechart_titel: 'Aantal overleden bewoners door de tijd heen',
    map_titel: 'Gehandicaptenzorg – sterfte',
    map_toelichting:
      'Deze kaarten laten zien hoe de oversterfte in gehandicaptenzorglocatie is in Nederland per dag.',
    metadata: {
      title:
        'Overleden bewoners gehandicaptenzorglocaties | Coronadashboard | Rijksoverheid.nl',
      description:
        'Landelijk aantal gemelde gehandicaptenzorglocatiebewoners dat in Nederland overlijdt aan de gevolgen van het coronavirus.',
    },
    titel_kpi: 'Aantal overleden personen',
    reference: {
      href: '/verantwoording#gehandicaptenzorg',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.html',
        text: 'RIVM',
      },
    },
    kpi_titel: 'Aantal overleden personen',
    line_chart_legend_trend_label: 'Aantal overleden bewoners',
    line_chart_legend_inaccurate_label:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
  },
  veiligheidsregio_gehandicaptenzorg_oversterfte: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bron: {
      href: 'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.html',
      text: 'RIVM',
    },
    titel: 'Gehandicaptenzorg – Sterfte in {{safetyRegion}}',
    pagina_toelichting:
      'Aantal bewoners van instellingen voor gehandicaptenzorg in deze regio die zijn overleden met een vastgestelde COVID-19 besmetting, per dag.',
    barscale_titel: 'Aantal overleden bewoners per dag',
    barscale_screenreader_text: '{{value}} overleden bewoners.',
    extra_uitleg:
      'Berekening van het aantal bewoners van instellingen voor gehandicaptenzorg dat gisteren in deze regio is overleden aan de gevolgen van het coronavirus.',
    linechart_titel: 'Aantal overleden bewoners door de tijd heen',
    map_titel: 'Gehandicaptenzorg oversterfte in Nederland',
    map_toelichting:
      'Deze kaarten laten zien hoe de oversterfte in gehandicaptenzorglocaties is in Nederland per dag.',
    titel_sidebar: 'Sterfte per dag',
    metadata: {
      title:
        'Overleden bewoners gehandicaptenzorglocaties in {{safetyRegionName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Aantal gemelde gehandicaptenzorglocatiebewoners dat in veiligheidsregio {{safetyRegionName}} overlijdt aan de gevolgen van het coronavirus.',
    },
    reference: {
      href: '/verantwoording#gehandicaptenzorg',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.html',
        text: 'RIVM',
      },
    },
    line_chart_legend_trend_label: 'Aantal overleden bewoners',
    line_chart_legend_inaccurate_label:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
  },
  veiligheidsregio_gehandicaptenzorg_besmette_locaties: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    titel: 'Gehandicaptenzorg – besmette locaties in {{safetyRegion}}',
    pagina_toelichting:
      'Dit getal is een berekening van het aantal nieuwe locaties voor gehandicaptenzorg in deze regio waar sprake is van tenminste één COVID-19 besmetting op basis van een positieve test.',
    barscale_titel: 'Aantal nieuwe locaties per dag',
    barscale_toelichting:
      'Het aantal nieuw besmette locaties waarbij tenminste één bewoners positief is getest. Een locatie telt mee als “nieuwe locatie” wanneer er tenminste 28 dagen (dit is twee keer de incubatietijd) geen nieuwe patienten besmet zijn geweest.',
    kpi_titel: 'Totaal aantal besmette locaties',
    kpi_toelichting:
      'Het aantal besmette locaties is het aantal locaties voor gehandicaptenzorg waar de afgelopen 28 dagen sprake is geweest van tenminste één vastgestelde COVID-19 besmetting op basis van een positieve test. Het percentage geeft aan op hoeveel locaties een besmetting is ten opzichte van het totaal aantal locaties voor gehandicaptenzorg in Nederland.',
    linechart_titel: 'Totaal aantal besmette locaties door de tijd heen',
    barscale_screenreader_text:
      '{{value}} nieuwe locaties waarbij tenminste één bewoner positief getest is, per dag.',
    metadata: {
      title:
        'Besmette gehandicaptenzorglocaties in {{safetyRegionName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht van gehandicaptenzorglocaties in veiligheidsregio {{safetyRegionName}} waar tenminste één COVID-19 besmetting is vastgesteld.',
    },
    titel_sidebar: 'Besmettelijke locaties',
    reference: {
      href: '/verantwoording#gehandicaptenzorg',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.html',
        text: 'RIVM',
      },
    },
    linechart_metric_label: 'Geïnfecteerde locaties',
  },
  veiligheidsregio_gehandicaptenzorg_positief_geteste_personen: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    titel: 'Gehandicaptenzorg - positief geteste bewoners in {{safetyRegion}}',
    barscale_titel:
      'Aantal positief geteste bewoners in verpleeghuizen per dag',
    extra_uitleg:
      'Het aantal bewoners van een instelling voor gehandicaptenzorg in deze regio waarvan gisteren is gemeld dat ze positief getest zijn op het coronavirus.',
    pagina_toelichting:
      'Bewoners van een instelling voor gehandicaptenzorg zijn vaak extra kwetsbaar bij een besmetting met het coronavirus. GGD’en houden daarom bij waneer een bewoner van een instelling positief test op COVID-19. Zo kunnen maatregelen worden genomen wanneer het aantal besmettingen in instellingen toeneemt.',
    linechart_titel: 'Aantal positief geteste bewoners door de tijd heen',
    barscale_screenreader_text: '{{value}} positief geteste bewoners.',
    titel_sidebar: 'Positief geteste bewoners',
    chloropleth_legenda: {
      titel: 'Aantal per 100.000 inwoners',
      geen_meldingen: 'Geen meldingen',
    },
    map_titel: 'Verdeling positief geteste mensen in Nederland',
    map_toelichting:
      'Deze kaarten laten zien van hoeveel mensen gisteren is gemeld dat ze positief getest zijn op het coronavirus, per 100.000 inwoners.',
    metadata: {
      title:
        'Positief geteste bewoners gehandicaptenzorglocaties in {{safetyRegionName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht aantal bewoners van gehandicaptenzorglocaties in veiligheidsregio {{safetyRegionName}} waarbij COVID-19-besmetting is vastgesteld.',
    },
    reference: {
      href: '/verantwoording#gehandicaptenzorg',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_gehandicaptenzorg.html',
        text: 'RIVM',
      },
    },
    kpi_titel:
      'Aantal positief geteste bewoners van gehandicapteninstellingen per dag',
    line_chart_legend_trend_label: 'Aantal positief geteste bewoners',
    line_chart_legend_inaccurate_label:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
  },
  thuiswonende_ouderen: {
    titel_sidebar: 'Thuiswonende 70-plussers',
    titel_kpi: 'Aantal positief geteste mensen',
    metadata: {
      title: 'Thuiswonende 70-plussers | Coronadashboard | Rijksoverheid.nl',
      description: 'Thuiswonende 70-plussers',
    },
    section_positive_tested: {
      title: 'Thuiswonende 70-plussers',
      description:
        'Personen van 70 jaar of ouder zijn extra kwetsbaar bij een besmetting met het coronavirus. Door zicht te houden op het aantal besmettingen onder deze groep kunnen de juiste maatregelen genomen worden om het virus in te dammen. Het gaat hierbij alleen om zelfstandig wonende 70-plussers.',
      reference: {
        href: '/verantwoording#thuiswonende-70-plussers',
        text:
          'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
      },
      bronnen: {
        rivm: {
          href:
            'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/40508e17-7296-4f39-ad25-8ddd0c904087',
          text: 'RIVM',
          download:
            'https://data.rivm.nl/covid-19/COVID-19_thuiswonend_70plus.csv',
        },
      },
      kpi_daily_title: 'Aantal positief geteste thuiswonende 70-plussers',
      kpi_daily_description:
        'Het aantal 70-plussers waarvan gisteren is gemeld dat ze positief zijn getest op COVID-19. Er wonen zo’n 2,3 miljoen 70-plussers zelfstandig.',
      kpi_daily_per_100k_title:
        'Aantal positief geteste thuiswonende 70-plussers per dag, per 100.000',
      kpi_daily_per_100k_description:
        'Dit getal laat zien van hoeveel thuiswonende personen van 70 jaar of ouder gisteren is gemeld dat ze positief zijn getest op COVID-19,  per 100.000 thuiswonende 70-plussers. Deze berekening maakt het mogelijk om regio’s beter met elkaar te vergelijken.',
      line_chart_daily_title:
        'Nieuwe besmettingen onder 70-plussers door de tijd heen',
      choropleth_daily_title:
        'Verdeling nieuwe besmettingen thuiswonende 70-plussers (per veiligheidsregio)',
      choropleth_daily_description:
        'Deze kaart laat de verdeling zien van het aantal nieuwe besmettingen per dag onder thuiswonende personen van 70 jaar of ouder per 100.000 thuiswonende personen van 70 jaar of ouder, waarvan gisteren is gemeld dat ze positief getest zijn op het coronavirus.',
      choropleth_daily_legenda: 'Aantal per 100.000 thuiswonende 70-plussers',
      datums:
        'Laatste waarden verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
      line_chart_legend_trend_label: 'Nieuwe besmettingen',
      line_chart_legend_inaccurate_label:
        'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
    },
    section_deceased: {
      title: 'Thuiswonende 70-plussers - COVID-19 sterfte',
      description:
        'Aantal thuiswonende personen van 70 jaar of ouder waarvan gisteren is gemeld dat ze zijn overleden aan COVID-19.',
      reference: {
        href: '/verantwoording#thuiswonende-70-plussers',
        text:
          'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
      },
      bronnen: {
        rivm: {
          href:
            'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/40508e17-7296-4f39-ad25-8ddd0c904087',
          text: 'RIVM',
          download:
            'https://data.rivm.nl/covid-19/COVID-19_thuiswonend_70plus.csv',
        },
      },
      kpi_daily_title:
        'Aantal 70-plussers dat aan COVID-19 is overleden, per dag',
      kpi_daily_description:
        'Aantal thuiswonende personen van 70 jaar of ouder waarvan gisteren is gemeld dat ze zijn overleden aan COVID-19.',
      line_chart_daily_title:
        'Aantal aan COVID-19 overleden 70-plussers door de tijd heen',
      datums:
        'Laatste waarden verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
      line_chart_legend_trend_label: 'Aantal overledenen',
      line_chart_legend_inaccurate_label:
        'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
    },
    kpi_titel: 'Aantal positief geteste mensen',
  },
  veiligheidsregio_thuiswonende_ouderen: {
    titel_sidebar: 'Thuiswonende 70-plussers',
    titel_kpi: 'Positief geteste mensen',
    metadata: {
      title:
        'Thuiswonende 70-plussers in {{safetyRegion}} | Coronadashboard | Rijksoverheid.nl',
      description: 'Thuiswonende 70-plussers in {{safetyRegion}}.',
    },
    section_positive_tested: {
      title:
        'Thuiswonende 70-plussers in {{safetyRegion}} - nieuwe besmettingen',
      description:
        'Personen van 70 jaar of ouder zijn extra kwetsbaar bij een besmetting met het coronavirus. Door zicht te houden op het aantal besmettingen onder deze groep kunnen de juiste maatregelen genomen worden om het virus in te dammen. Het gaat hierbij alleen om zelfstandig wonende 70-plussers.',
      reference: {
        href: '/verantwoording#thuiswonende-70-plussers',
        text:
          'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
      },
      bronnen: {
        rivm: {
          href:
            'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/40508e17-7296-4f39-ad25-8ddd0c904087',
          text: 'RIVM',
          download:
            'https://data.rivm.nl/covid-19/COVID-19_thuiswonend_70plus.csv',
        },
      },
      kpi_daily_title: 'Aantal positief geteste thuiswonende 70-plussers',
      kpi_daily_description:
        'Het aantal 70-plussers in deze veiligheidsregio waarvan gisteren is gemeld dat ze besmet zijn met COVID-19.',
      kpi_daily_per_100k_title:
        'Aantal positief geteste thuiswonende 70-plussers per dag, per 100.000',
      kpi_daily_per_100k_description:
        "Door te berekenen hoeveel thuiswonende 70-plussers in deze regio dagelijks besmet worden per 100.000 70-plussers is vergelijking met andere regio's mogelijk.",
      line_chart_daily_title:
        'Nieuwe besmettingen onder thuiswonenden van 70 jaar of ouder door de tijd heen',
      datums:
        'Laatste waarden verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
      line_chart_legend_trend_label: 'Nieuwe besmettingen',
      line_chart_legend_inaccurate_label:
        'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
    },
    section_deceased: {
      title: 'Thuiswonende 70-plussers in {{safetyRegion}} - COVID-19 sterfte',
      description:
        'Aantal thuiswonende personen van 70 jaar of ouder in deze veiligheidsregio die zijn overleden aan COVID-19, per dag.',
      reference: {
        href: '/verantwoording#thuiswonende-70-plussers',
        text:
          'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
      },
      bronnen: {
        rivm: {
          href:
            'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/40508e17-7296-4f39-ad25-8ddd0c904087',
          text: 'RIVM',
          download:
            'https://data.rivm.nl/covid-19/COVID-19_thuiswonend_70plus.csv',
        },
      },
      kpi_daily_title: 'Aantal 70-plussers overleden aan COVID-19, per dag',
      kpi_daily_description:
        'Aantal thuiswonende personen van 70 jaar of ouder in deze regio waarvan gisteren is gemeld dat ze zijn overleden aan COVID-19',
      line_chart_daily_title:
        'Aantal aan COVID-19 overleden 70-plussers door de tijd heen',
      datums:
        'Laatste waarden verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
      line_chart_legend_trend_label: 'Aantal overledenen',
      line_chart_legend_inaccurate_label:
        'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
    },
    kpi_titel: 'Aantal positief geteste mensen',
  },
  sterfte: {
    titel_sidebar: 'Sterfte',
    titel_kpi: 'Gemelde aantal overleden COVID-19 patiënten per dag',
    metadata: {
      title: 'Sterfte | Coronadashboard | Rijksoverheid.nl',
      description: 'Aantal overledenen per dag',
    },
    section_deceased_rivm: {
      title: 'Sterfte',
      description:
        'Deze cijfers laten zien van hoeveel COVID-19 patiënten gisteren aan de GGD gemeld is dat ze zijn overleden. Het werkelijke aantal overleden COVID-19 patiënten is waarschijnlijk hoger, omdat niet alle patiënten getest worden en er geen meldingsplicht geldt voor overlijden aan COVID-19.',
      datums:
        'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
      bronnen: {
        rivm: {
          href:
            'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/5f6bc429-1596-490e-8618-1ed8fd768427',
          text: 'RIVM',
          download:
            'https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_per_dag.csv',
        },
      },
      reference: {
        href: '/verantwoording#sterfte',
        text:
          'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
      },
      kpi_covid_daily_title:
        'Gemelde aantal overleden COVID-19 patiënten per dag',
      kpi_covid_daily_description:
        'Dit getal toont het aantal COVID-19 patiënten waarvan aan de GGD op die dag gemeld is dat ze zijn overleden. Een deel van de overlijdens is van eerdere dagen, die later zijn doorgegeven.',
      kpi_covid_total_title: 'Totaal aantal overleden COVID-19 patiënten',
      kpi_covid_total_description:
        'Dit getal laat zien van hoeveel COVID-19 patiënten in totaal is gemeld dat ze zijn overleden, sinds het begin van de meldingen.',
      line_chart_covid_daily_title:
        'Meldingen van aan COVID-19 overleden patiënten door de tijd heen',
      line_chart_covid_daily_description:
        'Deze grafiek laat zien van hoeveel COVID-19 patiënten in de geselecteerde periode gemeld is dat ze zijn overleden.',
      line_chart_covid_daily_legend_trend_label:
        'Meldingen overleden patiënten',
      line_chart_covid_daily_legend_inaccurate_label:
        'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
      line_chart_covid_daily_legend_trend_short_label: 'Overleden patiënten',
    },
    kpi_titel: 'Gemeld aantal personen overleden aan COVID-19 per dag',
  },
  veiligheidsregio_sterfte: {
    titel_sidebar: 'Sterfte',
    titel_kpi: 'Gemelde aantal overleden COVID-19 patiënten per dag',
    metadata: {
      title: 'Sterfte in {{safetyRegion}} | Coronadashboard | Rijksoverheid.nl',
      description: 'Aantal overledenen per dag in {{safetyRegion}}',
    },
    section_deceased_rivm: {
      title: 'Sterfte in {{safetyRegion}}',
      description:
        'Deze cijfers laten zien van hoeveel COVID-19 patiënten in deze veiligheidsregio gisteren aan de GGD gemeld is dat ze zijn overleden. Het werkelijke aantal overleden COVID-19 patiënten is waarschijnlijk hoger, omdat niet alle patiënten getest worden en er geen meldingsplicht geldt voor overlijden aan COVID-19.',
      datums:
        'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
      bronnen: {
        rivm: {
          href:
            'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/5f6bc429-1596-490e-8618-1ed8fd768427',
          text: 'RIVM',
          download:
            'https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_per_dag.csv',
        },
      },
      reference: {
        href: '/verantwoording#sterfte',
        text:
          'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
      },
      kpi_covid_daily_title:
        'Gemelde aantal overleden COVID-19 patiënten per dag',
      kpi_covid_daily_description:
        'Dit getal toont het aantal COVID-19 patiënten in deze veiligheidsregio waarvan aan de GGD op die dag gemeld is dat ze zijn overleden. Een deel van de overlijdens is van eerdere dagen, die later zijn doorgegeven.',
      kpi_covid_total_title: 'Totaal aantal overleden COVID-19 patiënten',
      kpi_covid_total_description:
        'Dit getal laat zien van hoeveel COVID-19 patiënten in deze veiligheidsregio in totaal is gemeld dat ze zijn overleden, sinds het begin van de meldingen.',
      line_chart_covid_daily_title:
        'Gemelde aantal overleden COVID-19 patiënten door de tijd heen',
      line_chart_covid_daily_description:
        'Deze grafiek laat zien van hoeveel COVID-19 patiënten in deze veiligheidsregio in de geselecteerde periode gemeld is dat ze zijn overleden.',
      line_chart_covid_daily_legend_trend_label:
        'Gemeld aantal overleden patiënten',
      line_chart_covid_daily_legend_inaccurate_label:
        'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
      line_chart_covid_daily_legend_trend_short_label: 'Overleden patiënten',
    },
    kpi_titel: 'Gemeld aantal personen overleden aan COVID-19 per dag',
  },
  section_sterftemonitor: {
    title: 'Sterftemonitor',
    description:
      'Het Centraal Bureau voor de Statistiek (CBS) publiceert wekelijks het totaal aantal overleden mensen en vergelijkt dit aantal met het verwacht aantal overlijdens gecorrigeerd voor koude- of hittegolven, uitbraken en epidemieën. Er is sprake van oversterfte indien meer mensen overlijden dan verwacht. Deze grafiek geeft mogelijk een completer beeld van sterfte door COVID-19 dan de door de GGD’en gemelde COVID-19 sterfte, omdat niet alle mensen die overlijden aan COVID-19 getest zijn op COVID-19.',
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bronnen: {
      cbs: {
        href: 'https://www.cbs.nl/nl-nl/cijfers/detail/70895ned',
        text: 'CBS',
        download:
          "https://opendata.cbs.nl/ODataApi/odata/70895ned/TypedDataSet?$filter=((Geslacht eq '1100')) and ((LeeftijdOp31December eq '10000')) and (substringof('W', Perioden) eq true)&$select=Perioden, Overledenen_1",
      },
    },
    reference: {
      href: '/verantwoording#sterftemonitor-CBS',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    cbs_message: {
      title: 'Sterfte in week 14 hoger dan verwacht',
      published_text: 'Publicatiedatum: vrijdag 16 april',
      message:
        'In week 14 (5 tot en met 11 april 2021) overleden naar schatting 3 150 mensen. Dat zijn ongeveer 100 sterfgevallen meer dan verwacht voor deze periode en ongeveer evenveel sterfgevallen als in de week ervoor (3 144). De sterfte bij Wlz-zorggebruikers lag onder het voor deze week verwachte niveau, in de overige bevolking overleden meer mensen dan verwacht. Dat meldt het CBS op basis van de voorlopige sterftecijfers per week. Van week 39 van 2020 tot en met week 6 van 2021 was de wekelijkse sterfte hoger dan verwacht. In week 7 was de sterfte ongeveer gelijk aan de verwachte sterfte voor deze periode en in de weken erna lag de sterfte eronder. In week 13 was de sterfte weer ongeveer gelijk aan de verwachte sterfte, de schatting in week 14 ligt er net boven. Het RIVM registreerde 112 overleden COVID-19-patiënten in week 14 (stand 13 april).',
      link: {
        href:
          'https://www.cbs.nl/nl-nl/nieuws/2021/15/sterfte-in-week-14-hoger-dan-verwacht',
        text: 'Lees het volledige nieuwsbericht op de website van het CBS',
      },
    },
    deceased_monitor_chart_title: 'Totaal aantal overledenen per week',
    deceased_monitor_chart_description:
      'Deze grafiek laat zien hoeveel mensen er in totaal wekelijks overleden zijn. Het aantal daadwerkelijk overleden mensen wordt vergeleken met het aantal overlijdens dat wordt verwacht op basis van voorgaande jaren. De lichtblauwe lijn en omliggende marge tonen de sterfte die op dat moment in het jaar wordt verwacht, de donkerblauwe lijn toont de sterfte zoals deze heeft plaatsgevonden.',
    deceased_monitor_chart_legenda_registered:
      'Daadwerkelijke aantal overledenen',
    deceased_monitor_chart_legenda_expected: 'Verwachte aantal overledenen',
    deceased_monitor_chart_legenda_expected_margin:
      'Boven- en ondergrens van verwachte aantal overledenen',
    deceased_monitor_chart_legenda_registered_short: 'Daadwerkelijk',
    deceased_monitor_chart_legenda_expected_short: 'Verwacht',
    deceased_monitor_chart_legenda_expected_margin_short:
      'Boven- en ondergrens van verwachte',
  },
  nationaal_maatregelen: {
    titel: 'Maatregelen',
    titel_sidebar: 'Maatregelen',
    subtitel_sidebar: 'Er gelden landelijke maatregelen',
    tabel_titel: 'Maatregelen van de lockdown',
  },
  veiligheidsregio_maatregelen: {
    titel_sidebar: 'Maatregelen',
    titel: 'Maatregelen in {{safetyRegionName}}',
    titel_risiconiveau: 'Risiconiveau',
    toelichting_risiconiveau:
      'Voor meer informatie over uw regio, kunt u terecht op de website van uw veiligheidsregio.',
    linktext_riskpage: 'Meer over de risiconiveaus',
    linktext_regionpage: 'Website veiligheidsregio {{safetyRegionName}}',
    titel_aanvullendemaatregelen: 'Aanvullende informatie',
    toelichting_aanvullendemaatregelen:
      'Lokaal of regionaal kunnen aanvullend nog strengere maatregelen gelden. Kijk hiervoor op de website van de veiligheidsregio.',
    metadata: {
      title:
        'Maatregelen in {{safetyRegionName}} | Coronadashboard | Rijksoverheid.nl',
      description:
        'Overzicht van de corona maatregelen in de veiligheidsregio {{safetyRegionName}}.',
    },
    subtitel_sidebar: 'Er gelden landelijke maatregelen',
    tabel_titel: 'Maatregelen van de lockdown',
  },
  veiligheidsregio_maatregelen_urls: {
    VR01: 'http://www.veiligheidsregiogroningen.nl/',
    VR02: 'https://www.veiligheidsregiofryslan.nl/',
    VR03: 'http://www.vrd.nl/',
    VR04: 'https://www.vrijsselland.nl/',
    VR05: 'http://www.vrtwente.nl/',
    VR06: 'https://www.vnog.nl/',
    VR07: 'http://www.vggm.nl/vggm',
    VR08: 'http://www.vrgz.nl/',
    VR09: 'http://www.vru.nl/',
    VR10: 'http://www.vrnhn.nl/',
    VR11: 'https://www.veiligheidsregiozaanstreekwaterland.nl/',
    VR12: 'http://www.vrk.nl/',
    VR13: 'https://www.amsterdam.nl/veiligheidsregio/',
    VR14: 'https://www.vrgooienvechtstreek.nl/',
    VR15: 'https://haaglandenveilig.nl/',
    VR16: 'https://www.hollandsmiddenveilig.nl/',
    VR17: 'https://www.rijnmondveilig.nl/',
    VR18: 'https://www.zhzveilig.nl/',
    VR19: 'https://www.zeelandveilig.nl/',
    VR20: 'https://www.vrmwb.nl/',
    VR21: 'https://www.vrbn.nl/',
    VR22: 'http://www.veiligheidsregiozob.nl/',
    VR23: 'http://vrln.nl/',
    VR24: 'http://www.vrzuidlimburg.nl/',
    VR25: 'http://www.veiligheidsregioflevoland.nl/',
  },
  choropleth: {
    verb: {
      singular: 'heeft',
      plural: 'hebben',
    },
    gm: {
      singular: 'gemeente',
      plural: 'gemeentes',
    },
    vr: {
      singular: 'veiligheidsregio',
      plural: 'veiligheidsregios',
    },
    tested_overall: {
      infected_per_100k: {
        full_sentence: 'Deze kaart toont dat {{first}} en {{last}}.',
        full_sentence_single: 'Deze kaart toont dat {{first}}.',
        sentence:
          '{{count}} {{area}} tussen de {{rangeLow}} en {{rangeHigh}} positief geteste mensen per 100000 inwoners {{verb}}',
        last_sentence:
          '{{count}} {{area}} meer dan {{rangeLow}} positief geteste mensen per 100000 inwoners {{verb}}',
      },
    },
    escalation_levels: {
      escalation_level: {
        full_sentence: 'Deze kaart toont dat {{first}} en {{last}}.',
        full_sentence_single: 'Deze kaart toont dat {{first}}.',
        sentence: '{{count}} {{area}} risiconiveau {{rangeLow}} {{verb}}',
        last_sentence: '{{count}} {{area}} risiconiveau {{rangeLow}} {{verb}}',
      },
    },
    hospital_nice: {
      admissions_moving_average: {
        full_sentence: 'Deze kaart toont dat {{first}} en {{last}}.',
        full_sentence_single: 'Deze kaart toont dat {{first}}.',
        sentence:
          '{{count}} {{area}} tussen de {{rangeLow}} en {{rangeHigh}} ziekenhuisopnames {{verb}}',
        last_sentence:
          '{{count}} {{area}} meer dan {{rangeLow}} ziekenhuisopnames {{verb}}',
      },
    },
    nursing_home: {
      infected_locations_percentage: {
        full_sentence: 'Deze kaart toont dat {{first}} en {{last}}.',
        full_sentence_single: 'Deze kaart toont dat {{first}}.',
        sentence:
          '{{count}} {{area}} tussen de {{rangeLow}} en {{rangeHigh}} procent besmette locaties {{verb}}',
        last_sentence:
          '{{count}} {{area}} meer dan {{rangeLow}} procent besmette locaties {{verb}}',
      },
    },
    disability_care: {
      infected_locations_percentage: {
        full_sentence: 'Deze kaart toont dat {{first}} en {{last}}.',
        full_sentence_single: 'Deze kaart toont dat {{first}}.',
        sentence:
          '{{count}} {{area}} tussen de {{rangeLow}} en {{rangeHigh}} procent besmette locaties {{verb}}',
        last_sentence:
          '{{count}} {{area}} meer dan {{rangeLow}} procent besmette locaties {{verb}}',
      },
    },
    elderly_at_home: {
      positive_tested_daily_per_100k: {
        full_sentence: 'Deze kaart toont dat {{first}} en {{last}}.',
        full_sentence_single: 'Deze kaart toont dat {{first}}.',
        sentence:
          '{{count}} {{area}} tussen de {{rangeLow}} en {{rangeHigh}} besmettingen per 100000 personen {{verb}}',
        last_sentence:
          '{{count}} {{area}} meer dan {{rangeLow}} besmettingen per 100000 personen {{verb}}',
      },
    },
    sewer: {
      average: {
        full_sentence: 'Deze kaart toont dat {{first}} en {{last}}.',
        full_sentence_single: 'Deze kaart toont dat {{first}}.',
        sentence:
          '{{count}} {{area}} tussen de {{rangeLow}} x 100 miljard en {{rangeHigh}} x 100 miljard virusdeeltjes per 100000 inwoners {{verb}}',
        last_sentence:
          '{{count}} {{area}} meer dan {{rangeLow}} x 100 miljard virusdeeltjes per 100000 inwoners {{verb}}',
      },
    },
    behavior: {
      compliance: {
        full_sentence: 'Deze kaart toont dat {{first}} en {{last}}.',
        full_sentence_single: 'Deze kaart toont dat {{first}}.',
        sentence:
          "{{count}} {{area}} tussen de {{rangeLow}} en {{rangeHigh}} procent deelnemers {{verb}} die zich aan de maatregel '{{restriction}}' houden",
        last_sentence:
          "{{count}} {{area}} meer dan {{rangeLow}} procent deelnemers {{verb}} die zich aan de maatregel '{{restriction}}' houden",
      },
      support: {
        full_sentence: 'Deze kaart toont dat {{first}} en {{last}}.',
        full_sentence_single: 'Deze kaart toont dat {{first}}.',
        sentence:
          "{{count}} {{area}} tussen de {{rangeLow}} en {{rangeHigh}} procent draagvlak {{verb}} voor de maatregel '{{restriction}}'",
        last_sentence:
          "{{count}} {{area}} meer dan {{rangeLow}} procent draagvlak {{verb}} voor de maatregel '{{restriction}}'",
      },
    },
    a11y: {
      tab_navigatie_button: "'Navigeer met de tab-toets door alle {{subject}}",
    },
  },
  accessibility: {
    grafieken: {
      reproductiegetal_verloop:
        'Deze grafiek toont het reproductiegetal door de tijd heen.',
      ziekenhuisopnames:
        'Deze grafiek toont het aantal ziekenhuisopnames door de tijd heen.',
      intensive_care_opnames:
        'Deze grafiek toon de intensive care-opnames door de tijd heen.',
      verpleeghuiszorg_positief_getest:
        'Deze grafiek toont het aantal bewoners van verpleeghuislocaties waarvan gemeld is dat ze positief getest zijn op het coronavirus.',
      verpleeghuiszorg_besmette_locaties:
        'Deze grafiek toont het aantal besmette verpleeghuislocaties door de tijd heen.',
      verpleeghuiszorg_overleden_getest:
        'Deze grafiek toont het aantal overleden bewoners van verpleeghuislocaties waarvan gemeld is dat ze positief getest zijn op het coronavirus.',
      gehandicaptenzorg_positief_getest:
        'Deze grafiek toont het aantal bewoners van instellingen voor gehandicaptenzorg waarvan gemeld is dat ze positief getest zijn op het coronavirus.',
      gehandicaptenzorg_besmette_locaties:
        'Deze grafiek toont het totaal aantal besmette gehandicaptenzorglocaties door de tijd heen. ',
      gehandicaptenzorg_overleden:
        'Deze grafiek toont het aantal overleden bewoners van instellingen voor gehandicaptenzorg door de tijd heen.',
      thuiswonende_ouderen_besmettingen:
        'Deze grafiek toont het aantal besmettingen onder thuiswonende ouderen door de tijd heen.',
      thuiswonende_ouderen_overleden:
        'Deze grafiek toont het aantal thuiswonende ouderen dat is overleden aan COVID-19 door de tijd heen.',
      rioolwater_virusdeeltjes:
        'Deze grafiek toont het gemiddeld aantal virusdeeltjes per 100.000 inwoners door de tijd heen.',
      verdenkingen_huisartsen:
        'Deze grafiek toont het geschatte aantal patiënten dat voor het eerst met COVID-19-achtige klachten contact opnam met de huisarts door de tijd heen.',
      ziekenhuis_opnames:
        'Deze grafiek toont het aantal ziekenhuisopnames door de tijd heen.',
      rioolwater_meetwaarde:
        'Deze grafiek toont de meest recente meetwaarde van het gemiddeld aantal virusdeeltjes per 100.000 inwoners, per rioolwaterzuiveringslocatie.',
      verwachte_leveringen:
        'Het linkerdeel van de grafiek laat zien hoeveel vaccins er in Nederland in totaal beschikbaar waren en hoeveel prikken daarmee zijn gezet. Het gestreepte deel rechts van de verticale lijn laat zien hoeveel vaccins we de komende weken in totaal beschikbaar hebben en hoeveel prikken we verwachten te zetten. De grafiek bevat alleen de vaccins voor Europees Nederland.\n\nIn de berekening is uitgegaan van een verspilling van 1%.',
      vaccin_levering_en_prikken:
        'Het linkerdeel van de grafiek laat zien hoeveel vaccins er in Nederland in totaal beschikbaar waren en hoeveel prikken daarmee zijn gezet. Het gestreepte deel rechts van de verticale lijn laat zien hoeveel vaccins we de komende weken in totaal beschikbaar hebben en hoeveel prikken we verwachten te zetten. Tot 23 maart bevatte de grafiek ook leveringen voor het Caribisch gebied. Per 23 maart tonen we in de hele grafiek alleen de vaccins voor Europees Nederland.\n\nIn de berekening is uitgegaan van een verspilling van 1%.',
      vaccinatie_draagvlak:
        'Deze grafiek toont hoeveel procent van de bevolking zelf een prik tegen corona wil hebben.',
    },
    link_source: 'Download de databron van "{{subject}}" op {{source}}',
    link_download: 'Bekijk de databron van "{{subject}}" op {{source}}',
    text_source: 'Bekijk de databron van "{{subject}}" op {{source}}',
    text_download: 'Download de databron van "{{subject}}" op {{source}}',
  },
  deceased_age_groups: {
    title: 'COVID-19 sterfte: verdeling naar leeftijd',
    description:
      'De blauwe rechterbalken in deze grafiek laten zien tot welke leeftijdsgroep de overleden personen met COVID-19 behoren. De grijze linkerbalken tonen hoe groot elke leeftijdsgroep is ten opzichte van de hele Nederlandse bevolking. De blauwe en grijze balken laten samen zien of leeftijdsgroepen naar verhouding meer of minder met COVID-19 overleden personen hebben. Stel dat de grijze balk toont dat 12% van alle Nederlanders een zestiger is, en de blauwe balk geeft bijvoorbeeld aan dat 10% van alle met COVID-19 overleden personen een zestiger is, dan heeft deze leeftijdsgroep naar verhouding minder met COVID-19 overleden personen. De grafiek wordt dagelijks bijgewerkt en gaat over sterftegevallen sinds de uitbraak van het virus. Let op dat iedereen onder de vijftig in één leeftijdsgroep is geplaatst door het RIVM, omdat die gegevens vanwege de kleine aantallen anders herleidbaar zouden zijn tot individuen.',
    bronnen: {
      rivm: {
        text: 'RIVM',
        href: 'https://data.rivm.nl/covid-19/COVID-19_casus_landelijk.html',
      },
    },
    graph: {
      accessibility_description:
        'Grafiek met percentages voor de verdeling van de bevolking en de verdeling van positief geteste leeftijdsgroepen.',
      clipped_value_message:
        'Deze waarde is groter dan in de grafiek is weergegeven',
      age_group_percentage_title: 'Verdeling leeftijdsgroepen in Nederland',
      age_group_percentage_tooltip:
        'van de bevolking is {{ageGroupRange}} jaar',
      value_percentage_title: 'Overledenen per leeftijdsgroep',
      value_percentage_tooltip:
        'van het aantal overleden personen is {{ageGroupRange}} jaar',
      age_group_range_tooltip: '{{ageGroupRange}} jaar',
    },
  },
  vaccinaties: {
    titel_sidebar: 'Vaccinaties',
    titel_kpi: 'Aantal gezette prikken',
    metadata: {
      title: 'Vaccinaties | Coronadashboard | Rijksoverheid.nl',
      description:
        'Op 6 januari 2021 is Nederland begonnen met vaccineren. De cijfers op het Coronadashboard laten zien hoeveel prikken zijn gezet en hoeveel vaccins er beschikbaar komen.',
    },
    title: 'COVID-19-vaccinaties',
    description:
      'Vaccineren is de belangrijkste stap naar een samenleving zonder coronaregels. Op 6 januari 2021 is Nederland begonnen met vaccineren. Uiteindelijk komt iedereen van 18 jaar of ouder aan de beurt. De cijfers op deze pagina laten zien hoeveel prikken zijn gezet en hoeveel vaccins er beschikbaar komen.',
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    date_unix: '1613650547',
    date_of_insertion_unix: '1613650547',
    reference: {
      href: '/verantwoording#vaccinatie',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
    bronnen: {
      rivm: {
        href: '',
        text: 'RIVM',
        download: '',
      },
      ggd: {
        href: '',
        text: '',
        download: '',
      },
      lnaz: {
        href: '',
        text: '',
        download: '',
      },
      all_left: {
        href: '',
        text: 'RIVM, LNAZ & GGD-GHOR',
        download: '',
      },
      all_right: {
        href: '',
        text: 'Ministerie van VWS',
        download: '',
      },
      stock: {
        href: '',
        text: 'RIVM',
        download: '',
      },
      delivery_estimate_time_span: {
        href: '',
        text: '',
        download: '',
      },
    },
    section_vaccinations_more_information: {
      title: 'Verwachte data over vaccinaties',
      description:
        'De komende tijd plaatsen we meer data over vaccinaties op het dashboard. Verwachte toevoegingen zijn onder meer:\n- vaccinatiegraad',
    },
    grafiek: {
      titel: 'Geleverde en gecontroleerde vaccins & gezette prikken in totaal',
      omschrijving:
        'Het linkerdeel van de grafiek laat zien hoeveel vaccins er in Nederland in totaal beschikbaar waren en hoeveel prikken daarmee zijn gezet. Het gestreepte deel rechts van de verticale lijn laat zien hoeveel vaccins we de komende weken in totaal beschikbaar hebben en hoeveel prikken we verwachten te zetten. Tot 23 maart bevatte de grafiek ook leveringen voor het Caribisch gebied. Per 23 maart tonen we in de hele grafiek alleen de vaccins voor Europees Nederland.\n\nIn de berekening is uitgegaan van een verspilling van 1%.',
    },
    verwachte_leveringen: {
      van_week_tot_week: 'Week {{weekNumberFrom}} tot week {{weekNumberTo}}',
      van_week_tot_week_klein_scherm:
        'Week {{weekNumberFrom}} tot {{weekNumberTo}}',
    },
    grafiek_draagvlak: {
      titel: 'Vaccinatiebereidheid',
      omschrijving:
        'Deze grafiek toont per leeftijdsgroep en in totaal hoeveel procent van de bevolking zelf een prik tegen corona wil hebben. De cijfers komen uit onderzoek waarin wordt gevraagd of mensen een prik willen krijgen. Het onderzoek wordt elke drie weken herhaald.',
      kpi_omschrijving:
        'Percentage van de Nederlandse bevolking dat zelf een prik tegen corona wil hebben',
      tooltip_gemiddeld: 'Totaal',
      leeftijd_jaar: '{{ageGroup}} jaar',
      metadata_tekst:
        'Enquête is afgenomen tussen {{weekStart}} en {{weekEnd}}. Wordt 3-wekelijks bijgewerkt.',
    },
    gezette_prikken: {
      title: 'Aantal gezette prikken',
      estimated_until: 'Berekend aantal tot en met {{reportedDate}}',
      reported_until: 'Gemeld aantal tot en met {{reportedDate}}',
      tab_first: {
        title: 'Berekend aantal',
        description:
          "Dit getal is een berekening van hoeveel prikken in totaal zijn gezet. De GGD-cijfers worden gemeld door de GGD-GHOR. Voor de ziekenhuizen, de huisartspraktijken en langdurige zorginstellingen maakt het RIVM een berekening door te kijken naar hoeveel vaccins er zijn bezorgd bij priklocaties. [Lees meer over de berekening in de 'Cijferverantwoording'.](https://coronadashboard.rijksoverheid.nl/verantwoording#vaccinatie).",
      },
      tab_second: {
        title: 'Gemeld aantal',
        description:
          "Dit getal laat zien hoeveel prikken zijn gemeld door GGD-GHOR. [Lees meer over de registratie in de 'Cijferverantwoording'.](https://coronadashboard.rijksoverheid.nl/verantwoording#vaccinatie)",
      },
      estimated: {
        ggd: "gezet door GGD'en",
        hospitals: 'gezet in ziekenhuizen',
        care_institutions: 'gezet in langdurige zorginstellingen',
        doctors: 'gezet in huisartsenpraktijken',
        hospitals_and_care_institutions:
          'gezet in instellingen (inclusief ziekenhuizen)',
      },
      reported: {
        ggd_ghor: 'gemeld door GGD-GHOR',
        lnaz: 'gemeld door LNAZ',
      },
    },
    expected_page_additions: {
      title: 'Verwachte toevoegingen aan deze pagina',
      description:
        'De komende tijd plaatsen we meer data over vaccinaties op het dashboard. Verwachte toevoegingen zijn onder meer de vaccinatiegraad.',
      additions: ['', '', ''],
    },
    data: {
      difference:
        'Do not remove this key. It is required as a temporary workaround',
      sidebar: {
        last_value: {
          total_vaccinated: '874959',
          date_unix: '1613650547',
          date_of_insertion_unix: '1613650547',
        },
      },
      kpi_total: {
        title: 'Aantal gezette prikken',
        value: '687306',
        description: '',
        date_of_report_unix: '1613650547',
        date_of_insertion_unix: '1613650547',
        administered: [
          {
            value: '592755',
            description: 'gemeld door GGD-GHOR',
            report_date: 'Gemeld aantal tot en met 17 februari',
          },
          {
            value: '94551',
            description: 'gemeld door LNAZ',
            report_date: 'Gemeld aantal tot en met 17 februari',
          },
          {
            value: '',
            description: '',
            report_date: '',
          },
          {
            value: '',
            description: '',
            report_date: '',
          },
          {
            value: '',
            description: '',
            report_date: '',
          },
        ],
        description_first:
          "Dit getal laat zien hoeveel prikken zijn gemeld door GGD-GHOR. [Lees meer over de registratie in de 'Cijferverantwoording'.](https://coronadashboard.rijksoverheid.nl/verantwoording#vaccinatie)",
        description_second: '',
        warning: '',
        first_tab_title: 'Berekend aantal',
        second_tab_title: 'Gemeld aantal',
        tab_total_estimated: {
          value: '874959',
          description: '',
          date_of_report_unix: '1613650547',
          date_of_insertion_unix: '1613650547',
          administered: [
            {
              value: '592755',
              description: "gezet door GGD'en",
              report_date: 'Gemeld aantal tot en met 17 februari',
            },
            {
              value: '94551',
              description: 'gezet in ziekenhuizen',
              report_date: 'Gemeld aantal tot en met 17 februari',
            },
            {
              value: '184706',
              description: 'gezet in langdurige zorginstellingen',
              report_date: 'Berekend aantal tot en met 17 februari',
            },
            {
              value: '2947',
              description: 'gezet in huisartsenpraktijken',
              report_date: 'Berekend aantal tot en met 17 februari',
            },
            {
              value: '',
              description: '',
              report_date: '',
            },
          ],
          description_first:
            "Dit getal is een berekening van hoeveel prikken in totaal zijn gezet. De GGD-cijfers worden gemeld door de GGD-GHOR. Voor de ziekenhuizen, de huisartspraktijken en langdurige zorginstellingen maakt het RIVM een berekening door te kijken naar hoeveel vaccins er zijn bezorgd bij priklocaties. [Lees meer over de berekening in de 'Cijferverantwoording'.](https://coronadashboard.rijksoverheid.nl/verantwoording#vaccinatie)",
          description_second: '',
        },
      },
      kpi_expected_delivery: {
        title: 'Verwachte levering goedgekeurde vaccins',
        value: '2473700',
        description:
          'Aantal goedgekeurde vaccins dat Nederland de komende zes weken verwacht te krijgen. Elke week ontvangt Nederland een deel van de vaccins. Mensen hebben twee prikken nodig voor een volledige vaccinatie.',
        date_of_report_unix: '1613648204',
        date_of_insertion_unix: '1613648204',
      },
      kpi_stock: {
        title: '',
        value: '',
        amount: [
          {
            value: '',
            description: '',
          },
          {
            value: '',
            description: '',
          },
          {
            value: '',
            description: '',
          },
          {
            value: '',
            description: '',
          },
          {
            value: '',
            description: '',
          },
          {
            value: '',
            description: '',
          },
        ],
      },
      kpi_expected_page_additions: {
        title: 'Verwachte toevoegingen aan deze pagina',
        description:
          'De komende tijd plaatsen we meer data over vaccinaties op het dashboard. Verwachte toevoegingen zijn onder meer de vaccinatiegraad.',
        additions: ['', '', ''],
      },
      vaccination_chart: {
        product_names: {
          pfizer: 'BioNTech/Pfizer',
          moderna: 'Moderna',
          astra_zeneca: 'AstraZeneca',
          cure_vac: 'CureVac',
          janssen: 'Janssen',
          sanofi: 'Sanofi',
        },
        delivered: 'Geleverd en beschikbaar',
        estimated: 'Verwacht geleverd en beschikbaar',
        left_divider_label: 'Berekend aantal',
        right_divider_label: 'Verwacht aantal',
        legend: {
          available: 'Geleverde en beschikbare vaccins',
          expected: 'Verwacht',
        },
        legend_label: 'Aantal gezette prikken {{name}}',
        doses_administered: 'Aantal gezette prikken',
        doses_administered_estimated: 'Verwacht aantal gezette prikken',
        doses_administered_total: 'Totaal',
      },
    },
    current_amount_of_administrations_text:
      'Tot nu toe zijn er ongeveer {{amount}} prikken gezet.',
    grafiek_gezette_prikken: {
      titel: 'Gezette prikken in totaal',
      omschrijving:
        'Deze grafiek laat zien hoeveel prikken er in totaal zijn gezet volgens berekeningen.',
      estimated_label: 'Berekend aantal',
      reported_label: 'Gemeld aantal',
    },
    kpi_geplande_prikken_deze_week: {
      titel: 'Geplande prikken deze week',
      omschrijving:
        'Aantal prikken dat Nederland verwacht te zetten van {{date_from}} tot en met {{date_to}}. Het echte aantal kan anders zijn, bijvoorbeeld doordat mensen hun afspraak afzeggen of door problemen met de leveringen van vaccins.',
    },
    clock: {
      title: 'Iedere {{seconds}} seconden krijgt iemand een prik',
      description:
        'Dit is een schatting. Deze schatting is gemaakt met het gemiddelde van {{amount}} prikken per dag tussen 8.00 en 20.00 uur in de afgelopen zeven dagen.',
    },
    more_information: {
      label: 'Meer informatie en nieuws over vaccinaties kunt u vinden op',
      link: {
        href: 'https://www.coronavaccinatie.nl/',
        text: 'coronavaccinatie.nl',
      },
    },
    bereidheid_section: {
      title: 'Vaccinatiebereidheid',
      description:
        'Vaccinatie tegen het coronavirus is niet verplicht. Maar als iedereen zich laat vaccineren, kan het virus zich niet meer verspreiden. Het is daarom belangrijk om te weten hoeveel mensen zelf een prik tegen corona willen. Het RIVM vraagt elke drie weken aan een groep mensen of zij zich willen laten vaccineren.',
      reference: {
        href: '/verantwoording#vaccinatiebereidheid',
        text:
          'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
      },
    },
    stock_and_delivery_section: {
      title: 'Leveringen & voorraad',
      description:
        'Hoeveel prikken we kunnen zetten, hangt af van hoeveel vaccins we geleverd krijgen. Elke week krijgt Nederland vaccins. Het grootste deel van de vaccins is na een controle snel beschikbaar om mensen een prik te geven. Maar we houden ook een deel van de vaccins op voorraad om zeker te weten dat er genoeg vaccins zijn om afspraken in de komende dagen gewoon door te kunnen laten gaan en voor mensen die een tweede prik nodig hebben. De cijfers hieronder laten zien hoeveel vaccins Nederland krijgt en hoeveel vaccins we op voorraad hebben.',
      reference: {
        href: '/verantwoording#leveringen-en-voorraad-vaccins',
        text:
          'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
      },
    },
    stock: {
      title: 'Vaccins in voorraad',
      description:
        'Dit getal laat zien hoeveel vaccins het RIVM op voorraad heeft per type vaccin. We houden niet meer vaccins in voorraad dan nodig is om te zorgen dat afspraken in de komende dagen gewoon door kunnen gaan en iedereen op tijd de tweede prik krijgt.',
      per_vaccine: '{{amount}} {{label}} vaccins',
      columns: {
        product_name: 'Type vaccin',
        available: 'Beschikbaar',
        not_available: 'Nog niet beschikbaar',
      },
    },
    delivery_estimate_time_span: {
      title: 'Verwachte leveringen',
      description:
        'Aantal vaccins dat Nederland de komende vier weken verwacht te krijgen. Elke week ontvangt Nederland een deel van de vaccins. Mensen hebben twee prikken nodig voor een volledige vaccinatie, behalve van het Janssen-vaccin. Van het Janssen-vaccin is één prik genoeg.',
    },
    grafiek_leveringen: {
      titel: 'Leveringen',
      omschrijving:
        'Deze grafiek laat zien hoeveel vaccins Nederland per week heeft gekregen en verwacht te krijgen van de verschillende producenten. Er wordt uitgegaan van 6 doses per flesje voor BioNTech/Pfizer, 10 doses per flesje voor Moderna, 11 doses per flesje voor AstraZeneca en 5 doses per flesje voor Janssen.',
      timeframe_recent_en_verwacht: 'Toon recent en verwacht',
    },
    bereidheid_datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt elke drie weken bijgewerkt.',
    stock_per_supplier_chart: {
      title: 'Voorraad per type vaccin',
      description:
        'Deze grafiek laat zien hoeveel vaccins het RIVM de afgelopen tijd op voorraad had per type vaccin. De totale voorraad bestaat uit de beschikbare en de nog niet beschikbare voorraad. De beschikbare voorraad is klaar voor gebruik en bestaat deels uit veiligheidsvoorraad. Nog niet beschikbare voorraad zijn vaccins die bijvoorbeeld nog gecontroleerd moeten worden. Na de controle komen ze in de beschikbare voorraad.',
      tooltip_title: 'Voorraad',
      legend: {
        available: 'Beschikbare voorraad {{vaccineName}}',
        total: 'Totale voorraad {{vaccineName}}',
      },
      select_help_text: 'Selecteer type vaccin om de voorraad te bekijken',
      tooltip_labels: {
        available: 'Beschikbare voorraad',
        total: 'Totale voorraad',
      },
    },
  },
  editorial_detail: {
    back_link: {
      text: 'Terug naar actueel',
    },
  },
  article_detail: {
    back_link: {
      text: 'Terug naar alle artikelen',
    },
  },
  articles_metadata: {
    title: 'Artikelen | Coronadashboard | Rijksoverheid.nl',
    description: '',
    url: 'https://coronadashboard.rijksoverheid.nl/artikelen',
  },
  common_actueel: {
    terug_naar_landelijk: 'Terug naar landelijke situatie',
    laatst_bijgewerkt: 'Laatst bijgewerkt: {{date}}',
    secties: {
      artikelen: {
        titel: 'Actuele artikelen',
        link: {
          text: 'Bekijk alle artikelen',
          href: '/artikelen',
        },
      },
      risicokaart: {
        titel: 'De risicokaart van Nederland',
        link: {
          text: "Bekijk de risiconiveaus van alle regio's",
          href: '/veiligheidsregio',
        },
      },
      meer_lezen: {
        titel: 'Meer lezen over het coronavirus',
        omschrijving:
          'Hier vindt u geregeld nieuwe berichten die allerlei zaken rondom de coronacijfers uitleggen.',
        link: {
          text: 'Bekijk alle artikelen',
          href: '/artikelen',
        },
        read_weekly_message: 'Lees het weekbericht',
        weekly_category: 'Weekbericht',
      },
      positief_getest_kaart: {
        titel: 'Positief geteste mensen in Nederland',
      },
    },
    overview_links_header: 'Bekijk alle cijfers op dit dashboard',
  },
  nationaal_actueel: {
    title: 'De actuele situatie in {{the_netherlands}}',
    the_netherlands: 'Nederland',
    metadata: {
      title: 'Coronadashboard | COVID-19 | Rijksoverheid.nl',
      description:
        'Informatie over de ontwikkeling van het coronavirus in Nederland.',
    },
    risiconiveaus: {
      selecteer_titel: 'De risicokaart van Nederland',
      selecteer_toelichting:
        'Iedere twee weken wordt bekeken of de situatie rond het coronavirus zich positief of negatief ontwikkelt. De laatste keer is dit op {{last_update}} gebeurd. Op welk niveau een regio zit, hangt af van het aantal positieve testen en het aantal ziekenhuisopnames. [Meer informatie over de risiconiveaus](/over-risiconiveaus).',
      belangrijk_bericht:
        '[De huidige maatregelen gelden voor het hele land tot en met ten minste 27 april](https://coronadashboard.rijksoverheid.nl/landelijk/maatregelen).',
    },
    data_sitemap_titel: 'Onderwerpen op dit dashboard',
    data_sitemap_toelichting: 'Ga direct naar de volgende onderwerpen:',
    mini_trend_tiles: {
      positief_getest: {
        title: 'Aantal positieve testen',
      },
      ziekenhuis_opnames: {
        title: 'Ziekenhuisopnames',
      },
      ic_opnames: {
        title: 'Intensive care-opnames',
      },
      toegediende_vaccins: {
        title: 'Aantal gezette prikken',
        sub_title: '',
        administered_tests:
          'Tot nu toe zijn er {{administeredVaccines}} prikken gezet. Dit cijfer omvat zowel eerste als tweede prikken.',
        supply: '',
      },
    },
    data_driven_texts: {
      infected_people_total: {
        value: {
          zero: '{{newDate}} zijn er geen nieuwe positieve tests gemeld.',
          singular:
            '{{newDate}} is {{propertyValue}} nieuwe positieve test gemeld.',
          plural:
            '{{newDate}} zijn er {{propertyValue}} nieuwe positieve tests gemeld.',
        },
        difference: {
          zero: 'Dat is hetzelfde als {{relativeOldDate}}.',
          singular: 'Dat is er {{differenceIndicator}} dan de vorige waarde.',
          plural: 'Dat zijn er {{differenceIndicator}} dan de vorige waarde.',
        },
      },
      intake_hospital_ma: {
        value: {
          zero: '{{newDate}} zijn er geen nieuwe ziekenhuisopnames gemeld.',
          singular:
            '{{newDate}} is {{propertyValue}} nieuwe ziekenhuisopname gemeld.',
          plural:
            '{{newDate}} zijn {{propertyValue}} nieuwe ziekenhuisopnames gemeld.',
        },
        difference: {
          zero: 'Dit is hetzelfde als {{relativeOldDate}}.',
          singular: 'Dat is er {{differenceIndicator}} dan de vorige waarde.',
          plural: 'Dat zijn er {{differenceIndicator}} dan de vorige waarde.',
        },
      },
      intake_intensivecare_ma: {
        value: {
          zero: '{{newDate}} zijn er geen nieuwe IC-opnames gemeld.',
          singular: '{{newDate}} is {{propertyValue}} nieuwe ic opname gemeld.',
          plural:
            '{{newDate}} zijn {{propertyValue}} nieuwe intensive care-opnames gemeld.',
        },
        difference: {
          zero: 'Dit is hetzelfde als {{relativeOldDate}}.',
          singular: 'Dat is er {{differenceIndicator}} dan de vorige waarde.',
          plural: 'Dat zijn er {{differenceIndicator}} dan de vorige waarde.',
        },
      },
    },
    quick_links: {
      header: 'Bekijk alle cijfers van het dashboard',
      links: {
        nationaal: 'Cijfers van Nederland',
        veiligheidsregio: 'Cijfers per veiligheidsregio',
        gemeente: 'Cijfers per gemeente',
      },
    },
    latest_articles: {
      title: 'Meer lezen over het coronavirus',
      subtitle:
        'Hier vindt u geregeld nieuwe berichten die allerlei zaken rondom de coronacijfers uitleggen.',
      all_articles: 'Bekijk alle artikelen',
    },
    title_link: 'Bekijk alle cijfers van Nederland',
    secties: {
      actuele_situatie: {
        titel: 'De actuele situatie in {{the_netherlands}}',
        link: {
          text: 'Bekijk alle cijfers van Nederland',
          href: '/landelijk/vaccinaties',
        },
      },
      positief_geteste_mensen: {
        titel: 'Positief geteste mensen in Nederland',
      },
    },
  },
  'common.tooltip.positive_tested_value': '',
  search: {
    placeholder: 'Zoek een gemeente of veiligheidsregio',
    clear: 'Zoekopdracht wissen',
    no_hits: 'Geen {{subject}} gevonden met “{{search}}”',
  },
  veiligheidsregio_actueel: {
    title: 'De actuele situatie in veiligheidsregio {{safetyRegionName}}',
    metadata: {
      title: 'Actuele situatie in de veiligheidsregio {{safetyRegionName}}',
      description:
        'Actuele situatie in de veiligheidsregio {{safetyRegionName}}',
    },
    risiconiveaus: {
      selecteer_titel: 'De risicokaart van Nederland',
      selecteer_toelichting:
        'Iedere twee weken wordt bekeken of de situatie rond het coronavirus zich positief of negatief ontwikkelt. De laatste keer is dit op {{last_update}} gebeurd. Op welk niveau een regio zit, hangt af van het aantal positieve testen en het aantal ziekenhuisopnames. [Meer informatie over de risiconiveaus](/over-risiconiveaus).',
    },
    risoconiveau_maatregelen: {
      title: 'Risiconiveau & maatregelen',
      description: 'Voor de veiligheidsregio geldt het risiconiveau',
      bekijk_href: 'Bekijk de maatregelen',
    },
    mini_trend_tiles: {
      positief_getest: {
        title: 'Aantal positieve testen',
      },
      ziekenhuis_opnames: {
        title: 'Ziekenhuisopnames',
      },
      ic_opnames: {
        title: 'Intensive care-opnames',
      },
    },
    data_driven_texts: {
      infected_people_total: {
        value: {
          zero: '{{newDate}} zijn er geen positieve tests gemeld.',
          singular:
            '{{newDate}} was er {{propertyValue}} gemelde positieve test.',
          plural:
            '{{newDate}} waren er {{propertyValue}} gemelde positieve tests.',
        },
        difference: {
          zero: 'Dit is hetzelfde als {{relativeOldDate}}.',
          singular: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
          plural: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
        },
      },
      intake_hospital_ma: {
        value: {
          zero: '{{newDate}} zijn er geen ziekenhuisopnames gemeld.',
          singular:
            '{{newDate}} is er {{propertyValue}} ziekenhuisopname gemeld.',
          plural:
            '{{newDate}} zijn er {{propertyValue}} ziekenhuisopnames gemeld.',
        },
        difference: {
          zero: 'Dit is hetzelfde als {{relativeOldDate}}.',
          singular: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
          plural: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
        },
      },
      intake_intensivecare_ma: {
        value: {
          zero: '{{newDate}} zijn er geen intensive care-opnames gemeld.',
          singular:
            '{{newDate}} is er {{propertyValue}} intensive care opname gemeld.',
          plural:
            '{{newDate}} zijn er {{propertyValue}} intensive care-opnames gemeld.',
        },
        difference: {
          zero: 'Dit is hetzelfde als {{relativeOldDate}}.',
          singular: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
          plural: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
        },
      },
    },
    quick_links: {
      header: 'Bekijk alle cijfers van het dashboard',
      links: {
        nationaal: 'Cijfers van Nederland',
        veiligheidsregio: 'Cijfers van veiligheidsregio {{safetyRegionName}}',
        gemeente: 'Cijfers per gemeente',
      },
    },
    secties: {
      actuele_situatie: {
        titel: 'De actuele situatie in veiligheidsregio {{safetyRegionName}}',
        link: {
          text: 'Bekijk alle cijfers van {{safetyRegionName}}',
          href: '/veiligheidsregio/{{vrCode}}/risiconiveau',
        },
      },
    },
    data_sitemap_title: 'Cijfers van {{safetyRegionName}}',
  },
  gemeente_actueel: {
    title: 'Actuele situatie in de gemeente {{municipalityName}}',
    metadata: {
      title: 'Actuele situatie in {{municipalityName}}',
      description: 'Actuele situatie in {{municipalityName}}',
    },
    risiconiveaus: {
      selecteer_titel: 'De risicokaart van Nederland',
      selecteer_toelichting:
        'Iedere twee weken wordt bekeken of de situatie rond het coronavirus zich positief of negatief ontwikkelt. De laatste keer is dit op {{last_update}} gebeurd. Op welk niveau een regio zit, hangt af van het aantal positieve testen en het aantal ziekenhuisopnames. [Meer informatie over de risiconiveaus](/over-risiconiveaus).',
    },
    risoconiveau_maatregelen: {
      title: 'Risiconiveau & maatregelen',
      description:
        'Voor de veiligheidsregio van deze gemeente geldt het risiconiveau',
      bekijk_href: 'Bekijk de maatregelen',
    },
    mini_trend_tiles: {
      positief_getest: {
        title: 'Aantal positieve testen',
      },
      ziekenhuis_opnames: {
        title: 'Ziekenhuisopnames',
      },
      ic_opnames: {
        title: 'Intensive care-opnames',
      },
    },
    data_driven_texts: {
      infected_people_total: {
        value: {
          zero: '{{newDate}} zijn er geen positief geteste personen gemeld.',
          singular:
            '{{newDate}} was er {{propertyValue}} positief getest persoon.',
          plural:
            '{{newDate}} waren er {{propertyValue}} positief geteste mensen.',
        },
        difference: {
          zero: 'Dit is hetzelfde als {{relativeOldDate}}.',
          singular: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
          plural: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
        },
      },
      intake_hospital_ma: {
        value: {
          zero: '{{newDate}} waren er geen nieuw gemelde ziekenhuisopnames.',
          singular:
            '{{newDate}} waren er {{propertyValue}} nieuw gemelde ziekenhuisopnames.',
          plural:
            '{{newDate}} zijn er {{propertyValue}} ziekenhuisopnames gemeld.',
        },
        difference: {
          zero: 'Dit is hetzelfde als {{relativeOldDate}}.',
          singular: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
          plural: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
        },
      },
      intake_intensivecare_ma: {
        value: {
          zero:
            '{{newDate}} waren er geen nieuw gemelde intensive care-opnames.',
          singular:
            '{{newDate}} waren er {{propertyValue}} nieuw gemelde intensive care-opnames.',
          plural:
            '{{newDate}} waren er {{propertyValue}} nieuwe gemelde intensive care-opnames.',
        },
        difference: {
          zero: 'Dit is hetzelfde als {{relativeOldDate}}.',
          singular: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
          plural: 'Dit is {{differenceIndicator}} dan de vorige waarde.',
        },
      },
    },
    quick_links: {
      header: 'Bekijk alle cijfers van het dashboard',
      links: {
        nationaal: 'Cijfers van Nederland',
        veiligheidsregio: 'Cijfers van veiligheidsregio {{safetyRegionName}}',
        veiligheidsregio_fallback: 'Cijfers per veiligheidsregio',
        gemeente: 'Cijfers van gemeente {{municipalityName}}',
      },
    },
    secties: {
      actuele_situatie: {
        titel: 'Actuele situatie in {{municipalityName}}',
        link: {
          text: 'Bekijk alle cijfers van {{municipalityName}}',
          href: '/gemeente/{{gmCode}}/positief-geteste-mensen',
        },
      },
    },
    data_sitemap_title: 'Cijfers van {{municipalityName}}',
  },
  toegankelijkheid_metadata: {
    title: 'Toegankelijkheid | Coronadashboard | Rijksoverheid.nl',
    description:
      'Informatie over de toegankelijkheid van het COVID-19 Dashboard.',
    url: 'https://coronadashboard.rijksoverheid.nl/verantwoording',
  },
  article_strip_title: 'Meer informatie over dit onderwerp',
  vr_risiconiveau: {
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt wekelijks bijgewerkt.',
    reference: {
      href: '/over-risiconiveaus',
      text:
        'Lees meer over de risiconiveaus en wat dit betekent voor de maatregelen op de pagina ‘Over de risiconiveaus’',
    },
    metadata: {
      title: 'Risiconiveau {{safetyRegionName}}',
      description: 'Risiconiveau {{safetyRegionName}}',
    },
    titel: 'Risiconiveau in {{safetyRegionName}}',
    pagina_toelichting:
      'Elke twee weken wordt bepaald in welk risiconiveau een regio zit. Daarvoor kijken we naar het aantal positieve testen en het aantal ziekenhuisopnames. Het meest ernstige cijfer bepaalt het risiconiveau. Bij de risiconiveaus horen maatregelen. Welke maatregelen precies gelden, hangt niet alleen af van hoe het in de veiligheidsregio gaat, maar ook van de situatie in het hele land. ',
    current_escalation_level: 'Risiconiveau van dit moment',
    bronnen: {
      rivm_positieve_testen: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_per_dag.csv',
        href:
          'https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_per_dag.html',
        text: 'RIVM (positieve testen)',
      },
      rivm_ziekenhuisopnames: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.html',
        text: 'RIVM (ziekenhuisopnames)',
      },
      rivm_positieve_testen_kpi: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_per_dag.csv',
        href:
          'https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_per_dag.html',
        text: 'RIVM',
      },
      rivm_ziekenhuisopnames_kpi: {
        download:
          'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.csv',
        href: 'https://data.rivm.nl/covid-19/COVID-19_ziekenhuisopnames.html',
        text: 'RIVM',
      },
    },
    positieve_testen: {
      title: 'Positieve testen',
      value_annotation: 'per 100.000 inwoners per week',
      description:
        'Dit getal laat zien hoeveel mensen uit deze veiligheidsregio de afgelopen 7 dagen positief getest zijn per 100.000 inwoners. De balk laat zien hoe ernstig het aantal positieve testen is.',
    },
    ziekenhuisopnames: {
      title: 'Ziekenhuisopnames (inclusief IC)',
      value_annotation: 'per 1 miljoen inwoners per week',
      description:
        'Dit getal laat zien hoeveel mensen met COVID-19 uit deze veiligheidsregio in de afgelopen 7 dagen in een ziekenhuis zijn opgenomen per 1 miljoen inwoners. De balk laat zien hoe ernstig het aantal ziekenhuisopnames is.',
    },
    types: {
      '1': {
        toelichting:
          'Dit is het risiconiveau dat nu geldt in deze regio. Het risiconiveau wordt elke twee weken bepaald op basis van het aantal ziekenhuisopnames en het aantal positieve testen van dat moment.',
      },
      '2': {
        toelichting:
          'Dit is het risiconiveau dat nu geldt in deze regio. Het risiconiveau wordt elke twee weken bepaald op basis van het aantal ziekenhuisopnames en het aantal positieve testen van dat moment.',
      },
      '3': {
        toelichting:
          'Dit is het risiconiveau dat nu geldt in deze regio. Het risiconiveau wordt elke twee weken bepaald op basis van het aantal ziekenhuisopnames en het aantal positieve testen van dat moment.',
      },
      '4': {
        toelichting:
          'Dit is het risiconiveau dat nu geldt in deze regio. Het risiconiveau wordt elke twee weken bepaald op basis van het aantal ziekenhuisopnames en het aantal positieve testen van dat moment.',
      },
    },
    escalation_level_last_determined:
      'Dit risiconiveau is bepaald op {{last_determined}}, op basis van de cijfers van {{based_from}} t/m {{based_to}}. Rond {{next_determined}} wordt het risiconiveau opnieuw bepaald.',
    momenteel: {
      description:
        'Dit is het risiconiveau dat nu geldt in deze regio. Het risiconiveau wordt elke twee weken bepaald op basis van het aantal ziekenhuisopnames en het aantal positieve testen van dat moment.',
      description_from_to: '',
      last_determined: 'Dit risiconiveau is bepaald op',
      established_with: {
        title: 'Het risiconiveau is bepaald met de cijfers van',
        description: '{{based_from}} t/m {{based_to}}',
      },
      positive_tests: {
        title: 'Positieve testen',
        description: '{{amount}} per 100.000 inwoners per week',
      },
      hospital_admissions: {
        title: 'Ziekenhuisopnames (incl. IC)',
        description: '{{amount}} per 1 miljoen inwoners per week',
      },
      next_determined: 'Het risiconiveau wordt opnieuw bepaald',
      link_text: '',
    },
  },
  gemeente_sterfte: {
    titel_sidebar: 'Sterfte',
    titel_kpi: 'Gemelde aantal overleden COVID-19 patiënten per dag',
    metadata: {
      title:
        'Sterfte in {{municipalityName}} | Coronadashboard | Rijksoverheid.nl',
      description: 'Aantal overledenen per dag in {{municipalityName}}',
    },
    section_deceased_rivm: {
      title: 'Sterfte in {{municipalityName}}',
      description:
        'Deze cijfers laten zien van hoeveel COVID-19 patiënten in deze gemeente gisteren aan de GGD gemeld is dat ze zijn overleden. Het werkelijke aantal overleden COVID-19 patiënten is waarschijnlijk hoger, omdat niet alle patiënten getest worden en er geen meldingsplicht geldt voor overlijden aan COVID-19.',
      datums:
        'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
      bronnen: {
        rivm: {
          href:
            'https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/5f6bc429-1596-490e-8618-1ed8fd768427',
          text: 'RIVM',
          download:
            'https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_per_dag.csv',
        },
      },
      reference: {
        href: '/verantwoording#sterfte',
        text:
          'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
      },
      kpi_covid_daily_title:
        'Gemelde aantal overleden COVID-19 patiënten per dag',
      kpi_covid_daily_description:
        'Dit getal toont het aantal COVID-19 patiënten in deze gemeente waarvan aan de GGD op die dag gemeld is dat ze zijn overleden. Een deel van de overlijdens is van eerdere dagen, die later zijn doorgegeven.',
      kpi_covid_total_title: 'Totaal aantal overleden COVID-19 patiënten',
      kpi_covid_total_description:
        'Dit getal laat zien van hoeveel COVID-19 patiënten in deze gemeente in totaal is gemeld dat ze zijn overleden, sinds het begin van de meldingen.',
      line_chart_covid_daily_title:
        'Gemelde aantal overleden COVID-19 patiënten door de tijd heen',
      line_chart_covid_daily_description:
        'Deze grafiek laat zien van hoeveel COVID-19 patiënten in deze gemeente in de geselecteerde periode gemeld is dat ze zijn overleden.',
      line_chart_covid_daily_legend_trend_label:
        'Meldingen overleden patiënten',
      line_chart_covid_daily_legend_trend_short_label: 'Overleden patiënten',
      line_chart_covid_daily_legend_inaccurate_label:
        'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
    },
    kpi_titel: 'Gemeld aantal personen overleden aan COVID-19 per dag',
  },
  corona_melder_app: {
    header: {
      category: 'Preventie verspreiding',
      title: 'Gebruik CoronaMelder-app',
      description:
        'Om verspreiding van het coronavirus tegen te gaan, is de app CoronaMelder ontwikkeld. Deze app houdt bij wanneer gebruikers van de app langere tijd bij elkaar in de buurt zijn geweest. Wanneer een gebruiker van de CoronaMelder postitief test op COVID-19 kan (met hulp van de GGD) een waarschuwing worden verzonden naar andere appgebruikers die in de buurt zijn geweest. Zij kunnen zich dan laten testen en zo voorkomen dat ze onbewust andere mensen besmetten.',
      datums:
        'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
      reference: {
        text:
          'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
        href: '/verantwoording#coronamelder',
      },
      bronnen: {
        rivm: {
          download: '',
          text: 'CoronaMelder',
          href:
            'https://github.com/minvws/nl-covid19-notification-app-statistics',
        },
      },
    },
    waarschuwingen: {
      title: 'Aantal mensen dat anderen waarschuwde via CoronaMelder: ',
      description:
        'Dit cijfer laat zien hoeveel (positief geteste) gebruikers van CoronaMelder gisteren andere app-gebruikers hebben gewaarschuwd.',
      total: '{{totalDownloads}} mensen hebben de CoronaMelder-app gedownload.',
    },
    rapport: {
      title: 'Factsheet CoronaMelder',
      description:
        'Er wordt steeds onderzocht hoe CoronaMelder werkt in de praktijk. De laatste factsheet hierover is te vinden via de website van de CoronaMelder-app.',
      link: {
        text: 'Meest recente factsheet CoronaMelder-app',
        href: 'https://www.coronamelder.nl/media/Factsheet_Corona_latest.pdf',
      },
    },
    waarschuwingen_over_tijd_grafiek: {
      title: 'Waarschuwingen door de tijd heen',
      description:
        'Deze grafiek laat per dag zien hoeveel (positief geteste) gebruikers van CoronaMelder andere app-gebruikers hebben gewaarschuwd.',
      ariaDescription:
        'Deze grafiek laat per dag zien hoeveel (positief geteste) gebruikers van CoronaMelder andere app-gebruikers hebben gewaarschuwd.',
      bronnen: {
        coronamelder: {
          download: '',
          text: 'CoronaMelder',
          href: '',
        },
      },
      labels: {
        warnings: 'Aantal waarschuwingen',
      },
    },
  },
  choropleth_tooltip: {
    patients: {
      singular: 'patiënt',
      plural: 'patiënten',
    },
    positive_tested_people: 'Positief geteste mensen:',
    hospital_admissions: 'Ziekenhuisopnames:',
    infected_locations: 'Besmette locaties:',
    elderly_at_home: 'Thuiswonende 70-plussers:',
    sewer_regional: 'Gemiddeld aantal virusdeeltjes:',
    sewer_municipal: 'Gemiddeld aantal virusdeeltjes:',
  },
  milestones: {
    toon_meer: 'Toon eerdere gebeurtenissen',
    verwacht: 'Verwacht',
  },
  section_sterftemonitor_vr: {
    title: 'Sterftemonitor',
    description:
      'Het Centraal Bureau voor de Statistiek (CBS) publiceert wekelijks het totaal aantal overleden mensen en vergelijkt dit aantal met het verwacht aantal overlijdens gecorrigeerd voor koude- of hittegolven, uitbraken en epidemieën. Er is sprake van oversterfte indien meer mensen overlijden dan verwacht. Deze grafiek geeft mogelijk een completer beeld van sterfte door COVID-19 dan de door de GGD’en gemelde COVID-19 sterfte, omdat niet alle mensen die overlijden aan COVID-19 getest zijn op COVID-19.',
    datums:
      'Laatste waardes verkregen op {{dateOfInsertion}}. Wordt dagelijks bijgewerkt.',
    bronnen: {
      cbs: {
        href: 'https://mlzopendata.cbs.nl/#/MLZ/nl/dataset/40080NED',
        text: 'CBS',
        download:
          'https://dataderden.cbs.nl/ODataApi/OData/40080NED/TypedDataSet?$filter=(substringof({{272020W}}27,%20Perioden){{20eq}}20true){{20or}}20(substringof({{272021W}}27,%20Perioden){{20eq}}20true){{20and}}20(substringof({{27VR}}27,%20RegioS){{20eq}}20true)&$select=Perioden,%20RegioS,%20Overledenen_1',
      },
    },
    reference: {
      href: '/verantwoording#sterftemonitor-CBS',
      text:
        'Lees meer over de informatie op deze pagina in de ‘Cijferverantwoording’.',
    },
  },
  infected_per_age_group: {
    title: 'Aantal positieve testen per leeftijdsgroep door de tijd heen',
    description:
      'Deze grafiek laat zien hoeveel mensen in een bepaalde leeftijdsgroep positief getest zijn op het coronavirus, per 100.000 inwoners. In de grafiek worden gemiddelden over de afgelopen zeven dagen getoond. Let op dat de cijfers niet overeenkomen met het aantal positief geteste mensen dat op andere plekken op deze pagina staat. Dit komt doordat de gegevens uit een andere databron komen. In dit bestand worden andere datums gebruikt, namelijk vooral de eerste ziektedag. Lees hier meer over in de cijferverantwoording.',
    legend: {
      infected_age_0_9_per_100k: '0-9',
      infected_age_10_19_per_100k: '10-19',
      infected_age_20_29_per_100k: '20-29',
      infected_age_30_39_per_100k: '30-39',
      infected_age_40_49_per_100k: '40-49',
      infected_age_50_59_per_100k: '50-59',
      infected_age_60_69_per_100k: '60-69',
      infected_age_70_79_per_100k: '70-79',
      infected_age_80_89_per_100k: '80-89',
      infected_age_90_plus_per_100k: '90+',
      infected_overall_per_100k: 'Alle leeftijden',
    },
    reset_button_label: 'Reset',
    legend_help_text:
      'Selecteer één of meerdere leeftijdsgroepen om deze te bekijken',
    line_chart_legend_inaccurate_label:
      'Laatste dagen zijn niet compleet omdat meldingen vertraagd binnenkomen',
    tooltip_labels: {
      inaccurate: 'Niet compleet',
    },
  },
  g_number: {
    bar_chart: {
      title: 'Ontwikkeling aantal positieve tests (Groeigetal)',
      description:
        'Het Groeigetal (of G-getal) geeft in procenten weer of in de afgelopen 7 dagen meer of minder mensen positief zijn getest op corona dan in de 7 dagen ervoor. Bij een positief Groeigetal is de trend dat het aantal positieve tests toeneemt. Bij een negatief Groeigetal is de trend dat het aantal positieve tests afneemt. De grafiek laat het Groeigetal van de laatste vijf weken zien.',
      negative_descriptor: 'minder',
      positive_descriptor: 'meer',
      bronnen: {
        download: '',
        href: '',
        text: 'Ministerie van VWS op basis van RIVM',
      },
    },
  },
  afschaling: {
    trend_grafieken: {
      reproductiegetal: 'Reproductiegetal',
      ic_opnames: 'IC-opnames',
      ziekenhuisopnames: 'Ziekenhuisopnames (incl. IC)',
      grenswaarde_meer: 'Grenswaarde is overschreden',
      grenswaarde_minder:
        'Waarde is minder dan {{days}} dagen onder de grenswaarde',
    },
  },
};
