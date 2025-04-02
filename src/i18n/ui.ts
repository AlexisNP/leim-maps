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
        'maps.markers.new': 'Nouveau marqueur',
        'maps.markers.addPersonal': 'Ajouter un marqueur personnel',
        'maps.markers.newNotice': "Le marqueur sera sauvegardé mais n'apparaîtra que sur votre carte !"
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
        'maps.markers.new': 'New marker',
        'maps.markers.addPersonal': 'Add a personal marker',
        'maps.markers.newNotice': "The marker will be saved but will only appear on your map!"
    }
} as const;
