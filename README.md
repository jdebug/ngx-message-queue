# ngx-message-queue

A message queue for Angular 2+ application components to communication each other.
`ngx-message-queue` supports message headers and payload. It also supports subscribers
to subscribe to only messages with specific message header via 'msgSelector'(kind of a filter).

Message header supports only JSON object. Message payload can be any type.

The implementation is based on RxJS.

`ng2-message-queue` has been renamed to `ngx-message-queue`

## Index

- [Install](#install)
- [API](#api-details)
- [Example](#example)
- [License](#license)

## Install

```
npm install ngx-message-queue
```

## API Details
* [https://blog.jdebugger.com/2018/10/angular-message-queue.html
](https://blog.jdebugger.com/2018/10/angular-message-queue.html)


## Example

Github: [ngx-message-queue-example](https://github.com/jdebug/ng2-message-queue-example)

## License

The GNU License

Copyright (c) 2018 JDebug

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
