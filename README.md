# My Sam — site

Site statique du cabinet **My Sam**. Aucune dépendance, aucune étape de build :
les fichiers du dépôt sont exactement ceux qui sont servis.

## Lancer le site en local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Structure

```
index.html                        La porte d'entrée : choix du profil
entreprises.html                  Conseil aux entreprises
particuliers.html                 Accompagnement des personnes
associations.html                 Structures d'accompagnement
contact.html                      Contact — sert aussi d'aboutissement à « Autre »
ressources/
  modele-cv-annote.html           Ressource : le CV commenté section par section
assets/
  css/  fonts · base · gateway · page · resource
  js/   config · site · gateway · resource
  fonts/                          Instrument Sans & Serif (OFL), auto-hébergées
```

## Ce qu'il faut renseigner

Tout ce qui dépend d'informations réelles est regroupé dans **`assets/js/config.js`** :

| Champ          | Effet quand il est vide                                   |
|----------------|-----------------------------------------------------------|
| `email`        | affiche « À compléter » sur la page contact                |
| `phone`        | idem                                                        |
| `linkedin`     | idem                                                        |
| `formEndpoint` | le formulaire reste désactivé, avec un message explicite   |

Dès qu'une valeur est saisie, l'affichage correspondant s'active partout. Rien
n'est inventé tant que le champ est vide : c'est volontaire.

Les contenus encore provisoires portent une pastille **« Contenu provisoire »**
dans la page. Cherchez `class="provisional"` pour les retrouver tous.

Restent à rédiger : les mentions légales et la politique de confidentialité
(lien en pied de page, actuellement signalé comme à faire).

## Direction artistique

Les décisions visuelles sont centralisées en variables CSS au début de
`assets/css/base.css` : encre, papier, accent terre cuite, tons par univers,
échelle typographique, rythme, courbes d'animation. Changer l'accent du site
se fait sur une ligne.

- **Typographie** — Instrument Serif (titres) / Instrument Sans (texte).
- **Accent** — `--accent` sur fond clair, `--accent-up` sur fond sombre.
  Les deux ont été vérifiés au contraste ; ne pas utiliser `--accent-up`
  sur du papier.
- **Tons d'univers** — `--tone-entreprises`, `--tone-particuliers`,
  `--tone-associations` : uniquement employés en halo très basse opacité.

## Accessibilité & robustesse

Vérifiés sur cette version :

- tous les textes passent le contraste **WCAG AA** ;
- navigation clavier complète sur la porte d'entrée (`1` `2` `3`, `↑` `↓`, `Entrée`) ;
- `prefers-reduced-motion` coupe les animations et les transitions de page ;
- **sans JavaScript** : les trois choix restent des liens, les pages restent
  lisibles, et les 32 conseils du CV annoté s'affichent tous à la suite ;
- aucun débordement horizontal de 320 px à 1920 px.

## Ajouter un univers

1. Dupliquer `entreprises.html`, changer le contenu et `data-profile`.
2. Ajouter un ton `--tone-<nom>` dans `assets/css/base.css`.
3. Ajouter la ligne dans `index.html` (`.gw__list`), le lien dans `.site-nav`
   et dans `.switch` de chaque page.
4. Ajouter le libellé dans `LABELS` de `assets/js/gateway.js`.
