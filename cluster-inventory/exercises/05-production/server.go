package production
import("context";"encoding/json";"fmt";"net/http";"time")
type Cluster struct{Name,Region string}
type Inventory interface{ByRegion(context.Context,string)([]Cluster,error)}
func Handler(inventory Inventory)http.Handler{mux:=http.NewServeMux();mux.HandleFunc("GET /clusters",func(w http.ResponseWriter,r *http.Request){clusters,err:=inventory.ByRegion(r.Context(),r.URL.Query().Get("region"));if err!=nil{http.Error(w,"inventory unavailable",http.StatusServiceUnavailable);return};w.Header().Set("Content-Type","application/json");if err:=json.NewEncoder(w).Encode(clusters);err!=nil{http.Error(w,"encode response",http.StatusInternalServerError)}});return mux}
func Server(addr string,h http.Handler)*http.Server{return &http.Server{Addr:addr,Handler:h,ReadHeaderTimeout:5*time.Second,ReadTimeout:10*time.Second,WriteTimeout:15*time.Second,IdleTimeout:60*time.Second}}
func Shutdown(ctx context.Context,s *http.Server)error{if err:=s.Shutdown(ctx);err!=nil{return fmt.Errorf("shutdown server: %w",err)};return nil}
