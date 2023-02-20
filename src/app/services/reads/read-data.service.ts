import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Person } from 'src/app/entities/person';

@Injectable({
  providedIn: 'root'
})
export class ReadDataService {

  constructor(private fireStore: AngularFirestore) { }

  //[LV]Consulto a Firebase un registro por identificacion y lo devuelvo en un Observable.
  public GetAnyRegistro(identificacion: string) {
    return this.fireStore.collection<Person>('Personas').doc(identificacion).valueChanges();
  }  
}