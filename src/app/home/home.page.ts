import { Component, ChangeDetectorRef } from '@angular/core';
import { QrService } from '../services/qr.service';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  scanResult: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private qrService: QrService
  ) { }

  ionViewDidEnter(): void {
    SplashScreen.hide();
    this.qrService.onScanResultState.subscribe((result: string) => {
      this.scanResult = result;
      this.cdr.detectChanges();
    })
    this.qrService.scan();
  }

  scan(): void {
    this.qrService.scan();
  }

  copy(): void {
    this.qrService.copy();
  }

  send(): void {
    this.qrService.send();
  }

  open(): void {
    this.qrService.open();
  }

}
