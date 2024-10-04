import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Event {
  'id' : bigint,
  'title' : string,
  'date' : bigint,
  'description' : string,
}
export interface FamilyMember {
  'id' : bigint,
  'name' : string,
  'todoCount' : bigint,
}
export interface _SERVICE {
  'addEvent' : ActorMethod<[string, bigint, string], bigint>,
  'addFamilyMember' : ActorMethod<[string], bigint>,
  'deleteEvent' : ActorMethod<[bigint], boolean>,
  'getEvents' : ActorMethod<[bigint, bigint], Array<Event>>,
  'getFamilyMembers' : ActorMethod<[], Array<FamilyMember>>,
  'updateEvent' : ActorMethod<[bigint, string, bigint, string], boolean>,
  'updateFamilyMemberTodoCount' : ActorMethod<[bigint, bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
