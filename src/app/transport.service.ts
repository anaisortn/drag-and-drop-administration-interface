import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'
import { isDevMode } from '@angular/core'

import { Element } from './elements'

export interface Update {
  element: Element,
  index: number,
  source: string,
  target: string,
  type: string,
}

export interface Remove {
  index: number,
  name: string,
}

export class TransportService {

  public INIT_EVENT = 'init'
  public REMOVE_EVENT = 'remove'
  public UPDATE_EVENT = 'update'

  private _socket = io(this._getHost())

  public getUpdates() {
    return new Observable(observer => {
      this._socket.on('updateElements', (data: Update) => observer.next(data))
      this._socket.on('init', (data: Update[]) => data.forEach(el => observer.next(el)))
    })
  }

  public moveElement(event: Update) {
    this._socket.emit('moveElements', event)
  }

  private _getHost() {
    if (isDevMode()) {
      return 'http://localhost:5000'
    }
    return 'https://anaisortn-dnd-server.herokuapp.com'
  }

}
