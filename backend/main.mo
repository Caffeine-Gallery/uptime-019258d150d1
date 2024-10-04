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
  };

  stable var events : [Event] = [];
  stable var familyMembers : [FamilyMember] = [];
  stable var nextEventId : Nat = 0;
  stable var nextFamilyMemberId : Nat = 0;

  public func addEvent(title: Text, date: Int, description: Text) : async Nat {
    let newEvent : Event = {
      id = nextEventId;
      title = title;
      date = date;
      description = description;
    };
    events := Array.append(events, [newEvent]);
    nextEventId += 1;
    nextEventId - 1
  };

  public query func getEvents(year: Int, month: Int) : async [Event] {
    let startOfMonth = Time.now() - Int.abs(Time.now()) + (year - 1970) * 365 * 24 * 3600 * 1000000000 + (month - 1) * 30 * 24 * 3600 * 1000000000;
    let endOfMonth = startOfMonth + 30 * 24 * 3600 * 1000000000;

    Array.filter<Event>(events, func (event: Event) : Bool {
      event.date >= startOfMonth and event.date < endOfMonth
    })
  };

  public func updateEvent(id: Nat, title: Text, date: Int, description: Text) : async Bool {
    let updatedEvents = Array.map<Event, Event>(events, func (event: Event) : Event {
      if (event.id == id) {
        {
          id = event.id;
          title = title;
          date = date;
          description = description;
        }
      } else {
        event
      }
    });

    if (Array.equal<Event>(events, updatedEvents, func(a, b) { a.id == b.id })) {
      false
    } else {
      events := updatedEvents;
      true
    }
  };

  public func deleteEvent(id: Nat) : async Bool {
    let initialLength = events.size();
    events := Array.filter<Event>(events, func (event: Event) : Bool {
      event.id != id
    });
    events.size() < initialLength
  };

  public func addFamilyMember(name: Text) : async Nat {
    let newMember : FamilyMember = {
      id = nextFamilyMemberId;
      name = name;
      todoCount = 0;
    };
    familyMembers := Array.append(familyMembers, [newMember]);
    nextFamilyMemberId += 1;
    nextFamilyMemberId - 1
  };

  public query func getFamilyMembers() : async [FamilyMember] {
    familyMembers
  };

  public func updateFamilyMemberTodoCount(id: Nat, todoCount: Nat) : async Bool {
    let updatedMembers = Array.map<FamilyMember, FamilyMember>(familyMembers, func (member: FamilyMember) : FamilyMember {
      if (member.id == id) {
        {
          id = member.id;
          name = member.name;
          todoCount = todoCount;
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
