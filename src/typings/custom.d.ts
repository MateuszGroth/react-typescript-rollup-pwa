declare module 'service-worker:*' {
    var swURL: string | URL;
    export default swURL;
}
// declare module 'web-worker:*' {
//     class WebWorker extends Worker {
//         constructor();
//     }
//     export default WebWorker;
// }
declare module 'web-worker:*' {
    var workerUrl: string | URL;
    export default workerUrl;
}
declare module 'consts:*' {
    var constant: any;
    export default constant;
}
declare interface ImportMeta {
    [propertyName: string]: any;
}
declare interface Window {
    skipWaiting(): Promise<boolean>;
}
