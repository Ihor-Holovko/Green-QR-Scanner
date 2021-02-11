import { Component, ViewChild } from '@angular/core';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;

  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
  ) {
    this.platform.backButton.subscribeWithPriority(-1, (processNextHandler) => {
      if (!this.routerOutlet.canGoBack()) {
        this.exitFromApp();
      }
      processNextHandler();
    });
  }

  exitFromApp(): void {
    this.alertCtrl.create({
      header: 'Quit now?',
      buttons: [
        {
          role: 'cancel',
          text: 'No'
        },
        {
          text: 'Yes',
          handler: (e) => {
            App.exitApp();
          }
        }],
    }).then(prompt => prompt.present());
  }
}
