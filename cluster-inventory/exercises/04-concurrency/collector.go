package concurrency
import("context";"errors";"sync")
var ErrInvalidWorkers=errors.New("workers must be positive")
type Cluster struct{Name string}
type Status struct{Name,State string;Err error}
type Checker interface{Check(context.Context,Cluster)(string,error)}
func Collect(ctx context.Context,clusters []Cluster,workers int,checker Checker)([]Status,error){
	if workers<1{return nil,ErrInvalidWorkers};type job struct{i int;c Cluster};type result struct{i int;s Status};jobs:=make(chan job);results:=make(chan result);var wg sync.WaitGroup
	for n:=0;n<workers;n++{wg.Add(1);go func(){defer wg.Done();for j:=range jobs{state,err:=checker.Check(ctx,j.c);select{case results<-result{j.i,Status{j.c.Name,state,err}}:case<-ctx.Done():return}}}()}
	go func(){defer close(jobs);for i,c:=range clusters{select{case jobs<-job{i,c}:case<-ctx.Done():return}}}();go func(){wg.Wait();close(results)}()
	out:=make([]Status,len(clusters));count:=0;for r:=range results{out[r.i]=r.s;count++};if err:=ctx.Err();err!=nil{return nil,err};return out[:count],nil
}
