import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'

import { Element } from './elements'

export class TransportService {

  private _socket = io('http://localhost:5000')

  public getUpdates() {
    return new Observable(observer => {
      this._socket.on('updateElements', (data) => observer.next(data))
    })
  }


  public moveElement(type: string, el: Element, target: string) {
    this._socket.emit('moveElements', {
      element: el,
      target,
      type,
    })
  }


}