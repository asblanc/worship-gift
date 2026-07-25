/* ================================================================
   Worship Gift — Configuration du widget de billetterie externe
   Fournisseur : billetteries.ma (vente + paiement en ligne).

   👉 Pour un nouveau concert, le prestataire fournit un nouveau code
   d'intégration. Mets simplement à jour les 3 valeurs ci-dessous :
     - formId    : l'id du <div> (ex: "form_350d29")
     - iframeUrl : l'URL passée à createss(...) (garde ?InIframe=1)
     - directUrl : la même page SANS ?InIframe=1 (lien de secours)
   Le script (scriptUrl) reste normalement identique.
   ================================================================ */

export const billetteriesWidget = {
  /** Script du moteur de rendu fourni par billetteries.ma */
  scriptUrl: "https://www.app.billetteries.ma/files/renderer.js",
  /** Id du conteneur <div> à remplir */
  formId: "form_4bc23c",
  /** URL de la billetterie (mode iframe) passée à createss() */
  iframeUrl:
    "https://www.billetteries.ma/billetterie/concert-de-jonathan-gambela-worship-gift?InIframe=1",
  /** Lien direct (nouvel onglet) — secours si le script est bloqué */
  directUrl:
    "https://www.billetteries.ma/billetterie/concert-de-jonathan-gambela-worship-gift",
} as const;
