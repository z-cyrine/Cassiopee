import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelParserService {
  /**
   * Lit le fichier Excel et renvoie un tableau d’objets JSON correspondant à la première feuille.
   * @param filePath Chemin du fichier Excel.
   */
  parseExcel(filePath: string): any[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }

  /**
   * Lit le fichier Excel et renvoie un tableau 2D (array of arrays) de la première feuille.
   * Utilisé pour les fichiers des majeures.
   * @param filePath Chemin du fichier Excel.
   */
  parseExcelMajors(filePath: string): any[][] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
  }

  /**
   * Nettoie une valeur en supprimant uniquement les espaces au début et à la fin.
   * @param value La valeur à nettoyer.
   * @returns La valeur nettoyée.
   */
  cleanForAffectation(value: any): string {
    if (!value) return '';
    return String(value).trim();
  }
  
  /**
   * Convertit une liste de valeurs séparées par des virgules ou point-virgule en tableau.
   * @param value La valeur à parser.
   * @returns Un tableau de chaînes.
   */
  parseList(value: any): string[] {
    if (!value) return [];
    return value.toString().split(/[;,]+/).map(item => item.trim()).filter(Boolean);
  }

  /**
   * Convertit une valeur en nombre, retourne 0 si la conversion échoue.
   * @param value La valeur à convertir.
   */
  toNumber(value: any): number {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Transforme la valeur de la colonne "Peut faire des tutorats ?" en booléen.
   * @param val La valeur brute.
   * @returns true si le tuteur est éligible.
   */
  parseEligibleTutorat(val: string | undefined): boolean {
    if (!val) return false;
    const cleaned = val.trim().toLowerCase();
    return ['o', 'oui', 'yes', 'y', '1'].includes(cleaned);
  }

  /**
   * Parse la colonne "Langue Tutorat" en un tableau de langues.
   * Par exemple, "FR + ANG" devient ["FR", "ANG"] et "EN" devient ["ANG"].
   * @param raw La valeur brute.
   * @returns Un tableau de chaînes représentant les langues.
   */
  parseLangueTutorat(raw: any): string[] {
    if (!raw) return [];
    let str = raw.toString().trim().toUpperCase();
    str = str.replace(/\bEN\b/g, 'ANG');
    str = str.replace(/\+/g, ',');
    str = str.replace(/\s+/g, '');
    const parts = str.split(/[;,]+/).filter(Boolean);
    return Array.from(new Set(parts));
  }
}
