import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Event {
  'id' : bigint,
  'title' : string,
  'date' : bigint,
  'description' : string,
}
export interface _SERVICE {
  'addEvent' : ActorMethod<[string, bigint, string], bigint>,
  'deleteEvent' : ActorMethod<[bigint], boolean>,
  'getEvents' : ActorMethod<[bigint, bigint], Array<Event>>,
  'updateEvent' : ActorMethod<[bigint, string, bigint, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
