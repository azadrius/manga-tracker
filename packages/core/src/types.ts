/** Ce qu'on retient quand on détecte une page de chapitre. */
export interface ChapterCapture {
  /** Nom d'hôte sans « www. », ex. « asurascans.com ». */
  site: string;
  /** Identifiant stable de la série sur ce site (dérivé de l'URL). */
  seriesSlug: string;
  /** Titre lisible de la série. */
  seriesTitle: string;
  /** URL de la page de la série. */
  seriesUrl: string;
  /** Numéro du chapitre (peut être décimal : 12.5). */
  chapter: number;
  /** URL de la page du chapitre, pour reprendre la lecture. */
  chapterUrl: string;
}

/** Ce que la page fournit au détecteur. */
export interface PageInfo {
  url: string;
  /** `document.title`, si disponible : sert à obtenir un titre plus propre. */
  title?: string;
}

/** Règle de détection propre à un site. */
export interface SiteAdapter {
  /** Nom affiché, ex. « Asura Scans ». */
  name: string;
  /** Domaines gérés (sans « www. »). Les sous-domaines sont acceptés. */
  hosts: string[];
  /** Renvoie la capture, ou `null` si la page n'est pas un chapitre. */
  parse(url: URL, title?: string): ChapterCapture | null;
}
