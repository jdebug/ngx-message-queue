import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import { UUID } from 'angular2-uuid';

interface Channel {
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

	private channel: Channel = {};
	private subscribers: SubscribersList = {};

	getQueues(): string[] {
		return Object.keys(this.channel);
	}

	getSubscribers(): string[] {
		return Object.keys(this.subscribers);
	}

	createQueue(name: string): boolean {
		if (name === undefined || this.channel[name]) {
			return false;
		}

		let s = new Subject<any>();
		let o = s.asObservable();
		this.channel[name] = { subject: s, observable: o };
		return true;
	}

	deleteQueue(name: string): boolean {
		if (name === undefined || !this.channel[name]) {
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
		delete this.channel[name].observable;
		delete this.channel[name].subject;
		delete this.channel[name];
	}

	publish(name: string, msg: any, lazy = true): boolean {
		if (msg === undefined || name === undefined) {
			return false;
		}

		if (lazy) {
			this.createQueue(name);
		} else if (!this.channel[name]) {
			return false;
		}

		this.channel[name].subject.next(msg);
		return true;
	}

	subscribe(name: string, callback: (any) => void, lazy = true): string {
		if (name === undefined || callback === undefined) {
			return '';
		}
		if (lazy) {
			this.createQueue(name);
		} else if (!this.channel[name]) {
			return '';
		}
		let id = name + '-' + UUID.UUID();
		this.subscribers[id] = {
			name: name,
			subscription: this.channel[name].observable.subscribe(callback)
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
