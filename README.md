# ng2-message-queue

A message queue for Angular 2+ application components to communication each other.
The implementation is based on RxJS.

## Index

- [Install](#install)
- [Usage](#usage)
	- ["noImplicitAny": false](#noimplicitany-false)
	- [Import into Angular 2 application (typescript)](#import-into-angular-2-application-typescript)
	- [API](#api)
		- [createQueue(name: string): boolean](#createQueuename-string-boolean)
		- [deleteQueue(name: string): boolean](#delqueuename-string-boolean)
		- [getQueues(): string[]](#getQueues-string)
		- [getSubscribers(): string[]](#getsubscription-string)
		- [publish(name: string, msg: any, lazy = true): boolean](#publishname-string-msg-any-lazy--true-boolean)
		- [subscribe(name: string, callback: (any) => void, lazy = true): string](#subscribename-string-callback-any--void-lazy--true-string)
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

__For app using angular version 6+__

`Ng2MessageQueue` is Injectable as root so no additional decalaration is required in any module.

__Each module to use Ng2MessageQueue__
(required only for apps using angular version prior to 6)
Add `Ng2MessageQueue` into module providers (eg. [app.module.ts](https://github.com/jdebug/ng2-message-queue/blob/master/app/app.module.ts)).

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

	constructor(private mq: Ng2MessageQueue) { }

}
```

### API

##### createQueue(name: string): boolean

`createQueue` will create queue `name`.

Return `false` if queue `name` exist.

```javascript
this.mq.createQueue('broadcast');
```

##### deleteQueue(name: string): boolean

`deleteQueue` will delete queue `name`.

Return `false` if queue `name` does not exist.

```javascript
this.mq.deleteQueue('broadcast');
```

##### getQueues(): string[]

`getQueues` will return all queue name in string array.
```javascript
let q: string[] = this.mq.getQueues();
```

##### getSubscribers(): string[]

`getSubscribers` will return all subscription id in string array.
```javascript
let ids: string[] = this.st.getSubscribers();
```

##### publish(name: string, msg: any, lazy = true): boolean

`publish` will put `msg` into queue `name`.

If `lazy = true`(default), queue `name` will be created automatically if not exist yet.

Return true if successful.

Return false if any of following is true:
- `lazy = false`, and queue `name` does not exist.
- `name` is undefined.
- `msg` is undefined.

```javascript
// lazy mode
message = 'This is a test message';
this.mq.publish('testqueue', message);
```

##### subscribe(name: string, callback: (any) => void, lazy = true): string

`subscribe` will link `callback` function to queue `name`. Whenever queue `name` receive a new message, `callback` will be invoked.

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
	this.mq.subscribe('testqueue', payload => this.handleMessage(payload));
}

handleMessage(message) {
	console.log(message);
}
```

##### unsubscribe(id: string): boolean

`unsubscribe` will cancel subscription using `id`.

`unsubscribe` will return false if `id` is undefined or `id` is not found in subscription list.

```javascript
id: string;

this.st.unsubscribe(this.id);
```

## Example

Github: [ng2-message-queue-example](https://github.com/jdebu/ng2-message-queue-example)

## License

The GNU License

Copyright (c) 2018 JDebug

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
