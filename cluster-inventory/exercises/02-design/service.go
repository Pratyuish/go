package design

import ("context"; "fmt")

type Cluster struct { Name, Region string }
type Source interface { Load(context.Context) ([]Cluster, error) }
type Service struct { source Source }
func New(source Source) Service { return Service{source:source} }
func (s Service) ByRegion(ctx context.Context, region string) ([]Cluster,error) {
	clusters, err := s.source.Load(ctx); if err != nil { return nil, fmt.Errorf("load inventory: %w",err) }
	result := make([]Cluster,0,len(clusters)); for _, c := range clusters { if region == "" || c.Region == region { result=append(result,c) } }; return result,nil
}
