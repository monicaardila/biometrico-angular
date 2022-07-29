import {
  ChangeDetectorRef,
  Input,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import {
  FingerprintReader,
  SampleFormat,
  DeviceConnected,
  DeviceDisconnected,
  SamplesAcquired,
  AcquisitionStarted,
  AcquisitionStopped,
} from '@digitalpersona/devices';
import './core/modules/WebSdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'demo-fingerprint-reader';
  ListaFingerprintReader: any;
  InfoFingerprintReader: any;
  ListaSamplesFingerPrints: any;
  currentImageFinger: any;
  currentImageFingerFixed:any;

  private reader: FingerprintReader;

  constructor() {
    this.reader = new FingerprintReader();
  }

  private onDeviceConnected = (event: DeviceConnected) => {};
  private onDeviceDisconnected = (event: DeviceDisconnected) => {};

  private onAcquisitionStarted = (event: AcquisitionStarted) => {
    console.log('En el evento:onAcquisitionStarted');
    console.log(event);
  };

  private onAcquisitionStopped = (event: AcquisitionStopped) => {
    console.log('En el evento:onAcquisitionStopped');
    console.log(event);
  };

  private onSamplesAcquired = (event: SamplesAcquired) => {
    console.log('en el evento:adquisicon de imagen');
    console.log(event);
    this.ListaSamplesFingerPrints = event;
  };
  ngOnInit() {
    this.reader = new FingerprintReader();
    this.reader.on('DeviceConnected', this.onDeviceConnected);
    this.reader.on('DeviceDisconnected', this.onDeviceDisconnected);
    this.reader.on('AcquisitionStarted', this.onAcquisitionStarted);
    this.reader.on('AcquisitionStopped', this.onAcquisitionStopped);
    this.reader.on('SamplesAcquired', this.onSamplesAcquired);
  }
  ngOnDestroy() {
    this.reader.on('DeviceConnected', this.onDeviceConnected);
    this.reader.on('DeviceDisconnected', this.onDeviceDisconnected);
    this.reader.on('AcquisitionStarted', this.onAcquisitionStarted);
    this.reader.on('AcquisitionStopped', this.onAcquisitionStopped);
    this.reader.on('SamplesAcquired', this.onSamplesAcquired);
  }
  //Lista de dispositivos conectados
  fn_ListaDispositivos() {
    Promise.all([this.reader.enumerateDevices()])
      .then((results) => {
        this.ListaFingerprintReader = results[0];
        console.log('Dato Dispositivos');
        console.log('this.listaFingerprintReader');
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //Obtener Informacion DE Dispositivo
  fn_DeviceInfo() {
    Promise.all([
      this.reader.getDeviceInfo(this.ListaFingerprintReader[0]),
    ]).then((results) => {
      this.InfoFingerprintReader = results[0];
      console.log('Info FingerReader');
      console.log('this.InfoFingerprintReader');
    });
  }
  //Inicia Device para lectura
  fn_StartCapturaFP() {
    this.reader.startAcquisition(SampleFormat.PngImage , this.InfoFingerprintReader['DeviceID'])
      .then((response) => {
        console.log('Ud puede iniciar a capturar !!');
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //Detener Device para lectura
  fn_EndCapturaFP() {
    this.reader
      .stopAcquisition(this.InfoFingerprintReader['DeviceID'])
      .then((response) => {
        console.log('Se paro de capturar !!');
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //Mostar Captura
  fn_CapturaFP() {
    var ListImages = this.ListaSamplesFingerPrints['samples'];
    var lsize = Object.keys(ListImages).length;
    if (ListImages != null && ListImages != undefined) {
      if (lsize > 0) {
        this.currentImageFinger = ListImages[1];
        this.currentImageFingerFixed = this.fn_fixFormatImageBase64(this.currentImageFinger);
      }
    }
  }
  //Corregir Formato Base64
  fn_fixFormatImageBase64(prm_imagebase:any) {
    var strImage = "";
      strImage = prm_imagebase;
      //Remplaza Caracteres no Validos
      strImage = strImage.replace(/_/g, "/");
      strImage = strImage.replace(/-/g, "+");
    return strImage;
  }
}
