import { Component } from '@angular/core';
import {takeUntil, map, filter, tap, delay, concatMap } from 'rxjs/operators'
import {Observable, interval, Subject, of, pairs, from} from 'rxjs'

export class Item {
  constructor(id: number, name: string, child?: Item) {
    this.id = id;
    this.name = name;
    if(child) {
      this.children.push(child);
    }
  }
  id: number;
  name: string;
  children: Item[] = new Array<Item>();
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name : string;
  childrenCount: number;

  testObs$: Observable<Item>;

  sub = new Subject();

  constructor() {
    this.testObs$ = of(new Item(1, 'Root-1'), null, new Item(2, 'Root-2', new Item(3, 'Root2s Child'))
    , new Item(2, 'Root-3', new Item(3, 'Root3s Child'))
    , new Item(2, 'Root-4', new Item(3, 'Root4s Child'))
    , new Item(2, 'Root-5', new Item(3, 'Root5s Child')));
  }

  updateName(data: Item) {
    console.log('inside updateName.......');
    this.name = data.name;
  }

  updateChildrenCount(data: Item) {
    console.log('inside updateChildrenCount.......');
    this.childrenCount = data.children.length;
  }

  start() {
    let obs$ = this.testObs$.pipe(concatMap( item => of(item).pipe ( delay( 1000 ) )))
    obs$
    .pipe(
      takeUntil(this.sub),
      filter(data => data !== null),
      tap(data => this.updateName(data)),
      filter(data => data.children !== null && data.children.length > 0),
      tap(data => this.updateChildrenCount(data))
    )
    .subscribe(console.log);
  }

  stop() {
    this.sub.next()
  }
}
