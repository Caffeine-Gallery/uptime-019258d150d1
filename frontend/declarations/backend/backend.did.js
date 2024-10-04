export const idlFactory = ({ IDL }) => {
  const FamilyMember = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'photoUrl' : IDL.Text,
    'todoCount' : IDL.Nat,
  });
  return IDL.Service({
    'getFamilyMembers' : IDL.Func([], [IDL.Vec(FamilyMember)], ['query']),
    'updateFamilyMember' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text],
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
