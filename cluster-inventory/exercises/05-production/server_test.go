package production
import("context";"errors";"net/http";"net/http/httptest";"testing")
type fakeInventory struct{items []Cluster;err error}
func(f fakeInventory)ByRegion(context.Context,string)([]Cluster,error){return f.items,f.err}
func TestClusters(t *testing.T){req:=httptest.NewRequest(http.MethodGet,"/clusters?region=eu-west-1",nil);res:=httptest.NewRecorder();Handler(fakeInventory{items:[]Cluster{{"prod","eu-west-1"}}}).ServeHTTP(res,req);if res.Code!=http.StatusOK{t.Fatalf("status=%d",res.Code)}}
func TestClustersDependencyFailure(t *testing.T){req:=httptest.NewRequest(http.MethodGet,"/clusters",nil);res:=httptest.NewRecorder();Handler(fakeInventory{err:errors.New("offline")}).ServeHTTP(res,req);if res.Code!=http.StatusServiceUnavailable{t.Fatalf("status=%d",res.Code)}}
