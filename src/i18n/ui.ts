export const availableLangs = ['fr', 'en'] as const;
export type Language = typeof availableLangs[number];
export type LanguageDict = Record<Language, any>;

export const defaultLang: Language = 'fr';

export const translations: LanguageDict = {
    'fr': {
        'lang.fr': 'Français',
        'lang.en': 'English',
        'common.title': 'Titre',
        'common.create': 'Créer',
        'common.by': 'par',
        'common.copyLink': 'Copier le lien',
        'common.copiedLink': 'Lien copié !',
        'continents': 'Continents',
        'cities': 'Villes',
        'others': 'Autres',
        'new': 'Nouveau',
        'quests': 'Quêtes',
        'capitals': 'Capitales',
        'points-of-interest': 'Points d\'intérêt',
        'personals': 'Personnels',
        'nav.aria-label': 'Navigation principale',
        'nav.map.aria-label': 'Changer de carte',
        'nav.lang.aria-label': 'Changer de langue',
        'maps.go-to-map': 'Voir la carte détaillée',
        'maps.go-to-player': 'Aller à la position actuelle des joueurs',
        'maps.seeQuest': 'Voir la quête',
        'maps.seePlace': 'Voir sur la carte',
        'maps.search': 'Rechercher la carte',
        'maps.searchPlaceholder': "Ville, point d'intérêt…",
        'maps.closeSearch': 'Enlever le filtre',
        'maps.copyCoords': 'Copier les coordonnées',
        'maps.markers.new': 'Nouveau marqueur',
        'maps.markers.addPersonal': 'Ajouter un marqueur personnel',
        'maps.markers.newNotice': "Le marqueur sera sauvegardé mais n'apparaîtra que sur votre carte !",
        'toast.copyCoords.description': 'Les coordonnées ont été copiées dans le presse-papiers !',
        'legal.cta': 'Mentions légales',
        'legal.text': `
            <p>Cette application est construite avec <a href="https://astro.build/" target="_blank">astro</a>, <a href="https://leafletjs.com/" target="_blank">leaflet</a> et <a href="https://vuejs.org/" target="_blank">vue</a>. J'utilise également des icônes de <a href="https://phosphoricons.com/" target="_blank">phosphor</a> et elle est actuellement hébergée sur <a href="https://www.ovhcloud.com" target="_blank">OVH</a>.</p>
            <h3>Données personelles</h3>
            <p>Je ne collecte aucune donnée sur votre activité dans cette application. Les marqueurs personnalisés que vous pouvez placer n'existent que sur votre navigateur en tant que données de <a href="https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage" target="_blank">local storage</a>.</p>
            <p>Mon hébergeur collecte des données de trafic pour des raisons de sécurité ; comme les adresses IP et leur emplacement approximatif, les types de navigateurs, les agents utilisateurs (si vous êtes un robot ou un humain) et l'état de la demande. </p>
            <p>Ce site n'utilise pas de pixels de suivi ou d'analyse, et je n'utilise aucune autre application tierce qui pourrait collecter des données sur vous (comme Youtube ou autre)</p>
            <p>Malgré cela, <strong>aucune de vos données n'est vendue ou transmise à un tiers quel qu'il soit</strong>.</p>
            <p>Si vous avez des questions, vous pouvez me contacter à <a href="mailto:contact@alexcreates.fr">contact@alexcreates.fr</a>.</p>
        `
    },
    'en': {
        'lang.fr': 'Français',
        'lang.en': 'English',
        'common.title': 'Title',
        'common.create': 'Create',
        'common.by': 'by',
        'common.copyLink': 'Copy link',
        'common.copiedLink': 'Link copied!',
        'continents': 'Continents',
        'cities': 'Cities',
        'others': 'Others',
        'new': 'New',
        'quests': 'Quests',
        'capitals': 'Capitals',
        'points-of-interest': 'Points of interest',
        'personals': 'Personals',
        'nav.aria-label': 'Main navigation',
        'nav.map.aria-label': 'Switch map',
        'nav.lang.aria-label': 'Switch language',
        'maps.go-to-map': 'See detailed map',
        'maps.go-to-player': 'Go to current players position',
        'maps.seeQuest': 'See the quest',
        'maps.seePlace': 'See on the map',
        'maps.search': 'Search the map',
        'maps.searchPlaceholder': "City, point of interest…",
        'maps.closeSearch': 'Remove filter',
        'maps.copyCoords': 'Copy coordinates',
        'maps.markers.new': 'New marker',
        'maps.markers.addPersonal': 'Add a personal marker',
        'maps.markers.newNotice': "The marker will be saved but will only appear on your map!",
        'toast.copyCoords.description': 'Coordinates have been copied to your clipboard !',
        'legal.cta': 'Legal notice',
        'legal.text': `
            <p>This app is built with <a href="https://astro.build/" target="_blank">astro</a>, <a href="https://leafletjs.com/" target="_blank">leaflet</a> and <a href="https://vuejs.org/" target="_blank">vue</a>. I also use icons from <a href="https://phosphoricons.com/" target="_blank">phosphor</a> and it's currently hosted on <a href="https://www.ovhcloud.com" target="_blank">OVH</a>.</p>
            <h3>Privacy</h3>
            <p>I don't collect any data of your activity with this app. The custom markers that you may place only exist on your browser as <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">local storage</a> data.</p>
            <p>My hosting provider collects traffic data for security reasons ; like IP addresses and their approximate location, browsers types, user agents (if you're a robot or a human) and the request status.</p>
            <p>This website doesn't use any tracking pixels or analytics, and I don't use any other third-party app that might collect stuff from you (like Youtube or anything else)</p>
            <p>Regardless, <strong>none of your data is sold or passed to any third-party whatsoever</strong>.</p>
            <p>If you have any questions, you can contact me at <a href="mailto:contact@alexcreates.fr">contact@alexcreates.fr</a>.</p>
        `
    }
} as const;
