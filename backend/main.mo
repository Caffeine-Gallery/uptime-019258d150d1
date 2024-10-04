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
  // Event type definition
  type Event = {
    id: Nat;
    title: Text;
    date: Int; // Unix timestamp
    description: Text;
  };

  // Stable variable to store events
  stable var events : [Event] = [];
  stable var nextId : Nat = 0;

  // Helper function to get events for a specific month
  private func getEventsForMonth(year: Int, month: Int) : [Event] {
    let startOfMonth = Time.now() - Int.abs(Time.now()) + (year - 1970) * 365 * 24 * 3600 * 1000000000 + (month - 1) * 30 * 24 * 3600 * 1000000000;
    let endOfMonth = startOfMonth + 30 * 24 * 3600 * 1000000000;

    Array.filter<Event>(events, func (event: Event) : Bool {
      event.date >= startOfMonth and event.date < endOfMonth
    })
  };

  // Add a new event
  public func addEvent(title: Text, date: Int, description: Text) : async Nat {
    let newEvent : Event = {
      id = nextId;
      title = title;
      date = date;
      description = description;
    };
    events := Array.append(events, [newEvent]);
    nextId += 1;
    nextId - 1
  };

  // Get all events for a specific month
  public query func getEvents(year: Int, month: Int) : async [Event] {
    getEventsForMonth(year, month)
  };

  // Update an existing event
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

  // Delete an event
  public func deleteEvent(id: Nat) : async Bool {
    let initialLength = events.size();
    events := Array.filter<Event>(events, func (event: Event) : Bool {
      event.id != id
    });
    events.size() < initialLength
  };
}
