# A Secret-Message Sharing APP

1. Input a secret message
2. Turn it into a secret link that you can share with a friend
3. Anyone open with the secret link will see the secret message

## How Base64 works?

- _ASCII Character Codes_
  - The characters "a-z", "A-Z", "0-9", "!@#$%^&\*()" and a few other can be represented with decimal value from 0 to 127
  - [ASCII Table](https://asciitable.com)
- _Base64 character codes_
  - The characters "a-z", "A-Z", "0-9" can be represented with decimal value from 0 to 63

### How is ASCII converted to Base64

- First ASCII Character first **converted to ASCII Character Code**
  - s -> 115
  - e -> 101
  - c -> 99
- Then those number will be converted to "**8 Digit binary representation**"
  - 115 -> 01110011
  - 101 -> 01100101
  - 99 -> 0110011
- Then join all the 8 digit together to **form a 24 digits**
  - 01110011011001010110011
- Take this 24 digit and **group them by set of 6 characters**
  - 011100
  - 110110
  - 010101
  - 100011
- Base on the Base64 Table, covert this group of 6 digit back to characters!
  - 011100 -> c
  - 110110 -> 2
  - 010101 -> v
  - 100011 -> j
- Join these character will form our Base64 string
  - c2vj

## Understanding of URL and Params

> For example "message.com/index.hmtl/?color=red#value"

Breaking it down would be:

- Domain
  - message.com
- Path
  - `/`index.html`/`
- Query String
  - `?`color`=`red
  - Useful for the server
- Hash/fragment
  - `#`value
  - Values that are only useful for the browser
