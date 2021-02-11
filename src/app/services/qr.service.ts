import { Injectable } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QrService {
  private scanResult = new BehaviorSubject<string>(null);
  public onScanResultState = this.scanResult.asObservable();

  constructor(
    private qrScanner: QRScanner,
    private sharing: SocialSharing,
    public toastController: ToastController,
    private clipboard: Clipboard,
    private iab: InAppBrowser
  ) { }

  public scan(): void {
    this.scanResult.next(null);
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show().then(status => {
            if (status.showing === true) {
              let scan = this.qrScanner.scan().subscribe((res: string) => {
                try {
                  this.scanResult.next(res);
                  this.presentToast('Scan is completed.');
                } catch (e) {
                  this.presentToast('1. Error: ' + String(e));
                  scan.unsubscribe();
                  return;
                }
              });
            }
          });
        } else if (status.denied) {
          this.presentToast('1. Scanned status: ' + String(status.denied));
        } else {
          this.presentToast('2. Scanned status: ' + String(status.denied));
        }
      })
      .catch((e: any) => this.presentToast('2. Error: ' + String(e)));
  }

  public copy(): void {
    if (this.scanResult.value) {
      this.clipboard.copy(this.scanResult.value).then((res) => {
        if (res) {
          this.presentToast('Copied to the clipboard.');
        }
      });
    } else {
      this.presentToast('Please scan the QR.');
    }
  }

  public send(): void {
    if (this.scanResult.value) {
      this.sharing.share(this.scanResult.value).then((res) => {
      }).catch((e) => {
        this.presentToast(e);
      });
    } else {
      this.presentToast('Please scan the QR.');
    }
  }

  public open(): void {
    if (this.scanResult.value) {
      if (this.isUrl(this.scanResult.value)) {
        this.iab.create(this.scanResult.value, '_system');
      } else {
        this.presentToast('Data is not a URL.');
      }
    } else {
      this.presentToast('Please scan the QR.');
    }
  }

  private async presentToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      color: 'dark',
      duration: 2000
    });
    toast.present();
  }

  private isUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

}
