import React from 'react';

const App: React.FC = () => {
  return (
    <html>
      <head>
        {/* base tag injection will be served in index.js */}
        <title>Prudential</title>
        <link rel="shortcut icon" type="image/icon" href="./assets/images/header/prudential_web_icon_16x16.ico" />
        <meta charSet="utf-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0" />
        {/* <meta name="referrer" content="no-referrer|no-referrer-when-downgrade|origin|origin-when-crossorigin|unsafe-url" /> */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="cache-control" content="no-cache" />
        <meta httpEquiv="expires" content="0" />
        <meta httpEquiv="pragma" content="no-cache" />
        <meta httpEquiv="Strict-Transport-Security" content="no-cache" />
        {/* meta tag injection for Content-Security-Policy will be served in index.run.js */}

        {/* <link rel="icon" type="image/png" href="http://fountainjs.io/assets/imgs/fountain.png" /> */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300,800,700,400italic" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Slab|Roboto:400,700" />
        {/* Google Tag Manager */}
        <script>
          {`(function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
              'gtm.start': new Date().getTime(),
              event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
              'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
          })(window, document, 'script', 'dataLayer', 'GTM-5CG7BN8');`}
        </script>
        {/* End Google Tag Manager */}
      </head>

      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5CG7BN8"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5MXS8V2"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript> */}
        {/* End Google Tag Manager (noscript) */}
        <ui-view></ui-view>
        <script type="text/javascript" src="./assets/javascripts/ds3Encrypt_e2ee.js"></script>
        <script type="text/javascript" src="./assets/javascripts/DSSSCryptography-1.5.1.js"></script>
        <script type="text/javascript" src="./assets/javascripts/jquery-3.6.0.min.js"></script>
        <script src="./assets/javascripts/respond.src.js"></script>
        <script>
          {`// manually clear cache - start
          window.onunload = null;
          window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
              // document.body.style.display = "none";
              window.location.reload(true);
            }
          })
          // manually clean cache for Safari - end`}
        </script>
      </body>
    </html>
  );
};

export default App;
