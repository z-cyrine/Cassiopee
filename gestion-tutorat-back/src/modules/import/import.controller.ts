import { Controller, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
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
  async uploadFiles(@UploadedFiles() files: { parTutorat?: Express.Multer.File[]; tutorats?: Express.Multer.File[] }) {
    if (!files.parTutorat || !files.tutorats) {
      throw new Error('Les deux fichiers (parTutorat et tutorats) sont requis.');
    }

    await this.importService.processFiles({
      parTutorat: files.parTutorat[0],
      tutorats: files.tutorats[0],
    });

    return { message: 'Fichiers traités avec succès.' };
  }
}
