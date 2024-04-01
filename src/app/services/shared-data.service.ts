import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private myData: string  = "";
  private myDataArray = new BehaviorSubject<any[]>([]);
  dataList$ = this.myDataArray.asObservable();

  constructor() { }

  setDataArray(newList:any): void {
    this.myDataArray.next(newList);
  }
}
