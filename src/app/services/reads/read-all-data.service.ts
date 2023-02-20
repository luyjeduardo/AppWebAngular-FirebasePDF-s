import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Person } from 'src/app/entities/person';

@Injectable({
  providedIn: 'root'
})
export class ReadAllDataService {

  constructor(private fireStore: AngularFirestore) { }

  //[LV]Consulto a Firebase mi colección de Personas y las devuelvo en un Observable.
  public GetAllRegistros() {
    return this.fireStore.collection<Person>('Personas').valueChanges();
  }
}