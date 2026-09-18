/* =========================================================
   MY SAM — Point de configuration unique.
   Renseignez ces valeurs : le site s'adapte automatiquement.
   Tant qu'un champ est vide, l'interface affiche un marqueur
   « à compléter » au lieu d'inventer une information.
   ========================================================= */

window.MY_SAM = {
  /* Coordonnées publiques — laissez "" si pas encore arrêtées */
  email: "",          // ex. "contact@my-sam.fr"
  phone: "",          // ex. "+33 6 00 00 00 00"
  linkedin: "",       // ex. "https://www.linkedin.com/company/my-sam"

  /* Point de collecte du formulaire de contact.
     Exemples : "https://formspree.io/f/xxxxxxx" (Formspree)
                "/"  + attribut data-netlify sur le <form> (Netlify Forms)
     Tant que la valeur est vide, le formulaire reste désactivé
     et l'invite renvoie vers l'e-mail. */
  formEndpoint: ""
};
