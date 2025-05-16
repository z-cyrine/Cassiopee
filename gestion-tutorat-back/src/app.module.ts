import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from './modules/etudiant/etudiant.entity';
import { Tuteur } from './modules/tuteur/tuteur.entity';
import { Majeures } from './modules/majeures/majeures';
import { EtudiantService } from './modules/etudiant/etudiant.service';
import { EtudiantController } from './modules/etudiant/etudiant.controller';
import { ImportController } from './services/import/import.controller';
import { ImportService } from './services/import/import.service';
import { ExcelParserService } from './services/import/excel-parser/excel-parser.service';
import { ImportModule } from './services/import/import.module';
import { AutoAffectationModule } from './auto-affectation/auto-affectation.module';
import { MajeuresModule } from './modules/majeures/majeures.module';
import { EtudiantModule } from './modules/etudiant/etudiant.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { ResetModule } from './services/reset/reset.module';
import { RouterModule } from '@nestjs/core';
import { TuteurService } from './modules/tuteur/tuteur.service';
import { TuteurController } from './modules/tuteur/tuteur.controller';
import { TuteurModule } from './modules/tuteur/tuteur.module';
import { AffectationManuelleController } from './affectation-manuelle/affectation-manuelle.controller';
import { AffectationManuelleService } from './affectation-manuelle/affectation-manuelle.service';
import { AffectationManuelleModule } from './affectation-manuelle/affectation-manuelle.module';
import { UsersModule } from './modules/users/user.module';
import { User } from './modules/users/user.entity';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';

@Module({
imports: [
TypeOrmModule.forRoot({
type: 'mysql',
host: 'localhost',
port: 3306,
username: 'root',
password: '',
database: 'gestion_tutorat',
entities: [Etudiant, Tuteur, Majeures, User],
synchronize: true,
}),
TypeOrmModule.forFeature([Etudiant, Tuteur, Majeures, User]),
ImportModule,
AutoAffectationModule,
MajeuresModule,
EtudiantModule,
TuteurModule,
ReportingModule,
ResetModule,
AffectationManuelleModule,
UsersModule,
AuthModule
],
controllers: [
AppController,
ImportController,
EtudiantController,
],
providers: [
AppService,
ImportService,
ExcelParserService,
EtudiantService,
],
})
export class AppModule {}