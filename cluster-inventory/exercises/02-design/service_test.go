package design
import("context";"errors";"testing")
type fakeSource struct{ clusters []Cluster; err error }
func(f fakeSource)Load(context.Context)([]Cluster,error){return f.clusters,f.err}
func TestByRegion(t *testing.T){ s:=New(fakeSource{clusters:[]Cluster{{"prod-eu","eu-west-1"},{"prod-in","ap-south-1"}}}); got,err:=s.ByRegion(context.Background(),"ap-south-1"); if err!=nil||len(got)!=1||got[0].Name!="prod-in"{t.Fatalf("got=%v err=%v",got,err)} }
func TestByRegionWrapsSourceError(t *testing.T){ sentinel:=errors.New("offline"); s:=New(fakeSource{err:sentinel}); _,err:=s.ByRegion(context.Background(),""); if !errors.Is(err,sentinel){t.Fatalf("expected wrapped error, got %v",err)} }
