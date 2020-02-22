var store = [{
        "title": "Centroid Decomposition Explained",
        "excerpt":"#include&lt;bits/stdc++.h&gt; #define pb push_back #define mp make_pair #define pii pair&lt;int,int&gt; using namespace std; int n; vector&lt;int&gt; adj[1000000+5]; vector&lt;int&gt; centroid[1000000+5]; bool is_centroid[1000000+5]; int sz[1000000+5],par[1000000+5],nn; vector&lt;pii&gt; disCentroidParent[100000+5]; void dfs(int u,int p = -1){ sz[u] = 1; for(auto x : adj[u]){ if(x == p || is_centroid[x])continue; dfs(x,u); sz[u] += sz[x]; } } void...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/centroid-decomposition-explained/",
        "teaser":null}]
