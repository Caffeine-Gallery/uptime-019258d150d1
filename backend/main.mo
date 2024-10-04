import Bool "mo:base/Bool";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type Event = {
    id: Nat;
    title: Text;
    date: Int; // Unix timestamp in nanoseconds
    description: Text;
  };

  type FamilyMember = {
    id: Nat;
    name: Text;
    todoCount: Nat;
    photoUrl: Text;
  };

  stable var events : [Event] = [];
  stable var familyMembers : [FamilyMember] = [
    { id = 0; name = "Mom"; todoCount = 5; photoUrl = "" },
    { id = 1; name = "Dad"; todoCount = 3; photoUrl = "" },
    { id = 2; name = "Noah"; todoCount = 4; photoUrl = "" },
    { id = 3; name = "Avery"; todoCount = 5; photoUrl = "" }
  ];
  stable var nextEventId : Nat = 0;
  stable var nextFamilyMemberId : Nat = 4;

  // ... (previous functions remain unchanged) ...

  public query func getFamilyMembers() : async [FamilyMember] {
    familyMembers
  };

  public func updateFamilyMember(id: Nat, name: Text, photoUrl: Text) : async Bool {
    let updatedMembers = Array.map<FamilyMember, FamilyMember>(familyMembers, func (member: FamilyMember) : FamilyMember {
      if (member.id == id) {
        {
          id = member.id;
          name = name;
          todoCount = member.todoCount;
          photoUrl = photoUrl;
        }
      } else {
        member
      }
    });

    if (Array.equal<FamilyMember>(familyMembers, updatedMembers, func(a, b) { a.id == b.id })) {
      false
    } else {
      familyMembers := updatedMembers;
      true
    }
  };

  public func updateFamilyMemberTodoCount(id: Nat, todoCount: Nat) : async Bool {
    let updatedMembers = Array.map<FamilyMember, FamilyMember>(familyMembers, func (member: FamilyMember) : FamilyMember {
      if (member.id == id) {
        {
          id = member.id;
          name = member.name;
          todoCount = todoCount;
          photoUrl = member.photoUrl;
        }
      } else {
        member
      }
    });

    if (Array.equal<FamilyMember>(familyMembers, updatedMembers, func(a, b) { a.id == b.id })) {
      false
    } else {
      familyMembers := updatedMembers;
      true
    }
  };
}
