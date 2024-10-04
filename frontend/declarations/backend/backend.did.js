export const idlFactory = ({ IDL }) => {
  const Event = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'date' : IDL.Int,
    'description' : IDL.Text,
  });
  const FamilyMember = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'todoCount' : IDL.Nat,
  });
  return IDL.Service({
    'addEvent' : IDL.Func([IDL.Text, IDL.Int, IDL.Text], [IDL.Nat], []),
    'addFamilyMember' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'deleteEvent' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getEvents' : IDL.Func([IDL.Int, IDL.Int], [IDL.Vec(Event)], ['query']),
    'getFamilyMembers' : IDL.Func([], [IDL.Vec(FamilyMember)], ['query']),
    'updateEvent' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Int, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'updateFamilyMemberTodoCount' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Bool],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
