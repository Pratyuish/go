package testingtrack
import("errors";"fmt";"sort")
var ErrInvalid=errors.New("invalid cluster")
type Cluster struct{Name string; Nodes int}
func Normalize(in []Cluster)([]Cluster,error){out:=append([]Cluster(nil),in...);seen:=map[string]bool{};for _,c:=range out{if c.Name==""||c.Nodes<1||seen[c.Name]{return nil,fmt.Errorf("%s: %w",c.Name,ErrInvalid)};seen[c.Name]=true};sort.Slice(out,func(i,j int)bool{return out[i].Name<out[j].Name});return out,nil}
