// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBd2xplmwoyhIakK4cgDMaA9goMcCNcDwQ' ,
    authDomain: 'proxima-platform.firebaseapp.com',
    databaseURL: 'https://proxima-platform.firebaseio.com',
    projectId: 'proxima-platform',
    storageBucket: 'proxima-platform.appspot.com',
    messagingSenderId: '346596349465'
  }
};
