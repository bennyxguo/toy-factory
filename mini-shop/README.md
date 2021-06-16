# Mini Shop

## Project Setup

- Create a new project directory
- Generate a package.json file
- Install a few dependencies to help us write our project
- Create a 'start' script to run our project

## How HTTP Request Works?

First lets look at this sample code:

```javascript
const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('hi there!')
})

app.listen(3000, () => {
  console.log('Listening...')
})
```

Now if open the browser and go to https://localhost:3000/, we will see a message "hi there!".

### So what happened behind the scenes?

- After we enter the url `https://localhost:3000/`, the browser formulated a network request
- However browser itself is not responsible for actually issuing that network request
- Instead, it handles the request and hand it to your operating system and all the different network devices will send the request data over the internet.

> Process: `Browser` -> `HTTP Request` -> `Your Operating System`

The HTTP Request also have a couple of different properties tied to it. The browser takes the url and break it into different pieces:

- _Host_: 'localhost'
- _Port_: 3000
- _Path_: '/'
- _Method_: 'GET'

> In a normal case, let say we are sending a request to `https://google.com`, then this is what will happen:

- The network device isn't randomly sends this data out to the internet
- It sends the request data out according to the `host` or `domain`
- This domain is attached to a `DNS Server`
- This `DNS Server` is an outside server public available on the internet, which has a mapping between different host names and IP addresses.
- Before the data is sent, your operating system will make a request to the DNS server, find out the domain name's corresponding IP address.
- Then the operating system will make a second request, which is the real request to that IP address, this request will reach the `Web Server`

> Since here we are sending request to `localhost`, that means our local computer. Instead of vising the DNS Server, local operating system will try to identify the application listening to a specific `port`.

- First the operating system found our `Express` Application base on the port `3000`
- This is because we defined in our code, that Express will be hosted on port `3000`
- By the time the request gets into `Express`, it doesn't care about the host name and the port
- `Express` only cares about the `Path`, `Method` and the `Params` included in the request
- `app.get` function will set up a `Router`
- The `Router` is responsible for matching both `Path` and `Method` and transfer the request data to the `Callback function` in the Web Server code base.

### Data Stream

- Browser sends `HTTP header` to the server
- Server see request with `path` and `method`
- Server runs appropriate callback method
- THEN the browser starts transmitting information from body of request
  - -> Browser sends a little chunk of info, waits for confirmation
    - -> Browser sends a little chunk of info, waits for confirmation
      - -> Browser sends a little chunk of info, waits for confirmation
- All chunks sent! Request complete!

```shell
<Buffer 65 6d 61 69 6c 3d 31 26 70 61 73 73 77 6f 72 64 3d 32 26 70 61 73 73 77 6f 72 64 43 6f 6e 66 69 72 6d 61 74 69 6f 6e 3d 33>
```

> A `Buffer` is an array in JavaScript that contains some raw information, each of the little pairs of numbers are `hex values` and each of them represent a single character inside of the response. (A bit of data that is sent from the browser's request.)

> As we said, data from the browser are sent by `chunks`, but if the data is very small, the server side will only receive one chunk of data. If the browser send over much more information, like content of an entire book. Then multiple chunks will be received.

To turn a `Buff` array into information that can be used, we can turn it back to utf8 string.

```javascript
data.toString('utf8') // email=1&password=2&passwordConfirmation=3
```

## Express Middleware

> Function that does some preprocessing on the `req` and `res` objects, enable code reusability in Express. These middlewares are executed before the `Route handler`.

Example:

```javascript
const bodyParser = (req, res, next) => {
  if (req.method === 'POST') {
    req.on('data', (data) => {
      const parsed = data.toString('utf8').split('&')
      const formData = {}
      for (let pair of parsed) {
        const [key, value] = pair.split('=')
        formData[key] = value
      }
      req.body = formData
      next()
    })
  } else {
    next()
  }
}

app.post('/', bodyParser, (req, res) => {
  // Get access to form data
  console.log(req.body)
  res.send('Account created!')
})
```

For a global middleware, we assign the middleware to the app instance.

```javascript
const app = express()
app.use(express.urlencoded({ extended: true }))
```

## Data Storage

Data of this mini application will be store in the Hard Drive, in two json files.

- _Products Repository_ - products.json
- \_Users Repository - users.json

> This is `not a production solution`, just using it for the mini application and demonstration only, BECAUSE:
>
> - Will error if we try to open/write to the same file twice at the same time
> - Won't work if we have multiple servers running on the different machines
> - We have to write to the FS every time we want to update some data

Each Repository, should have the following methods:

|  Method  | Input Arguments | Return Value |                          Description                          |
| :------: | :-------------: | :----------: | :-----------------------------------------------------------: |
|  getAll  |        -        |    [user]    |                    Get a list of all users                    |
|  getOne  |       id        |     user     |               Finds the user with the given id                |
| getOneBy |     filters     |     user     |             Finds one user with the given filters             |
|  create  |   attributes    |     null     |           Creates a user with the given attributes            |
|  update  | id, attributes  |     null     | Updates the user with the given id using the given attributes |
|  delete  |       id        |     null     |               Delete the user with the given id               |
| randomId |        -        |      id      |                     Generate a random id                      |
| writeAll |        -        |     null     |              Writes all users to users.json file              |

There are two popular approaches for managing data:

- **Repository Approach** - A single class (repository) is responsible for data access. All records are stored and used as plain JS objects
- **Active Record Approach** - Every record is an instance of a '`model`' class that has method to save, update, delete this record.

## Cookie based Authentication

- On login the browser sends a Session request to get a cookie for a specific user
- After obtaining the cookie, every other request by the application will need to carry the cookie with it.
- This cookie is used to identify the user of the current request

## Hashing Password

- If we provide the same string to a `Hashing algorithm` the exact same output back.

- Another attribute is that when we change 1 character the output will change significantly.

- Hash algorithm does not work in reverse, that means hash **can't be reversed back to original password**.

  > - mypassword -> _89e01536ac207279409d4de1e5253e01f4a1769e696db0d6062ca9b8f56767c8_
  > - mypasswor -> _8a0a1b12ce825af03859b5dbeaf8df84fcfbbecfd2a782c3a11add427466fc44_

### Rainbow Password Attack

Even tho hash is not reversible, but there is a `Rainbow Password Attack`, where one can use a set of thousands of common password and turn them into hash codes, then they will use the hash in the rainbow table to match against the passwords stored in the database.

In this situation, there our user's password has a potential of being breaking into his/her account. Therefore we can introduce the use of `Salt` to increase our password security level.

### Adding Salt

A salt is a random string character, which is added to the end of our password string, then pass to the `Hashing Algorithm ` for encryption.

> [Password String] + [Salt String] -> [Hash String]
>
> > 'MyPassword' + 'sliejflskdjfls' -> d710152413e5c043665d0acf610e47b872e5de7037208e1945712d666b466503

In this way, Rainbow Attack will not work, because different application will use a different `Salt` string. There is make it way harder for hackers to hack even a very simple or common password, because the **possibility had increased exponentially**.

- Since our salt is randomly generated string, how are we going to regenerate this Hash + Salt password, and use it to verify login?
- We save the random salt into the database with the password, by separating the `Hashed PW + Salt` and `Random Salt` with a special character like `.` or `/` or `+`
- This way we can get the random Salt back when we try to verify a user's entered password. Simply just join the password and the salt together and hash it again to see if it match what we have in the database.

## Restructuring

```shell
.
├── index.js
├── Routes
│   ├── Admin
│   │   ├── auth.js
│   │   └── product.js
│   ├── products.js
│   └── cart.js
├── Repositories
│   ├── users.js
│   └── products.js
├── Views
｜   └── various files...
```

```shell
.
├── `<div>`
│   ├── `<p>`
│   │   └── JavaScript
│   ├── `</p>`
│   ├── `<span>`
│   │   └── is fun!
│   └── `</span>`
└── `</div>`
```

## HTML Templating

- pug/jade
- haml
- mustashe
- EJS

## Different methods of image storage

### Understanding of the server setup

For a high load web application, we are not going to just use one Express Server, running on our local machine. This project setup is only for learning and demonstration purpose only, it's not production ready.

For high load web application, we will have to build a much better server setup, a typical setup will look like this:

![](https://img-blog.csdnimg.cn/20210615182744194.png)

> This would be a multi-server setup, the overall load will be balance and **RANDOMLY** distributed across multiple servers.

### Image Upload Methods

Going to look at worse to best solutions:

- **Co-Located Disk** - Store on the local hard drive
  - Doesn't work when the application scaled up
  - Not a long term solution

![](https://img-blog.csdnimg.cn/2021061518400445.png)

- **Database** - Store the image in the database (MySql, MongoDB...)
  - Storing big data into a database is expensive compare to raw hard drive space
  - Each GB/month cost is much higher than hard drive space

![](https://img-blog.csdnimg.cn/2021061518544011.png)

- **Stream Through to Datastore**
  - Centralized source of image data store
  - Much more less expensive
  - Increase network streaming load, because the server has to upload the image to the outside data store
  - Because the image first is uploaded to the server, then the server will have to upload to the Outside Data Store, double the amount of load is put on the server.

![](https://img-blog.csdnimg.cn/20210615184922792.png)

- **Presigned URL**
  - Browser will request the server, telling the server that it is going to upload a file
  - Then the server will request the outside data store API and get a `presigned URL` and return it back to the browser
  - The browser will use this `presigned URL` to upload the image straight to the Outside Data Store instead of uploading to the server
  - Only a presigned URL will give temporary access on uploading a file to the outside data store

![](https://img-blog.csdnimg.cn/2021061518523574.png)
