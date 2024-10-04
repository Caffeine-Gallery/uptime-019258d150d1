import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface FamilyMember {
  'id' : bigint,
  'name' : string,
  'photoUrl' : string,
  'todoCount' : bigint,
}
export interface _SERVICE {
  'getFamilyMembers' : ActorMethod<[], Array<FamilyMember>>,
  'updateFamilyMember' : ActorMethod<[bigint, string, string], boolean>,
  'updateFamilyMemberTodoCount' : ActorMethod<[bigint, bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
