import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import { UUID } from 'angular2-uuid';
import { Tokenizer } from './utils/tokenizer';
import { Expression } from './utils/expression';

interface Queue {
	[name: string]: {
		subject: Subject<any>,
		observable: Observable<any>
	};
}

interface SubscribersList {
	[id: string]: {
		name: string,
		subscription: Subscription
	};
}

@Injectable({
  providedIn: 'root'
})
export class Ng2MessageQueue {

	private queues: Queue = {};
	private subscribers: SubscribersList = {};

	getQueueNames(): string[] {
		return Object.keys(this.queues);
	}

	getSubscribers(): string[] {
		return Object.keys(this.subscribers);
	}

	createQueue(name: string): boolean {
		if (name === undefined || this.queues[name]) {
			return false;
		}

		let subject = new Subject<any>();
		let observable = subject.asObservable();
		this.queues[name] = { subject: subject, observable: observable };

		return true;
	}

	deleteQueue(name: string): boolean {
		if (name === undefined || !this.queues[name]) {
			return false;
		}

		let s = this.getSubscribers();
		// unsubscribe all subscribers for queue 'name'
		s.forEach(i => {
			if (this.subscribers[i].name === name) {
				this.unsubscribe(i);
			}
		});

		// delete queue 'name' subject and observable
		delete this.queues[name].observable;
		delete this.queues[name].subject;
		delete this.queues[name];
	}

	publish(name: string, headers: any, message: any, lazy = true): boolean {
		if (message === undefined || name === undefined) {
			return false;
		}

		if (lazy) {
			this.createQueue(name);
		} else if (!this.queues[name]) {
			return false;
		}

		this.queues[name].subject.next({headers: headers, payload: message});
		return true;
	}

	subscribe(name: string, msgSelector: string, callback: (headers: any, payload: any) => void, lazy = true): string {
		if (name === undefined || callback === undefined) {
			return '';
		}
		if (lazy) {
			this.createQueue(name);
		} else if (!this.queues[name]) {
			return '';
		}
		let id = name + '-' + UUID.UUID();
		// let hName = '';
		// let expr = '';
		// let filterMsg = false;

		// if (msgSelector !== undefined) {
		// 	var parts = msgSelector.split(/(?=[=><!])/);		
		// 	if (parts.length > 1 ) {
		// 		hName = parts[0].trim();

		// 		// convert to js comparator
		// 		if (parts[1].startsWith('=')) {
		//             parts[1] = '=' + parts[1];
		//         }

		// 		expr = parts.slice(1, parts.length).join('');
		// 		filterMsg = true;
		// 	} else {
		// 		filterMsg = false;
		// 	}
		// }

		var token = Tokenizer.tokenizeExpression(msgSelector);

		// this.subscribers[id] = {
		// 	name: name,
		// 	subscription: this.queues[name].observable.filter(s => {return filterMsg? eval(s.headers[hName] + expr) : true} ).subscribe(subject => callback(subject.headers, subject.payload))
		// }

		this.subscribers[id] = {
			name: name,
			subscription: this.queues[name].observable.filter(s => {return Expression.eval(token, s.headers)} ).subscribe(subject => callback(subject.headers, subject.payload))
		}

		return id;
	}

	unsubscribe(id: string): boolean {
		if (id === undefined || !this.subscribers[id]) {
			return false;
		}

		this.subscribers[id].subscription.unsubscribe();
		delete this.subscribers[id];
	}
}
