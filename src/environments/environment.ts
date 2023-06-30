// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.




import { initializeApp } from "firebase/app";
export const environment = {
  firebaseConfig: {
    apiKey: "AIzaSyBM6-eU9q4eTTflXuWQgoVb52aug2SkXsE",
    authDomain: "speed-pro-desarrollo.firebaseapp.com",
    databaseURL: "https://speed-pro-desarrollo-default-rtdb.firebaseio.com",
    projectId: "speed-pro-desarrollo",
    storageBucket: "speed-pro-desarrollo.appspot.com",
    messagingSenderId: "381368411035",
    appId: "1:381368411035:web:65367ee5affc6d6571373e"
  },
  usuarios: 'https://identitytoolkit.googleapis.com/v1',
  production: false,
  cloud: 'https://us-central1-speed-pro-app.cloudfunctions.net/sendMail',
  cloud_local: 'http://127.0.0.1:5001/speed-pro-app/us-central1/sendMail',
  clave_publica: 'pk_test_51NOlofEg8nFeK6NC5vc2fyMVer0VolgF93B3sk60HbPUzPM0p93nQLAoxJuoXr00c0DDVJ6iU55NdOMYiTgeB8hy00KurfK9Is',
  clave_secreta: 'sk_test_51NOlofEg8nFeK6NCYFm9FST2EY3m3PbUkEXJgIOEdF8WJ44UtQtZtry1wCK1MIQrAQmiQWbp8zTYQSqWazh88al80091NAHBAc'
}
const app = initializeApp(environment.firebaseConfig);
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
