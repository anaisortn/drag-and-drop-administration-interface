import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { TransportService } from './transport.service'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [TransportService],
  bootstrap: [AppComponent]
})
export class AppModule { }
