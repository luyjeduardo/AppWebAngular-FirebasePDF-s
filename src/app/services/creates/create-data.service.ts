import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Person } from 'src/app/entities/person';

@Injectable({
  providedIn: 'root'
})
export class CreateDataService {

  constructor(private fireStore: AngularFirestore) { }

  //[LV]Registro en Firebase la persona que viene entrando por parámetro.
  public CreateRegistro(person: Person) : Promise<any> {
    return this.fireStore.collection('Personas').doc(person.numeroIdentificacion).set(person);
  }
}