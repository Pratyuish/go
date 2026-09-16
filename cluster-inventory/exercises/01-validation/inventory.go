package validation

import (
	"errors"
	"fmt"
	"sort"
)

var (
	ErrInvalidName     = errors.New("invalid cluster name")
	ErrInvalidNodes    = errors.New("node count must be positive")
	ErrInvalidEnv      = errors.New("unsupported environment")
	ErrDuplicateName   = errors.New("duplicate cluster name")
)

type Cluster struct { Name, Region, Environment string; Nodes int }

func Normalize(clusters []Cluster) ([]Cluster, error) {
	seen := make(map[string]struct{}, len(clusters))
	result := append([]Cluster(nil), clusters...)
	for i, c := range result {
		if c.Name == "" { return nil, fmt.Errorf("cluster %d: %w", i, ErrInvalidName) }
		if c.Nodes < 1 { return nil, fmt.Errorf("cluster %q: %w", c.Name, ErrInvalidNodes) }
		if c.Environment != "dev" && c.Environment != "stage" && c.Environment != "prod" { return nil, fmt.Errorf("cluster %q: %w", c.Name, ErrInvalidEnv) }
		if _, exists := seen[c.Name]; exists { return nil, fmt.Errorf("cluster %q: %w", c.Name, ErrDuplicateName) }
		seen[c.Name] = struct{}{}
	}
	sort.Slice(result, func(i, j int) bool { return result[i].Name < result[j].Name })
	return result, nil
}
