import { Component, OnInit } from '@angular/core'
import { TransportService, Update, Remove } from './transport.service'
import { Element, elements } from './elements'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public classA = 'classA'
  public classB = 'classB'
  public classAContainer: Element[] = []
  public classBContainer: Element[] = []

  public dispo = 'dispo'
  public dispoContainer: Element[] = elements

  private _source: string
  private _index: number

  constructor(private _transportService: TransportService) { }

  public ngOnInit() {
    this._transportService.getUpdates().subscribe((data: Update) => {
      if (data.type === this._transportService.UPDATE_EVENT) {
        this._move(data.source, data.index, data.target, data.element)
      } else if (data.type === this._transportService.REMOVE_EVENT) {
        this._remove(data.source, data.index)
      } else {
        throw new Error('unknown update type')
      }
    })
  }

  public allowDrop(event) {
    event.preventDefault()
  }

  public onDragStart(event: any, index: number) {
    this._index = index
    this._source = event.srcElement.parentElement.id
  }

  public onDrop(event) {
    const TARGET = event.target.id
    const EL = this.dispoContainer[this._index]
    if (this._move(this._source, this._index, TARGET, EL)) {
      const EVENT: Update = {
        element: EL,
        index: this._index,
        source: this._source,
        target: TARGET,
        type: this._transportService.UPDATE_EVENT,
      }
      this._transportService.moveElement(EVENT)
    }
  }

  private _move(source: string, index: number, target: string, el: Element): boolean {
    const IS_TARGET_A = target === this.classA
    const IS_TARGET_B = target === this.classB
    const IS_DISPO = source === this.dispo
    const EXISTS_A = this._includes(this.classAContainer, el)
    const EXISTS_B = this._includes(this.classBContainer, el)

    if (IS_DISPO && IS_TARGET_A) {
      if (!EXISTS_A && !EXISTS_B) {
        this._add(this.classA, el)
        return true
      }
    } else if (IS_DISPO && IS_TARGET_B) {
      if (!EXISTS_A && !EXISTS_B) {
        this._add(this.classB, el)
        return true
      }
    } else if (source === this.classA && IS_TARGET_B) {
      this._add(this.classB, this.classAContainer[index])
      this._remove(this.classA, index)
      return true
    } else if (source === this.classB && IS_TARGET_A) {
      this._add(this.classA, this.classBContainer[index])
      this._remove(this.classB, index)
      return true
    }

    return false
  }

  public removeFromA(index: number) {
    const EVENT: Update = {
      element: null,
      index,
      source: this.classA,
      target: null,
      type: this._transportService.REMOVE_EVENT
    }
    this._transportService.moveElement(EVENT)
    this._remove(this.classA, index)
  }

  public removeFromB(index: number) {
    const EVENT: Update = {
      element: null,
      index,
      source: this.classB,
      target: null,
      type: this._transportService.REMOVE_EVENT
    }
    this._transportService.moveElement(EVENT)
    this._remove(this.classB, index)
  }

  private _add(name: string, el: Element) {
    this._getContainer(name).push(el)
  }

  private _getContainer(name: string): Element[] {
    if (name === this.classA) {
      return this.classAContainer
    }
    return this.classBContainer
  }

  private _includes(container: Element[], el: Element): boolean {
    return !!container.filter(e => e.title === el.title).length
  }

  private _remove(name: string, index: number) {
    this._getContainer(name).splice(index, 1)
  }

}
