import { Component } from '@angular/core';
import { Person } from './entities/person';
import { CreateDataService } from './services/creates/create-data.service';
import { ReadAllDataService } from './services/reads/read-all-data.service';
import { ReadDataService } from './services/reads/read-data.service'; 
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'ClientAngularPDF';
  //[LV]Declaro un objeto que recibirá la consulta a Firebase de una persona...
  personaQuery: Person = {} as Person;
  //[LV]Declaro una colección de objetos que recibirá la consulta a Firebase de todas las personas...
  personasQuery: Person[] = [];
  //[LV]Declaro una colección de personas con data quedama (Estática) para guardar en Firebase.
  Personas: Person[] = [
    { numeroIdentificacion: '012', nombresCompletos: 'Aaaa', apellidosCompletos: 'Aaaa' } as Person,
    { numeroIdentificacion: '345', nombresCompletos: 'Bbbb', apellidosCompletos: 'Bbbb' } as Person,
    { numeroIdentificacion: '678', nombresCompletos: 'Cccc', apellidosCompletos: 'Cccc' } as Person,
    { numeroIdentificacion: '901', nombresCompletos: 'Dddd', apellidosCompletos: 'Dddd' } as Person
  ];
  //[LV]Contenido del PDF una sola persona...
  pdfContentAnyPerson = {
    content: [
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [ 'auto', 'auto', 'auto' ],  
          body: [['','','']]
        }
      }
    ]
  };
  //[LV]Contenido del PDF todas las personas...
  pdfContentAllPersons = {
    content: [
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [ 'auto', 'auto', 'auto' ],  
          body: [['','','']]
        }
      }
    ]
  };


  /**
     *
     */
  constructor(private createDataService: CreateDataService,
              private readDataService: ReadDataService,
              private readAllDataService: ReadAllDataService) {
    //[LV]Llamo mi función de registro de data desde mi ctor.
    this.CreateRegistro();
  }

  private CreateRegistro(){
    //[LV]Recorro c/u de las personas de la colección declarada arriba y las envío al servicio que almacena en Firebase.
    this.Personas.map(person => {
      this.createDataService.CreateRegistro(person)
        .then(response => {
          console.log("Registro exitoso.");
        })
        .catch(error => {
          console.log("Ocurrió un error al intentar registrar la data.");
        });
    });
  }

  public GenerarPDF_s(){
    this.GetAnyRegistro('345');//[LV]Identificación de consulta quemada.
    this.GetAllRegistro();
    setTimeout(() => { 
      this.AbrirPDFAnyPerson();
      this.AbrirPDFAllPersons();
    }, 1000);
  }

  private AbrirPDFAnyPerson(){
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.LlenarPDFConConsultaPorIdentificacion();
    let pdf = pdfMake.createPdf(this.pdfContentAnyPerson);
    pdf.open();
  }

  private AbrirPDFAllPersons(){
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.LlenarPDFConConsultaTodaLaColeccion();
    let pdf = pdfMake.createPdf(this.pdfContentAllPersons);
    pdf.open();
  }

  private LlenarPDFConConsultaPorIdentificacion(){
    //[LV]Limpio el body del PDF y lleno su contenido con la data de la persona consulta por identificación.
    this.pdfContentAnyPerson.content[0].table.body = [];
    this.pdfContentAnyPerson.content[0].table.body.push(['Identificación','Nombres completos','Apellidos completos']);
    this.pdfContentAnyPerson.content[0].table.body.push([
      this.personaQuery.numeroIdentificacion.toString(),
      this.personaQuery.nombresCompletos.toString(),
      this.personaQuery.apellidosCompletos.toString()
    ]);
  }

  private LlenarPDFConConsultaTodaLaColeccion(){
    //[LV]Limpio el body del PDF y lleno su contenido con la data de la colección personas
    this.pdfContentAllPersons.content[0].table.body = [];
    this.pdfContentAllPersons.content[0].table.body.push(['Identificación','Nombres completos','Apellidos completos']);
    this.personasQuery.map(persona => {
      this.pdfContentAllPersons.content[0].table.body.push([
        persona.numeroIdentificacion.toString(),
        persona.nombresCompletos.toString(),
        persona.apellidosCompletos.toString()
      ]);
    });
  }

  private GetAnyRegistro(identificacion: string){
    //[LV]Llamo al servicio que obtiene de Firebase un registro filtrado por su ident. de la colección Personas.
    this.readDataService.GetAnyRegistro(identificacion)
      .subscribe((response?: Person) => {
        this.personaQuery = {
          numeroIdentificacion: response?.numeroIdentificacion!, 
          nombresCompletos: response?.nombresCompletos!, 
          apellidosCompletos: response?.apellidosCompletos!
        } as Person;
      });
  }

  private GetAllRegistro(){
    //[LV]Llamo al servicio que obtiene de Firebase todos los registros la colección Personas.
    this.personasQuery = [];
    this.readAllDataService.GetAllRegistros()
      .subscribe((response?: Person[]) => {
        response?.map(person => {
          this.personasQuery.push(person);
        });
      });
  }
}