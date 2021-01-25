  
/*
* Licencia con arreglo a la EUPL, Versión 1.2 o –en cuanto sean aprobadas por la
Comisión Europea– versiones posteriores de la EUPL (la «Licencia»);
* Solo podrá usarse esta obra si se respeta la Licencia.
* Puede obtenerse una copia de la Licencia en:
* http://joinup.ec.europa.eu/software/page/eupl/licence-eupl
* Salvo cuando lo exija la legislación aplicable o se acuerde por escrito, el programa
distribuido con arreglo a la Licencia se distribuye «TAL CUAL», SIN GARANTÍAS NI
CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
* Véase la Licencia en el idioma concreto que rige los permisos y limitaciones que
establece la Licencia.
*/


/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  "./precache-manifest.8d7bef8e4bcebdc6d832111d5d7bc1b2.js"
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("./index.html"), {
  
  blacklist: [/^\/_/,/\/[^\/?]+\.[^\/]+$/],
});
