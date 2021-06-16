const layout = require('../layout')
const { getError } = require('../../helpers')

module.exports = ({ product, errors }) => {
  return layout({
    content: `
      <div class="columns is-centered">
        <div class="column is-half">
            <div class="box">
            <h1 class="subtitle">Edit a Product</h1>

            <form method="POST" enctype="multipart/form-data">
              <div class="field">
                <label class="label">Title</label>
                <input class="input" placeholder="Title" name="title" value="${
                  product.title
                }">
                <p class="help is-danger">${getError(errors, 'title')}</p>
              </div>

              <div class="field">
                <label class="label">Price</label>
                <input class="input" placeholder="Price" name="price" value="${
                  product.price
                }">
                <p class="help is-danger">${getError(errors, 'price')}</p>
              </div>

              <div class="field">
                <label class="label">Image</label>
                <img src="data:image/jpeg;base64, ${product.image}" />
                <input type="file" name="image" />
              </div>
              <br />
              <button class="button is-link">Save</button>
            </form>
          </div>
        </div>
      </div>
    `
  })
}
