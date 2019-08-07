const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

type ArgumentTypes<original extends Function> = original extends (...args: infer argumentsType) => any ? argumentsType : never;

declare var gapi: any;
const clientLoaded = new Promise((resolve, reject) => {
  // Load gapi script
  const gapiScript = document.createElement('script');
  gapiScript.src = "https://apis.google.com/js/api.js";
  gapiScript.addEventListener('load', resolve);
  gapiScript.addEventListener('error', reject);
  document.body.appendChild(gapiScript);
}).then(() => {
  console.log('script appended and loaded');
  // Load client and auth2 components of gapi
  return new Promise(resolve => gapi.load('client:auth2', resolve));
});

export default class DriveFiles {
  public create = (...query: ArgumentTypes<typeof gapi.client.drive.files.create>) => this.clientReady.then(() => gapi.client.drive.files.create(...query));
  public list = (...query: ArgumentTypes<typeof gapi.client.drive.files.list>) => this.clientReady.then(() => gapi.client.drive.files.list(...query));
  public get = (...query: ArgumentTypes<typeof gapi.client.drive.files.get>) => this.clientReady.then(() => gapi.client.drive.files.get(...query));
  public update = (...query: ArgumentTypes<typeof gapi.client.drive.files.update>) => this.clientReady.then(() => gapi.client.drive.files.update(...query));
  public generateIds = (...query: ArgumentTypes<typeof gapi.client.drive.files.generateIds>) => this.clientReady.then(() => gapi.client.drive.files.generateIds(...query));
  public watch = (...query: ArgumentTypes<typeof gapi.client.drive.files.watch>) => this.clientReady.then(() => gapi.client.drive.files.watch(...query));
  public copy = (...query: ArgumentTypes<typeof gapi.client.drive.files.copy>) => this.clientReady.then(() => gapi.client.drive.files.copy(...query));

  public signedIn: {
    get: (() => (boolean | null)),
    listen: (callback: ((status: boolean) => void)) => Promise<void>
  }

  public clientReady: Promise<void>;

  constructor(
    private clientId: string,
    private apiKey: string
  ) {
    this.clientReady = clientLoaded.then(() => {
      console.log('client loaded');
      return gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      });
    });
    this.signedIn = {
      get: () => null,
      listen: (callback: (status: boolean) => void) => this.clientReady.then(() => gapi.auth2.getAuthInstance().isSignedIn.listen(callback)),
    }
    this.clientReady.then(() => {
      this.signedIn.get = () => gapi.auth2.getAuthInstance().isSignedIn.get()
    });
  }

  signIn() {
    return this.clientReady.then(() => gapi.auth2.getAuthInstance().signIn());
  }

  signOut() {
    return this.clientReady.then(() => gapi.auth2.getAuthInstance().signOut());
  }

  save(fileId: string, content: string) {
    return this.clientReady.then(() => gapi.client.request({
      path: '/upload/drive/v3/files/' + fileId,
      method: 'PATCH',
      params: {
        uploadType: 'media'
      },
      body: content
    }));
  }
}
