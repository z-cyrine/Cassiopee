import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelParserService {
  parseExcel(filePath: string): any[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }

  /**
   * 🔤 Normalise une valeur en supprimant les espaces inutiles et retours à la ligne.
   */
  normalizeValue(value: any): string {
    if (!value) return '';
    return value.toString().trim().replace(/\s+/g, ' ').toLowerCase();
  }

  /**
   * 📌 Convertit une liste de valeurs séparées par des virgules en tableau.
   */
  parseList(value: any): string[] {
    if (!value) return [];
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }

  /**
   * 🔢 Convertit une valeur en nombre, sinon retourne 0.
   */
  toNumber(value: any): number {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }
}
