# ng2-message-queue

A message queue for Angular 2+ application components to communication each other.
`ng2-message-queue` supports message headers and payload. It also supports subscribers
to subscribe to only messages with specific message header via 'msgSelector'.

Message header supports only JSON object. Message payload can be any type.

The implementation is based on RxJS.

## Index

- [Install](#install)
- [Usage](#usage)
	- ["noImplicitAny": false](#noimplicitany-false)
	- [Import into Angular 2 application (typescript)](#import-into-angular-2-application-typescript)
	- [API](#api)
		- [createQueue(name: string): boolean](#createqueuename-string-boolean)
		- [deleteQueue(name: string): boolean](#deletequeuename-string-boolean)
		- [getQueueNames(): string[]](#getqueuenames-string)
		- [getSubscribers(): string[]](#getsubscribers-string)
		- [publish(name: string, headers: any, message: any, lazy = true): boolean](#publishname-string-headers-any-message-any-lazy--true-boolean)
		- [subscribe(name: string, msgSelector: string, callback: (any, any) => void, lazy = true): string](#subscribename-string-msgselector-any-callback-any-any--void-lazy--true-string)
		- [unsubscribe(id: string): boolean](#unsubscribeid-string-boolean)
- [Example](#example)
- [Changelog](#changelog)
- [License](#license)

## Install

```
npm install ng2-message-queue
```

## Usage

### Import into Angular 2+ application (typescript)

`ng2-message-queue` is implemented as Angular 2+ injectable service name __Ng2MessageQueue__.

__For apps using angular version 6+__

`Ng2MessageQueue` is Injectable as root so no additional decalaration is required in any module.

__For apps using angular version prior to 6__

Add `Ng2MessageQueue` into module providers.

```javascript
import { Ng2MessageQueue } from 'ng2-message-queue';

@NgModule({
	providers: [Ng2MessageQueue]
})
```

__Each component to use Ng2MessageQueue__

```javascript
import { Ng2MessageQueue } from 'ng2-message-queue';

export class MyComponent {

	constructor(private messageQueue: Ng2MessageQueue) { }

}
```

### API

##### createQueue(name: string): boolean

`createQueue` will create queue `name`.

Return `false` if queue `name` exist.

```javascript
this.messageQueue.createQueue('myQueue');
```

##### deleteQueue(name: string): boolean

`deleteQueue` will delete queue `name`.

Return `false` if queue `name` does not exist.

```javascript
this.messageQueue.deleteQueue('myQueue');
```

##### getQueueNames(): string[]

`getQueueNames` will return all queue name in string array.
```javascript
let qNames: string[] = this.messageQueue.getQueueNames();
```

##### getSubscribers(): string[]

`getSubscribers` will return all subscription id in string array.
```javascript
let ids: string[] = this.messageQueue.getSubscribers();
```

##### publish(name: string, headers: any, message: any, lazy = true): boolean

`publish` will put `message` into queue `name`. It will also put `headers` into queue if any.
`headers` are optional but it is best way to process/route/filter the messages quickly without parsing the message payload.

If `lazy = true`(default), queue `name` will be created automatically if not exist yet.

Return true if successful.

Return false if any of following is true:
- `lazy = false`, and queue `name` does not exist.
- `name` is undefined.
- `message` is undefined.

```javascript
// lazy mode
message = 'This is a test message';
this.mq.publish('myQueue', {}, message);
```

##### subscribe(name: string, msgSelector: string, callback: (any, any) => void, lazy = true): string

`subscribe` will link `callback` function to queue `name`. Whenever queue `name` receives a new message, `callback` will be invoked. The callback will return both headers and message payload.

Subscriber can `subscribe` to only certain messages with in the same queue. Let us say you have
multiple subscribers listening for log messages with different logging level (debug, info, warn, fatal etc). If you want to configure high priority subscriber who listens for logs with 'fatal' 
then use msgSelector as `loglevel=fatal`

```javascript

this.mq.subscribe('myQueue', 'loglevel=fatal', (headers, message) => this.handleMessage(headers, message));

```

If `lazy = true`(default), queue `name` will be created automatically if not exist yet.

Return subscription id if successful.

Return empty string if any of following is true:
- `lazy = false`, and queue `name` does not exist.
- `name` is undefined.
- `callback` is undefined.

Either use Lambda(fat arrow) in typescript to pass in callback or bind `this` to another variable in javascript, else `this` scope will be lost.

__Lambda(fat arrow)__
```javascript

ngOnInit() {
	this.mq.subscribe('testqueue', '', (headers, message) => this.handleMessage(headers, message));
}

handleMessage(headers, message) {
	console.log(message);
}
```

##### unsubscribe(id: string): boolean

`unsubscribe` will cancel subscription using `id`.

`unsubscribe` will return false if `id` is undefined or `id` is not found in subscription list.

```javascript
id: string;

this.messageQueue.unsubscribe(this.id);
```

## Example

Github: [ng2-message-queue-example](https://github.com/jdebug/ng2-message-queue-example)

## License

The GNU License

Copyright (c) 2018 JDebug

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
