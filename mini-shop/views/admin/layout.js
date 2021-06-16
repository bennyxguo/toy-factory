module.exports = ({ content }) => {
  return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EShop Admin Panel</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
        <link href="/css/main.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.2/css/bulma.min.css"></link>
      </head>

      <body class="admin">
        <nav class="navbar navbar-bottom has-background-link-light" role="navigation" aria-label="main navigation">
          <div class="container">
            <div class="navbar-brand">
              <a class="navbar-item" href="/admin/products">
                <h3 class="title is-3 has-text-link">Admin Panel</h3>
              </a>
            </div>

            <div class="navbar-menu">
              <div class="navbar-start">
                <a class="navbar-item">
                  Mall
                </a>
              </div>
              <div class="navbar-end">
                <div class="navbar-item">
                  <div class="buttons">
                    <a class="button is-link" href="/admin/products">
                      <span class="icon is-small">
                        <i class="fas fa-star"></i>
                      </span>
                      <span>Products</span>
                    </a>
                    <a class="button is-link is-light" href="/signout">
                      <span class="icon is-small">
                        <i class="fas fa-sign-out-alt"></i>
                      </span>
                      <span>Logout</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div class="container">
          ${content}
        </div>
      </body>
    </html>
  `
}
