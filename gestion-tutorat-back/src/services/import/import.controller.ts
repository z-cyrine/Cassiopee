import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'parTutorat', maxCount: 1 },
        { name: 'tutorats', maxCount: 1 },
        { name: 'majors', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async uploadFiles(@UploadedFiles() files: { parTutorat?: Express.Multer.File[]; tutorats?: Express.Multer.File[] ;  majors?: Express.Multer.File[];}) {
    if (!files.parTutorat && !files.tutorats && !files.majors) {
      throw new BadRequestException('Vous devez envoyer au moins un fichier.');
    }

    if (files.majors) {
      const fileMajors = files.majors[0];
      await this.importService.processMajors(fileMajors);
    }
    if (files.parTutorat) {
      await this.importService.processParTutorat(files.parTutorat[0]);
    }
    if (files.tutorats) {
      await this.importService.processTutorats(files.tutorats[0]);
    }
    
    return { message: 'Fichier(s) importé(s) avec succès' };
  }

  @Post('corriger-majeures-etudiants')
  async corrigerMajeuresEtudiants() {
    await this.importService.corrigerEtudiantsSansMajeure();
    return { success: true };
  }
}
