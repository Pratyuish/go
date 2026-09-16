package concurrency
import("context";"sync";"testing";"time")
type trackingChecker struct{mu sync.Mutex;active,max int}
func(c *trackingChecker)Check(ctx context.Context,cl Cluster)(string,error){c.mu.Lock();c.active++;if c.active>c.max{c.max=c.active};c.mu.Unlock();select{case<-time.After(5*time.Millisecond):case<-ctx.Done():return "",ctx.Err()};c.mu.Lock();c.active--;c.mu.Unlock();return "ready",nil}
func TestCollectBoundsConcurrency(t *testing.T){c:=&trackingChecker{};clusters:=make([]Cluster,10);for i:=range clusters{clusters[i].Name="cluster"};got,err:=Collect(context.Background(),clusters,3,c);if err!=nil||len(got)!=10{t.Fatalf("got=%d err=%v",len(got),err)};if c.max>3{t.Fatalf("max=%d",c.max)}}
func TestCollectCancels(t *testing.T){ctx,cancel:=context.WithCancel(context.Background());cancel();_,err:=Collect(ctx,[]Cluster{{"a"}},1,&trackingChecker{});if err==nil{t.Fatal("expected cancellation")}}
