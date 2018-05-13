import { Component } from '@angular/core'
import { TransportService } from './transport.service'
import { Element, elements } from './elements'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

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
    let connection = this._transportService.getUpdates().subscribe((data) => {
      console.log(data)
    })
  }

  public allowDrop(event) {
    event.preventDefault();
  }

  public onDragStart(event: any, index: number) {
    this._index = index
    this._source = event.srcElement.parentElement.id
  }

  public onDrop(event) {
    const TARGET = event.target.id
    const EL = this.dispoContainer[this._index]
    this._move(TARGET, EL)
    this._transportService.moveElement('move', EL, TARGET)
  }

  private _move(target: string, el: Element) {
    const IS_TARGET_A = target === this.classA
    const IS_TARGET_B = target === this.classB
    const IS_DISPO = this._source === this.dispo
    const EXISTS_A = this.classAContainer.includes(el)
    const EXISTS_B = this.classBContainer.includes(el)

    if (IS_DISPO && IS_TARGET_A) {
      if (!EXISTS_A && !EXISTS_B) {
        this._add(this.classAContainer, el)
      }
    } else if (IS_DISPO && IS_TARGET_B) {
      if (!EXISTS_A && !EXISTS_B) {
        this._add(this.classBContainer, el)
      }
    } else if (this._source === this.classA && IS_TARGET_B) {
      this._add(this.classBContainer, this.classAContainer[this._index])
      this._remove(this.classAContainer, this._index)

    } else if (this._source === this.classB && IS_TARGET_A) {
      this._add(this.classAContainer, this.classBContainer[this._index])
      this._remove(this.classBContainer, this._index)
    }
  }

  public removeFromA(index: number) {
    this._remove(this.classAContainer, index)
  }

  public removeFromB(index: number) {
    this._remove(this.classBContainer, index)
  }

  private _add(container: Element[], el: Element) {
    container.push(el)
  }

  private _remove(container: Element[], index: number) {
    container.splice(index, 1)
    // this._transportService.moveElements()
  }

}
