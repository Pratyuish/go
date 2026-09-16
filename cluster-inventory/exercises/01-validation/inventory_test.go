package validation

import ("errors"; "reflect"; "testing")

func TestNormalize(t *testing.T) {
	valid := []Cluster{{Name:"zeta",Environment:"prod",Nodes:3},{Name:"alpha",Environment:"dev",Nodes:1}}
	tests := []struct{name string; input []Cluster; want []Cluster; wantErr error}{
		{"sorts a valid inventory",valid,[]Cluster{valid[1],valid[0]},nil},
		{"rejects empty name",[]Cluster{{Environment:"dev",Nodes:1}},nil,ErrInvalidName},
		{"rejects duplicate",[]Cluster{{Name:"a",Environment:"dev",Nodes:1},{Name:"a",Environment:"prod",Nodes:2}},nil,ErrDuplicateName},
	}
	for _, tc := range tests { t.Run(tc.name, func(t *testing.T) { got, err := Normalize(tc.input); if !errors.Is(err,tc.wantErr){t.Fatalf("error=%v want=%v",err,tc.wantErr)}; if !reflect.DeepEqual(got,tc.want){t.Fatalf("got=%#v want=%#v",got,tc.want)} }) }
}
